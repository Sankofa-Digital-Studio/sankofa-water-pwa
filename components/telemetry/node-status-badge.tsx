import React from 'react';
import { NodeStatus } from '@/types/telemetry.types';
import { Badge } from '@/components/ui/badge';

export interface NodeStatusBadgeProps {
  status: NodeStatus;
  className?: string;
}

const statusConfig: Record<
  NodeStatus,
  { variant: 'nominal' | 'surge' | 'depressurized' | 'filtered'; label: string }
> = {
  NOMINAL: { variant: 'nominal', label: 'Nominal' },
  HAMMER_SURGE: { variant: 'surge', label: 'Hammer Surge' },
  DEPRESSURIZED: { variant: 'depressurized', label: 'Depressurized' },
  LOCAL_DRAW_FILTERED: { variant: 'filtered', label: 'Draw Filtered' },
};

export function NodeStatusBadge({ status, className }: NodeStatusBadgeProps) {
  const cfg = statusConfig[status];
  return <Badge variant={cfg.variant} className={className}>{cfg.label}</Badge>;
}
