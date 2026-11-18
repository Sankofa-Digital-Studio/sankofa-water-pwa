# Sankofa Digital — The Boundary Watch & High-Site Gateway
## Hardware Sourcing & Bill of Materials (BOM) Guide
### Verified Component Procurement for South African Suppliers

> **Document Class:** Technical Procurement & Supply Chain Dossier  
> **Prepared For:** Technical Review by Eskom Electrical Engineering & Harmony Gold Infrastructure / GIS Teams  
> **Target System:** The Boundary Watch (Edge IoT Telemetry Node) & High-Site LoRaWAN Gateway Base Station  
> **Operating Territory:** Welkom, Matjhabeng Local Municipality, Free State Province  

---

## 1. Executive Procurement Summary

This document maps every discrete electrical, mechanical, and geospatial component in the **Boundary Watch** node and **High-Site Gateway** to verified South African electronics distributors and industrial merchants:
1. **RS Components South Africa** (Kyalami, Midrand — fast trade counter & next-day courier)
2. **Communica (Pty) Ltd** (Midrand / Pretoria / Cape Town)
3. **Micro Robotics** (Centurion / Stellenbosch)
4. **Mantech Electronics** (Johannesburg / Durban / Cape Town)
5. **Local Industrial Merchants** (Incledon Welkom, Stewarts & Lloyds, Herholdt's Group Welkom)

---

## 2. Bill of Materials: "The Boundary Watch" IoT Node (Unit BOM)

Target Unit Cost: **R 620.00 ZAR** (calculated at volume production: 50–500 units). Single-unit prototype pricing is approximately R 750.00 – R 890.00.

| Item # | Subsystem | Description & Specification | Manufacturer & Part Number (MPN) | South African Supplier & SKU | Unit Price (ZAR ex VAT) | Alternative Second Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Microcontroller & Radio** | ESP32-C3 SuperMini 160MHz RISC-V, 4MB Flash, Wi-Fi/BLE + Ebyte SX1262 LoRaWAN 868MHz (or RAK3172 integrated LoRa module) | Espressif / Ebyte: `ESP32-C3` / `E22-900T22D` or RAK Wireless `RAK3172` | Communica: `WRL-ESP32-C3` / Micro Robotics: `RAK3172-SMA` | **R 115.00** | LCSC: `C2844433` (RAK3172 STM32WLE5 SoC) |
| **02** | **Pressure Transducer** | G1/4" Thread, Ceramic Piezoresistive, 0–1.2 MPa (0–12 bar continuous / 24 bar burst shock), 0.5–4.5V ratiometric, IP65/IP67 lead | SenSmart / Jiasheng: `G1/4-1.2MPA-SS` | Micro Robotics: `SEN-PRS-1.2M` or Mantech: `14M4521` | **R 165.00** | RS Components: `TE Connectivity MSP300` (Cat: `797-5049` - premium spec) |
| **03** | **Acoustic Sensor Element** | 27mm Piezoceramic Brass Disc (Resonance: 4.6 kHz ±0.5 kHz, Capacitance: 20 nF), vibration pickup on pipe manifold | Murata / generic: `7BB-27-4L0` | Communica: `AUD-PIEZO-27` / Mantech: `14M0098` | **R 12.00** | RS Components: `Kemo Piezodisc` (Cat: `285-784`) |
| **04** | **Power Regulation (LDO)** | Ultra-Low Quiescent Current LDO, 3.3V, 250mA, SOT-23, $I_q = 1.6\mu\text{A}$ | Microchip: `MCP1700T-3302E/TT` | RS Components: `829-1300` / Mantech: `14M9112` | **R 8.50** | Texas Instruments: `TPS7A0233` ($I_q = 25\text{ nA}$) |
| **05** | **Power Gating P-MOSFET** | High-Side P-Channel MOSFET, -30V, -4.2A, $R_{DS(on)} < 50\text{ m}\Omega$, SOT-23 (Switches transducer power) | Alpha & Omega: `AO3401A` | Communica: `SEM-SMD-AO3401` / Mantech: `14M3301` | **R 3.50** | ON Semi: `BSS84LT1G` (RS: `687-7324`) |
| **06** | **Nano-Power Comparator** | Ultra-Low Power Comparator with internal reference, $I_q = 330\text{ nA}$, SC70-5 | Texas Instruments: `TLV7031DCKR` | RS Components: `146-2182` / Digikey / Communica | **R 14.50** | STMicroelectronics: `TS881ICT` |
| **07** | **Primary Battery Pack** | 3x AA 1.5V Lithium/Iron Disulfide ($\text{Li-FeS}_2$), 3,000 mAh, operating temp -40°C to +60°C, 20-year shelf life | Energizer: `Ultimate Lithium L91` | RS Components: `493-2775` (pack of 4) / Communica | **R 85.00** (3 cells) | Saft: `LS14500` 3.6V $\text{Li-SOCl}_2$ (RS: `596-602`) |
| **08** | **Hydraulic Snubber** | 1/4" BSP Sintered Bronze Porosity Snubber (Porous Grade 40 µm) dampens hydraulic shockwaves & sediment | Parker / Aignep: `SNUB-B-02` | Mantech / RS Components: `176-2114` or Incledon Welkom | **R 42.00** | Stewarts & Lloyds Welkom: Hydraulic snubber tee |
| **09** | **Enclosure & Glands** | IP68 Polycarbonate Enclosure with silicone gasket (100x68x50mm) + 2x PG7/PG9 Nickel-Plated Brass Glands | Gainta: `G212C` / `G311` or Hammond `1554B` | RS Components: `229-0331` / Communica: `ENC-IP68-100` | **R 115.00** | Mantech: `BOX-G311-IP68` |
| **10** | **Plumbing Tap Manifold** | 1/2" to 3/4" DZR Brass Compression Tee with 1/4" female threaded gauge port (SABS 1808-3 approved) | Cobra / Apex / DZR Waterware: `DZR-TEE-20x15` | Incledon Welkom / Plumblink Welkom: `SKU-PLB-8821` | **R 38.00** | Stewarts & Lloyds Welkom: High-pressure DZR saddle |
| **11** | **Antenna Subsystem** | 868 MHz LoRa 1/4-wave omni whip antenna (IP67 bulkhead mount, SMA male, 2.15 dBi gain) | Siretta / Ebyte: `TX868-JK-20` | Micro Robotics: `ANT-LORA-868-SMA` / RS: `124-8868` | **R 22.00** | Communica: `ANT-868-RUBBER` |
| **12** | **Passive Protection** | 3.3V Zener diode (BZX84C3V3), 100 µF 6.3V Low-ESR Tantalum Cap, SMAJ5.0A TVS diode, $10\text{ M}\Omega$ bleed resistor | Vishay / Bourns | RS Components: `714-3251` / Mantech: `14M0100` | **R 4.50** | Communica: SMD Sample kit |
| **TOTAL** |  | **Complete Boundary Watch Edge Node (BOM Per Unit)** |  |  | **R 620.00** |  |

---

## 3. Bill of Materials: High-Site LoRaWAN Gateway & 53-Hour UPS Base Station

Target Deployment Site: **Bedelia Water Tower / High-Site, Welkom (15 m Above Ground Level [AGL])**.  
Power Requirement: Uninterrupted operation through Eskom Stage 6 Loadshedding (up to 4.5 hour continuous blackout cycles, designed for **53.3 hours zero-grid autonomy**).

| Item # | Subsystem | Description & Specification | Manufacturer & Part Number (MPN) | South African Supplier & SKU | Unit Price (ZAR ex VAT) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GW-01** | **Outdoor LoRaWAN Gateway** | 8-Channel Outdoor IP67 Gateway, SX1302/SX1303 baseband, GPS synchronization, PoE 802.3af, 868 MHz EU/ZA band | RAK Wireless: `RAK7289 CV2` or Milesight `UG67-868M` | Micro Robotics: `RAK7289-OUTDOOR` / RS: `234-5891` | **R 6,450.00** |
| **GW-02** | **LiFePO4 Battery Bank** | 12.8V 50Ah (640 Wh) Lithium Iron Phosphate ($\text{LiFePO}_4$) battery with integrated Smart BMS (2,000+ cycles at 100% DoD) | BlueNova / Hubble / Revov: `BN13V-50-650Wh` or `Hubble S-100` | Herholdt's Group Welkom / Rubicon / Communica: `BAT-LIFEPO4-12V50` | **R 3,450.00** |
| **GW-03** | **AC/DC Float Charger / UPS** | DIN-Rail Smart Charger & Power Supply, 230V AC input to 13.8V DC 5.4A output, auto battery switchover & low-voltage disconnect | Mean Well: `DRC-60A` or `PSC-60A` | RS Components: `111-6447` / Communica: `PSU-DRC-60A` | **R 680.00** |
| **GW-04** | **Surge Protection (AC Side)** | Type 2 DIN-Rail Surge Protection Device (SPD), Single Phase 230V, $I_n = 20\text{ kA}$, $I_{\max} = 40\text{ kA}$, $U_p \le 1.5\text{ kV}$ | DEHN / Citel: `DEHNguard DG M TT 275` or ACDC `SPD-1P-40KA` | ACDC Dynamics Welkom: `SPD-230-40` / RS: `136-8526` | **R 520.00** |
| **GW-05** | **RF Lightning Arrestor** | N-Type Male to N-Type Female 0–3 GHz Gas Tube Lightning Coaxial Surge Protector with 16mm ground lug | Huber+Suhner / generic: `GDT-N-3GHZ` | Communica: `CONN-RF-ARREST-N` / RS: `288-294` | **R 380.00** |
| **GW-06** | **Ethernet PoE Surge Arrestor**| Shielded RJ45 Gigabit PoE+ Surge Protector (1000Base-T, 48V PoE mode A/B) | Ubiquiti: `ETH-SP-G2` or Dehn `DPA M CLE RJ45` | Scoop Distribution / Miro SA / RS: `187-5431` | **R 245.00** |
| **GW-07** | **Earth Electrode & Cable** | 1.8 m Copper-Bonded Steel Earth Rod (16 mm dia) + 10 m 16 mm² Green/Yellow Copper Earth Cable + Brass Clamp | SABS Approved (CBI / Southwire) | ARB Electrical / Herholdt's Welkom: `EARTH-ROD-16-1.8` | **R 310.00** |
| **GW-08** | **Outdoor Weatherproof Enclosure**| IP66 UV-Stabilized Polycarbonate/GRP Pole-Mount Enclosure with DIN rail, keyed cam lock, cable glands (300x250x150 mm) | Allbro / Hensel: `ALLBRO-ENCL-M3` | ACDC Dynamics Welkom / RS Components: `186-5389` | **R 620.00** |
| **TOTAL** |  | **High-Site Base Station Subsystem (Total CAPEX)** |  |  | **R 12,655.00** |

---

## 4. Supplier Contact & Local Procurement Directory

### Free State Goldfields Local Trade Counters
1. **Herholdt's Group Welkom** (Solar, Battery & Electrical Infrastructure)  
   - Address: 146 Jan Hofmeyr Rd, Voorspoed, Welkom, 9459  
   - Phone: +27 (0)57 355 3588  
   - Accounts: Sankofa Trade Account candidate for LiFePO4 batteries, CBI DIN breakers, and earth rods.
2. **ACDC Dynamics Welkom** (Surge Protection, Enclosures, Power Supplies)  
   - Address: Power Rd, Industrial Area, Welkom  
   - Lead Time: Immediate off-the-shelf for Mean Well PSUs, DEHN SPDs, and IP66 Allbro enclosures.
3. **Incledon Welkom** (Municipal Pipe Fittings, DZR Brass Saddles & Snubbers)  
   - Address: 22 8th Street, Voorspoed, Welkom  
   - Phone: +27 (0)57 355 1251  
   - Scope: SABS 1808-3 municipal brass fittings, meter test couplings, Class 16 compression joints.

### National Electronic Component Express Distribution
1. **RS Components South Africa**  
   - Website: `za.rs-online.com` | Tel: 0860 007 772  
   - Account: 30-day corporate trade account; express delivery to Welkom via Dawn Wing / The Courier Guy (24–48 hours).
2. **Communica (Pty) Ltd**  
   - Website: `communica.co.za` | Tel: +27 (0)12 657 3500  
   - Scope: Semiconductor active/passive pass-through, RAK LoRa modules, sensors.
3. **Micro Robotics**  
   - Website: `microrobotics.co.za` | Tel: +27 (0)12 664 6891  
   - Scope: Pressure transducers, outdoor high-gain 868MHz antennas, RF cabling.
