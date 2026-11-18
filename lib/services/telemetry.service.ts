import { createServerClient } from '@/lib/supabase/server'
import type { Database, TelemetryNodeRow, PressureLogRow, NodeStatus } from '@/types/supabase.types'

/**
 * Retrieves all telemetry nodes ordered by ID.
 *
 * @returns Array of TelemetryNodeRow records
 */
export async function getNodes(): Promise<TelemetryNodeRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('telemetry_nodes')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch telemetry nodes: ${error.message}`)
  }

  return data ?? []
}

/**
 * Retrieves a single telemetry node by its ID.
 *
 * @param id - Telemetry node ID
 * @returns TelemetryNodeRow record or null if not found
 */
export async function getNodeById(id: number): Promise<TelemetryNodeRow | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('telemetry_nodes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`Failed to fetch telemetry node ${id}: ${error.message}`)
  }

  return data
}

/**
 * Updates telemetry node current pressure and optional radio diagnostics,
 * and appends a corresponding record into pressure_logs.
 *
 * @param id - Telemetry node ID
 * @param currentBar - Current pressure in bar
 * @param status - Updated node operational status
 * @param batteryMv - Battery level in millivolts
 * @param rssiDbm - RSSI in dBm
 * @param snrDb - SNR in dB
 * @returns Updated TelemetryNodeRow
 */
export async function updateNodePressure(
  id: number,
  currentBar: number,
  status?: NodeStatus,
  batteryMv?: number,
  rssiDbm?: number,
  snrDb?: number
): Promise<TelemetryNodeRow> {
  const supabase = await createServerClient()

  // First fetch node for baseline and ward
  const node = await getNodeById(id)
  if (!node) {
    throw new Error(`Node ${id} not found`)
  }

  const deltaPressure = currentBar - node.baseline_bar
  const isHammer = status === 'HAMMER_SURGE' || currentBar >= 4.5

  // Update telemetry node
  const updatePayload: Record<string, unknown> = {
    current_bar: currentBar,
  }
  if (status) updatePayload.status = status
  if (batteryMv !== undefined) updatePayload.battery_mv = batteryMv
  if (rssiDbm !== undefined) updatePayload.rssi_dbm = rssiDbm
  if (snrDb !== undefined) updatePayload.snr_db = snrDb

  const { data: updatedNode, error: updateError } = await supabase
    .from('telemetry_nodes')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single()

  if (updateError || !updatedNode) {
    throw new Error(`Failed to update node ${id}: ${updateError?.message}`)
  }

  // Insert log record
  const { error: logError } = await supabase.from('pressure_logs').insert({
    node_id: id,
    ward_id: node.ward_id,
    peak_pressure_bar: currentBar,
    delta_pressure_bar: deltaPressure,
    battery_mv: batteryMv ?? node.battery_mv,
    rssi_dbm: rssiDbm ?? node.rssi_dbm,
    is_hammer_event: isHammer,
    sparkline_json: [currentBar],
  })

  if (logError) {
    console.error(`Warning: Failed to log pressure for node ${id}: ${logError.message}`)
  }

  return updatedNode
}

/**
 * Retrieves pressure logs, optionally filtered by node_id.
 *
 * @param nodeId - Optional filter for specific node
 * @param limit - Maximum logs to return (default: 50)
 * @returns Array of PressureLogRow records
 */
export async function getPressureLogs(
  nodeId?: number,
  limit: number = 50
): Promise<PressureLogRow[]> {
  const supabase = await createServerClient()
  let query = supabase
    .from('pressure_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (nodeId !== undefined) {
    query = query.eq('node_id', nodeId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch pressure logs: ${error.message}`)
  }

  return data ?? []
}
