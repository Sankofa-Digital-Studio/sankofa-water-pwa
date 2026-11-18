// ============================================================
// Sankofa Digital Matjhabeng Water PWA — Formal Dossiers Catalog
// 5 Formal Water Intervention Dossiers for Matjhabeng Municipality
// ============================================================

import { Dossier } from '@/types/dossiers.types';

export const FORMAL_DOSSIERS: Dossier[] = [
  {
    id: 'dossier-01',
    code: 'DSR-2024-WW-001',
    title: 'Ward 3 CBD Acoustic Pinpoint & Pressure Stabilization',
    subtitle: 'High-density commercial district NRW reduction & water hammer suppression',
    wardScope: 'Ward 3 (Welkom CBD, Koppie Alleen)',
    summary:
      'Targeted deployment of IoT high-speed acoustic transducers and surge suppression valves across the commercial spine. Rapidly halts pipe fatigue and catastrophic AC pipe failures.',
    sections: [
      {
        title: 'Problem Statement',
        content:
          'Commercial Ward 3 suffers recurring pressure transients up to 5.2 bar caused by rapid commercial valving and industrial draw cycles, accelerating Asbestos Cement (AC) rupture rates.',
        highlights: [
          'AC Class 10 pipelines installed in 1974 operating beyond design lifespan',
          'Unaccounted-for water loss estimated at 42.6% in CBD perimeter',
        ],
      },
      {
        title: 'Technical Scope of Work',
        content:
          'Installation of 10 high-precision piezo-resistive LoRaWAN transducers, real-time edge burst detection, and automated PRV (Pressure Reducing Valve) curve modulation.',
        highlights: [
          'Sub-second pressure transient logging with LoRaWAN event triggers',
          'TDOA rupture triangulation within 15-meter circular error probable',
        ],
      },
    ],
    financials: [
      {
        category: 'Hardware & Transducers',
        amountZar: 420000,
        description: 'LoRaWAN IP68 telemetry nodes, solar harvesting brackets & sensors',
      },
      {
        category: 'Civil & Valve Installation',
        amountZar: 380000,
        description: 'Pit excavation, dynamic PRV retrofitting, chamber rehabilitation',
      },
      {
        category: 'Platform & SaaS Integration',
        amountZar: 150000,
        description: 'Telemetry ingestion engine, GIS visualization & alerts routing',
      },
    ],
    risks: [
      {
        risk: 'Chamber flooding during torrential rain events',
        mitigation: 'IP68 hermetic potting with submerged antenna extensions',
        severity: 'MEDIUM',
      },
      {
        risk: 'Vandalism / copper theft attempts',
        mitigation: 'Sub-surface composite lids with anti-tamper magnetic latches',
        severity: 'HIGH',
      },
    ],
    capexZar: 950000,
    opexZarPerMonth: 28000,
    projectedSavingsZarPerMonth: 142000,
    paybackMonths: 6.7,
  },
  {
    id: 'dossier-02',
    code: 'DSR-2024-WW-002',
    title: 'Ward 5 Riebeeckstad Bulk Feeder Line Modernization',
    subtitle: 'Asbestos-cement transition and satellite SAR leak localization',
    wardScope: 'Ward 5 (Riebeeckstad, Danie Theron St)',
    summary:
      'Integration of Asterra L-band synthetic aperture radar (SAR) soil moisture tracking with ground-truthed IoT pressure logging to eliminate undetected sub-surface pipe leaks.',
    sections: [
      {
        title: 'Geotechnical & Infrastructure Background',
        content:
          'Expansive clay soils combined with 50-year-old AC pipelines create chronic shear fractures that remain unexpressed at surface level for months.',
        highlights: [
          'Estimated underground loss: 65 kL/hr across 4 feeder branches',
          'Subsidence causing structural road foundation failures on Voortrekker St',
        ],
      },
      {
        title: 'Intervention Plan',
        content:
          'Satellite SAR POI correlation followed by acoustic correlator field verification and targeted localized composite sleeve rehabilitation.',
      },
    ],
    financials: [
      {
        category: 'Satellite SAR Intelligence',
        amountZar: 210000,
        description: 'L-band radar pass analysis, soil moisture index, POI vectoring',
      },
      {
        category: 'Acoustic Validation & Digging',
        amountZar: 490000,
        description: 'Trenchless spot verification and localized high-density sleeve clamps',
      },
      {
        category: 'Continuous Telemetry Monitoring',
        amountZar: 180000,
        description: 'Permanent acoustic noise loggers with 4G/LoRa fallback',
      },
    ],
    risks: [
      {
        risk: 'False positives from shallow stormwater drainage basins',
        mitigation: 'Dual-pass SAR verification cross-checked with LoRaWAN baseline flow',
        severity: 'LOW',
      },
    ],
    capexZar: 880000,
    opexZarPerMonth: 22000,
    projectedSavingsZarPerMonth: 115000,
    paybackMonths: 7.7,
  },
  {
    id: 'dossier-03',
    code: 'DSR-2024-WW-003',
    title: 'Ward 7 Thabong Low-Pressure Equalization & Water Security',
    subtitle: 'Equitable distribution and night-flow depressurization prevention',
    wardScope: 'Ward 7 (Thabong Central, Moshoeshoe Dr, Setjhaba St)',
    summary:
      'Addresses severe evening depressurization in residential zones through district metered area (DMA) partitioning and solar-powered pressure boost valves.',
    sections: [
      {
        title: 'Community Water Access Challenge',
        content:
          'Terminal extremities of the Thabong network experience drop to 0.4 bar during peak morning and evening consumption periods, causing intermittent zero-flow conditions.',
      },
      {
        title: 'Sankofa Solution Matrix',
        content:
          'Boundary isolation valves, smart solar pressure boosting, and real-time community WhatsApp water dispatch notification network.',
      },
    ],
    financials: [
      {
        category: 'Smart Boundary Isolation Valves',
        amountZar: 340000,
        description: 'Electric actuator actuated boundary valves with solar backup',
      },
      {
        category: 'Community Citizen Telemetry Network',
        amountZar: 120000,
        description: 'WhatsApp Cloud API integration & ward dispatch alert automation',
      },
      {
        category: 'Pipe Line Balancing & Purging',
        amountZar: 260000,
        description: 'Air release valve installation and sediment flushing manifolds',
      },
    ],
    risks: [
      {
        risk: 'Community friction during planned network sectioning',
        mitigation: 'Automated 48-hour prior opt-in WhatsApp ward broadcasts',
        severity: 'MEDIUM',
      },
    ],
    capexZar: 720000,
    opexZarPerMonth: 18000,
    projectedSavingsZarPerMonth: 89000,
    paybackMonths: 8.1,
  },
  {
    id: 'dossier-04',
    code: 'DSR-2024-WW-004',
    title: 'Ward 9 Virginia Mining Belt Hydraulic Hammer Abatement',
    subtitle: 'Heavy industry pump cavitation containment and ductile iron pipe protection',
    wardScope: 'Ward 9 (Virginia, President Steyn Ave, Merriman St)',
    summary:
      'High-impact hydraulic hammer arrestor chambers installed along the mining boundary pipeline to absorb extreme kinetic shockwaves from sudden mine pump trips.',
    sections: [
      {
        title: 'Industrial Shock Wave Profile',
        content:
          'Sudden electrical trips at mining deep pumps create reverse pressure waves exceeding 6.5 bar within 280 milliseconds, shattering municipal connections.',
      },
      {
        title: 'Engineering Remedy',
        content:
          'Fast-acting hydraulic bladder surge vessels, high-frequency Piezo telemetry with milli-second delta capture, and automated upstream dampeners.',
      },
    ],
    financials: [
      {
        category: 'Surge Anticipator & Bladder Vessels',
        amountZar: 850000,
        description: 'Twin 500L ASME-certified nitrogen-charged surge dampeners',
      },
      {
        category: 'Ultra-High-Speed IoT Transducers',
        amountZar: 290000,
        description: '100Hz transient capture nodes with LoRaWAN event backhaul',
      },
      {
        category: 'SCADA Interlock Integration',
        amountZar: 190000,
        description: 'Mine pump house communication relay and failsafe cutoff interlocks',
      },
    ],
    risks: [
      {
        risk: 'Cross-jurisdictional private mine infrastructure access',
        mitigation: 'Tripartite SLA framework between Matjhabeng, Mining House, and Sankofa',
        severity: 'HIGH',
      },
    ],
    capexZar: 1330000,
    opexZarPerMonth: 34000,
    projectedSavingsZarPerMonth: 210000,
    paybackMonths: 6.3,
  },
  {
    id: 'dossier-05',
    code: 'DSR-2024-WW-005',
    title: 'Ward 11 Odendaalsrus Outfall Pipeline Leak Triangulation',
    subtitle: 'Agricultural interface drone NDVI inspection & acoustic cross-correlation',
    wardScope: 'Ward 11 (Odendaalsrus, Brink St, Piet Retief St)',
    summary:
      'Combines UAV multispectral vegetation indices (NDVI) with dual-node acoustic TDOA to identify major concealed trunk line ruptures running across agricultural lands.',
    sections: [
      {
        title: 'Agricultural Outfall Vulnerability',
        content:
          'Rural outfall lines suffer heavy mechanical damage from farm tillage machinery. Hidden leaks create lush surface vegetation without visible surface pooling.',
      },
      {
        title: 'UAV & TDOA Methodology',
        content:
          'Autonomous quarterly multispectral drone surveys detect anomalous chlorophyll absorption anomalies. TDOA pressure wave analysis confirms rupture exact coordinates.',
      },
    ],
    financials: [
      {
        category: 'UAV Multispectral Sensor Survey',
        amountZar: 175000,
        description: 'High-resolution NDVI aerial scan of 42km pipeline right-of-way',
      },
      {
        category: 'Telemetry Logger Grid',
        amountZar: 320000,
        description: 'Solar-powered remote RTUs with cellular and satellite fallbacks',
      },
      {
        category: 'Contractor Geofenced Excavation Support',
        amountZar: 275000,
        description: 'Mobile PWA proof-of-work excavation validation and rapid clamps',
      },
    ],
    risks: [
      {
        risk: 'Farmland property access permissions',
        mitigation: 'Municipal servitudes pre-registration with Free State Agriculture union',
        severity: 'LOW',
      },
    ],
    capexZar: 770000,
    opexZarPerMonth: 21000,
    projectedSavingsZarPerMonth: 104000,
    paybackMonths: 7.4,
  },
];
