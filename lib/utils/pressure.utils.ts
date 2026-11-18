/**
 * Pressure & Battery conversion utilities for LoRaWAN telemetry nodes.
 */

/**
 * Converts centibar (cbar) to bar.
 * 100 cbar = 1 bar.
 */
export function cbarToBar(cbar: number): number {
  return parseFloat((cbar / 100).toFixed(2));
}

/**
 * Maps LiFePO4 battery cell voltage (mV) to approximate percentage.
 * Nominal range for single LiFePO4 cell:
 * 3000 mV (3.0V) = 0%
 * 3650 mV (3.65V) = 100%
 */
export function mvToPercent(mv: number): number {
  const minMv = 3000;
  const maxMv = 3650;

  if (mv <= minMv) return 0;
  if (mv >= maxMv) return 100;

  const pct = ((mv - minMv) / (maxMv - minMv)) * 100;
  return Math.round(pct);
}

/**
 * Determines whether a transient pressure delta represents a hydraulic hammer event.
 * Standard threshold: delta >= 1.5 bar.
 */
export function isHammerEvent(delta: number): boolean {
  return Math.abs(delta) >= 1.5;
}

/**
 * Determines whether pipeline pressure represents depressurization (burst or main outage).
 * Threshold: bar < 1.0.
 */
export function isDepressurized(bar: number): boolean {
  return bar < 1.0;
}

/**
 * Formats bar numeric value into human-readable string: e.g. "3.80 bar".
 */
export function formatBar(bar: number): string {
  return `${bar.toFixed(2)} bar`;
}
