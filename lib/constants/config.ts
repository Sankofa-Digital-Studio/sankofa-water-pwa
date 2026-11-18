// ============================================================
// Sankofa Digital Matjhabeng Water PWA — System Configuration Constants
// ============================================================

export const WATER_TARIFF_ZAR_PER_KL = 17.01;
export const HAMMER_THRESHOLD_BAR = 1.5;
export const DEPRESSURIZATION_THRESHOLD_BAR = 1.0;
export const GEOFENCE_RADIUS_METERS = 15.0;
export const WARD_ALERT_DEBOUNCE_HOURS = 4;
export const LORAWAN_DUTY_CYCLE_PERCENT = 1;
export const BATTERY_CAPACITY_MAH = 3000;
export const AVG_CURRENT_UA = 11.2;
export const LORA_BAND = 'EU868'; // TODO: Verify ICASA compliance
export const NODE_COUNT_MVP0 = 10;
export const GATEWAY_UPS_HOURS = 53;

// Commercial Model & MVP-0 Pricing (40% Net Profit Margin Tier 1A)
export const MVP_0_PILOT_FEE_ZAR = 150000;
export const MVP_0_DELIVERY_COST_ZAR = 90000;
export const MVP_0_NET_PROFIT_ZAR = 60000;
export const MVP_0_PROFIT_MARGIN_PERCENT = 40.0;
export const MVP_0_PILOT_DURATION_DAYS = 90;

// Extended Pilot Model (Tier 1B: 180 Days + Citizen WhatsApp Integration)
export const MVP_0_EXTENDED_PILOT_FEE_ZAR = 245000;
export const MVP_0_EXTENDED_DELIVERY_COST_ZAR = 140000;
export const MVP_0_EXTENDED_NET_PROFIT_ZAR = 105000;
export const MVP_0_EXTENDED_PROFIT_MARGIN_PERCENT = 42.9;
