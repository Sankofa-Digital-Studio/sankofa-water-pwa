# Sankofa Digital — Matjhabeng Predictive Water Network
## Technical Architecture, Public Specification & SEDA / SEFA Funding Memorandum

> **Municipal Entity:** Matjhabeng Local Municipality (Welkom, Odendaalsrus, Virginia, Allanridge, Hennenman, Ventersburg)  
> **Implementing Partner:** Sankofa Digital Labs (Pty) Ltd  
> **Statutory Alignment:** MFMA Sec 33, MSA Sec 17(2)(a), POPIA Act 4 of 2013, ICASA Act 36 of 2005  
> **Deployment Target:** Vercel Global Edge (Johannesburg `jnb1`), Supabase Managed PostGIS  

---

## 1. Executive Summary & Problem Formulation

Matjhabeng Local Municipality incurs a catastrophic **64.2% Non-Revenue Water (NRW)** deficit, losing an estimated 38.6 million kiloliters of treated potable bulk water per annum purchased from Vaal Central Water Board at **R17.01 / kL**. This fiscal hemorrhage translates to over **R656 million annually** in unrecovered expenditure, compounding an outstanding bulk debt balance exceeding **R6.0 billion**.

### Subterranean Failure Dynamics
The primary failure mode across the 1,540 km reticulation grid is **hydraulic transient water hammer** ripping through aged Class 20/30 Asbestos Cement (AC) and uPVC mains buried at depths of 4.0 m to 6.2 m. Rapid valve closures and erratic un-buffered pumping post Stage 4–6 load shedding cycles generate 11.0 to 14.8 bar transient shockwaves against pipes rated for 3.5 bar nominal static pressure.

### The Sankofa Digital Solution
A unified, low-power IoT, geospatial, and distributed ledger platform:
1. **MVP-0 ("The Boundary Watch"):** 10 non-invasive acoustic/transient nodes installed on consumer boundary meter manifolds (R620/node BOM vs R78,000 SCADA equivalents), achieving **11.2 µA average sleep current** and 6.8+ year battery life.
2. **PostGIS Spatial Multi-Node Coincidence Engine:** Real-time burst localization (TDOA) combined with strict 3-node spatial validation to eliminate false positives from local irrigation draws.
3. **Field Anti-Ghost-Work PWA:** Server-side PostGIS geofenced attestation (ST_DistanceSphere ≤ 15.0 m) enforcing 3-stage photographic proof (Excavation, Class 16 Sleeve Repair, Road Surface Compaction) before municipal disbursements can unlock under MFMA rules.

---

## 2. Full-Stack Cloud & Database Architecture

```mermaid
graph TD
    subgraph Edge Layer [Welkom Reticulation Grid]
        N1[Node 101: Stateway & Tempest] -->|LoRaWAN EU868 / ICASA SRD| GW[High-Site Gateway: 15m AGL Bedelia]
        N2[Node 102: Stateway & Bok] -->|LoRaWAN EU868 / ICASA SRD| GW
        N3[Node 106: Reitzpark Othello] -->|LoRaWAN EU868 / ICASA SRD| GW
        GW -->|Backhaul: Fiber / 53h LiFePO4 UPS| CS[ChirpStack v4 Network Server]
    end

    subgraph Security & Ingestion [Next.js App Router @ Vercel JNB1]
        CS -->|HTTP POST with HMAC-SHA256 Header| API["/api/v1/lora/webhook"]
        API -->|Validate X-Chirpstack-Signature| VHMAC{HMAC OK?}
        VHMAC -->|No: 401 Unauthorized| REJ[Drop Packet]
        VHMAC -->|Yes: 200 OK| RPC[Supabase RPC Ingestion]
    end

    subgraph Relational & Spatial Core [Supabase PostgreSQL 15 + PostGIS]
        RPC --> PL[pressure_logs Table]
        RPC --> EWE["evaluate_ward_emergency(ward_id, is_surge)"]
        EWE -->|3 Nodes < 1.0 Bar OR Peak > 1.5 Bar Delta| LOCK[ward_alert_locks Mutex]
        EWE -->|Advisory Lock Verified| WAGEN[Trigger Meta WhatsApp Cloud API]
    end

    subgraph Field Compliance & Anti-Fraud [Mobile PWA]
        TECH[Field Plumber / Technician] -->|Offline-First IndexedDB| PWA[Field PWA React 19]
        PWA -->|Live WebRTC Camera + GPS DOP| GEO["/api/v1/tickets (PATCH)"]
        GEO -->|PostGIS: validate_stage_geofence()| CHK{Dist <= 15m?}
        CHK -->|No: 400 Ghost-Work Blocked| WARN[Flag Fraud Attempt]
        CHK -->|Yes: Advance Stage| ADV[Payment Authorized under MFMA]
    end
```

---

## 3. Hardware & Embedded Systems Specification

### 3.1 Bill of Materials (BOM) Comparison
| Subsystem Component | Tier 3 Legacy SCADA / District Meter | Sankofa MVP-0 "Boundary Watch" Node | Cost Variance (%) |
| :--- | :--- | :--- | :--- |
| **Compute Core** | Allen-Bradley Micro850 PLC (R18,500) | ESP32-C3 SuperMini 160MHz RISC-V (R65) | **-99.6%** |
| **Acoustic Sensor** | Submersible Hydrophone Kit (R24,000) | Piezoceramic Disc + Zener Clamp (R12) | **-99.9%** |
| **Pressure Transducer** | ABB 316L SS Flanged 4-20mA (R19,200) | Ceramic Piezoresistive G1/4" 0-12 bar (R165) | **-99.1%** |
| **Power Supply** | Dual Solar Panel + 45Ah Lead-Acid (R9,800) | 3x Energizer Ultimate Lithium L91 AA (R85) | **-99.1%** |
| **Radio Modem** | Industrial 4G/LTE Modem + SIM (R6,500) | Ebyte E22-900T22D SX1262 LoRa (R115) | **-98.2%** |
| **Enclosure & Tap** | Cast Iron Underground Vault (R7,200) | IP67 Conduit Box + Brass Meter Tee (R178) | **-97.5%** |
| **Total Per Unit** | **R 85,200.00** | **R 620.00** | **-99.27%** |

### 3.2 Power Budgeting & Energy Harvesting Calculations
- **Deep Sleep Current (I_sleep):** ESP32-C3 deep sleep (5.0 µA) + Microchip MCP1700T-3302E LDO (1.6 µA) + SX1262 sleep (1.0 µA) = **7.6 µA**.
- **Sampling Active Current (I_active):** High-side P-MOSFET gate turns on for 15.0 ms every 5 minutes (4.2 mA active including 3.5 ms op-amp settling) = **0.21 µA normalized average**.
- **Mechanical Vibration Wake:** PASSIVE R12 piezoceramic disc generates 1.2V–3.3V piezo charge across a 3.3V Zener diode into GPIO 2. The 18 ms secondary validation test filters 140 passing ore trucks/day with zero LoRa transmission, drawing only **0.105 µAh / check**.
- **LoRaWAN Uplink:** Scheduled 2 heartbeats/day at +14 dBm (45 mA for 1.2s airtime at SF9) = **0.030 mAh/day**.
- **Total Energy Consumption:** **268.8 µAh/day = 11.2 µA average draw**.
- **Battery Expectancy:** 3x AA L91 Lithium cells = 3,000 mAh nominal capacity @ 75% derating factor = 2,250 mAh usable.
  $$\text{Service Life} = \frac{2,250\text{ mAh}}{0.2688\text{ mAh/day} \times 365\text{ days}} = 22.9\text{ theoretical years} \implies \mathbf{6.8\text{ years (chemical shelf-life limited)}}.$$

---

## 4. Statutory & Regulatory Alignment (South Africa)

1. **ICASA SRD Spectrum Compliance:** Operates on the 868.0–868.6 MHz telemetry band with ≤ 25 mW ERP (14 dBm) and < 1% duty cycle under the Electronic Communications Act No. 36 of 2005.
2. **POPIA Act No. 4 of 2013:** 
   - Section 69: Automated WhatsApp early-warning dispatches are restricted exclusively to verified opted-in citizens registered in `whatsapp_subscribers`.
   - Section 11 & 14: Client IP addresses logged during legal Letter of Intent (LOI) signing are transformed into one-way **SHA-256 digests (`ip_hash`)**; raw IP addresses are never committed to disk.
3. **Municipal Finance Management Act (MFMA No. 56 of 2003):** 
   - Sections 33 & 71: Service Delivery and Budget Implementation Plan (SDBIP) auditing reconciles citizen-verified water saved (@ R17.01/kL) directly against municipal capital allocations, eliminating unsupported voucher processing.
4. **Municipal Systems Act (MSA No. 32 of 2000):** 
   - Section 17(2)(a): Establishes legally binding civic evidence trails empowering Ratepayers Associations and Business Chambers to petition for service delivery restoration.

---

## 5. SEDA & SEFA Funding Application Memoranda

### 5.1 SEDA (Small Enterprise Development Agency) — Technology Transfer & Incubation
- **Target Grant:** SEDA Technology Programme (STP) / Seed Capital Facility
- **Requested Amount:** **R 350,000.00**
- **Fund Allocation:**
  - Automated SMT Pick-and-Place tooling & stencil calibration: R 120,000
  - Pre-compliance EMC & ICASA radio type-approval testing (RF laboratory): R 95,000
  - Tooling for injection-molded IP68 UV-stabilized polycarbonate enclosures: R 85,000
  - Matjhabeng youth artisan stipend for pilot deployment (10 nodes): R 50,000
- **Developmental Impact:**
  - Establishes a local electronics assembly workflow in the Lejweleputswa District.
  - Transitions informal plumbing contractors into certified IoT sensor deployment technicians.

### 5.2 SEFA (Small Enterprise Finance Agency) — Bridging Finance & CAPEX Scaling
- **Target Facility:** Direct Lending / Asset Finance Facility
- **Requested Amount:** **R 2,280,000.00** (Phase 1 Lean DMA Pilot)
- **Financial Architecture:** Ring-fenced Private Escrow Model backed by Mining House Social & Labour Plan (SLP) commitments (Harmony Gold / Sibanye-Stillwater host-community development).
- **Repayment Mechanism:** Shared-savings performance model. The recovery of 26,000 kL/month of water in a single DMA at R17.01/kL unlocks R 442,260/month in municipal bulk savings, yielding a full CAPEX amortization within **5.2 months**.

---

## 6. Verification and Test Proofs

| Test Suite Module | Execution Target | Coverage Metrics | Status |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | `__tests__/unit/utils/*.test.ts` | 100% logic coverage (Pressure, Battery, HMAC, Financial) | **PASSED** |
| **API Integration** | `__tests__/integration/api/*.test.ts` | Webhook HMAC auth, PostGIS geofence, LOI signing | **PASSED** |
| **End-to-End** | `__tests__/e2e/*.spec.ts` | Playwright: 11.8 Bar Surge, GPS geofencing, PWA offline queue | **PASSED** |

---

*Authored by Ntula "Otto" Thoso, Lead Systems Architect — Sankofa Digital Labs (Pty) Ltd.*  
*Welkom, Free State, Republic of South Africa.*
