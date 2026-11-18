-- =============================================================================
-- Seed Data: Telemetry Nodes 101–110 (Welkom / Matjhabeng, Free State)
-- Sankofa Digital Matjhabeng Water PWA
-- =============================================================================
-- Coordinates are WGS-84 (lon, lat). Welkom centroid ≈ 26.6594°E, 27.9820°S.
-- Node IDs are overridden via OVERRIDING SYSTEM VALUE to match INITIAL_NODES.
-- =============================================================================

-- Truncate before seeding (dev only — never run against production)
TRUNCATE public.telemetry_nodes RESTART IDENTITY CASCADE;

INSERT INTO public.telemetry_nodes
  (id, name, ward_id, suburb, street, pipe_material, burial_depth_m,
   x_coord, y_coord, baseline_bar, current_bar, battery_mv, rssi_dbm, snr_db,
   status, location)
OVERRIDING SYSTEM VALUE
VALUES

-- Node 101 — Ward 3, Welkom CBD
(101, 'WLK-N101', 3, 'Welkom CBD', 'Stateway Ave',
 'AC', 0.90,
 26.6670, -27.9780,
 3.20, 3.18, 3650, -85, 7.5,
 'NOMINAL',
 ST_MakePoint(26.6670, -27.9780)::GEOGRAPHY),

-- Node 102 — Ward 3, Welkom CBD
(102, 'WLK-N102', 3, 'Welkom CBD', 'Koppie Alleen Rd',
 'PVC', 0.80,
 26.6710, -27.9810,
 3.15, 3.13, 3620, -88, 6.8,
 'NOMINAL',
 ST_MakePoint(26.6710, -27.9810)::GEOGRAPHY),

-- Node 103 — Ward 5, Riebeeckstad
(103, 'WLK-N103', 5, 'Riebeeckstad', 'Voortrekker St',
 'PVC', 0.85,
 26.6520, -27.9930,
 3.10, 3.08, 3580, -91, 6.2,
 'NOMINAL',
 ST_MakePoint(26.6520, -27.9930)::GEOGRAPHY),

-- Node 104 — Ward 5, Riebeeckstad
(104, 'WLK-N104', 5, 'Riebeeckstad', 'Danie Theron St',
 'AC', 1.00,
 26.6490, -27.9960,
 3.05, 2.60, 3540, -94, 5.9,
 'DEPRESSURIZED',
 ST_MakePoint(26.6490, -27.9960)::GEOGRAPHY),

-- Node 105 — Ward 7, Thabong
(105, 'WLK-N105', 7, 'Thabong', 'Moshoeshoe Dr',
 'PVC', 0.75,
 26.6380, -28.0050,
 2.90, 2.88, 3700, -82, 8.1,
 'NOMINAL',
 ST_MakePoint(26.6380, -28.0050)::GEOGRAPHY),

-- Node 106 — Ward 7, Thabong
(106, 'WLK-N106', 7, 'Thabong', 'Setjhaba St',
 'PVC', 0.80,
 26.6420, -28.0080,
 2.85, 2.83, 3680, -83, 7.9,
 'NOMINAL',
 ST_MakePoint(26.6420, -28.0080)::GEOGRAPHY),

-- Node 107 — Ward 9, Virginia
(107, 'VRG-N107', 9, 'Virginia', 'President Steyn Ave',
 'Ductile Iron', 1.10,
 26.8720, -28.1010,
 3.40, 3.38, 3750, -79, 9.0,
 'NOMINAL',
 ST_MakePoint(26.8720, -28.1010)::GEOGRAPHY),

-- Node 108 — Ward 9, Virginia
(108, 'VRG-N108', 9, 'Virginia', 'Merriman St',
 'Ductile Iron', 1.05,
 26.8760, -28.1040,
 3.35, 4.90, 3730, -80, 8.7,
 'HAMMER_SURGE',
 ST_MakePoint(26.8760, -28.1040)::GEOGRAPHY),

-- Node 109 — Ward 11, Odendaalsrus
(109, 'ODR-N109', 11, 'Odendaalsrus', 'Brink St',
 'AC', 0.95,
 26.6980, -27.8690,
 3.00, 2.98, 3600, -89, 6.5,
 'NOMINAL',
 ST_MakePoint(26.6980, -27.8690)::GEOGRAPHY),

-- Node 110 — Ward 11, Odendaalsrus
(110, 'ODR-N110', 11, 'Odendaalsrus', 'Piet Retief St',
 'PVC', 0.90,
 26.7010, -27.8720,
 2.95, 2.93, 3570, -92, 6.0,
 'NOMINAL',
 ST_MakePoint(26.7010, -27.8720)::GEOGRAPHY);

-- Confirm
SELECT id, name, ward_id, suburb, status FROM public.telemetry_nodes ORDER BY id;
