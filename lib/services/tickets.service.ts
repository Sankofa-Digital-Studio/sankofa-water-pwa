import { createServerClient } from '@/lib/supabase/server'
import type {
  Database,
  RepairTicketRow,
  RepairTicketInsert,
  RepairTicketUpdate,
  TicketStageCompletionRow,
  TicketStatus,
} from '@/types/supabase.types'

export interface TicketWithCompletions extends RepairTicketRow {
  completions: TicketStageCompletionRow[]
}

export interface GeofenceValidationResult {
  isValid: boolean
  distanceMeters: number
}

/**
 * Retrieves repair tickets with optional filtering by ward or status.
 *
 * @param wardId - Optional ward filter
 * @param status - Optional status filter
 * @returns Array of RepairTicketRow records
 */
export async function getTickets(
  wardId?: number,
  status?: TicketStatus
): Promise<RepairTicketRow[]> {
  const supabase = await createServerClient()
  let query = supabase
    .from('repair_tickets')
    .select('*')
    .order('created_at', { ascending: false })

  if (wardId !== undefined) {
    query = query.eq('ward_id', wardId)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch repair tickets: ${error.message}`)
  }

  return data ?? []
}

/**
 * Retrieves a single repair ticket along with its stage completion records.
 *
 * @param id - UUID of the repair ticket
 * @returns TicketWithCompletions or null if not found
 */
export async function getTicketById(id: string): Promise<TicketWithCompletions | null> {
  const supabase = await createServerClient()

  const { data: ticket, error: ticketError } = await supabase
    .from('repair_tickets')
    .select('*')
    .eq('id', id)
    .single()

  if (ticketError) {
    if (ticketError.code === 'PGRST116') return null
    throw new Error(`Failed to fetch ticket ${id}: ${ticketError.message}`)
  }

  const { data: completions, error: compError } = await supabase
    .from('ticket_stage_completions')
    .select('*')
    .eq('ticket_id', id)
    .order('stage_num', { ascending: true })

  if (compError) {
    throw new Error(`Failed to fetch completions for ticket ${id}: ${compError.message}`)
  }

  return {
    ...ticket,
    completions: completions ?? [],
  }
}

/**
 * Creates a new repair ticket.
 *
 * @param payload - Repair ticket insert details
 * @returns Created RepairTicketRow
 */
export async function createTicket(
  payload: RepairTicketInsert
): Promise<RepairTicketRow> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('repair_tickets')
    .insert(payload)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(`Failed to create repair ticket: ${error?.message}`)
  }

  return data
}

/**
 * Advances a ticket stage after performing server-side PostGIS geofence validation.
 * Checks ST_DistanceSphere <= 15m against the target asset location.
 *
 * @param ticketId - UUID of the repair ticket
 * @param stageNum - Stage number (1: Excavation, 2: Repair, 3: Reinstatement)
 * @param lat - Contractor's current GPS latitude
 * @param lng - Contractor's current GPS longitude
 * @param accuracyM - Reported GPS accuracy radius in meters
 * @param photoUrl - Uploaded evidence photo URL
 * @param completedBy - Optional user UUID of contractor
 * @returns Object with success flag, distance, and updated ticket data
 */
export async function advanceTicketStage(
  ticketId: string,
  stageNum: 1 | 2 | 3,
  lat: number,
  lng: number,
  accuracyM?: number,
  photoUrl?: string,
  completedBy?: string
): Promise<{
  success: boolean
  distanceMeters: number
  ticket?: RepairTicketRow
  stageCompletion?: TicketStageCompletionRow
  error?: string
}> {
  const supabase = await createServerClient()

  // 1. Perform PostGIS RPC geofence check
  const { data: rpcResult, error: rpcError } = await (supabase.rpc as any)(
    'validate_stage_geofence',
    {
      p_ticket_id: ticketId,
      p_lat: lat,
      p_lng: lng,
    }
  )

  if (rpcError) {
    throw new Error(`Geofence validation RPC failed: ${rpcError.message}`)
  }

  const validation = Array.isArray(rpcResult) ? rpcResult[0] : rpcResult
  const isValid: boolean = validation?.is_valid ?? false
  const distanceMeters: number = validation?.distance_m ?? 999

  if (!isValid) {
    return {
      success: false,
      distanceMeters,
      error: `Geofence check failed: distance is ${distanceMeters}m (maximum allowed: 15m)`,
    }
  }

  // 2. Insert ticket stage completion
  const { data: completion, error: compInsertError } = await supabase
    .from('ticket_stage_completions')
    .insert({
      ticket_id: ticketId,
      stage_num: stageNum,
      gps_lat: lat,
      gps_lng: lng,
      gps_accuracy_m: accuracyM ?? null,
      distance_to_target_m: distanceMeters,
      photo_url: photoUrl ?? null,
      completed_by: completedBy ?? null,
    })
    .select('*')
    .single()

  if (compInsertError) {
    throw new Error(`Failed to record stage completion: ${compInsertError.message}`)
  }

  // 3. Advance ticket status according to completed stage
  const nextStatus: TicketStatus =
    stageNum === 1
      ? 'STAGE_1_EXCAVATED'
      : stageNum === 2
      ? 'STAGE_2_REPAIRED'
      : 'AUTHORIZED_FOR_PAYMENT'

  const { data: updatedTicket, error: ticketUpdateError } = await supabase
    .from('repair_tickets')
    .update({ status: nextStatus })
    .eq('id', ticketId)
    .select('*')
    .single()

  if (ticketUpdateError) {
    throw new Error(`Failed to update ticket status: ${ticketUpdateError.message}`)
  }

  return {
    success: true,
    distanceMeters,
    ticket: updatedTicket,
    stageCompletion: completion,
  }
}
