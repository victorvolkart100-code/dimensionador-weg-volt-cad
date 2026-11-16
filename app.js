/**
 * ============================================================================
 * VOLT-CAD // WEG DT-11 & NBR 5410 — ELECTRICAL ENGINEERING WORKBENCH (v5.0)
 * Arquitetura 3-Pane CAD/CAE (ISA-101) — 100% Offline
 * Módulos:
 *   [M1] Transformador Trifásico a Óleo (Padrão WEG DT-11 / ABNT NBR 5356 / 5440)
 *   [M2] Transformador Monofásico Núcleo E-I (IEC 60076 / Comando)
 *   [M3] Alimentador de Baixa Tensão (ABNT NBR 5410 — Método B1)
 * ============================================================================
 */

// 1. Tabelas Normativas AWG/MCM, Cabos NBR 5410 (1,5 a 300 mm² — Prysmian/Cobrecom), Potências e Isolamento WEG DT-11
const AWG_TABLE = [
  { gauge: '600 MCM', area: 304.0, d_mm: 19.68,  r_ohm_km: 0.0567 },
  { gauge: '500 MCM', area: 253.4, d_mm: 17.96,  r_ohm_km: 0.0680 },
  { gauge: '350 MCM', area: 177.3, d_mm: 15.01,  r_ohm_km: 0.0972 },
  { gauge: '300 MCM', area: 152.0, d_mm: 13.90,  r_ohm_km: 0.1134 },
  { gauge: '250 MCM', area: 126.7, d_mm: 12.70,  r_ohm_km: 0.1360 },
  { gauge: '4/0 AWG', area: 107.2, d_mm: 11.684, r_ohm_km: 0.161 },
  { gauge: '3/0 AWG', area: 85.03, d_mm: 10.404, r_ohm_km: 0.203 },
  { gauge: '2/0 AWG', area: 67.43, d_mm: 9.266,  r_ohm_km: 0.255 },
  { gauge: '1/0 AWG', area: 53.48, d_mm: 8.251,  r_ohm_km: 0.322 },
  { gauge: '2 AWG',   area: 33.63, d_mm: 6.544,  r_ohm_km: 0.513 },
  { gauge: '4 AWG',   area: 21.15, d_mm: 5.189,  r_ohm_km: 0.815 },
  { gauge: '6 AWG',   area: 13.30, d_mm: 4.115,  r_ohm_km: 1.296 },
  { gauge: '8 AWG',   area: 8.366, d_mm: 3.264,  r_ohm_km: 2.061 },
  { gauge: '10 AWG',  area: 5.261, d_mm: 2.588,  r_ohm_km: 3.277 },
  { gauge: '12 AWG',  area: 3.309, d_mm: 2.053,  r_ohm_km: 5.211 },
  { gauge: '14 AWG',  area: 2.081, d_mm: 1.628,  r_ohm_km: 8.285 },
  { gauge: '16 AWG',  area: 1.309, d_mm: 1.291,  r_ohm_km: 13.17 },
  { gauge: '18 AWG',  area: 0.823, d_mm: 1.024,  r_ohm_km: 20.95 },
  { gauge: '20 AWG',  area: 0.518, d_mm: 0.812,  r_ohm_km: 33.31 },
  { gauge: '22 AWG',  area: 0.326, d_mm: 0.644,  r_ohm_km: 52.96 },
  { gauge: '24 AWG',  area: 0.205, d_mm: 0.511,  r_ohm_km: 84.22 },
  { gauge: '26 AWG',  area: 0.128, d_mm: 0.405,  r_ohm_km: 133.9 }
];

// Catálogo Completo de Cabos de Cobre de 1,5 mm² a 300 mm²
// Fontes: ABNT NBR 5410 (Tabela 36 PVC 70°C, Tabela 37 EPR/XLPE 90°C, Tabela 39 Leito/Bandeja F),
// ABNT NBR NM 280 (Resistência CC a 20°C) e Catálogos Técnicos Prysmian (Sintenax/Eprotenax) & Cobrecom
const NBR5410_CABLES = [
  { section: 1.5,   awg: '16 AWG',  iz_b1_2c: 17.5,  iz_b1_3c: 15.5,  iz_xlpe_2c: 23.0,  iz_xlpe_3c: 19.5,  iz_tray_3c: 22.0,  r_cc_20: 12.10,  r_ohm_km: 14.48, r_xlpe_km: 15.43, x_ohm_km: 0.115, d_cond: 1.5,  d_ext: 3.0,  mass_kg_km: 21 },
  { section: 2.5,   awg: '14 AWG',  iz_b1_2c: 24.0,  iz_b1_3c: 21.0,  iz_xlpe_2c: 31.0,  iz_xlpe_3c: 27.0,  iz_tray_3c: 30.0,  r_cc_20: 7.41,   r_ohm_km: 8.87,  r_xlpe_km: 9.45,  x_ohm_km: 0.110, d_cond: 1.9,  d_ext: 3.6,  mass_kg_km: 32 },
  { section: 4.0,   awg: '12 AWG',  iz_b1_2c: 32.0,  iz_b1_3c: 28.0,  iz_xlpe_2c: 42.0,  iz_xlpe_3c: 36.0,  iz_tray_3c: 40.0,  r_cc_20: 4.61,   r_ohm_km: 5.52,  r_xlpe_km: 5.88,  x_ohm_km: 0.107, d_cond: 2.4,  d_ext: 4.2,  mass_kg_km: 48 },
  { section: 6.0,   awg: '10 AWG',  iz_b1_2c: 41.0,  iz_b1_3c: 36.0,  iz_xlpe_2c: 54.0,  iz_xlpe_3c: 46.0,  iz_tray_3c: 51.0,  r_cc_20: 3.08,   r_ohm_km: 3.69,  r_xlpe_km: 3.93,  x_ohm_km: 0.100, d_cond: 3.0,  d_ext: 4.8,  mass_kg_km: 68 },
  { section: 10.0,  awg: '8 AWG',   iz_b1_2c: 57.0,  iz_b1_3c: 50.0,  iz_xlpe_2c: 75.0,  iz_xlpe_3c: 63.0,  iz_tray_3c: 70.0,  r_cc_20: 1.83,   r_ohm_km: 2.19,  r_xlpe_km: 2.33,  x_ohm_km: 0.094, d_cond: 3.9,  d_ext: 6.0,  mass_kg_km: 112 },
  { section: 16.0,  awg: '6 AWG',   iz_b1_2c: 76.0,  iz_b1_3c: 68.0,  iz_xlpe_2c: 100.0, iz_xlpe_3c: 85.0,  iz_tray_3c: 94.0,  r_cc_20: 1.15,   r_ohm_km: 1.38,  r_xlpe_km: 1.47,  x_ohm_km: 0.090, d_cond: 4.9,  d_ext: 7.2,  mass_kg_km: 172 },
  { section: 25.0,  awg: '4 AWG',   iz_b1_2c: 101.0, iz_b1_3c: 89.0,  iz_xlpe_2c: 133.0, iz_xlpe_3c: 112.0, iz_tray_3c: 119.0, r_cc_20: 0.727,  r_ohm_km: 0.870, r_xlpe_km: 0.927, x_ohm_km: 0.086, d_cond: 6.1,  d_ext: 9.0,  mass_kg_km: 265 },
  { section: 35.0,  awg: '2 AWG',   iz_b1_2c: 125.0, iz_b1_3c: 110.0, iz_xlpe_2c: 164.0, iz_xlpe_3c: 138.0, iz_tray_3c: 148.0, r_cc_20: 0.524,  r_ohm_km: 0.627, r_xlpe_km: 0.668, x_ohm_km: 0.083, d_cond: 7.2,  d_ext: 10.2, mass_kg_km: 362 },
  { section: 50.0,  awg: '1/0 AWG', iz_b1_2c: 151.0, iz_b1_3c: 134.0, iz_xlpe_2c: 198.0, iz_xlpe_3c: 168.0, iz_tray_3c: 180.0, r_cc_20: 0.387,  r_ohm_km: 0.463, r_xlpe_km: 0.494, x_ohm_km: 0.081, d_cond: 8.5,  d_ext: 11.8, mass_kg_km: 495 },
  { section: 70.0,  awg: '2/0 AWG', iz_b1_2c: 192.0, iz_b1_3c: 171.0, iz_xlpe_2c: 253.0, iz_xlpe_3c: 222.0, iz_tray_3c: 246.0, r_cc_20: 0.268,  r_ohm_km: 0.321, r_xlpe_km: 0.342, x_ohm_km: 0.080, d_cond: 10.2, d_ext: 13.8, mass_kg_km: 690 },
  { section: 95.0,  awg: '3/0 AWG', iz_b1_2c: 232.0, iz_b1_3c: 207.0, iz_xlpe_2c: 306.0, iz_xlpe_3c: 269.0, iz_tray_3c: 298.0, r_cc_20: 0.193,  r_ohm_km: 0.232, r_xlpe_km: 0.247, x_ohm_km: 0.079, d_cond: 12.0, d_ext: 16.0, mass_kg_km: 945 },
  { section: 120.0, awg: '4/0 AWG', iz_b1_2c: 269.0, iz_b1_3c: 239.0, iz_xlpe_2c: 354.0, iz_xlpe_3c: 312.0, iz_tray_3c: 346.0, r_cc_20: 0.153,  r_ohm_km: 0.184, r_xlpe_km: 0.196, x_ohm_km: 0.078, d_cond: 13.5, d_ext: 17.8, mass_kg_km: 1185 },
  { section: 150.0, awg: '300 MCM', iz_b1_2c: 309.0, iz_b1_3c: 275.0, iz_xlpe_2c: 407.0, iz_xlpe_3c: 358.0, iz_tray_3c: 399.0, r_cc_20: 0.124,  r_ohm_km: 0.150, r_xlpe_km: 0.159, x_ohm_km: 0.078, d_cond: 15.0, d_ext: 19.8, mass_kg_km: 1465 },
  { section: 185.0, awg: '350 MCM', iz_b1_2c: 353.0, iz_b1_3c: 314.0, iz_xlpe_2c: 464.0, iz_xlpe_3c: 408.0, iz_tray_3c: 456.0, r_cc_20: 0.0991, r_ohm_km: 0.121, r_xlpe_km: 0.128, x_ohm_km: 0.077, d_cond: 16.8, d_ext: 22.0, mass_kg_km: 1825 },
  { section: 240.0, awg: '500 MCM', iz_b1_2c: 415.0, iz_b1_3c: 370.0, iz_xlpe_2c: 546.0, iz_xlpe_3c: 481.0, iz_tray_3c: 538.0, r_cc_20: 0.0754, r_ohm_km: 0.094, r_xlpe_km: 0.099, x_ohm_km: 0.076, d_cond: 19.2, d_ext: 25.0, mass_kg_km: 2390 },
  { section: 300.0, awg: '600 MCM', iz_b1_2c: 477.0, iz_b1_3c: 426.0, iz_xlpe_2c: 628.0, iz_xlpe_3c: 553.0, iz_tray_3c: 621.0, r_cc_20: 0.0601, r_ohm_km: 0.078, r_xlpe_km: 0.081, x_ohm_km: 0.076, d_cond: 21.6, d_ext: 28.0, mass_kg_km: 2985 }
];

const STANDARD_BREAKERS = [
  10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 225, 250, 315, 400, 500, 630, 800,
  1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000, 25000
];

// Catálogo Dimensional de Referência WEG — Transformadores Trifásicos a Óleo (15 a 3.000 kVA — NBR 5440 / NBR 5356 / DT-11)
const WEG_TRAFO_DIMENSIONS_CATALOG = [
  { kva: 15,    c_mm: 580,  l_mm: 450,  h_mm: 880,  ht_mm: 640,  len_mm: 580,  wid_mm: 450,  hei_mm: 880,  wheel_mm: 0,    oil_L: 50,   active_kg: 72,   total_kg: 165,  mass_kg: 165,  type: 'Distribuição Poste (ONAN)' },
  { kva: 30,    c_mm: 720,  l_mm: 560,  h_mm: 1020, ht_mm: 750,  len_mm: 720,  wid_mm: 560,  hei_mm: 1020, wheel_mm: 0,    oil_L: 82,   active_kg: 128,  total_kg: 285,  mass_kg: 285,  type: 'Distribuição Poste (ONAN)' },
  { kva: 45,    c_mm: 780,  l_mm: 620,  h_mm: 1080, ht_mm: 800,  len_mm: 780,  wid_mm: 620,  hei_mm: 1080, wheel_mm: 0,    oil_L: 105,  active_kg: 168,  total_kg: 365,  mass_kg: 365,  type: 'Distribuição Poste (ONAN)' },
  { kva: 75,    c_mm: 880,  l_mm: 720,  h_mm: 1180, ht_mm: 890,  len_mm: 880,  wid_mm: 720,  hei_mm: 1180, wheel_mm: 500,  oil_L: 150,  active_kg: 238,  total_kg: 510,  mass_kg: 510,  type: 'Distribuição Poste (ONAN)' },
  { kva: 112.5, c_mm: 990,  l_mm: 780,  h_mm: 1260, ht_mm: 960,  len_mm: 990,  wid_mm: 780,  hei_mm: 1260, wheel_mm: 500,  oil_L: 200,  active_kg: 325,  total_kg: 685,  mass_kg: 685,  type: 'Distribuição Poste/Cabine' },
  { kva: 150,   c_mm: 1060, l_mm: 830,  h_mm: 1320, ht_mm: 1010, len_mm: 1060, wid_mm: 830,  hei_mm: 1320, wheel_mm: 500,  oil_L: 245,  active_kg: 405,  total_kg: 840,  mass_kg: 840,  type: 'Distribuição Poste/Cabine' },
  { kva: 225,   c_mm: 1220, l_mm: 940,  h_mm: 1430, ht_mm: 1110, len_mm: 1220, wid_mm: 940,  hei_mm: 1430, wheel_mm: 670,  oil_L: 310,  active_kg: 545,  total_kg: 1120, mass_kg: 1120, type: 'Distribuição / Subestação' },
  { kva: 300,   c_mm: 1340, l_mm: 1040, h_mm: 1530, ht_mm: 1190, len_mm: 1340, wid_mm: 1040, hei_mm: 1530, wheel_mm: 670,  oil_L: 365,  active_kg: 680,  total_kg: 1380, mass_kg: 1380, type: 'Subestação Industrial (ONAN)' },
  { kva: 500,   c_mm: 1550, l_mm: 1180, h_mm: 1680, ht_mm: 1320, len_mm: 1550, wid_mm: 1180, hei_mm: 1680, wheel_mm: 670,  oil_L: 580,  active_kg: 1060, total_kg: 2150, mass_kg: 2150, type: 'Subestação Industrial (ONAN)' },
  { kva: 750,   c_mm: 1750, l_mm: 1320, h_mm: 1850, ht_mm: 1460, len_mm: 1750, wid_mm: 1320, hei_mm: 1850, wheel_mm: 820,  oil_L: 810,  active_kg: 1480, total_kg: 2950, mass_kg: 2950, type: 'Subestação Industrial (ONAN)' },
  { kva: 1000,  c_mm: 1920, l_mm: 1420, h_mm: 1980, ht_mm: 1580, len_mm: 1920, wid_mm: 1420, hei_mm: 1980, wheel_mm: 820,  oil_L: 1020, active_kg: 1840, total_kg: 3650, mass_kg: 3650, type: 'Subestação Industrial (ONAN)' },
  { kva: 1500,  c_mm: 2020, l_mm: 1460, h_mm: 2080, ht_mm: 1660, len_mm: 2020, wid_mm: 1460, hei_mm: 2080, wheel_mm: 820,  oil_L: 1180, active_kg: 2180, total_kg: 4250, mass_kg: 4250, type: 'Força / Média Potência (ONAN)' },
  { kva: 2000,  c_mm: 2120, l_mm: 1520, h_mm: 2220, ht_mm: 1780, len_mm: 2120, wid_mm: 1520, hei_mm: 2220, wheel_mm: 1070, oil_L: 1380, active_kg: 2560, total_kg: 4950, mass_kg: 4950, type: 'Força / Média Potência (ONAN)' },
  { kva: 2500,  c_mm: 2220, l_mm: 1580, h_mm: 2380, ht_mm: 1910, len_mm: 2220, wid_mm: 1580, hei_mm: 2380, wheel_mm: 1070, oil_L: 1620, active_kg: 2950, total_kg: 5650, mass_kg: 5650, type: 'Força / Subestação (ONAN)' },
  { kva: 3000,  c_mm: 2340, l_mm: 1650, h_mm: 2520, ht_mm: 2020, len_mm: 2340, wid_mm: 1650, hei_mm: 2520, wheel_mm: 1070, oil_L: 1950, active_kg: 3380, total_kg: 6450, mass_kg: 6450, type: 'Força / Subestação (ONAN)' }
];

const STD_POWERS_KVA = [
  15, 30, 45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1500, 2000, 2500,
  3000, 3750, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000
];

const INSULATION_CLASSES = [
  { maxKv: 1.2,  um: '1,2 kV',   nbiFull: 'Não aplicável',     nbiChopped: '-',      applied: '10 kV' },
  { maxKv: 7.2,  um: '7,2 kV',   nbiFull: '60 kV crista',      nbiChopped: '66 kV',  applied: '20 kV' },
  { maxKv: 15.0, um: '15,0 kV',  nbiFull: '95 kV (ou 110 kV)', nbiChopped: '105 kV', applied: '34 kV' },
  { maxKv: 24.2, um: '24,2 kV',  nbiFull: '125 kV (ou 150 kV)',nbiChopped: '138 kV', applied: '50 kV' },
  { maxKv: 36.2, um: '36,2 kV',  nbiFull: '170 kV (ou 200 kV)',nbiChopped: '187 kV', applied: '70 kV' },
  { maxKv: 72.5, um: '72,5 kV',  nbiFull: '350 kV crista',     nbiChopped: '385 kV', applied: '140 kV' },
  { maxKv: 145,  um: '145,0 kV', nbiFull: '550 kV crista',     nbiChopped: '605 kV', applied: '230 kV' },
  { maxKv: 9999, um: '242,0 kV', nbiFull: '850 kV crista',     nbiChopped: '935 kV', applied: '360 kV' }
];

// Banco de Dados de Líquidos Isolantes (Tabelas 5.4, 5.5 e Seção 7.3 WEG DT-11)
const OIL_DATABASE = {
  mineral_A: {
    code: 'mineral_A',
    shortName: 'Óleo Mineral Tipo A (Naftênico)',
    fullName: 'Óleo Mineral Isolante Tipo A — Base Naftênica (Res. CNP 06/85 / ANP) — ONAN',
    coolingClass: 'ONAN (Óleo Natural / Ar Natural)',
    normRef: 'ABNT MB-100 / CNP 06/85 / WEG Tabela 5.4 (pág. 106)',
    density20C: 0.880,
    densityRange: '0,861 a 0,900 g/cm³ (típico 0,880 kg/L)',
    visc20C: '≤ 25,0 mm²/s (cSt)',
    visc40C: '≤ 11,0 mm²/s (cSt)',
    visc100C: '≤ 3,0 mm²/s (cSt)',
    flashPoint: '≥ 140 °C (MB-50)',
    pourPoint: '≤ -39 °C (MB-102)',
    dielectricNew: '≥ 30 kV (NBR 6869) / ≥ 42 kV (IEC 156)',
    dielectricTreated: '≥ 50 kV (Padrão Interno WEG pág. 186)',
    waterContent: '≤ 35 ppm (novo) / ≤ 15 ppm (tratado WEG)',
    interfacialTension: '≥ 40 mN/m a 25 °C (MB-292)',
    neutralizationIdx: '≤ 0,03 mg KOH/g (MB-101)',
    powerFactor90C: '≤ 0,5 % (novo) / ≤ 0,4 % (tratado WEG)',
    thermalExpCoeff: 0.00075,
    topOilLimitRise: 60,
    windingLimitRise: 65
  },
  mineral_B: {
    code: 'mineral_B',
    shortName: 'Óleo Mineral Tipo B (Parafínico)',
    fullName: 'Óleo Mineral Isolante Tipo B — Base Parafínica (Res. CNP 09/88 / 16/79) — ONAN',
    coolingClass: 'ONAN (Óleo Natural / Ar Natural)',
    normRef: 'Resolução CNP 09/88 e 16/79 (até 15 kV) / WEG Tabela 5.5 (pág. 107)',
    density20C: 0.855,
    densityRange: '≤ 0,860 g/cm³ (típico 0,855 kg/L)',
    visc20C: '≤ 25,0 mm²/s (cSt)',
    visc40C: '≤ 12,0 mm²/s (cSt)',
    visc100C: '≤ 3,0 mm²/s (cSt)',
    flashPoint: '≥ 140 °C (MB-50)',
    pourPoint: '≤ -12 °C (MB-102)',
    dielectricNew: '≥ 30 kV (NBR 6869) / ≥ 42 kV (IEC 156)',
    dielectricTreated: '≥ 50 kV (Padrão Interno WEG pág. 186)',
    waterContent: '≤ 35 ppm (novo) / ≤ 15 ppm (tratado WEG)',
    interfacialTension: '≥ 40 mN/m a 25 °C (NBR 6234)',
    neutralizationIdx: '≤ 0,03 mg KOH/g (MB-101)',
    powerFactor90C: '≤ 0,5 % a 90 °C',
    thermalExpCoeff: 0.00076,
    topOilLimitRise: 60,
    windingLimitRise: 65
  },
  vegetal: {
    code: 'vegetal',
    shortName: 'Óleo Vegetal Biodegradável (FR3)',
    fullName: 'Éster Natural Isolante Biodegradável (Envirotemp FR3 / ABNT NBR 15422) — KNAN',
    coolingClass: 'KNAN (Fluido Biodegradável Alto Ponto de Fulgor > 300 °C)',
    normRef: 'ABNT NBR 15422 / IEEE C57.147 / WEG DT-11 Seção 5.6 (pág. 105)',
    density20C: 0.920,
    densityRange: '0,910 a 0,930 g/cm³ (típico 0,920 kg/L)',
    visc20C: '≤ 85,0 mm²/s (cSt)',
    visc40C: '≤ 33,0 mm²/s (cSt)',
    visc100C: '≤ 8,0 mm²/s (cSt)',
    flashPoint: '≥ 330 °C (Combustão ≥ 360 °C)',
    pourPoint: '≤ -21 °C',
    dielectricNew: '≥ 45 kV (NBR 6869)',
    dielectricTreated: '≥ 55 kV (Após termo-vácuo)',
    waterContent: '≤ 100 ppm (novo) / ≤ 50 ppm (tratado)',
    interfacialTension: '≥ 25 mN/m a 25 °C',
    neutralizationIdx: '≤ 0,06 mg KOH/g',
    powerFactor90C: '≤ 3,0 % a 90 °C',
    thermalExpCoeff: 0.00074,
    topOilLimitRise: 65,
    windingLimitRise: 70
  },
  silicone: {
    code: 'silicone',
    shortName: 'Fluido Silicone / Alto Fulgor',
    fullName: 'Fluido Isolante Polidimetilsiloxano (Silicone / Rtemp) — Alto Ponto de Fulgor — KNAN',
    coolingClass: 'KNAN (Fluido Anti-Incêndio > 300 °C)',
    normRef: 'IEC 60836 / ANSI C57.111 / WEG DT-11 Seções 5.6 e 6.2 (pág. 105/132)',
    density20C: 0.960,
    densityRange: '0,955 a 0,970 g/cm³ (típico 0,960 kg/L)',
    visc20C: '≤ 50,0 mm²/s (cSt)',
    visc40C: '≤ 38,0 mm²/s (cSt)',
    visc100C: '≤ 15,0 mm²/s (cSt)',
    flashPoint: '≥ 300 °C (Autoextinguível)',
    pourPoint: '≤ -50 °C',
    dielectricNew: '≥ 35 kV (IEC 156)',
    dielectricTreated: '≥ 45 kV (Após filtragem)',
    waterContent: '≤ 50 ppm',
    interfacialTension: 'Não aplicável (imiscível)',
    neutralizationIdx: '≤ 0,01 mg KOH/g',
    powerFactor90C: '≤ 0,1 % a 90 °C',
    thermalExpCoeff: 0.00095,
    topOilLimitRise: 65,
    windingLimitRise: 65
  }
};

// Estado Global do Workbench
const state = {
  activeModule: 'trafo3ph', // 'trafo3ph' | 'trafo1ph' | 'feeder'
  activeTab: 'svg',         // 'svg' | 'oil' | 'curves' | 'table' | 'memorial' | 'scripts'
  scriptLang: 'matlab',     // 'matlab' | 'python' | 'cursorrules'
  zoom: 1.0,
  showCotas: true,
  m1PowerMode: '3ph',       // '3ph' | 'direct'
  m1LiveV1: 24000,
  m2ElecMode: 'power',      // 'power' | 'current'
  m2CoreMode: 'auto',       // 'auto' | 'manual'
  m3Phases: '3F'
};

function fmt(val, dec = 2) {
  if (!isFinite(val)) return '0';
  return val.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtInt(val) {
  if (!isFinite(val)) return '0';
  return Math.round(val).toLocaleString('pt-BR');
}

function getConductor3Ph(areaMm2, matName, lineCurrentA = 0) {
  const mat = matName === 'cobre' ? 'Cu' : 'Al';
  // Seleciona também o Cabo Comercial de Potência (1,5 a 300 mm² — NBR 5410 / Prysmian / Cobrecom)
  const targetI = lineCurrentA > 0 ? lineCurrentA : areaMm2 * 2.5;
  let nParallel = 1;
  let catCable = NBR5410_CABLES.find(c => c.section >= areaMm2 * 0.92 && c.iz_xlpe_3c >= targetI);
  if (!catCable) {
    // Acima de 300 mm² ou 553 A: usa cabos de até 300 mm² em paralelo por fase
    nParallel = Math.max(1, Math.ceil(Math.max(areaMm2 / 300, targetI / 553)));
    const secPerCable = areaMm2 / nParallel;
    const iPerCable = targetI / nParallel;
    catCable = NBR5410_CABLES.find(c => c.section >= secPerCable * 0.92 && c.iz_xlpe_3c >= iPerCable) || NBR5410_CABLES[NBR5410_CABLES.length - 1];
  }
  const cableDesc = `${nParallel}× ${fmt(catCable.section, 1).replace(',0', '')} mm² (${catCable.awg}) — Øext ${fmt(catCable.d_ext, 1)} mm (Iz=${fmt(catCable.iz_b1_3c * nParallel, 0)}A PVC / ${fmt(catCable.iz_xlpe_3c * nParallel, 0)}A XLPE)`;

  if (areaMm2 > 45) {
    const thick = areaMm2 > 180 ? 4.0 : 3.0;
    const width = areaMm2 / thick;
    return {
      short: `Fita ${mat} ${fmt(width, 0)}×${fmt(thick, 0)}mm (${nParallel}×${catCable.section}mm²)`,
      full: `${fmt(areaMm2, 2)} mm² — Bobina: Fita ${mat} ${fmt(width, 1)}×${fmt(thick, 1)} mm | Cabo Equivalente: ${cableDesc}`,
      cableSpec: cableDesc,
      catSection: catCable.section,
      radialMm: thick + 0.5,
      axialMm: width + 0.5
    };
  }
  const found = [...AWG_TABLE].reverse().find(w => w.area >= areaMm2 * 0.94) || AWG_TABLE[0];
  return {
    short: `${found.gauge} ${mat} (${catCable.section}mm²)`,
    full: `${fmt(areaMm2, 2)} mm² (${found.gauge} ${mat} Ø ${fmt(found.d_mm, 2)} mm) | Cabo: ${cableDesc}`,
    cableSpec: cableDesc,
    catSection: catCable.section,
    radialMm: found.d_mm + 0.15,
    axialMm: found.d_mm + 0.15
  };
}

function recommendOil(v1Kv, env, ta) {
  if (env === 'abrigado_seguranca') {
    return {
      code: 'silicone',
      title: 'Indicado: Fluido de Silicone / Alto Ponto de Fulgor (≥ 300 °C — Classe KNAN)',
      reason: 'Para instalações internas/abrigadas (hospitais, edifícios, subsolo), as Seções 5.6 e 6.2 do WEG DT-11 recomendam fluido de alto ponto de fulgor (≥ 300 °C) autoextinguível.'
    };
  }
  if (env === 'ambiental') {
    return {
      code: 'vegetal',
      title: 'Indicado: Óleo Vegetal Biodegradável — Éster Natural (Envirotemp FR3 / NBR 15422)',
      reason: 'Para áreas de proteção ambiental ou plantas industriais ecológicas, indica-se o Éster Natural Biodegradável (100% atóxico, ponto de fulgor ≥ 330 °C), que amplia em até 2,5× a vida útil da celulose.'
    };
  }
  if (env === 'frio' || ta <= 0) {
    return {
      code: 'mineral_A',
      title: 'Indicado: Óleo Mineral Tipo A — Base Naftênica (Ponto de Fluidez ≤ -39 °C)',
      reason: 'Conforme Tabela 5.4 do WEG DT-11, em baixas temperaturas o Óleo Mineral Tipo A (Naftênico) é obrigatório pelo seu baixíssimo ponto de fluidez (≤ -39 °C vs. -12 °C do parafínico).'
    };
  }
  if (v1Kv > 15.0) {
    return {
      code: 'mineral_A',
      title: `Indicado: Óleo Mineral Tipo A — Base Naftênica (Obrigatório p/ U₁ = ${fmt(v1Kv, 1)} kV > 15 kV)`,
      reason: `Conforme Seção 7.3.1 do WEG DT-11 (pág. 184 — Resolução CNP 16/79 e 06/85), o óleo Tipo B (Parafínico) é restrito a transformadores de até 15 kV. Para ${fmt(v1Kv, 1)} kV, o óleo indicado é o Mineral Tipo A (Naftênico), com viscosidade ≤ 11 cSt (40 °C) e rigidez tratada ≥ 50 kV.`
    };
  }
  return {
    code: 'mineral_A',
    title: 'Indicado: Óleo Mineral Tipo A (Naftênico) — Compatível com Tipo B até 15 kV',
    reason: `Para subestações ao tempo até 15 kV (atual: ${fmt(v1Kv, 1)} kV), a Resolução CNP permite tanto o Tipo A (Naftênico) quanto o Tipo B (Parafínico). O Tipo A é o padrão primário pela menor viscosidade (11 cSt a 40 °C).`
  };
}

// ============================================================================
// MOTORES DE CÁLCULO DOS 3 MÓDULOS (M1, M2, M3)
// ============================================================================

function computeM1() {
  const Ac = Math.max(1, parseFloat(document.getElementById('m1_Ac').value) || 40);
  const Aj = Math.max(1, parseFloat(document.getElementById('m1_Aj').value) || 40);
  const Bm = Math.max(0.4, parseFloat(document.getElementById('m1_Bm').value) || 1.65);
  const J = Math.max(0.5, parseFloat(document.getElementById('m1_J').value) || 2.8);
  const Ku = Math.max(0.1, Math.min(0.85, parseFloat(document.getElementById('m1_Ku').value) || 0.38));
  const condMat = document.getElementById('m1_Mat').value;
  const f = 60;
  const Ke = 0.95;
  const Sm = Ac * Ke;

  const v1Kv = Math.max(0.1, parseFloat(document.getElementById('m1_V1_kV').value) || 24);
  const V1_line = v1Kv * 1000;
  const I1_line = Math.max(0.05, parseFloat(document.getElementById('m1_I1').value) || 10);
  const V2_line = Math.max(12, parseFloat(document.getElementById('m1_V2').value) || 380);
  let I2_line = Math.max(0.1, parseFloat(document.getElementById('m1_I2').value) || 630);

  if (document.getElementById('m1_syncI2').checked) {
    I2_line = (V1_line * I1_line) / V2_line;
    document.getElementById('m1_I2').value = I2_line.toFixed(1);
  }

  const vec = document.getElementById('m1_Vec').value;
  const sq3 = Math.sqrt(3);

  const V1_phase = vec.startsWith('D') ? V1_line : V1_line / sq3;
  const I1_phase = vec.startsWith('D') ? I1_line / sq3 : I1_line;

  let V2_phase = V2_line / sq3;
  let I2_phase = I2_line;
  let zigZag = 1.0;
  if (vec.includes('z')) zigZag = 1.155;
  else if (!vec.includes('y') && !vec.includes('z')) {
    V2_phase = V2_line;
    I2_phase = I2_line / sq3;
  }

  const S_3ph = Math.max(sq3 * V1_line * I1_line, sq3 * V2_line * I2_line) / 1000;
  const S_direct = Math.max(V1_line * I1_line, V2_line * I2_line) / 1000;
  const S_oper = state.m1PowerMode === '3ph' ? S_3ph : S_direct;

  const phaseScale = state.m1PowerMode === 'direct' ? (1 / sq3) : 1.0;
  const I1_coil = I1_phase * phaseScale;
  const I2_coil = I2_phase * phaseScale;

  // Equação Fundamental de Volts/Espira na seção informada Ac
  const voltsPerTurn = 4.44 * f * Bm * (Sm * 1e-4);
  const turnsPerVolt = 1 / voltsPerTurn;

  const N1_nom = Math.max(1, Math.round(V1_phase / voltsPerTurn));
  const N2_nom = Math.max(1, Math.round((V2_phase * zigZag) / voltsPerTurn));

  const s1_mm2 = I1_coil / J;
  const s2_mm2 = I2_coil / J;

  // Capacidade física máxima permitida pela estrutura Ac e Aj
  const areaCondAvail_mm2 = Aj * 100 * Ku;
  const areaReq_mm2 = N1_nom * s1_mm2 + N2_nom * s2_mm2;
  const areaReq_cm2 = areaReq_mm2 / (100 * Ku);
  const maxTurnsAT = Math.floor(areaCondAvail_mm2 / (2 * s1_mm2));

  const S_max_Ap = 3 * 2.22 * f * Bm * J * Ku * Sm * Aj * 1e-5;
  const S_max_Col = Math.pow(Sm / 1.15, 2);
  const S_core_max = Math.min(S_max_Ap, S_max_Col * 1.35);

  const Sm_ideal = 1.18 * Math.sqrt(S_oper);
  const Ac_ideal = Math.ceil((Sm_ideal / Ke) * 1.04);
  const Aj_ideal = Math.ceil(Math.max(Ac_ideal * 3.1, (S_oper / (3 * 2.22 * f * Bm * J * Ku * Sm_ideal * 1e-5)) * 1.30));

  const windowFillPct = (areaReq_mm2 / areaCondAvail_mm2) * 100;
  const corePowerPct = (S_oper / Math.max(0.01, S_core_max)) * 100;

  // Geometria Construtiva de Camadas (RALE / Etrafo) sobre o núcleo viável de projeto
  const isUndersized = Ac < Ac_ideal * 0.92;
  const Ac_design = Math.max(Ac, Ac_ideal);
  const Aj_design = Math.max(Aj, Aj_ideal);
  const Sm_design = Ac_design * Ke;
  const Ve_design = 4.44 * f * Bm * (Sm_design * 1e-4);

  const N1_des = isUndersized ? Math.max(1, Math.round(V1_phase / Ve_design)) : N1_nom;
  const N2_des = isUndersized ? Math.max(1, Math.round((V2_phase * zigZag) / Ve_design)) : N2_nom;

  const diamCoreMm = Math.sqrt((4 * Ac_design) / Math.PI) * 10.6;
  const winHeightMm = Math.max(parseFloat(document.getElementById('m1_winH').value) * 10, Math.sqrt(Aj_design * 2.5) * 10);
  const coilAxialMm = Math.max(140, winHeightMm - 40);

  const cond1 = getConductor3Ph(s1_mm2, condMat, I1_line);
  const cond2 = getConductor3Ph(s2_mm2, condMat, I2_line);

  const turnsPerLayerBT = Math.max(1, Math.floor(coilAxialMm / cond2.axialMm));
  const numLayersBT = Math.max(1, Math.ceil(N2_des / turnsPerLayerBT));
  const radialBT_mm = numLayersBT * cond2.radialMm + 3.0;
  const meanDiamBT_mm = diamCoreMm + 12 + radialBT_mm;
  const Lme_BT_m = (Math.PI * meanDiamBT_mm) / 1000;
  const totalLenBT_m = Lme_BT_m * N2_des * 3;

  const gapAT_BT_mm = V1_line <= 15000 ? 14 : V1_line <= 24200 ? 20 : 28;
  const turnsPerLayerAT = Math.max(1, Math.floor((coilAxialMm - 20) / cond1.axialMm));
  const numLayersAT = Math.max(1, Math.ceil(N1_des / turnsPerLayerAT));
  const radialAT_mm = numLayersAT * cond1.radialMm + numLayersAT * 0.35;
  const meanDiamAT_mm = meanDiamBT_mm + radialBT_mm + 2 * gapAT_BT_mm + radialAT_mm;
  const Lme_AT_m = (Math.PI * meanDiamAT_mm) / 1000;
  const totalLenAT_m = Lme_AT_m * N1_des * 3;

  const rho20 = condMat === 'cobre' ? 0.017241 : 0.028264;
  const T0 = condMat === 'cobre' ? 235 : 225;
  const kTemp75 = (T0 + 75) / (T0 + 20);
  const densCond = condMat === 'cobre' ? 8.89 : 2.70;

  const R20_BT = (rho20 * Lme_BT_m * N2_des) / s2_mm2;
  const R75_BT = R20_BT * kTemp75;
  const R20_AT = (rho20 * Lme_AT_m * N1_des) / s1_mm2;
  const R75_AT = R20_AT * kTemp75;

  const massCondBT_kg = (totalLenBT_m * s2_mm2 * densCond) / 1000;
  const massCondAT_kg = (totalLenAT_m * s1_mm2 * densCond) / 1000;
  const totalMassCond_kg = massCondBT_kg + massCondAT_kg;

  // Perdas garantidas e impedância (Tabelas 3.1 / 3.2 WEG DT-11)
  const scale300 = Math.max(S_oper, 15) / 300;
  const baseP0 = v1Kv <= 15 ? 950 : 1020;
  const basePt = v1Kv <= 15 ? 4310 : 4620;
  const P0_W = Math.round(baseP0 * Math.pow(scale300, 0.74));
  const Pc_W = Math.round((basePt - baseP0) * Math.pow(scale300, 0.80));
  const Pt_W = P0_W + Pc_W;
  const Ez_pct = S_oper <= 150 ? (v1Kv <= 15 ? 3.5 : 4.0) : S_oper <= 1000 ? (v1Kv <= 15 ? 4.5 : 5.0) : 6.0;
  const i0_pct = Math.max(0.8, 2.4 * Math.pow(scale300, -0.28));
  const eff_pct = (1 - Pt_W / (S_oper * 1000 + Pt_W)) * 100;

  const ER_pct = (Pc_W / (S_oper * 1000)) * 100;
  const EX_pct = Math.sqrt(Math.max(0.1, Ez_pct * Ez_pct - ER_pct * ER_pct));
  const reg_pct = (ER_pct * 0.88 + EX_pct * Math.sqrt(1 - 0.88 * 0.88));

  // Seleção Automática do Tipo de Óleo e Balanço Volumétrico (WEG DT-11 Cap. 5.4, 5.6 e 7.3)
  const env = document.getElementById('m1_Env').value;
  const Ta = parseFloat(document.getElementById('m1_Ta').value) || 30;
  const recOil = recommendOil(v1Kv, env, Ta);
  if (document.getElementById('m1_autoOil').checked) {
    document.getElementById('m1_Oil').value = recOil.code;
  }
  const oilCode = document.getElementById('m1_Oil').value;
  const oilSpec = OIL_DATABASE[oilCode] || OIL_DATABASE.mineral_A;
  const paraffinicViolation = (!document.getElementById('m1_autoOil').checked && oilCode === 'mineral_B' && v1Kv > 15.0);

  const scaleMass = Math.pow(scale300, 0.74);
  const massCoreSteel_kg = Math.round(375 * scaleMass);
  const massActiveCond_kg = Math.round(Math.max(totalMassCond_kg, 165 * scaleMass));
  const massSolidInsul_kg = Math.round(42 * scaleMass);
  const massActiveTotal_kg = massCoreSteel_kg + massActiveCond_kg + massSolidInsul_kg;

  const volDispCore_L = massCoreSteel_kg / 7.65;
  const volDispCond_L = massActiveCond_kg / densCond;
  const volDispInsul_L = massSolidInsul_kg / 1.15;
  const volActiveDisplaced_L = volDispCore_L + volDispCond_L + volDispInsul_L;

  const totalCoolingArea_m2 = Pt_W / 340;
  const tankSmoothArea_m2 = 2.85 * Math.pow(Math.max(S_oper, 15) / 100, 0.52);
  const radAreaReq_m2 = Math.max(0, totalCoolingArea_m2 - tankSmoothArea_m2 * 0.65);
  const numRadPanels = S_oper <= 30 ? 0 : S_oper <= 112.5 ? 2 : S_oper <= 300 ? 4 : S_oper <= 750 ? 6 : 8;
  const totalFins = numRadPanels > 0 ? Math.max(numRadPanels * 4, Math.ceil(radAreaReq_m2 / (S_oper <= 300 ? 0.42 : 0.68))) : 0;

  const volOilTankFree_L = Math.round(205 * scaleMass * (v1Kv > 24.2 ? 1.14 : v1Kv > 15 ? 1.05 : 1.0));
  const volOilRadiators_L = Math.round(totalFins * 1.65);
  const hasConservator = (S_oper > 500 || v1Kv > 36.2);
  const volOilConservator_L = hasConservator ? Math.round((volOilTankFree_L + volOilRadiators_L) * 0.095) : 0;

  const volOilTotal_L = volOilTankFree_L + volOilRadiators_L + volOilConservator_L;
  const massOilTotal_kg = Math.round(volOilTotal_L * oilSpec.density20C);
  const volTankGross_L = Math.round(volOilTankFree_L + volActiveDisplaced_L);
  const volExpansion_L = volOilTotal_L * oilSpec.thermalExpCoeff * 75;
  const volPurchase_L = Math.ceil(volOilTotal_L * 1.05);
  const drums200L = volOilTotal_L / 200;

  // Simulação Térmica e Vida Útil (ABNT NBR 5416 — Seção 3.4 WEG DT-11)
  const deltaTopOil = 46.0;
  const topOilTemp_TO = Ta + deltaTopOil;
  const hotSpotGrad = 19.0;
  const avgWindingRise = deltaTopOil + hotSpotGrad * 0.45;
  const hotSpotTemp_ThetaE = topOilTemp_TO + hotSpotGrad;
  const vegLifeFactor = oilCode === 'vegetal' ? 0.40 : 1.0;
  const dailyLossPct = 0.0369 * Math.pow(10, 6328.8 * (1 / 368 - 1 / (hotSpotTemp_ThetaE + 273))) * vegLifeFactor;
  const estLifeYears = Math.min(90, Math.max(1.5, 100 / (dailyLossPct * 365)));

  // Status ISA-101
  const statusCore = windowFillPct <= 85 && corePowerPct <= 95 ? 'nominal' : windowFillPct <= 100 && corePowerPct <= 108 ? 'warning' : 'critical';
  const statusBm = Bm <= 1.72 ? 'nominal' : Bm <= 1.82 ? 'warning' : 'critical';
  const statusJ = J <= 3.2 ? 'nominal' : J <= 4.0 ? 'warning' : 'critical';
  const statusOil = paraffinicViolation ? 'critical' : hotSpotTemp_ThetaE > 105 ? 'warning' : 'nominal';
  const statusEff = eff_pct >= 98.0 ? 'nominal' : eff_pct >= 96.5 ? 'warning' : 'critical';

  const allStatuses = [statusCore, statusBm, statusJ, statusOil, statusEff];
  const globalStatus = allStatuses.includes('critical') ? 'critical' : allStatuses.includes('warning') ? 'warning' : 'nominal';

  const stdKva = STD_POWERS_KVA.find(p => p >= S_oper * 0.96) || Math.ceil(S_oper / 5000) * 5000;
  const catDim = WEG_TRAFO_DIMENSIONS_CATALOG.reduce((prev, curr) =>
    Math.abs(curr.kva - S_oper) < Math.abs(prev.kva - S_oper) ? curr : prev
  , WEG_TRAFO_DIMENSIONS_CATALOG[0]);
  const insPri = INSULATION_CLASSES.find(c => v1Kv <= c.maxKv) || INSULATION_CLASSES[INSULATION_CLASSES.length - 1];
  const insSec = INSULATION_CLASSES.find(c => (V2_line / 1000) <= c.maxKv) || INSULATION_CLASSES[0];

  // Dimensões Físicas Externas do Transformador Completo (Catálogo WEG DT-11 / NBR 5440 / NBR 5356)
  const scaleDim = Math.pow(Math.max(S_oper, 15) / 300, 0.30);
  const kvFactor = v1Kv > 24.2 ? 1.12 : v1Kv > 15 ? 1.05 : 1.0;
  const coreWinW_mm = Math.round((Aj_design / (winHeightMm / 10)) * 10);
  const coreLen_mm = Math.round(3 * diamCoreMm + 2 * coreWinW_mm);
  const coreHei_mm = Math.round(winHeightMm + 2 * diamCoreMm * 0.92);
  const extLen_mm = Math.round(Math.max(coreLen_mm + 340, 1340 * scaleDim * kvFactor));
  const extWid_mm = Math.round(Math.max(meanDiamAT_mm + 320, 1040 * scaleDim * kvFactor));
  const tankHei_mm = Math.round(Math.max(coreHei_mm + 240, 1180 * scaleDim));
  const bushingHei_mm = v1Kv <= 15 ? 290 : v1Kv <= 24.2 ? 360 : 480;
  const extHei_mm = Math.round(tankHei_mm + bushingHei_mm + (hasConservator ? 240 : 0));
  const wheelBase_mm = S_oper <= 150 ? 500 : S_oper <= 500 ? 670 : S_oper <= 1500 ? 820 : 1070;
  const footprint_m2 = (extLen_mm / 1000) * (extWid_mm / 1000);
  const envelope_m3 = footprint_m2 * (extHei_mm / 1000);
  const massTank_kg = Math.round(310 * scaleMass * kvFactor);
  const massTotalTrafo_kg = massActiveTotal_kg + massOilTotal_kg + massTank_kg;

  return {
    Ac, Aj, Sm, Bm, J, Ku, condMat, f, Ke,
    v1Kv, V1_line, I1_line, V2_line, I2_line, vec,
    V1_phase, I1_phase, V2_phase, I2_phase, I1_coil, I2_coil,
    S_3ph, S_direct, S_oper, stdKva, catDim,
    voltsPerTurn, turnsPerVolt, N1_nom, N2_nom, s1_mm2, s2_mm2,
    areaCondAvail_mm2, areaReq_mm2, areaReq_cm2, maxTurnsAT,
    S_max_Ap, S_max_Col, S_core_max, Ac_ideal, Aj_ideal,
    windowFillPct, corePowerPct, isUndersized,
    Ac_design, Aj_design, N1_des, N2_des, diamCoreMm,
    cond1, cond2, turnsPerLayerBT, numLayersBT, radialBT_mm, meanDiamBT_mm, Lme_BT_m, totalLenBT_m,
    gapAT_BT_mm, turnsPerLayerAT, numLayersAT, radialAT_mm, meanDiamAT_mm, Lme_AT_m, totalLenAT_m,
    R20_BT, R75_BT, R20_AT, R75_AT, massCondBT_kg, massCondAT_kg, totalMassCond_kg,
    P0_W, Pc_W, Pt_W, Ez_pct, ER_pct, EX_pct, i0_pct, eff_pct, reg_pct,
    env, Ta, recOil, oilCode, oilSpec, paraffinicViolation,
    massCoreSteel_kg, massActiveCond_kg, massSolidInsul_kg, massActiveTotal_kg,
    volDispCore_L, volDispCond_L, volDispInsul_L, volActiveDisplaced_L,
    totalCoolingArea_m2, numRadPanels, totalFins,
    volOilTankFree_L, volOilRadiators_L, hasConservator, volOilConservator_L,
    volOilTotal_L, massOilTotal_kg, volTankGross_L, volExpansion_L, volPurchase_L, drums200L,
    deltaTopOil, topOilTemp_TO, hotSpotGrad, avgWindingRise, hotSpotTemp_ThetaE, dailyLossPct, estLifeYears,
    insPri, insSec,
    coreLen_mm, coreHei_mm, extLen_mm, extWid_mm, tankHei_mm, bushingHei_mm, extHei_mm,
    wheelBase_mm, footprint_m2, envelope_m3, massTank_kg, massTotalTrafo_kg,
    statusCore, statusBm, statusJ, statusOil, statusEff, globalStatus
  };
}

function computeM2() {
  const V1 = Math.max(6, parseFloat(document.getElementById('m2_V1').value) || 220);
  const V2 = Math.max(1, parseFloat(document.getElementById('m2_V2').value) || 24);
  const f = Math.max(50, parseFloat(document.getElementById('m2_f').value) || 60);
  const compPctEl = document.getElementById('m2_compPct');
  const compPct = compPctEl ? Math.max(0, parseFloat(compPctEl.value) || 3.5) : 3.5;

  let S = Math.max(5, parseFloat(document.getElementById('m2_S').value) || 500);
  let I2 = S / V2;
  const i2InEl = document.getElementById('m2_I2_in');

  if (state.m2ElecMode === 'current' && i2InEl) {
    I2 = Math.max(0.05, parseFloat(i2InEl.value) || 20.83);
    S = V2 * I2;
    const sEl = document.getElementById('m2_S');
    if (sEl && document.activeElement !== sEl) sEl.value = Math.round(S * 10) / 10;
  } else if (i2InEl && document.activeElement !== i2InEl) {
    i2InEl.value = I2.toFixed(2);
  }

  const Bm = Math.max(0.4, parseFloat(document.getElementById('m2_Bm').value) || 1.15);
  const J = Math.max(0.8, parseFloat(document.getElementById('m2_J').value) || 2.5);
  const Ke = Math.min(0.98, Math.max(0.75, parseFloat(document.getElementById('m2_Ke').value) || 0.92));
  const kc = Math.max(0.4, parseFloat(document.getElementById('m2_Kc').value) || 1.18);

  const stackRatioEl = document.getElementById('m2_stackRatio');
  const stackRatio = stackRatioEl ? Math.max(0.6, parseFloat(stackRatioEl.value) || 1.25) : 1.25;
  const winScaleEl = document.getElementById('m2_winScale');
  const winScale = winScaleEl ? Math.max(0.4, parseFloat(winScaleEl.value) || 1.0) : 1.0;

  const steelEl = document.getElementById('m2_steelType');
  const steelVal = steelEl ? parseFloat(steelEl.value) || 1.15 : 1.15;
  const steelMaxBm = steelVal >= 1.35 ? 1.50 : steelVal >= 1.20 ? 1.30 : 1.25;

  const limKuEl = document.getElementById('m2_limKu');
  const limKu = limKuEl ? Math.max(15, parseFloat(limKuEl.value) || 42) : 42;
  const limRegEl = document.getElementById('m2_limReg');
  const limReg = limRegEl ? Math.max(1.0, parseFloat(limRegEl.value) || 4.5) : 4.5;
  const insClassEl = document.getElementById('m2_insClass');
  const insClass = insClassEl ? parseFloat(insClassEl.value) || 155 : 155;
  const taEl = document.getElementById('m2_Ta');
  const Ta = taEl ? parseFloat(taEl.value) || 30 : 30;

  const I1 = (1.04 * S) / V1;
  const Sc1 = I1 / J;
  const Sc2 = I2 / J;

  const awg1 = [...AWG_TABLE].reverse().find(w => w.area >= Sc1 * 0.96) || AWG_TABLE[0];
  const awg2 = [...AWG_TABLE].reverse().find(w => w.area >= Sc2 * 0.96) || AWG_TABLE[0];

  // Cálculo Físico Martignoni / ABNT da Seção Magnética Ideal (cm²)
  const Sm_auto = kc * Math.sqrt(S / (f / 50)) * Math.sqrt((1.15 / Bm) * (2.5 / J));
  const Sg_auto = Sm_auto / Ke;
  const a_cm_auto = Math.sqrt(Sg_auto / stackRatio);
  const a_auto = Math.max(12, Math.round(a_cm_auto * 10));
  const b_auto = Math.max(12, Math.round((Sg_auto / (a_auto / 10)) * 10));
  const winW_auto = Math.max(6, Math.round(0.5 * a_auto * winScale * 10) / 10);
  const winH_auto = Math.max(18, Math.round(1.5 * a_auto * winScale));

  let a_mm = a_auto;
  let b_mm = b_auto;
  let winW_mm = winW_auto;
  let winH_mm = winH_auto;
  let Sg = (a_mm * b_mm) / 100;
  let Sm = Sg * Ke;

  const elA = document.getElementById('m2_a');
  const elB = document.getElementById('m2_b');
  const elWinW = document.getElementById('m2_winW');
  const elWinH = document.getElementById('m2_winH');

  if (state.m2CoreMode === 'manual' && elA && elB && elWinW && elWinH) {
    a_mm = Math.max(8, parseFloat(elA.value) || a_auto);
    b_mm = Math.max(8, parseFloat(elB.value) || b_auto);
    winW_mm = Math.max(4, parseFloat(elWinW.value) || winW_auto);
    winH_mm = Math.max(12, parseFloat(elWinH.value) || winH_auto);
    Sg = (a_mm * b_mm) / 100;
    Sm = Sg * Ke;
  } else if (elA && elB && elWinW && elWinH) {
    if (document.activeElement !== elA) elA.value = a_mm;
    if (document.activeElement !== elB) elB.value = b_mm;
    if (document.activeElement !== elWinW) elWinW.value = winW_mm;
    if (document.activeElement !== elWinH) elWinH.value = winH_mm;
  }

  const A_mm = Math.round(2 * a_mm + 2 * winW_mm);
  const B_mm = Math.round(a_mm + winH_mm);
  const Aw_mm2 = winW_mm * winH_mm;

  const espPorVolt = 10000 / (4.44 * f * Bm * Math.max(0.5, Sm));
  const voltsPorEsp = 1 / espPorVolt;
  const N1 = Math.max(1, Math.ceil(V1 * espPorVolt));
  const N2 = Math.max(1, Math.ceil(V2 * espPorVolt * (1 + compPct / 100)));

  const Acu_mm2 = N1 * awg1.area + N2 * awg2.area;
  const Ku_percent = (Acu_mm2 / Math.max(1, Aw_mm2)) * 100;

  const volFerro_cm3 = Math.max(5, (A_mm * B_mm - 2 * winW_mm * winH_mm) * (b_mm / 1000));
  const pesoFerro_kg = Math.max(0.15, (volFerro_cm3 * 7.65) / 1000);

  const lmEspira_m = (2 * (a_mm + b_mm) + Math.PI * winW_mm) / 1000;
  const len1_m = N1 * lmEspira_m;
  const len2_m = N2 * lmEspira_m;
  const pesoCobre_kg = ((len1_m * awg1.area + len2_m * awg2.area) * 8.89) / 1000;
  const pesoTotal_kg = pesoFerro_kg + pesoCobre_kg + Math.max(0.15, pesoFerro_kg * 0.08);
  const extWidth_mm = Math.round(A_mm + 14);
  const extHeight_mm = Math.round(B_mm + 22);
  const extDepth_mm = Math.round(b_mm + 2 * winW_mm + 18);

  const R1_ohm = (len1_m / 1000) * awg1.r_ohm_km;
  const R2_ohm = (len2_m / 1000) * awg2.r_ohm_km;

  const Pcu_W = I1 * I1 * R1_ohm + I2 * I2 * R2_ohm;
  const Pfe_W = pesoFerro_kg * 1.65 * Math.pow(Bm / 1.15, 2) * (f / 60);
  const Ptot_W = Pcu_W + Pfe_W;
  const rendimento_percent = (S / (S + Ptot_W)) * 100;
  const reg_percent = ((I1 * R1_ohm) / V1 + (I2 * R2_ohm) / V2) * 100;

  const areaDiss_m2 = Math.max(0.015, 2 * (extWidth_mm * extHeight_mm + extWidth_mm * extDepth_mm + extHeight_mm * extDepth_mm) * 1e-6 * 1.35);
  const deltaT_est = Ptot_W / (11.5 * areaDiss_m2);
  const tempOp_C = Ta + deltaT_est;

  const statusBm = Bm <= steelMaxBm ? 'nominal' : Bm <= steelMaxBm + 0.15 ? 'warning' : 'critical';
  const statusJ = J <= 3.0 ? 'nominal' : J <= 3.6 ? 'warning' : 'critical';
  const statusKu = Ku_percent <= limKu ? 'nominal' : Ku_percent <= limKu + 10 ? 'warning' : 'critical';
  const statusEta = rendimento_percent >= 90.0 ? 'nominal' : rendimento_percent >= 86.0 ? 'warning' : 'critical';
  const statusReg = reg_percent <= limReg ? 'nominal' : reg_percent <= limReg + 1.5 ? 'warning' : 'critical';
  const statusTemp = tempOp_C <= insClass - 10 ? 'nominal' : tempOp_C <= insClass ? 'warning' : 'critical';

  const violations = [];
  if (statusBm !== 'nominal') violations.push(`Indução Bm = ${fmt(Bm, 2)} T excede o limite da chapa (${fmt(steelMaxBm, 2)} T)`);
  if (statusJ !== 'nominal') violations.push(`Densidade J = ${fmt(J, 1)} A/mm² elevada (limite ideal ≤ 3,0 A/mm²)`);
  if (statusKu !== 'nominal') violations.push(`Ocupação da Janela Ku = ${fmt(Ku_percent, 1)}% excede o espaço útil do carretel (≤ ${fmt(limKu, 0)}%)`);
  if (statusReg !== 'nominal') violations.push(`Regulação de Tensão ΔV = ${fmt(reg_percent, 2)}% excede o limite (≤ ${fmt(limReg, 1)}%)`);
  if (statusEta !== 'nominal') violations.push(`Rendimento η = ${fmt(rendimento_percent, 2)}% abaixo do mínimo normativo (≥ 90,0%)`);
  if (statusTemp !== 'nominal') violations.push(`Temperatura operacional ${fmt(tempOp_C, 1)} °C próxima/acima da Classe (${insClass} °C)`);

  const allStatuses = [statusBm, statusJ, statusKu, statusEta, statusReg, statusTemp];
  const globalStatus = allStatuses.includes('critical')
    ? 'critical'
    : allStatuses.includes('warning')
    ? 'warning'
    : 'nominal';

  return {
    S, V1, V2, f, compPct, Bm, J, Ke, kc, stackRatio, winScale,
    steelMaxBm, limKu, limReg, insClass, Ta,
    I1, I2, Sc1, Sc2, awg1, awg2, Sm, Sg,
    a_mm, b_mm, A_mm, B_mm, winW_mm, winH_mm, Aw_mm2,
    espPorVolt, voltsPorEsp, N1, N2, Acu_mm2, Ku_percent, pesoFerro_kg,
    len1_m, len2_m, pesoCobre_kg, pesoTotal_kg, extWidth_mm, extHeight_mm, extDepth_mm,
    R1_ohm, R2_ohm, Pcu_W, Pfe_W, Ptot_W, rendimento_percent, reg_percent,
    deltaT_est, tempOp_C, violations,
    statusBm, statusJ, statusKu, statusEta, statusReg, statusTemp, globalStatus
  };
}

function computeM3() {
  const is3F = state.m3Phases === '3F';
  const Vll = Math.max(110, parseFloat(document.getElementById('m3_Vll').value) || 380);
  const rawP = Math.max(0.1, parseFloat(document.getElementById('m3_P').value) || 2800);
  const pUnitEl = document.getElementById('m3_pUnit');
  const pUnit = pUnitEl ? pUnitEl.value : 'kW';
  // Se estiver em kW (ex: 2800 kW), converte para Watts (2.800.000 W). Se digitar > 250000 em kW já trata como Watts.
  const P = pUnit === 'kW' ? (rawP > 250000 ? rawP : rawP * 1000) : rawP;
  const P_kW = P / 1000;

  const lblUnit = document.getElementById('lblM3Unit');
  if (lblUnit) lblUnit.textContent = pUnit;
  const hintP = document.getElementById('hintM3_P');
  if (hintP) hintP.textContent = `Potência Ativa = ${fmt(P_kW, 2)} kW (${fmtInt(P)} W) | NBR 5410 Item 6.2.5.6`;

  const fp = Math.min(1.0, Math.max(0.5, parseFloat(document.getElementById('m3_fp').value) || 0.88));
  const senPhi = Math.sqrt(Math.max(0, 1 - fp * fp));
  const L = Math.max(1, parseFloat(document.getElementById('m3_L').value) || 68);
  const L_km = L / 1000;
  const insulEl = document.getElementById('m3_insul');
  const insul = insulEl ? insulEl.value : 'xlpe';
  const isXlpe = insul === 'xlpe';
  const parEl = document.getElementById('m3_parallel');
  const manualPar = parEl ? (parseInt(parEl.value, 10) || 0) : 0;
  const fca = Math.min(1.0, Math.max(0.4, parseFloat(document.getElementById('m3_fca').value) || 0.87));
  const fct = Math.min(1.1, Math.max(0.5, parseFloat(document.getElementById('m3_fct').value) || 0.94));
  const limDv = Math.max(1.0, parseFloat(document.getElementById('m3_limDv').value) || 4.0);
  const manualSection = parseFloat(document.getElementById('m3_manualSec').value) || 0;

  const Ib = is3F ? P / (Math.sqrt(3) * Vll * fp) : P / (Vll * fp);
  const Iz_req = Ib / (fca * fct);
  const targetInMin = STANDARD_BREAKERS.find(b => b >= Ib) || Math.ceil(Ib / 500) * 500;

  // Avalia todas as 16 bitolas (1,5 a 300 mm²) considerando 1× cabo ou Np cabos em paralelo por fase (NBR 5410 item 6.2.5.6)
  const evaluatedCables = NBR5410_CABLES.map(c => {
    const izTab = isXlpe ? (is3F ? c.iz_xlpe_3c : c.iz_xlpe_2c) : (is3F ? c.iz_b1_3c : c.iz_b1_2c);
    const rActive = isXlpe ? c.r_xlpe_km : c.r_ohm_km;
    const Iz_unit = izTab * fca * fct;
    const kPhase = is3F ? Math.sqrt(3) : 2;
    const dV_unit_volts = kPhase * Ib * L_km * (rActive * fp + c.x_ohm_km * senPhi);
    const dV_unit_pct = (dV_unit_volts / Vll) * 100;

    // Número de cabos em paralelo por fase necessário para atender Coordenação (Iz_total >= In >= Ib) e Queda de Tensão
    const reqParIz = Math.max(1, Math.ceil(targetInMin / Iz_unit));
    const reqParDv = Math.max(1, Math.ceil(dV_unit_pct / limDv));
    const idealPar = Math.max(reqParIz, reqParDv);

    // Em modo AUTO (manualPar === 0):
    // Bitolas até 50 mm² operam com 1× cabo/fase (exceto se o usuário forçar aquela bitola manualmente);
    // Bitolas de alta potência (70 a 300 mm²) podem operar em paralelo automaticamente quando 1× 300 mm² não é suficiente!
    const nParallel = manualPar > 0
      ? manualPar
      : (c.section >= 70 ? idealPar : 1);

    const Iz_real = Iz_unit * nParallel;
    const dV_volts = dV_unit_volts / nParallel;
    const dV_percent = dV_unit_pct / nParallel;
    const numCond = is3F ? 3 : 2;
    const pj_W = numCond * Ib * Ib * (rActive / nParallel) * L_km;
    const totalSec_mm2 = c.section * nParallel;
    const passesIz = Iz_real >= Ib;
    const passesDv = dV_percent <= limDv;
    const singleCompliant = (Iz_unit >= targetInMin) && (dV_unit_pct <= limDv);

    return {
      ...c,
      izTab,
      rActive,
      Iz_unit,
      nParallel,
      totalSec_mm2,
      Iz_real,
      dV_volts,
      dV_percent,
      pj_W,
      passesIz,
      passesDv,
      singleCompliant,
      compliant: passesIz && passesDv
    };
  });

  // Se 1× cabo até 300 mm² atende, escolhe o menor cabo simples; caso contrário (ex: 2800 kW -> 4835 A),
  // escolhe o arranjo multi-condutor em paralelo em 300 mm² (ou 240 mm²) conforme ABNT NBR 5410 item 6.2.5.6!
  const singleAuto = manualPar === 0 ? evaluatedCables.find(c => c.singleCompliant) : null;
  const parallelAuto = evaluatedCables.find(c => c.section === 300 && c.compliant)
    || evaluatedCables.find(c => c.compliant)
    || evaluatedCables[evaluatedCables.length - 1];

  const autoCable = singleAuto ? {
    ...singleAuto,
    nParallel: 1,
    totalSec_mm2: singleAuto.section,
    Iz_real: singleAuto.Iz_unit,
    dV_volts: singleAuto.dV_volts * singleAuto.nParallel,
    dV_percent: singleAuto.dV_percent * singleAuto.nParallel
  } : parallelAuto;

  const selectedCable = manualSection > 0
    ? evaluatedCables.find(c => c.section === manualSection) || autoCable
    : autoCable;

  const In = STANDARD_BREAKERS.find(b => b >= Ib && b <= selectedCable.Iz_real)
    || STANDARD_BREAKERS.find(b => b >= Ib)
    || Math.ceil(Ib / 500) * 500;

  const breakerModel = In <= 160 ? `Disjuntor Caixa Moldada WEG DWB160 (${In} A)`
    : In <= 800 ? `Disjuntor Caixa Moldada WEG DWB800 (${In} A)`
    : In <= 1600 ? `Disjuntor Caixa Moldada WEG DWB1600 (${In} A)`
    : In <= 2500 ? `Disjuntor Aberto ACB WEG ABW25 (${In} A)`
    : In <= 4000 ? `Disjuntor Aberto ACB WEG ABW40 (${In} A)`
    : In <= 6300 ? `Disjuntor Aberto ACB WEG ABW63 (${In} A)`
    : `Disjuntor Aberto Duplo WEG ABW (${In} A)`;

  // Barramento de Cobre Equivalente no QGBT (Densidade ~ 1,35 A/mm²)
  const busAreaReq = Ib / 1.35;
  const numBusBars = Math.max(1, Math.ceil(busAreaReq / 1200));
  const busBarSpec = Ib <= 630
    ? `1× Barra Cu ${Math.max(20, Math.ceil(busAreaReq / 5 / 5) * 5)}×5 mm/fase`
    : `${numBusBars}× Barras Cu 120×10 mm/fase (${numBusBars * 1200} mm²/fase)`;

  const coordOk = Ib <= In && In <= selectedCable.Iz_real;
  const J_cabo = Ib / selectedCable.totalSec_mm2;

  const statusDv = selectedCable.dV_percent <= limDv * 0.85 ? 'nominal' : selectedCable.dV_percent <= limDv ? 'warning' : 'critical';
  const statusCoord = coordOk ? 'nominal' : 'critical';
  const globalStatus = [statusDv, statusCoord].includes('critical') ? 'critical' : [statusDv, statusCoord].includes('warning') ? 'warning' : 'nominal';

  const insulLabel = isXlpe ? 'XLPE/EPR 90°C (Tab. 37)' : 'PVC 70°C (Tab. 36)';
  const secStr = fmt(selectedCable.section, 1).replace(',0', '');
  const cableLabelShort = selectedCable.nParallel > 1
    ? `${selectedCable.nParallel}× ${secStr} mm²`
    : `1× ${secStr} mm²`;

  return {
    phases: state.m3Phases, Vll, P, P_kW, pUnit, fp, L, insul, isXlpe, insulLabel, cableLabelShort,
    manualPar, fca, fct, limDv, manualSection,
    Ib, Iz_req, evaluatedCables, selectedCable, In, breakerModel, busBarSpec, coordOk, J_cabo,
    nParallel: selectedCable.nParallel, totalSec_mm2: selectedCable.totalSec_mm2,
    dV_percent: selectedCable.dV_percent, dV_volts: selectedCable.dV_volts,
    Iz_real: selectedCable.Iz_real, pj_W: selectedCable.pj_W,
    statusDv, statusCoord, globalStatus
  };
}

// ============================================================================
// RENDERIZAÇÃO DE INTERFACE (SVG CAD, ABAS, KPIS E SCRIPTS)
// ============================================================================

function kpiHtml(title, symbol, value, unit, status, limitText) {
  const cls = status === 'critical' ? 'kpi-critical' : status === 'warning' ? 'kpi-warning' : '';
  const badge = status === 'critical' ? '✗ NÃO VÁLIDO' : status === 'warning' ? '⚠️ ALERTA' : '✓ VÁLIDO';
  return `
    <div class="kpi-card ${cls}">
      <div class="kpi-top">
        <span class="kpi-title">${title} <span class="mono" style="color:var(--text-secondary)">(${symbol})</span></span>
        <span class="kpi-badge">${badge}</span>
      </div>
      <div class="kpi-mid">
        <span class="kpi-val">${value}</span>
        <span class="kpi-unit">${unit}</span>
      </div>
      <div class="kpi-bot">
        <span>Critério:</span>
        <span style="color:var(--text-secondary)">${limitText}</span>
      </div>
    </div>
  `;
}

function renderAll() {
  const m1 = computeM1();
  const m2 = computeM2();
  const m3 = computeM3();

  // Atualiza Dicas e Síntese do Dock M1
  document.getElementById('hintM1_Ac').textContent = `Sm líq. = ${fmt(m1.Sm, 1)} cm² | ${fmt(m1.voltsPerTurn, 2)} V/esp`;
  document.getElementById('hintM1_Aj').textContent = `Máx AT: ${fmtInt(m1.maxTurnsAT)} esp na janela`;
  document.getElementById('hintM1_V1').textContent = `${fmtInt(m1.V1_line)} V (Classe ${m1.insPri.um})`;
  document.getElementById('hintM1_I1').textContent = `If bobina = ${fmt(m1.I1_coil, 2)} A`;
  document.getElementById('hintM1_V2').textContent = `Uf bobina = ${fmt(m1.V2_phase, 1)} V`;
  document.getElementById('hintM1_I2').textContent = `If bobina = ${fmt(m1.I2_coil, 1)} A`;

  document.getElementById('m1_Ac').className = `eng-input ${m1.statusCore === 'critical' ? 'input-crit' : m1.statusCore === 'warning' ? 'input-warn' : ''}`;
  document.getElementById('m1_Aj').className = `eng-input ${m1.statusCore === 'critical' ? 'input-crit' : m1.statusCore === 'warning' ? 'input-warn' : ''}`;
  document.getElementById('m1_Bm').className = `eng-input ${m1.statusBm === 'critical' ? 'input-crit' : m1.statusBm === 'warning' ? 'input-warn' : ''}`;
  document.getElementById('m1_J').className = `eng-input ${m1.statusJ === 'critical' ? 'input-crit' : m1.statusJ === 'warning' ? 'input-warn' : ''}`;

  document.getElementById('synthM1_AT_sub').textContent = `I₁f = ${fmt(m1.I1_coil, 2)} A | Sc₁ = ${fmt(m1.s1_mm2, 2)} mm²`;
  document.getElementById('synthM1_AT_turns').textContent = `${fmtInt(m1.N1_nom)} esp`;
  document.getElementById('synthM1_AT_wire').textContent = m1.cond1.short;

  document.getElementById('synthM1_BT_sub').textContent = `I₂f = ${fmt(m1.I2_coil, 1)} A | Sc₂ = ${fmt(m1.s2_mm2, 1)} mm²`;
  document.getElementById('synthM1_BT_turns').textContent = `${fmtInt(m1.N2_nom)} esp`;
  document.getElementById('synthM1_BT_wire').textContent = m1.cond2.short;

  document.getElementById('synthM1_Oil_name').textContent = m1.oilSpec.shortName.toUpperCase();
  document.getElementById('synthM1_Oil_sub').textContent = `Tanque ${m1.volOilTankFree_L}L + Rad ${m1.volOilRadiators_L}L`;
  document.getElementById('synthM1_Oil_vol').textContent = `${fmtInt(m1.volOilTotal_L)} Litros`;
  document.getElementById('synthM1_Oil_mass').textContent = `${fmtInt(m1.massOilTotal_kg)} kg (~${fmt(m1.drums200L, 2)} tamb.)`;

  // Atualiza Dicas, Cores de Status, Alerta Normativo e Síntese do Dock M2 (Trafo 1Ø E-I)
  const hM2S = document.getElementById('hintM2_S');
  if (hM2S) hM2S.textContent = `S = V₂ × I₂ = ${fmt(m2.S, 1)} VA`;
  const hM2I1 = document.getElementById('hintM2_I1');
  if (hM2I1) hM2I1.textContent = `Primário I₁ = ${fmt(m2.I1, 2)} A`;
  const hM2V1 = document.getElementById('hintM2_V1');
  if (hM2V1) hM2V1.textContent = `N₁ = ${fmtInt(m2.N1)} esp (${fmt(m2.espPorVolt, 2)} esp/V)`;
  const hM2V2 = document.getElementById('hintM2_V2');
  if (hM2V2) hM2V2.textContent = `N₂ = ${fmtInt(m2.N2)} esp (+${fmt(m2.compPct, 1)}%)`;
  const hM2Sm = document.getElementById('hintM2_Sm');
  if (hM2Sm) hM2Sm.textContent = `Sm = ${fmt(m2.Sm, 2)} cm² (Sg = ${fmt(m2.Sg, 2)} cm²)`;
  const hM2Aw = document.getElementById('hintM2_Aw');
  if (hM2Aw) hM2Aw.textContent = `Janela = ${m2.winW_mm}×${m2.winH_mm}mm (${fmt(m2.Aw_mm2 / 100, 2)} cm²)`;

  const setM2InputCls = (id, st) => {
    const el = document.getElementById(id);
    if (el) el.className = `eng-input ${st === 'critical' ? 'input-crit' : st === 'warning' ? 'input-warn' : ''}`;
  };
  setM2InputCls('m2_Bm', m2.statusBm);
  setM2InputCls('m2_J', m2.statusJ);
  setM2InputCls('m2_Kc', m2.statusKu === 'critical' || m2.statusReg === 'critical' ? 'critical' : m2.statusKu);
  setM2InputCls('m2_winScale', m2.statusKu);
  setM2InputCls('m2_a', m2.statusKu === 'critical' || m2.statusReg === 'critical' ? 'critical' : 'nominal');
  setM2InputCls('m2_b', m2.statusReg);
  setM2InputCls('m2_winW', m2.statusKu);
  setM2InputCls('m2_winH', m2.statusKu);

  const sM2PriSub = document.getElementById('synthM2_Pri_sub');
  if (sM2PriSub) {
    sM2PriSub.textContent = `I₁ = ${fmt(m2.I1, 2)} A | Sc₁ = ${fmt(m2.Sc1, 2)} mm²`;
    document.getElementById('synthM2_Pri_turns').textContent = `${fmtInt(m2.N1)} esp`;
    document.getElementById('synthM2_Pri_wire').textContent = `${m2.awg1.gauge} (${fmt(m2.awg1.area, 2)} mm²)`;

    document.getElementById('synthM2_Sec_sub').textContent = `I₂ = ${fmt(m2.I2, 2)} A | Sc₂ = ${fmt(m2.Sc2, 2)} mm²`;
    document.getElementById('synthM2_Sec_turns').textContent = `${fmtInt(m2.N2)} esp`;
    document.getElementById('synthM2_Sec_wire').textContent = `${m2.awg2.gauge} (${fmt(m2.awg2.area, 2)} mm²)`;

    document.getElementById('synthM2_Core_name').textContent = `LÂMINA E-I (${m2.a_mm}×${m2.b_mm} mm)`;
    document.getElementById('synthM2_Core_sub').textContent = `Janela Ku = ${fmt(m2.Ku_percent, 1)}% (≤ ${fmt(m2.limKu, 0)}%)`;
    document.getElementById('synthM2_Core_dim').textContent = `${m2.extWidth_mm}×${m2.extDepth_mm}×${m2.extHeight_mm} mm`;
    document.getElementById('synthM2_Core_mass').textContent = `Peso Total: ${fmt(m2.pesoTotal_kg, 2)} kg`;
  }

  const m2Alert = document.getElementById('m2NormAlertBox');
  if (m2Alert) {
    if (m2.globalStatus === 'nominal') {
      m2Alert.style.borderColor = 'var(--nom-border)';
      m2Alert.style.background = 'var(--nom-bg)';
      m2Alert.style.color = 'var(--nom-text)';
      m2Alert.innerHTML = `<b>✓ 100% DENTRO DA NORMA (ABNT / IEC):</b> Núcleo E-I (${m2.a_mm}×${m2.b_mm} mm), Janela Ku = ${fmt(m2.Ku_percent, 1)}% (≤ ${fmt(m2.limKu, 0)}%), Regulação ΔV = ${fmt(m2.reg_percent, 2)}% (≤ ${fmt(m2.limReg, 1)}%) e Rendimento η = ${fmt(m2.rendimento_percent, 2)}% validados.`;
    } else {
      const isCrit = m2.globalStatus === 'critical';
      m2Alert.style.borderColor = isCrit ? 'var(--crit-border)' : 'var(--warn-border)';
      m2Alert.style.background = isCrit ? 'var(--crit-bg)' : 'var(--warn-bg)';
      m2Alert.style.color = isCrit ? 'var(--crit-text)' : 'var(--warn-text)';
      m2Alert.innerHTML = `
        <div style="font-weight:700;margin-bottom:4px;">${isCrit ? '✗ FORA DE NORMA — AJUSTE NECESSÁRIO:' : '⚠️ ALERTA DE DERATING NO TRAFO 1Ø:'}</div>
        <div style="color:#e2e8f0;margin-bottom:6px;">• ${m2.violations.join('<br>• ')}</div>
        <button type="button" class="preset-chip chip-emerald" style="width:100%;padding:5px 8px;font-weight:700;" onclick="window.triggerAutoRecalc(this)">
          ⚡ Recalcular Automático (Colocar 100% na Norma)
        </button>
      `;
    }
  }

  // Semáforo Global ISA-101 e Norma no Topo
  const curGlobal = state.activeModule === 'trafo3ph' ? m1.globalStatus : state.activeModule === 'trafo1ph' ? m2.globalStatus : m3.globalStatus;
  const semEl = document.getElementById('globalSemaphore');
  const semTxt = document.getElementById('globalSemaphoreText');
  semEl.className = `isa-semaphore ${curGlobal === 'critical' ? 'status-critical' : curGlobal === 'warning' ? 'status-warning' : ''}`;
  semTxt.textContent = curGlobal === 'critical'
    ? (state.activeModule === 'trafo3ph' && m1.statusCore === 'critical' ? '✗ NÃO VÁLIDO (NÚCLEO SUBDIMENSIONADO)' : '✗ NÃO VÁLIDO (FORA DE NORMA)')
    : curGlobal === 'warning'
    ? '⚠️ ALERTA DE DERATING'
    : '✓ VÁLIDO (CONVERGÊNCIA OK)';

  document.getElementById('lblHeaderNorm').textContent = state.activeModule === 'trafo3ph'
    ? 'WEG DT-11 / NBR 5356'
    : state.activeModule === 'trafo1ph'
    ? 'IEC 60076 / NBR 5356'
    : 'ABNT NBR 5410:2004';

  // Atualiza Títulos das Abas 1 a 6 de acordo com o Módulo Ativo
  const t1 = document.getElementById('tabTitle_1');
  const t2 = document.getElementById('tabTitle_2');
  const t3 = document.getElementById('tabTitle_3');
  const t4 = document.getElementById('tabTitle_4');
  const t5 = document.getElementById('tabTitle_5');
  const t6 = document.getElementById('tabTitle_6');

  if (state.activeModule === 'trafo3ph') {
    if (t1) t1.textContent = '[1] Esquemático SVG 3Ø';
    if (t2) t2.textContent = '[2] Óleo, Térmica & Tamanho 3Ø';
    if (t3) t3.textContent = '[3] Curvas & Faixa de Tensão (Taps)';
    if (t4) t4.textContent = '[4] Folha de Dados WEG DT-11';
    if (t5) t5.textContent = '[5] Forma de Cálculo (Memorial 3Ø)';
    if (t6) t6.textContent = '[6] Scripts (.m / .py)';
  } else if (state.activeModule === 'trafo1ph') {
    if (t1) t1.textContent = '[1] Esquemático Lâmina E-I';
    if (t2) t2.textContent = '[2] Tamanho Físico & Térmica 1Ø';
    if (t3) t3.textContent = '[3] Curvas Magnéticas & Tensão 1Ø';
    if (t4) t4.textContent = '[4] Tabela de Fios AWG & Dados 1Ø';
    if (t5) t5.textContent = '[5] Forma de Cálculo (Memorial 1Ø)';
    if (t6) t6.textContent = '[6] Scripts (.m / .py)';
  } else {
    if (t1) t1.textContent = '[1] Unifilar & Topologia Cabos BT';
    if (t2) t2.textContent = '[2] Instalação & Barramentos QGBT';
    if (t3) t3.textContent = '[3] Perfil Queda ΔV% & Faixa Tensão';
    if (t4) t4.textContent = '[4] Catálogo de Cabos NBR 5410';
    if (t5) t5.textContent = '[5] Forma de Cálculo (Memorial BT)';
    if (t6) t6.textContent = '[6] Scripts (.m / .py)';
  }

  // Atualiza Dica de Potência do Módulo 3 (Cabo BT)
  const hintM3P = document.getElementById('hintM3_P');
  if (hintM3P) {
    hintM3P.textContent = `P = ${fmt(m3.P_kW, 2)} kW (${fmtInt(m3.P)} W) → Ib = ${fmt(m3.Ib, 1)} A | Arranjo: ${m3.cableLabelShort}`;
  }

  // Renderiza Faixa Inferior de 6 KPIs (Bottom Summary Strip — Exclusivo da Aba/Módulo Selecionado)
  renderBottomKpis(m1, m2, m3);

  // Renderiza Canvas SVG (Aba 1)
  renderSvgTab(m1, m2, m3);

  // Renderiza Aba 2 (Óleo Isolante, Térmica & Tamanho Físico do Transformador)
  renderOilTab(m1, m2, m3);

  // Renderiza Aba 3 (Curvas & Faixa de Tensão Taps)
  renderCurvesTab(m1, m2, m3);

  // Renderiza Aba 4 (Tabelas & Folha de Dados WEG DT-11)
  renderTableTab(m1, m2, m3);

  // Renderiza Aba 5 (Memorial de Cálculo Auditável)
  renderMemorialTab(m1, m2, m3);

  // Renderiza Aba 6 e Modal (Scripts MATLAB / Python / .cursorrules)
  renderScriptsTab(m1, m2, m3);
}

function renderSvgTab(m1, m2, m3) {
  const container = document.getElementById('svgCanvasContainer');
  const banner = document.getElementById('svgBottomBanner');
  const titleEl = document.getElementById('svgLegendTitle');

  if (state.activeModule === 'trafo3ph') {
    titleEl.textContent = '✨ GEOMETRIA NÚCLEO TRIFÁSICO A ÓLEO (3 COLUNAS STEP-LAP) + TANQUE & RADIADORES ONAN';
    const fillRatio = Math.min(1.0, Math.max(0.12, m1.windowFillPct / 100));
    const isOver = m1.windowFillPct > 100;
    const atColor = isOver ? '#ef4444' : '#3b82f6';
    const btColor = '#10b981';
    const coilW = Math.max(6, Math.round(24 * fillRatio));
    const eqDiamCm = Math.sqrt((4 * m1.Ac) / Math.PI) * 1.06;

    container.innerHTML = `
      <svg viewBox="0 0 860 390" style="width:100%;height:100%;max-height:430px;transition:transform 0.15s;transform:scale(${state.zoom})">
        <defs>
          <pattern id="steelHatch3Ph" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" stroke-width="2" />
          </pattern>
        </defs>

        <!-- ESQUERDA: CORTE FRONTAL DO TANQUE A ÓLEO E NÚCLEO DE 3 COLUNAS -->
        <g transform="translate(38, 46)">
          <!-- Tanque Principal e Nível de Óleo -->
          <rect x="0" y="0" width="430" height="275" rx="8" fill="#0b1325" stroke="#1e3a8a" stroke-width="2" />
          <line x1="2" y1="26" x2="428" y2="26" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6 4" />
          <text x="12" y="18" fill="#fbbf24" font-size="10" font-family="monospace" font-weight="bold">
            NÍVEL DE ÓLEO (${m1.oilSpec.shortName.toUpperCase()} — ${fmtInt(m1.volOilTotal_L)} L / ${fmtInt(m1.massOilTotal_kg)} kg)
          </text>

          <!-- Aletas dos Radiadores Laterais -->
          <rect x="-18" y="42" width="14" height="195" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
          <rect x="434" y="42" width="14" height="195" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />

          <!-- Culatra Superior e Inferior (Aço GO) -->
          <rect x="52" y="42" width="326" height="28" fill="url(#steelHatch3Ph)" stroke="#64748b" stroke-width="2" />
          <rect x="52" y="220" width="326" height="28" fill="url(#steelHatch3Ph)" stroke="#64748b" stroke-width="2" />

          <!-- 3 Colunas (Fases A, B, C) -->
          <rect x="76"  y="70" width="38" height="150" fill="url(#steelHatch3Ph)" stroke="#94a3b8" stroke-width="1.8" />
          <rect x="196" y="70" width="38" height="150" fill="url(#steelHatch3Ph)" stroke="#94a3b8" stroke-width="1.8" />
          <rect x="316" y="70" width="38" height="150" fill="url(#steelHatch3Ph)" stroke="#94a3b8" stroke-width="1.8" />

          <!-- Bobinas Concêntricas BT (Interna Verde) e AT (Externa Azul/Vermelha) nas 3 Fases -->
          ${[76, 196, 316].map((cx, idx) => `
            <!-- BT Interno -->
            <rect x="${cx - 7}" y="82" width="5" height="126" fill="${btColor}" opacity="0.9" />
            <rect x="${cx + 40}" y="82" width="5" height="126" fill="${btColor}" opacity="0.9" />
            <!-- AT Externo -->
            <rect x="${cx - 9 - coilW}" y="78" width="${coilW}" height="134" rx="2" fill="${atColor}" fill-opacity="0.55" stroke="${atColor}" stroke-width="1.5" />
            <rect x="${cx + 47}" y="78" width="${coilW}" height="134" rx="2" fill="${atColor}" fill-opacity="0.55" stroke="${atColor}" stroke-width="1.5" />
            <text x="${cx + 19}" y="150" text-anchor="middle" fill="#f8fafc" font-size="11" font-family="monospace" font-weight="bold">
              FASE ${['A', 'B', 'C'][idx]}
            </text>
          `).join('')}

          ${state.showCotas ? `
            <!-- Cotas Técnicas -->
            <line x1="76" y1="262" x2="114" y2="262" stroke="#38bdf8" stroke-width="1.5" />
            <text x="95" y="272" text-anchor="middle" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="bold">
              Ac=${fmt(m1.Ac, 0)}cm² | Ext: ${m1.extLen_mm}×${m1.extWid_mm}×${m1.extHei_mm}mm
            </text>
            <line x1="114" y1="145" x2="196" y2="145" stroke="#fbbf24" stroke-width="1.2" stroke-dasharray="3 2" />
            <text x="155" y="139" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-family="monospace" font-weight="bold">
              Aj=${fmt(m1.Aj, 0)}cm²
            </text>
          ` : ''}
        </g>

        <!-- DIREITA: CORTE TRANSVERSAL CRUCIFORME STEP-LAP + BARRAS DE OCUPAÇÃO -->
        <g transform="translate(505, 46)">
          <rect x="0" y="0" width="320" height="275" rx="8" fill="#0d1322" stroke="#1e293b" stroke-width="1.5" />
          <text x="160" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold">
            SEÇÃO CRUCIFORME DA COLUNA &amp; BOBINAS
          </text>

          <!-- Bobina AT Externa, Canal AT-BT e Bobina BT Interna -->
          <circle cx="160" cy="112" r="68" fill="none" stroke="${atColor}" stroke-width="12" stroke-opacity="0.75" />
          <circle cx="160" cy="112" r="52" fill="none" stroke="${btColor}" stroke-width="7" />
          <circle cx="160" cy="112" r="43" fill="#070a12" stroke="#475569" stroke-width="1" stroke-dasharray="3 2" />

          <!-- Degraus do Núcleo Escalonado (Step-Lap) -->
          <rect x="128" y="94" width="64" height="36" fill="#334155" stroke="#94a3b8" stroke-width="1.2" />
          <rect x="136" y="84" width="48" height="56" fill="#475569" stroke="#94a3b8" stroke-width="1.2" />
          <rect x="144" y="76" width="32" height="72" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />

          <text x="160" y="110" text-anchor="middle" fill="#f8fafc" font-size="11" font-family="monospace" font-weight="bold">
            Sm=${fmt(m1.Sm, 1)}cm²
          </text>
          <text x="160" y="124" text-anchor="middle" fill="#38bdf8" font-size="9.5" font-family="monospace">
            Ø ${fmt(eqDiamCm * 10, 0)} mm
          </text>

          <!-- Medidores de Ocupação da Janela e Solicitação do Núcleo -->
          <g transform="translate(18, 198)">
            <text x="0" y="0" fill="#cbd5e1" font-size="10.5" font-family="monospace">
              Ocupação Espiras na Janela: ${fmt(m1.windowFillPct, 1)}% (Máx ${fmtInt(m1.maxTurnsAT)} esp AT)
            </text>
            <rect x="0" y="6" width="284" height="10" rx="3" fill="#070a12" stroke="#334155" />
            <rect x="1" y="7" width="${Math.min(282, (m1.windowFillPct / 100) * 282)}" height="8" rx="2" fill="${isOver ? '#ef4444' : m1.windowFillPct > 85 ? '#f59e0b' : '#10b981'}" />

            <text x="0" y="34" fill="#cbd5e1" font-size="10.5" font-family="monospace">
              Tamanho Físico: C=${m1.extLen_mm}×L=${m1.extWid_mm}×H=${m1.extHei_mm} mm (${fmtInt(m1.massTotalTrafo_kg)} kg)
            </text>
            <rect x="0" y="40" width="284" height="10" rx="3" fill="#070a12" stroke="#334155" />
            <rect x="1" y="41" width="${Math.min(282, (m1.corePowerPct / 100) * 282)}" height="8" rx="2" fill="${m1.corePowerPct > 105 ? '#ef4444' : m1.corePowerPct > 88 ? '#f59e0b' : '#3b82f6'}" />

            <text x="0" y="65" fill="#94a3b8" font-size="10" font-family="monospace">
              Ideal p/ ${fmt(m1.S_oper, 1)} kVA: Ac ≥ ${m1.Ac_ideal} cm² | Janela Aj ≥ ${m1.Aj_ideal} cm²
            </text>
          </g>
        </g>
      </svg>
    `;

    banner.innerHTML = m1.statusCore === 'critical'
      ? `<span style="color:var(--crit-text)">⚠️ <b>LIMITE FÍSICO EXCEDIDO EM ${fmt(m1.Ac, 0)} cm²:</b> A estrutura atual comporta no máx. <b>${fmtInt(m1.maxTurnsAT)} esp. AT</b> (${fmt(m1.S_core_max, 2)} kVA), mas a carga exige <b>${fmtInt(m1.N1_nom)} esp. AT</b> (${fmt(m1.S_oper, 2)} kVA). Clique em <b>"🔄 Recalcular &amp; Auto-Dimensionar"</b> para ajustar Ac=${m1.Ac_ideal} cm²!</span>`
      : `<span style="color:var(--nom-text)">✅ <b>ESTRUTURA FÍSICA APROVADA (WEG DT-11):</b> Coluna Ac=${fmt(m1.Ac, 1)} cm² | Tamanho Externo: <b>${m1.extLen_mm} × ${m1.extWid_mm} × ${m1.extHei_mm} mm</b> | Peso Total: <b>${fmtInt(m1.massTotalTrafo_kg)} kg</b> (Ocupação: ${fmt(m1.windowFillPct, 1)}%).</span>`;
  } else if (state.activeModule === 'trafo1ph') {
    titleEl.textContent = '✨ GEOMETRIA LÂMINA PADRONIZADA E-I MONOFÁSICA + TAMANHO EXTERNO (C × L × H)';
    const fillRatio = Math.min(1, m2.Ku_percent / 65);
    const wCu = Math.max(8, 24 * fillRatio);
    container.innerHTML = `
      <svg viewBox="0 0 820 380" style="width:100%;height:100%;max-height:420px;transition:transform 0.15s;transform:scale(${state.zoom})">
        <defs>
          <pattern id="ironHatch1Ph" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" stroke-width="2" />
          </pattern>
        </defs>
        <g transform="translate(65, 45)">
          <rect x="0" y="0" width="330" height="260" fill="url(#ironHatch1Ph)" stroke="#64748b" stroke-width="2.5" />
          <line x1="0" y1="210" x2="330" y2="210" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4" />
          <rect x="55" y="50" width="55" height="160" fill="#070b12" stroke="#475569" stroke-width="2" />
          <rect x="220" y="50" width="55" height="160" fill="#070b12" stroke="#475569" stroke-width="2" />
          <rect x="${110 - wCu * 2}" y="58" width="${wCu}" height="144" rx="2" fill="#1d4ed8" fill-opacity="0.65" stroke="#3b82f6" />
          <rect x="${110 - wCu}" y="58" width="${wCu}" height="144" rx="2" fill="#047857" fill-opacity="0.65" stroke="#10b981" />
          <rect x="220" y="58" width="${wCu}" height="144" rx="2" fill="#047857" fill-opacity="0.65" stroke="#10b981" />
          <rect x="${220 + wCu}" y="58" width="${wCu}" height="144" rx="2" fill="#1d4ed8" fill-opacity="0.65" stroke="#3b82f6" />
          <rect x="112" y="80" width="106" height="100" fill="#0f172a" stroke="#334155" rx="4" />
          <text x="165" y="106" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="monospace" font-weight="bold">COLUNA CENTRAL</text>
          <text x="165" y="126" text-anchor="middle" fill="#38bdf8" font-size="13" font-family="monospace" font-weight="bold">a = ${m2.a_mm} mm</text>
          <text x="165" y="146" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace">Sm = ${fmt(m2.Sm, 1)} cm²</text>
          <text x="165" y="164" text-anchor="middle" fill="#10b981" font-size="11" font-family="monospace">Sg = ${fmt(m2.Sg, 1)} cm²</text>
          ${state.showCotas ? `
            <text x="165" y="-10" text-anchor="middle" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">Largura Lâmina A = 3a = ${m2.A_mm} mm | Altura B = 2,5a = ${m2.B_mm} mm</text>
            <text x="165" y="280" text-anchor="middle" fill="#fbbf24" font-size="11" font-family="monospace" font-weight="bold">Empilhamento b = ${m2.b_mm} mm (Profundidade Total: ${m2.extDepth_mm} mm)</text>
          ` : ''}
        </g>
        <g transform="translate(465, 45)">
          <rect x="0" y="0" width="305" height="260" rx="6" fill="#0d1322" stroke="#1e293b" stroke-width="1.5" />
          <text x="152" y="26" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="monospace" font-weight="bold">SÍNTESE E TAMANHO MONOFÁSICO E-I</text>
          <text x="18" y="56" fill="#cbd5e1" font-size="11.5" font-family="monospace">Primário: N₁ = ${m2.N1} esp (${m2.awg1.gauge})</text>
          <text x="18" y="80" fill="#cbd5e1" font-size="11.5" font-family="monospace">Secundário: N₂ = ${m2.N2} esp (${m2.awg2.gauge})</text>
          <text x="18" y="104" fill="#38bdf8" font-size="11.5" font-family="monospace">Relação: ${fmt(m2.espPorVolt, 2)} esp/V</text>
          <text x="18" y="128" fill="#10b981" font-size="11.5" font-family="monospace">Rendimento: η = ${fmt(m2.rendimento_percent, 2)}%</text>
          <text x="18" y="152" fill="#fbbf24" font-size="11.5" font-family="monospace">Ocupação Janela Ku: ${fmt(m2.Ku_percent, 1)}%</text>
          <text x="18" y="178" fill="#e2e8f0" font-size="11.5" font-family="monospace" font-weight="bold">Tamanho: ${m2.extWidth_mm}×${m2.extDepth_mm}×${m2.extHeight_mm} mm</text>
          <text x="18" y="202" fill="#94a3b8" font-size="11" font-family="monospace">Ferro: ${fmt(m2.pesoFerro_kg, 2)} kg | Cobre: ${fmt(m2.pesoCobre_kg, 2)} kg</text>
          <text x="18" y="226" fill="#38bdf8" font-size="11.5" font-family="monospace" font-weight="bold">Peso Total Trafo: ${fmt(m2.pesoTotal_kg, 2)} kg</text>
        </g>
      </svg>
    `;
    banner.innerHTML = `<span><b>MÓDULO 2 (TRAFO 1Ø E-I):</b> S = ${m2.S} VA | Lâmina A=${m2.A_mm}×B=${m2.B_mm} mm | Tamanho Total: <b>${m2.extWidth_mm} × ${m2.extDepth_mm} × ${m2.extHeight_mm} mm</b> | Peso Total: <b>${fmt(m2.pesoTotal_kg, 2)} kg</b></span>`;
  } else {
    titleEl.textContent = '✨ DIAGRAMA UNIFILAR + CABOS EM PARALELO POR FASE & PROTEÇÃO WEG (ABNT NBR 5410)';
    container.innerHTML = `
      <svg viewBox="0 0 840 360" style="width:100%;height:100%;max-height:410px;transition:transform 0.15s;transform:scale(${state.zoom})">
        <g transform="translate(30, 50)">
          <rect x="0" y="20" width="130" height="90" rx="5" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />
          <text x="65" y="45" text-anchor="middle" fill="#93c5fd" font-size="11" font-family="monospace" font-weight="bold">QGBT / SUBESTAÇÃO</text>
          <text x="65" y="67" text-anchor="middle" fill="#f8fafc" font-size="13" font-family="monospace" font-weight="bold">${m3.phases} ${m3.Vll} V</text>
          <text x="65" y="88" text-anchor="middle" fill="#38bdf8" font-size="10" font-family="monospace">Ib = ${fmt(m3.Ib, 1)} A</text>

          <line x1="130" y1="65" x2="195" y2="65" stroke="#3b82f6" stroke-width="3" />

          <rect x="195" y="18" width="145" height="94" rx="5" fill="#0f172a" stroke="${m3.coordOk ? '#10b981' : '#ef4444'}" stroke-width="2" />
          <text x="267" y="40" text-anchor="middle" fill="#e2e8f0" font-size="10" font-family="monospace">PROTEÇÃO WEG</text>
          <text x="267" y="62" text-anchor="middle" fill="${m3.coordOk ? '#10b981' : '#ef4444'}" font-size="13" font-family="monospace" font-weight="bold">In = ${fmtInt(m3.In)} A</text>
          <text x="267" y="82" text-anchor="middle" fill="#fbbf24" font-size="9.5" font-family="monospace">${m3.breakerModel.split('(')[0].trim()}</text>

          <!-- Linhas paralelas representando condutores por fase -->
          ${Array.from({ length: Math.min(5, m3.nParallel) }).map((_, idx) => {
            const yOff = 65 + (idx - (Math.min(5, m3.nParallel) - 1) / 2) * 5;
            return `<line x1="340" y1="${yOff}" x2="600" y2="${yOff}" stroke="${m3.statusDv === 'nominal' ? '#10b981' : m3.statusDv === 'warning' ? '#f59e0b' : '#ef4444'}" stroke-width="2.2" />`;
          }).join('')}

          <rect x="355" y="0" width="230" height="48" rx="4" fill="#0b0f19" stroke="#334155" />
          <text x="470" y="19" text-anchor="middle" fill="#38bdf8" font-size="11.5" font-family="monospace" font-weight="bold">${m3.cableLabelShort}/fase (${m3.insulLabel.split(' ')[0]})</text>
          <text x="470" y="36" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace">Iz' total = ${fmt(m3.Iz_real, 1)} A | L = ${m3.L} m</text>

          <rect x="355" y="120" width="230" height="42" rx="4" fill="#0b0f19" stroke="#1e293b" />
          <text x="470" y="137" text-anchor="middle" fill="#fbbf24" font-size="10" font-family="monospace" font-weight="bold">BARRAMENTO QGBT EQUIVALENTE:</text>
          <text x="470" y="152" text-anchor="middle" fill="#cbd5e1" font-size="9.5" font-family="monospace">${m3.busBarSpec}</text>

          <rect x="600" y="20" width="175" height="90" rx="5" fill="#0f172a" stroke="#64748b" stroke-width="2" />
          <text x="687" y="45" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="monospace" font-weight="bold">CARGA TERMINAL</text>
          <text x="687" y="67" text-anchor="middle" fill="#38bdf8" font-size="13" font-family="monospace" font-weight="bold">${fmt(m3.P_kW, 1)} kW (fp ${m3.fp})</text>
          <text x="687" y="88" text-anchor="middle" fill="#10b981" font-size="11" font-family="monospace">V_rec = ${fmt(m3.Vll - m3.dV_volts, 1)} V (ΔV=${fmt(m3.dV_percent, 2)}%)</text>
        </g>
      </svg>
    `;
    banner.innerHTML = `<span><b>COORDENAÇÃO NBR 5410 (Item 5.3.4 &amp; 6.2.5.6):</b> Ib = <b>${fmt(m3.Ib, 1)} A</b> ≤ In = <b>${fmtInt(m3.In)} A</b> (${m3.breakerModel}) ≤ Iz' = <b>${fmt(m3.Iz_real, 1)} A</b> (<b>${m3.cableLabelShort}/fase</b> = ${fmtInt(m3.totalSec_mm2)} mm²/fase) | Queda ΔV = <b>${fmt(m3.dV_percent, 2)}%</b></span>`;
  }
}

// ============================================================================
// MODULAR RENDERING FOR CENTER STAGE TABS [2] TO [6] & BOTTOM KPIS
// Separated specifically for [M1] Trafo 3Ø, [M2] Trafo 1Ø, and [M3] Cabos BT
// ============================================================================

// ----------------------------------------------------------------------------
// ABA [2]: TÉRMICA, ÓLEO & TAMANHO FÍSICO DO TRANSFORMADOR
// ----------------------------------------------------------------------------

function renderOilTab(m1, m2, m3) {
  const el = document.getElementById('oilTabContent');
  if (state.activeModule === 'trafo1ph') {
    renderOilTabM2(el, m2);
  } else if (state.activeModule === 'feeder') {
    renderOilTabM3(el, m3);
  } else {
    renderOilTabM1(el, m1);
  }
}

function renderOilTabM1(el, m1) {
  const wegDimRows = WEG_TRAFO_DIMENSIONS_CATALOG.map(d => {
    const isRef = d.kva === m1.catDim.kva;
    return `
      <tr class="${isRef ? 'row-active' : ''}">
        <td><b>${fmtInt(d.kva)} kVA</b> ${isRef ? '<span style="color:var(--nom-text)">★ REF. PROJETO</span>' : ''}</td>
        <td class="text-right"><b>${d.c_mm} mm</b> (${fmt(d.c_mm / 1000, 2)} m)</td>
        <td class="text-right"><b>${d.l_mm} mm</b> (${fmt(d.l_mm / 1000, 2)} m)</td>
        <td class="text-right"><b>${d.h_mm} mm</b> (${fmt(d.h_mm / 1000, 2)} m)</td>
        <td class="text-right">${d.ht_mm} mm</td>
        <td class="text-right">${d.wheel_mm > 0 ? `${d.wheel_mm} mm` : 'Base Fixa'}</td>
        <td class="text-right" style="color:var(--blue-light)">${fmtInt(d.oil_L)} L</td>
        <td class="text-right">${fmtInt(d.active_kg)} kg</td>
        <td class="text-right" style="color:var(--nom-text);font-weight:700">${fmtInt(d.total_kg)} kg</td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <!-- PAINEL 1: TAMANHO FÍSICO EXTERNO DO TRANSFORMADOR 3Ø, DIMENSÕES DE CONTORNO E PESOS (WEG DT-11) -->
    <div class="cae-panel">
      <div class="cae-panel-header">
        <span>📐 [M1] TAMANHO FÍSICO DO TRANSFORMADOR 3Ø, DIMENSÕES DE CONTORNO (C × L × H) E PESOS (WEG DT-11)</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--nom-text)">3Ø: ${m1.extLen_mm}×${m1.extWid_mm}×${m1.extHei_mm} mm (${fmtInt(m1.massTotalTrafo_kg)} kg)</span>
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <div class="cae-grid-4" style="margin-bottom:12px;">
          ${kpiHtml('Dimensões Externas 3Ø (C×L×H)', 'C×L×H', `${m1.extLen_mm}×${m1.extWid_mm}×${m1.extHei_mm}`, 'mm', 'nominal', `${fmt(m1.extLen_mm / 1000, 2)}m × ${fmt(m1.extWid_mm / 1000, 2)}m × ${fmt(m1.extHei_mm / 1000, 2)}m`)}
          ${kpiHtml('Peso Total Transformador 3Ø', 'M_tot', fmtInt(m1.massTotalTrafo_kg), 'kg', 'nominal', `Ativa: ${fmtInt(m1.massActiveTotal_kg)}kg | Óleo: ${fmtInt(m1.massOilTotal_kg)}kg | Tanque: ${fmtInt(m1.massTank_kg)}kg`)}
          ${kpiHtml('Área de Base & Envelope 3Ø', 'A_piso', fmt(m1.footprint_m2, 2), 'm²', 'nominal', `Volume Envelope: ${fmt(m1.envelope_m3, 2)} m³ | Rodas: ${m1.wheelBase_mm > 0 ? m1.wheelBase_mm + ' mm' : 'Base Skid'}`)}
          ${kpiHtml('Referência Padronizada WEG', 'kVA Ref', fmtInt(m1.catDim.kva), 'kVA', 'nominal', `Catálogo WEG DT-11 (Tab. Padronizada)`)}
        </div>

        <div class="cae-grid-2" style="margin-bottom:12px;">
          <!-- Desenho Dimensional de Contorno (Vistas Frontal e Lateral com Cotas C x L x H) -->
          <div style="background:#070a12;border:1px solid #1e293b;border-radius:4px;padding:8px;">
            <div style="font-family:var(--font-mono);font-size:10.5px;font-weight:700;color:var(--blue-light);margin-bottom:4px;">
              DESENHO DIMENSIONAL EXTERNO (CONTORNO C × L × H COM BUCHAS, RADIADORES E RODAS DE TRANSPORTE)
            </div>
            <svg viewBox="0 0 520 220" style="width:100%;height:195px;">
              <!-- VISTA FRONTAL (Comprimento C x Altura Total H) -->
              <g transform="translate(30, 22)">
                <text x="105" y="-6" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace" font-weight="bold">VISTA FRONTAL (C × H)</text>
                <!-- Tanque Principal -->
                <rect x="25" y="45" width="160" height="115" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="1.8"/>
                <!-- Radiadores Laterais -->
                <rect x="2" y="55" width="23" height="95" rx="2" fill="#0f172a" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="3,2"/>
                <rect x="185" y="55" width="23" height="95" rx="2" fill="#0f172a" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="3,2"/>
                <!-- Buchas AT no Topo (3 fases) -->
                <rect x="48" y="10" width="12" height="35" rx="2" fill="#334155" stroke="#f59e0b" stroke-width="1.2"/>
                <circle cx="54" cy="8" r="4.5" fill="#f59e0b"/>
                <rect x="99" y="10" width="12" height="35" rx="2" fill="#334155" stroke="#f59e0b" stroke-width="1.2"/>
                <circle cx="105" cy="8" r="4.5" fill="#f59e0b"/>
                <rect x="150" y="10" width="12" height="35" rx="2" fill="#334155" stroke="#f59e0b" stroke-width="1.2"/>
                <circle cx="156" cy="8" r="4.5" fill="#f59e0b"/>
                <!-- Rodas de Transporte Bicolor -->
                <circle cx="55" cy="167" r="7" fill="#020617" stroke="#94a3b8" stroke-width="1.8"/>
                <circle cx="155" cy="167" r="7" fill="#020617" stroke="#94a3b8" stroke-width="1.8"/>
                <!-- Linhas de Cota C e H -->
                <line x1="2" y1="184" x2="208" y2="184" stroke="#64748b" stroke-width="1" marker-start="url(#dot)" marker-end="url(#dot)"/>
                <text x="105" y="196" text-anchor="middle" fill="#60a5fa" font-size="9.5" font-family="monospace">C = ${m1.extLen_mm} mm</text>
                <line x1="218" y1="4" x2="218" y2="174" stroke="#64748b" stroke-width="1"/>
                <text x="224" y="94" fill="#10b981" font-size="9.5" font-family="monospace" transform="rotate(90, 224, 94)">H = ${m1.extHei_mm} mm</text>
              </g>

              <!-- VISTA LATERAL (Largura L x Altura Total H) -->
              <g transform="translate(295, 22)">
                <text x="85" y="-6" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace" font-weight="bold">VISTA LATERAL (L × H)</text>
                <!-- Tanque Lateral -->
                <rect x="25" y="45" width="120" height="115" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="1.8"/>
                <!-- Conservador de Óleo no Topo (se houver) -->
                ${m1.hasConservator ? `
                  <ellipse cx="85" cy="22" rx="38" ry="14" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
                  <text x="85" y="25" text-anchor="middle" fill="#6ee7b7" font-size="8" font-family="monospace">CONSERVADOR</text>
                ` : `
                  <rect x="70" y="24" width="30" height="21" rx="2" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
                  <text x="85" y="38" text-anchor="middle" fill="#94a3b8" font-size="7.5" font-family="monospace">VÁLVULA</text>
                `}
                <!-- Buchas BT no Topo -->
                <rect x="42" y="18" width="9" height="27" rx="1.5" fill="#334155" stroke="#38bdf8" stroke-width="1"/>
                <circle cx="46.5" cy="15" r="3.5" fill="#38bdf8"/>
                <rect x="119" y="18" width="9" height="27" rx="1.5" fill="#334155" stroke="#38bdf8" stroke-width="1"/>
                <circle cx="123.5" cy="15" r="3.5" fill="#38bdf8"/>
                <!-- Rodas de Transporte -->
                <circle cx="50" cy="167" r="7" fill="#020617" stroke="#94a3b8" stroke-width="1.8"/>
                <circle cx="120" cy="167" r="7" fill="#020617" stroke="#94a3b8" stroke-width="1.8"/>
                <!-- Linhas de Cota L -->
                <line x1="25" y1="184" x2="145" y2="184" stroke="#64748b" stroke-width="1"/>
                <text x="85" y="196" text-anchor="middle" fill="#60a5fa" font-size="9.5" font-family="monospace">L = ${m1.extWid_mm} mm</text>
                <text x="85" y="208" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="monospace">Bitola Rodas: ${m1.wheelBase_mm} mm</text>
              </g>
            </svg>
          </div>

          <!-- Tabela de Padronização WEG DT-11 Dimensões de Contorno -->
          <div style="max-height:225px;overflow-y:auto;border:1px solid #1e293b;border-radius:4px;">
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Potência WEG</th>
                  <th class="text-right">Comprimento (C)</th>
                  <th class="text-right">Largura (L)</th>
                  <th class="text-right">Altura Tanque</th>
                  <th class="text-right">Altura Total</th>
                  <th class="text-right">Bitola Rodas</th>
                  <th class="text-right">Óleo</th>
                  <th class="text-right">P. Ativa</th>
                  <th class="text-right">Peso Total</th>
                </tr>
              </thead>
              <tbody>
                ${wegDimRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- PAINEL 2: ESPECIFICAÇÃO DO ÓLEO ISOLANTE WEG DT-11 E BALANÇO VOLUMÉTRICO -->
    <div class="cae-panel" style="margin-top:12px;">
      <div class="cae-panel-header">
        <span>🛢️ ESPECIFICAÇÃO DO ÓLEO ISOLANTE WEG DT-11, PROPRIEDADES FÍSICO-QUÍMICAS E BALANÇO VOLUMÉTRICO</span>
        <span style="color:var(--nom-text);font-weight:700;">${m1.oilSpec.fullName}</span>
      </div>
      <div class="cae-panel-body">
        <div class="memo-result-box" style="margin-bottom:12px;border-color:${m1.paraffinicViolation ? 'var(--crit-border)' : 'var(--nom-border)'};background:${m1.paraffinicViolation ? 'var(--crit-bg)' : 'var(--nom-bg)'};color:${m1.paraffinicViolation ? 'var(--crit-text)' : 'var(--nom-text)'}">
          <div style="font-size:12.5px;margin-bottom:4px;">
            ${m1.paraffinicViolation
              ? `⚠️ ALERTA NORMATIVO (Resolução CNP 16/79 — pág. 184 WEG DT-11): O Óleo Tipo B (Parafínico) é restrito a até 15 kV! Para U1 = ${fmt(m1.v1Kv, 1)} kV, utilize Óleo Mineral Tipo A (Naftênico) ou Vegetal FR3.`
              : `✓ ${m1.recOil.title}`}
          </div>
          <div style="font-weight:400;color:var(--text-secondary);font-size:11.5px;">${m1.recOil.reason}</div>
        </div>

        <div class="cae-grid-4" style="margin-bottom:14px;">
          ${kpiHtml('Volume Total Óleo (20°C)', 'V_óleo', fmtInt(m1.volOilTotal_L), 'Litros', m1.statusOil, `Massa: ${fmtInt(m1.massOilTotal_kg)} kg`)}
          ${kpiHtml('Tanque + Radiadores', 'V_tq+rad', `${m1.volOilTankFree_L}+${m1.volOilRadiators_L}`, 'L', 'nominal', m1.hasConservator ? `Conservador: +${m1.volOilConservator_L} L` : 'Tanque Selado')}
          ${kpiHtml('Dilatação Térmica (ΔT=75°C)', 'ΔV_exp', `+${fmt(m1.volExpansion_L, 1)}`, 'Litros', 'nominal', `Compra (+5%): ${m1.volPurchase_L} L (${fmt(m1.drums200L, 2)} tamb.)`)}
          ${kpiHtml('Radiadores & Dissipação', 'A_rad', `${m1.numRadPanels} painéis`, `(${m1.totalFins} aletas)`, 'nominal', `Área: ${fmt(m1.totalCoolingArea_m2, 1)} m² (${m1.Pt_W} W)`)}
        </div>

        <div class="cae-grid-2">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              TABELA 1: PROPRIEDADES FÍSICO-QUÍMICAS E DIELÉTRICAS GARANTIDAS (TABELAS 5.4 / 5.5 DT-11)
            </div>
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Propriedade Físico-Química</th>
                  <th class="text-right">Valor Garantido</th>
                  <th class="text-right">Norma / Método</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Densidade Relativa (20/4 °C)</td><td class="text-right">${m1.oilSpec.densityRange}</td><td class="text-right">${m1.oilSpec.normRef.split('/')[0]}</td></tr>
                <tr><td>Viscosidade a 20°C / 40°C / 100°C</td><td class="text-right">${m1.oilSpec.visc20C} | ${m1.oilSpec.visc40C} | ${m1.oilSpec.visc100C}</td><td class="text-right">MB-293 / ASTM D445</td></tr>
                <tr><td>Ponto de Fulgor / Ponto de Fluidez</td><td class="text-right">${m1.oilSpec.flashPoint} | ${m1.oilSpec.pourPoint}</td><td class="text-right">MB-50 / MB-102</td></tr>
                <tr><td>Rigidez Dielétrica (Novo / Tratado WEG)</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${m1.oilSpec.dielectricTreated}</td><td class="text-right">NBR 6869 / IEC 156</td></tr>
                <tr><td>Teor Máximo de Água / Tensão Interfacial</td><td class="text-right">${m1.oilSpec.waterContent} | ${m1.oilSpec.interfacialTension}</td><td class="text-right">NBR 5755 / MB-292</td></tr>
                <tr><td>Índice de Neutralização / Fator Potência 90°C</td><td class="text-right">${m1.oilSpec.neutralizationIdx} | ${m1.oilSpec.powerFactor90C}</td><td class="text-right">MB-101 / NBR 5356</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              TABELA 2: BALANÇO VOLUMÉTRICO DO TANQUE, PARTE ATIVA E RADIADORES (METODOLOGIA UFSCar / RALE)
            </div>
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Compartimento / Componente</th>
                  <th class="text-right">Volume (L)</th>
                  <th class="text-right">Massa (kg)</th>
                  <th class="text-right">Fração</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1. Volume Interno Bruto do Tanque</td><td class="text-right">${fmtInt(m1.volTankGross_L)} L</td><td class="text-right">—</td><td class="text-right">100,0% (Caixa)</td></tr>
                <tr><td>2. (—) Volume Deslocado pela Parte Ativa</td><td class="text-right">— ${fmt(m1.volActiveDisplaced_L, 1)} L</td><td class="text-right">${fmtInt(m1.massActiveTotal_kg)} kg</td><td class="text-right">${fmt((m1.volActiveDisplaced_L / m1.volTankGross_L) * 100, 1)}% (Caixa)</td></tr>
                <tr><td>3. (=) Óleo Livre no Tanque Principal</td><td class="text-right" style="color:#fff;font-weight:700">${fmtInt(m1.volOilTankFree_L)} L</td><td class="text-right">${fmtInt(m1.volOilTankFree_L * m1.oilSpec.density20C)} kg</td><td class="text-right">${fmt((m1.volOilTankFree_L / m1.volOilTotal_L) * 100, 1)}% do Óleo</td></tr>
                <tr><td>4. (+) Óleo nas Aletas dos Radiadores (${m1.totalFins} aletas)</td><td class="text-right" style="color:#fff;font-weight:700">${fmtInt(m1.volOilRadiators_L)} L</td><td class="text-right">${fmtInt(m1.volOilRadiators_L * m1.oilSpec.density20C)} kg</td><td class="text-right">${fmt((m1.volOilRadiators_L / m1.volOilTotal_L) * 100, 1)}% do Óleo</td></tr>
                <tr><td>5. (+) Óleo no Conservador de Expansão</td><td class="text-right">${fmtInt(m1.volOilConservator_L)} L</td><td class="text-right">${fmtInt(m1.volOilConservator_L * m1.oilSpec.density20C)} kg</td><td class="text-right">${fmt((m1.volOilConservator_L / m1.volOilTotal_L) * 100, 1)}% do Óleo</td></tr>
                <tr class="row-active"><td>TOTAL DE ÓLEO NECESSÁRIO (20 °C)</td><td class="text-right">${fmtInt(m1.volOilTotal_L)} L</td><td class="text-right">${fmtInt(m1.massOilTotal_kg)} kg</td><td class="text-right">100,0%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderOilTabM2(el, m2) {
  // Tabela de Lâminas Comerciais Padronizadas E-I
  const stdLams = [
    { name: 'E-I 42 (Nº 0)', a: 14, b_rec: 18, w: 7,  h: 21, va_max: 25,   kg: 0.35 },
    { name: 'E-I 54 (Nº 1)', a: 18, b_rec: 22, w: 9,  h: 27, va_max: 55,   kg: 0.65 },
    { name: 'E-I 66 (Nº 2)', a: 22, b_rec: 28, w: 11, h: 33, va_max: 120,  kg: 1.15 },
    { name: 'E-I 84 (Nº 3)', a: 28, b_rec: 35, w: 14, h: 42, va_max: 280,  kg: 2.10 },
    { name: 'E-I 96 (Nº 4)', a: 32, b_rec: 42, w: 16, h: 48, va_max: 550,  kg: 3.40 },
    { name: 'E-I 120 (Nº 5)', a: 40, b_rec: 50, w: 20, h: 60, va_max: 1100, kg: 6.20 },
    { name: 'E-I 150 (Nº 6)', a: 50, b_rec: 65, w: 25, h: 75, va_max: 2500, kg: 11.5 }
  ];

  const closestLam = stdLams.reduce((prev, curr) =>
    Math.abs(curr.a - m2.a_mm) < Math.abs(prev.a - m2.a_mm) ? curr : prev
  );

  const lamRows = stdLams.map(l => {
    const isRef = l.name === closestLam.name;
    return `
      <tr class="${isRef ? 'row-active' : ''}">
        <td><b>${l.name}</b> ${isRef ? '<span style="color:var(--nom-text)">★ LÂMINA RECOMENDADA</span>' : ''}</td>
        <td class="text-right"><b>${l.a} mm</b></td>
        <td class="text-right">${l.b_rec} mm</td>
        <td class="text-right">${l.w} × ${l.h} mm</td>
        <td class="text-right" style="color:var(--blue-light)">${l.va_max} VA</td>
        <td class="text-right" style="color:var(--nom-text);font-weight:700">~${l.kg} kg</td>
      </tr>
    `;
  }).join('');

  // Estimativa de Elevação Térmica por Convecção Natural em Ar
  const areaDiss_m2 = 2 * (m2.extWidth_mm * m2.extHeight_mm + m2.extWidth_mm * m2.extDepth_mm + m2.extHeight_mm * m2.extDepth_mm) * 1e-6 * 1.35;
  const deltaT_est = m2.deltaT_est;
  const tempRiseClassB = m2.statusTemp;

  el.innerHTML = `
    <!-- PAINEL 1: TAMANHO FÍSICO EXTERNO DO TRANSFORMADOR 1Ø E-I & PESOS -->
    <div class="cae-panel">
      <div class="cae-panel-header">
        <span>📐 [M2] TAMANHO FÍSICO DO TRANSFORMADOR MONOFÁSICO NÚCLEO E-I &amp; PESOS</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--nom-text)">1Ø: ${m2.extWidth_mm}×${m2.extDepth_mm}×${m2.extHeight_mm} mm (${fmt(m2.pesoTotal_kg, 2)} kg)</span>
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
        </div>
      </div>
      <div class="cae-panel-body">
        ${m2.globalStatus !== 'nominal' ? `
          <div style="margin-bottom:12px;padding:10px 12px;border-radius:4px;border:1px solid ${m2.globalStatus === 'critical' ? 'var(--crit-border)' : 'var(--warn-border)'};background:${m2.globalStatus === 'critical' ? 'var(--crit-bg)' : 'var(--warn-bg)'};color:${m2.globalStatus === 'critical' ? 'var(--crit-text)' : 'var(--warn-text)'};display:flex;justify-content:space-between;align-items:center;gap:12px;font-family:var(--font-mono);font-size:11px;">
            <div>
              <b>${m2.globalStatus === 'critical' ? '✗ PARÂMETROS FORA DE NORMA DETECTADOS NO TRAFO 1Ø:' : '⚠️ ALERTA DE PROJETO NO TRAFO 1Ø:'}</b><br/>
              <span style="color:#e2e8f0;">${m2.violations.join(' | ')}</span>
            </div>
            <button type="button" class="preset-chip chip-emerald" style="white-space:nowrap;padding:6px 12px;font-weight:700;" onclick="window.triggerAutoRecalc(this)">
              ⚡ Corrigir &amp; Colocar 100% na Norma
            </button>
          </div>
        ` : ''}
        <div class="cae-grid-4" style="margin-bottom:12px;">
          ${kpiHtml('Dimensões Externas 1Ø (L×P×A)', 'L×P×A', `${m2.extWidth_mm}×${m2.extDepth_mm}×${m2.extHeight_mm}`, 'mm', 'nominal', `${fmt(m2.extWidth_mm / 10, 1)} × ${fmt(m2.extDepth_mm / 10, 1)} × ${fmt(m2.extHeight_mm / 10, 1)} cm`)}
          ${kpiHtml('Peso Total Montado', 'M_tot', fmt(m2.pesoTotal_kg, 2), 'kg', 'nominal', `Ferro: ${fmt(m2.pesoFerro_kg, 2)}kg | Cobre: ${fmt(m2.pesoCobre_kg, 2)}kg`)}
          ${kpiHtml('Perna Central & Empilhamento', 'a × b', `${m2.a_mm} × ${m2.b_mm}`, 'mm', m2.statusKu, `Janela ${m2.winW_mm}×${m2.winH_mm}mm (Ku=${fmt(m2.Ku_percent, 1)}%)`)}
          ${kpiHtml('Dissipação Térmica em Ar', 'T_op', fmt(m2.tempOp_C, 1), '°C', tempRiseClassB, `ΔT = +${fmt(deltaT_est, 1)} °C (Limite ≤ ${m2.insClass}°C)`)}
        </div>

        <div class="cae-grid-2" style="margin-bottom:12px;">
          <!-- Desenho Dimensional Vetorial do Trafo 1Ø E-I com Cotas -->
          <div style="background:#070a12;border:1px solid #1e293b;border-radius:4px;padding:8px;">
            <div style="font-family:var(--font-mono);font-size:10.5px;font-weight:700;color:var(--blue-light);margin-bottom:4px;">
              DESENHO DIMENSIONAL DO NÚCLEO E-I MONTADO COM CARRETEL E PRESILHAS
            </div>
            <svg viewBox="0 0 520 220" style="width:100%;height:195px;">
              <!-- VISTA FRONTAL (Largura Total A x Altura Total B) -->
              <g transform="translate(35, 20)">
                <text x="95" y="-5" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace" font-weight="bold">VISTA FRONTAL (A × B)</text>
                <!-- Placa E-I Externa -->
                <rect x="15" y="15" width="160" height="135" rx="3" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
                <!-- Janela Esquerda -->
                <rect x="45" y="42" width="28" height="80" rx="2" fill="#070a12" stroke="#60a5fa" stroke-width="1.2"/>
                <!-- Janela Direita -->
                <rect x="117" y="42" width="28" height="80" rx="2" fill="#070a12" stroke="#60a5fa" stroke-width="1.2"/>
                <!-- Perna Central com Bobinamento -->
                <rect x="73" y="42" width="44" height="80" fill="#334155" stroke="#f59e0b" stroke-width="1.5"/>
                <!-- Bobina Primária e Secundária no Carretel -->
                <rect x="62" y="48" width="66" height="68" rx="3" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
                <text x="95" y="86" text-anchor="middle" fill="#fcd34d" font-size="9" font-family="monospace" font-weight="bold">BOBINAS</text>
                <!-- Linhas de Cota -->
                <line x1="15" y1="162" x2="175" y2="162" stroke="#64748b" stroke-width="1"/>
                <text x="95" y="174" text-anchor="middle" fill="#60a5fa" font-size="9.5" font-family="monospace">A = ${m2.A_mm} mm</text>
                <line x1="184" y1="15" x2="184" y2="150" stroke="#64748b" stroke-width="1"/>
                <text x="190" y="88" fill="#10b981" font-size="9.5" font-family="monospace" transform="rotate(90, 190, 88)">B = ${m2.B_mm} mm</text>
                <!-- Cota da perna central a -->
                <text x="95" y="32" text-anchor="middle" fill="#38bdf8" font-size="8.5" font-family="monospace">Perna a = ${m2.a_mm} mm</text>
              </g>

              <!-- VISTA LATERAL (Profundidade de Empilhamento b x Altura B) -->
              <g transform="translate(305, 20)">
                <text x="85" y="-5" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace" font-weight="bold">VISTA LATERAL (EMPILHAMENTO b)</text>
                <!-- Pacote de Chapas Laminadas -->
                <rect x="35" y="15" width="90" height="135" rx="3" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
                <!-- Linhas de Laminação -->
                <line x1="50" y1="15" x2="50" y2="150" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="65" y1="15" x2="65" y2="150" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="80" y1="15" x2="80" y2="150" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="95" y1="15" x2="95" y2="150" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="110" y1="15" x2="110" y2="150" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
                <!-- Presilhas e Cantoneiras de Fixação -->
                <rect x="25" y="145" width="110" height="12" rx="2" fill="#0f172a" stroke="#94a3b8" stroke-width="1.2"/>
                <circle cx="35" cy="151" r="3" fill="#94a3b8"/>
                <circle cx="125" cy="151" r="3" fill="#94a3b8"/>
                <!-- Cota b -->
                <line x1="35" y1="172" x2="125" y2="172" stroke="#64748b" stroke-width="1"/>
                <text x="80" y="184" text-anchor="middle" fill="#60a5fa" font-size="9.5" font-family="monospace">Empilhamento b = ${m2.b_mm} mm</text>
                <text x="80" y="200" text-anchor="middle" fill="#cbd5e1" font-size="8.5" font-family="monospace">Prof. Total C/ Carretel = ${m2.extDepth_mm} mm</text>
              </g>
            </svg>
          </div>

          <!-- Tabela de Lâminas Padronizadas E-I -->
          <div style="max-height:225px;overflow-y:auto;border:1px solid #1e293b;border-radius:4px;">
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Lâmina Padronizada</th>
                  <th class="text-right">Perna Central (a)</th>
                  <th class="text-right">Empilhamento Rec. (b)</th>
                  <th class="text-right">Janela (w × h)</th>
                  <th class="text-right">Potência Típica</th>
                  <th class="text-right">Peso Estimado</th>
                </tr>
              </thead>
              <tbody>
                ${lamRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- PAINEL 2: DISSIPAÇÃO TÉRMICA EM AR POR CONVECÇÃO NATURAL E BALANÇO DE PERDAS (IEC 60076-11) -->
    <div class="cae-panel" style="margin-top:12px;">
      <div class="cae-panel-header">
        <span>🌡️ DISSIPAÇÃO TÉRMICA EM AR, ELEVAÇÃO DE TEMPERATURA E BALANÇO DE PERDAS (IEC 60076-11)</span>
        <span style="color:var(--nom-text);font-weight:700;">Classe Térmica B (130 °C) / F (155 °C) — Convecção Natural em Ar</span>
      </div>
      <div class="cae-panel-body">
        <div class="memo-result-box" style="margin-bottom:12px;border-color:var(--nom-border);background:var(--nom-bg);color:var(--nom-text)">
          <div style="font-size:12.5px;margin-bottom:4px;">
            ✓ Transformador Monofásico tipo Seco com Resfriamento Natural em Ar (AN)
          </div>
          <div style="font-weight:400;color:var(--text-secondary);font-size:11.5px;">
            O transformador dissipa ${fmt(m2.Ptot_W, 1)} W por convecção e radiação através de uma área externa estimada de ${fmt(areaDiss_m2, 3)} m². Elevação calculada: ΔT ≈ ${fmt(deltaT_est, 1)} °C (Limite máximo admissível para Classe B: 55 °C para temp. ambiente de 40 °C).
          </div>
        </div>

        <div class="cae-grid-2">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              TABELA 1: BALANÇO DE PERDAS ELÉTRICAS E MAGNÉTICAS
            </div>
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Componente de Perda</th>
                  <th class="text-right">Valor Calculado</th>
                  <th class="text-right">Fração das Perdas</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Perdas no Ferro (Histerese + Foucault Pfe)</td><td class="text-right">${fmt(m2.Pfe_W, 2)} W</td><td class="text-right">${fmt((m2.Pfe_W / Math.max(0.1, m2.Ptot_W)) * 100, 1)}%</td></tr>
                <tr><td>Perdas no Cobre Primário (R1 × I1²)</td><td class="text-right">${fmt(m2.I1 * m2.I1 * m2.R1_ohm, 2)} W</td><td class="text-right">${fmt(((m2.I1 * m2.I1 * m2.R1_ohm) / Math.max(0.1, m2.Ptot_W)) * 100, 1)}%</td></tr>
                <tr><td>Perdas no Cobre Secundário (R2 × I2²)</td><td class="text-right">${fmt(m2.I2 * m2.I2 * m2.R2_ohm, 2)} W</td><td class="text-right">${fmt(((m2.I2 * m2.I2 * m2.R2_ohm) / Math.max(0.1, m2.Ptot_W)) * 100, 1)}%</td></tr>
                <tr class="row-active"><td>TOTAL DE PERDAS DISSIPADAS (Pt)</td><td class="text-right">${fmt(m2.Ptot_W, 2)} W</td><td class="text-right">100,0%</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              TABELA 2: VERIFICAÇÃO DE CONFORMIDADE TÉRMICA DO ENROLAMENTO
            </div>
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Parâmetro Térmico</th>
                  <th class="text-right">Valor</th>
                  <th class="text-right">Critério Normativo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Área Superficial de Dissipação (Adiss)</td><td class="text-right">${fmt(areaDiss_m2, 3)} m²</td><td class="text-right">Convecção Externa</td></tr>
                <tr><td>Elevação Térmica Média dos Enrolamentos (ΔT)</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(deltaT_est, 1)} °C</td><td class="text-right">≤ 55,0 °C (Classe B)</td></tr>
                <tr><td>Temperatura Máxima em Regime Contínuo</td><td class="text-right">${fmt(deltaT_est + 40, 1)} °C</td><td class="text-right">≤ 130 °C (Classe B)</td></tr>
                <tr><td>Regulação de Tensão a Plena Carga</td><td class="text-right">${fmt(m2.reg_percent, 2)} %</td><td class="text-right">≤ 4,50 % (ABNT)</td></tr>
                <tr class="row-active"><td>RENDIMENTO TÉRMICO OPERACIONAL (η)</td><td class="text-right">${fmt(m2.rendimento_percent, 2)} %</td><td class="text-right">≥ 90,0 %</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderOilTabM3(el, m3) {
  // Cálculo de Ocupação de Eletroduto Conforme NBR 5410 item 6.2.11
  const numCond = (m3.phases === '3F' ? 5 : 3) * m3.nParallel; // 3F: 3 fases + 1 neutro + 1 PE
  const d_ext = m3.selectedCable.d_ext || (Math.sqrt(m3.selectedCable.section) * 1.8 + 2.5);
  const areaUnitCond_mm2 = (Math.PI * Math.pow(d_ext, 2)) / 4;
  const areaTotalCond_mm2 = numCond * areaUnitCond_mm2;
  // Taxa de ocupação máxima permitida para 3 ou mais condutores = 40% (NBR 5410 item 6.2.11.1)
  const areaMinEletroduto_mm2 = areaTotalCond_mm2 / 0.40;
  const diamIntMin_mm = Math.sqrt((4 * areaMinEletroduto_mm2) / Math.PI);

  const stdConduits = [
    { pol: '1/2"',  d_int: 16.0 },
    { pol: '3/4"',  d_int: 21.0 },
    { pol: '1"',    d_int: 27.0 },
    { pol: '1.1/4"', d_int: 35.0 },
    { pol: '1.1/2"', d_int: 41.0 },
    { pol: '2"',    d_int: 53.0 },
    { pol: '2.1/2"', d_int: 63.0 },
    { pol: '3"',    d_int: 78.0 },
    { pol: '4"',    d_int: 102.0 }
  ];

  const chosenConduit = stdConduits.find(c => c.d_int >= diamIntMin_mm)
    || { pol: 'Leito Aramado / Calha Perfurada', d_int: Math.round(diamIntMin_mm) };

  const conduitArea = chosenConduit.d_int > 0 ? (Math.PI * Math.pow(chosenConduit.d_int, 2)) / 4 : areaMinEletroduto_mm2;
  const realOccPct = (areaTotalCond_mm2 / conduitArea) * 100;
  const statusOcc = realOccPct <= 40 ? 'nominal' : 'warning';

  el.innerHTML = `
    <!-- PAINEL 1: MÉTODO DE INSTALAÇÃO, ROTEAMENTO & FATORES DE CORREÇÃO NBR 5410 -->
    <div class="cae-panel">
      <div class="cae-panel-header">
        <span>⚡ [M3] INSTALAÇÃO DE CABOS BT, ELETRODUTOS &amp; BARRAMENTOS QGBT (NBR 5410)</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--nom-text)">Cabo: ${m3.cableLabelShort} (${fmt(m3.Ib, 1)} A)</span>
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <div class="cae-grid-4" style="margin-bottom:12px;">
          ${kpiHtml('Método de Instalação NBR', 'Método', m3.insulLabel.split('(')[0].trim(), '', 'nominal', `${m3.phases} ${m3.Vll}V | L = ${m3.L} m`)}
          ${kpiHtml('Fator Derating Global', 'FCA×FCT', fmt(m3.fca * m3.fct, 2), '', m3.fca * m3.fct >= 0.7 ? 'nominal' : 'warning', `FCA = ${fmt(m3.fca, 2)} | FCT = ${fmt(m3.fct, 2)}`)}
          ${kpiHtml('Ocupação de Eletroduto', 'Ocup.%', fmt(realOccPct, 1), '%', statusOcc, `Ref: ${chosenConduit.pol} (Di = ${chosenConduit.d_int}mm)`)}
          ${kpiHtml('Barramento QGBT Cobre', 'Barra Cu', m3.busBarSpec.split('(')[0].trim(), '', 'nominal', `Densidade J ≤ 1,35 A/mm²`)}
        </div>

        <div class="cae-grid-2" style="margin-bottom:12px;">
          <!-- SVG Ilustrativo do Corte Transversal do Eletroduto / Leito com Cabos e Folga de 40% -->
          <div style="background:#070a12;border:1px solid #1e293b;border-radius:4px;padding:8px;">
            <div style="font-family:var(--font-mono);font-size:10.5px;font-weight:700;color:var(--blue-light);margin-bottom:4px;">
              CORTE TRANSVERSAL DO ELETRODUTO / LEITO (DISTRIBUIÇÃO DE CONDUTORES E TAXA MÁXIMA DE 40%)
            </div>
            <svg viewBox="0 0 520 220" style="width:100%;height:195px;">
              <!-- Seção Circular do Eletroduto -->
              <g transform="translate(140, 110)">
                <!-- Eletroduto Externo -->
                <circle cx="0" cy="0" r="88" fill="#0b0f19" stroke="#3b82f6" stroke-width="2.5"/>
                <!-- Área Livre Permitida (40% de preenchimento) -->
                <circle cx="0" cy="0" r="56" fill="rgba(59, 130, 246, 0.08)" stroke="#60a5fa" stroke-width="1" stroke-dasharray="3,3"/>
                <!-- Cabos Dispostos no Feixe -->
                <!-- Fase R (Vermelho/Marrom) -->
                <circle cx="-25" cy="-25" r="18" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.8"/>
                <text x="-25" y="-21" text-anchor="middle" fill="#fca5a5" font-size="9" font-family="monospace" font-weight="bold">R</text>
                <!-- Fase S (Branco/Cinza) -->
                <circle cx="25" cy="-25" r="18" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.8"/>
                <text x="25" y="-21" text-anchor="middle" fill="#f1f5f9" font-size="9" font-family="monospace" font-weight="bold">S</text>
                <!-- Fase T (Preto) -->
                <circle cx="-35" cy="22" r="18" fill="#020617" stroke="#94a3b8" stroke-width="1.8"/>
                <text x="-35" y="26" text-anchor="middle" fill="#cbd5e1" font-size="9" font-family="monospace" font-weight="bold">T</text>
                <!-- Neutro N (Azul Claro) -->
                <circle cx="10" cy="25" r="16" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.8"/>
                <text x="10" y="29" text-anchor="middle" fill="#bae6fd" font-size="8.5" font-family="monospace" font-weight="bold">N</text>
                <!-- Proteção PE (Verde/Amarelo) -->
                <circle cx="48" cy="22" r="14" fill="#064e3b" stroke="#10b981" stroke-width="1.8"/>
                <text x="48" y="26" text-anchor="middle" fill="#6ee7b7" font-size="8" font-family="monospace" font-weight="bold">PE</text>

                <text x="0" y="-72" text-anchor="middle" fill="#94a3b8" font-size="8.5" font-family="monospace">Eletroduto: ${chosenConduit.pol} (Ø int = ${chosenConduit.d_int} mm)</text>
              </g>

              <!-- Painel Lateral de Resumo das Folgas Técnicas -->
              <g transform="translate(290, 20)">
                <text x="0" y="15" fill="#f1f5f9" font-size="11" font-family="monospace" font-weight="bold">CRITÉRIOS DE OCUPAÇÃO NBR 5410:</text>
                <text x="0" y="38" fill="#94a3b8" font-size="9.5" font-family="monospace">• Condutores no feixe: <tspan fill="#60a5fa" font-weight="bold">${numCond} cabos</tspan> (${m3.nParallel}×/fase)</text>
                <text x="0" y="58" fill="#94a3b8" font-size="9.5" font-family="monospace">• Diâmetro ext. cabo: <tspan fill="#60a5fa" font-weight="bold">${fmt(d_ext, 1)} mm</tspan></text>
                <text x="0" y="78" fill="#94a3b8" font-size="9.5" font-family="monospace">• Área total cabos: <tspan fill="#60a5fa" font-weight="bold">${fmt(areaTotalCond_mm2, 1)} mm²</tspan></text>
                <text x="0" y="98" fill="#94a3b8" font-size="9.5" font-family="monospace">• Área mín. eletroduto: <tspan fill="#60a5fa" font-weight="bold">${fmt(areaMinEletroduto_mm2, 1)} mm²</tspan></text>
                <text x="0" y="118" fill="#94a3b8" font-size="9.5" font-family="monospace">• Ø interno mínimo: <tspan fill="#60a5fa" font-weight="bold">${fmt(diamIntMin_mm, 1)} mm</tspan></text>
                <text x="0" y="142" fill="#10b981" font-size="10.5" font-family="monospace" font-weight="bold">✓ Eletroduto Sugerido: ${chosenConduit.pol}</text>
                <text x="0" y="162" fill="${statusOcc === 'nominal' ? '#10b981' : '#f59e0b'}" font-size="9.5" font-family="monospace">Taxa Real = ${fmt(realOccPct, 1)}% (Máx normativo: 40,0%)</text>
              </g>
            </svg>
          </div>

          <!-- Tabela de Padronização de Eletrodutos Comerciais -->
          <div style="max-height:225px;overflow-y:auto;border:1px solid #1e293b;border-radius:4px;">
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Bitola Comercial</th>
                  <th class="text-right">Diâmetro Interno</th>
                  <th class="text-right">Área Interna</th>
                  <th class="text-right">Capacidade (40%)</th>
                  <th class="text-right">Status do Projeto</th>
                </tr>
              </thead>
              <tbody>
                ${stdConduits.map(c => {
                  const areaInt = (Math.PI * Math.pow(c.d_int, 2)) / 4;
                  const cap40 = areaInt * 0.40;
                  const isOk = c.d_int >= diamIntMin_mm;
                  const isChosen = c.pol === chosenConduit.pol;
                  return `
                    <tr class="${isChosen ? 'row-active' : ''}">
                      <td><b>${c.pol}</b> ${isChosen ? '<span style="color:var(--nom-text)">★ ADOTADO</span>' : ''}</td>
                      <td class="text-right">${c.d_int} mm</td>
                      <td class="text-right">${fmtInt(areaInt)} mm²</td>
                      <td class="text-right">${fmtInt(cap40)} mm²</td>
                      <td class="text-right" style="color:${isOk ? 'var(--nom-text)' : 'var(--crit-text)'};font-weight:700">
                        ${isOk ? '✓ ATENDE' : '✗ NÃO ATENDE'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- PAINEL 2: BARRAMENTO DE COBRE ELETROLÍTICO DO QGBT (NBR IEC 61439-1) -->
    <div class="cae-panel" style="margin-top:12px;">
      <div class="cae-panel-header">
        <span>⚡ BARRAMENTOS DE COBRE ELETROLÍTICO PARA O QGBT (QUADRO GERAL DE BAIXA TENSÃO)</span>
        <span style="color:var(--nom-text);font-weight:700;">Capacidade Nominal In = ${m3.In} A | Densidade J ≤ 1,35 A/mm²</span>
      </div>
      <div class="cae-panel-body">
        <div class="memo-result-box" style="margin-bottom:12px;border-color:var(--nom-border);background:var(--nom-bg);color:var(--nom-text)">
          <div style="font-size:12.5px;margin-bottom:4px;">
            ✓ Especificação do Barramento Geral de Entrada do QGBT: ${m3.busBarSpec}
          </div>
          <div style="font-weight:400;color:var(--text-secondary);font-size:11.5px;">
            Para suportar a corrente de projeto Ib = ${fmt(m3.Ib, 1)} A com proteção por Disjuntor WEG (${m3.In} A), recomenda-se barramento de cobre eletrolítico em ar livre (NBR IEC 61439) dimensionado com densidade econômica e térmica não superior a 1,35 A/mm².
          </div>
        </div>

        <div class="cae-grid-2">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              TABELA 1: DIMENSIONAMENTO DO BARRAMENTO DE COBRE POR FASE
            </div>
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Parâmetro do Barramento</th>
                  <th class="text-right">Valor Projetado</th>
                  <th class="text-right">Referência Técnica</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Corrente de Projeto (Ib)</td><td class="text-right">${fmt(m3.Ib, 1)} A</td><td class="text-right">Carga P = ${fmt(m3.P_kW, 1)} kW</td></tr>
                <tr><td>Corrente Nominal do Disjuntor (In)</td><td class="text-right">${m3.In} A</td><td class="text-right">WEG DWB / ABW</td></tr>
                <tr><td>Densidade de Corrente Adotada</td><td class="text-right">1,35 A/mm²</td><td class="text-right">Barras de Cobre em Ar</td></tr>
                <tr><td>Seção Mínima Requerida por Fase</td><td class="text-right">${fmt(m3.Ib / 1.35, 1)} mm²</td><td class="text-right">Ib / 1,35 A/mm²</td></tr>
                <tr class="row-active"><td>BARRAMENTO SUGERIDO POR FASE</td><td class="text-right" colspan="2"><b>${m3.busBarSpec}</b></td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              TABELA 2: BARRAMENTO DE NEUTRO E ATERRAMENTO (PE)
            </div>
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Condutor / Barramento</th>
                  <th class="text-right">Seção Recomendada</th>
                  <th class="text-right">Critério Normativo NBR 5410</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Barramento de Fases (R, S, T)</td><td class="text-right">100% da Seção (${m3.busBarSpec.split('(')[0].trim()})</td><td class="text-right">Capacidade Plena</td></tr>
                <tr><td>Barramento de Neutro (N)</td><td class="text-right">${m3.totalSec_mm2 > 50 ? '50% ou 100% (Harmônicas)' : '100% da Fase'}</td><td class="text-right">NBR 5410 Tabela 48</td></tr>
                <tr><td>Barramento de Proteção (PE)</td><td class="text-right">${m3.totalSec_mm2 > 35 ? `${fmtInt(m3.totalSec_mm2 / 2)} mm²` : `${m3.totalSec_mm2} mm²`}</td><td class="text-right">NBR 5410 Tabela 51</td></tr>
                <tr class="row-active"><td>DISJUNTOR GERAL DO QGBT</td><td class="text-right" colspan="2">${m3.breakerModel}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}


// ----------------------------------------------------------------------------
// ABA [3]: CURVAS CARACTERÍSTICAS & FAIXA DE TENSÃO
// ----------------------------------------------------------------------------

function renderCurvesTab(m1, m2, m3) {
  const el = document.getElementById('curvesTabContent');
  if (state.activeModule === 'trafo1ph') {
    renderCurvesTabM2(el, m2);
  } else if (state.activeModule === 'feeder') {
    renderCurvesTabM3(el, m3);
  } else {
    renderCurvesTabM1(el, m1);
  }
}

function renderCurvesTabM1(el, m1) {
  const tapMode = document.getElementById('m1_Taps').value;
  const tapSteps = tapMode === '5' ? [5, 0, -5] : tapMode === '4.5' ? [4.5, 0, -4.5] : tapMode === '5_5pos' ? [5, 2.5, 0, -2.5, -5] : [10, 5, 0, -5, -10];

  const tapRows = tapSteps.map((pct, i) => {
    const f = 1 + pct / 100;
    const u1L = m1.V1_line * f;
    const u1f = m1.V1_phase * f;
    const i1L = m1.I1_line / f;
    const n1Tap = Math.round(u1f / m1.voltsPerTurn);
    const isNom = Math.abs(pct) < 0.01;
    return `
      <tr class="${isNom ? 'row-active' : ''}">
        <td>Tap ${i + 1} ${isNom ? '(Nominal)' : ''}</td>
        <td class="text-right">${pct > 0 ? '+' : ''}${fmt(pct, 1)}%</td>
        <td class="text-right">${fmtInt(u1L)} V (${fmt(u1L / 1000, 2)} kV)</td>
        <td class="text-right">${fmtInt(u1f)} V</td>
        <td class="text-right" style="color:var(--blue-light)">${fmt(i1L, 2)} A</td>
        <td class="text-right">${fmtInt(n1Tap)} esp</td>
        <td class="text-right">${fmt(u1L / m1.V2_line, 2)} : 1</td>
        <td class="text-right" style="color:var(--nom-text)">${fmt(m1.V2_line, 0)} V / ${fmt(m1.I2_line, 1)} A</td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="cae-grid-2">
      <!-- Curva de Saturação Magnética SVG (Aço Silício GO M4) -->
      <div class="cae-panel">
        <div class="cae-panel-header">
          <span>📈 CURVA DE SATURAÇÃO B-H (AÇO SILÍCIO GRÃO ORIENTADO GO M4)</span>
          <span style="color:${m1.statusBm === 'critical' ? 'var(--crit-text)' : 'var(--nom-text)'}">Bm Operação = ${fmt(m1.Bm, 2)} T</span>
        </div>
        <div class="cae-panel-body">
          <svg viewBox="0 0 480 230" style="width:100%;height:210px;background:#050811;border:1px solid #1e293b;border-radius:4px;">
            <defs>
              <linearGradient id="gradSat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="50" y2="190" stroke="#1e293b" stroke-width="1"/>
            <line x1="50" y1="190" x2="450" y2="190" stroke="#1e293b" stroke-width="1"/>
            <line x1="50" y1="140" x2="450" y2="140" stroke="#1e293b" stroke-dasharray="3,3"/>
            <line x1="50" y1="90" x2="450" y2="90" stroke="#1e293b" stroke-dasharray="3,3"/>
            <line x1="50" y1="40" x2="450" y2="40" stroke="#1e293b" stroke-dasharray="3,3"/>
            <!-- Rótulos Eixos -->
            <text x="35" y="44" fill="#64748b" font-size="9" font-family="monospace">2.0T</text>
            <text x="35" y="94" fill="#64748b" font-size="9" font-family="monospace">1.5T</text>
            <text x="35" y="144" fill="#64748b" font-size="9" font-family="monospace">1.0T</text>
            <text x="35" y="194" fill="#64748b" font-size="9" font-family="monospace">0.0T</text>
            <text x="250" y="212" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace">Intensidade de Campo H (A/m)</text>
            <!-- Curva B-H Realística -->
            <path d="M 50 190 Q 150 170 230 115 T 320 65 T 440 45" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
            <!-- Zona de Joelho de Saturação (1.70 T) -->
            <line x1="50" y1="70" x2="450" y2="70" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="4,4"/>
            <text x="440" y="66" text-anchor="end" fill="#ef4444" font-size="9" font-family="monospace">Joelho de Saturação: 1.70 T</text>
            <!-- Ponto Atual de Operação -->
            ${(() => {
              const b = Math.min(2.0, m1.Bm);
              const py = 190 - (b / 2.0) * 150;
              const px = 50 + Math.pow(b / 1.7, 2.2) * 230;
              return `
                <circle cx="${px}" cy="${py}" r="6" fill="${m1.statusBm === 'critical' ? '#ef4444' : '#10b981'}" stroke="#ffffff" stroke-width="2"/>
                <text x="${px + 10}" y="${py - 4}" fill="${m1.statusBm === 'critical' ? '#ef4444' : '#6ee7b7'}" font-size="10" font-family="monospace" font-weight="bold">Bm = ${fmt(m1.Bm, 2)} T (${px > 300 ? 'Saturando!' : 'Linear OK'})</text>
              `;
            })()}
          </svg>
        </div>
      </div>

      <!-- Curva de Rendimento e Balanço de Perdas -->
      <div class="cae-panel">
        <div class="cae-panel-header">
          <span>📊 CURVA DE RENDIMENTO η(%) E BALANÇO DE PERDAS P0 / Pk</span>
          <span style="color:var(--nom-text)">η = ${fmt(m1.eff_pct, 2)}% | P0=${m1.P0_W}W, Pk=${m1.Pc_W}W</span>
        </div>
        <div class="cae-panel-body">
          <svg viewBox="0 0 480 230" style="width:100%;height:210px;background:#050811;border:1px solid #1e293b;border-radius:4px;">
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="50" y2="190" stroke="#1e293b" stroke-width="1"/>
            <line x1="50" y1="190" x2="450" y2="190" stroke="#1e293b" stroke-width="1"/>
            <text x="25" y="44" fill="#64748b" font-size="9" font-family="monospace">100%</text>
            <text x="25" y="94" fill="#64748b" font-size="9" font-family="monospace">98%</text>
            <text x="25" y="144" fill="#64748b" font-size="9" font-family="monospace">96%</text>
            <text x="25" y="194" fill="#64748b" font-size="9" font-family="monospace">94%</text>
            <!-- Curva de Rendimento típica de trafo a óleo -->
            <path d="M 50 180 Q 120 70 200 48 T 320 60 T 440 95" fill="none" stroke="#10b981" stroke-width="2.5"/>
            <!-- Rótulos X -->
            <text x="120" y="206" fill="#94a3b8" font-size="9" font-family="monospace">25%</text>
            <text x="200" y="206" fill="#94a3b8" font-size="9" font-family="monospace">50%</text>
            <text x="280" y="206" fill="#94a3b8" font-size="9" font-family="monospace">75%</text>
            <text x="360" y="206" fill="#94a3b8" font-size="9" font-family="monospace">100%</text>
            <text x="430" y="206" fill="#94a3b8" font-size="9" font-family="monospace">125%</text>
            <!-- Ponto 100% de carga -->
            <circle cx="360" cy="70" r="5" fill="#10b981" stroke="#ffffff" stroke-width="1.8"/>
            <text x="365" y="62" fill="#6ee7b7" font-size="9.5" font-family="monospace" font-weight="bold">100% Carga: η = ${fmt(m1.eff_pct, 2)}%</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- PAINEL 2: FAIXA DE TENSÃO E DERIVAÇÕES DO COMUTADOR DE TAPS PRIMÁRIOS -->
    <div class="cae-panel" style="margin-top:12px;">
      <div class="cae-panel-header">
        <span>🔢 TABELA COMPLETA DE FAIXA DE TENSÃO DOS TAPS PRIMÁRIOS (COMUTADOR SOBRE V1)</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--nom-text)">Comutador: ±${tapSteps[0]}% (${tapSteps.length} posições)</span>
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <table class="cae-table">
          <thead>
            <tr>
              <th>Posição / Tap</th>
              <th class="text-right">Derivação</th>
              <th class="text-right">Tensão de Linha U1L</th>
              <th class="text-right">Tensão de Fase U1f</th>
              <th class="text-right">Corrente I1</th>
              <th class="text-right">Espiras N1</th>
              <th class="text-right">Relação a</th>
              <th class="text-right">Secundário U2 / I2</th>
            </tr>
          </thead>
          <tbody>
            ${tapRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCurvesTabM2(el, m2) {
  // Patamares de Tensão da Rede de Comando (110V, 127V, 220V com variação ±10%)
  const stepsNet = [
    { name: '-10% Subtensão', factor: 0.90 },
    { name: '-5% Mínimo Normal', factor: 0.95 },
    { name: 'Nominal de Projeto', factor: 1.00 },
    { name: '+5% Máximo Normal', factor: 1.05 },
    { name: '+10% Sobretensão', factor: 1.10 }
  ];

  const netRows = stepsNet.map(s => {
    const v1_real = m2.V1 * s.factor;
    const bm_real = m2.Bm * s.factor;
    const i0_est = (m2.I1 * 0.08) * Math.pow(bm_real / 1.1, 3);
    const v2_vazio = m2.V2 * s.factor * 1.035;
    const v2_carga = v2_vazio * (1 - (m2.reg_percent / 100));
    const isNom = s.factor === 1.0;
    const statusSat = bm_real > 1.30 ? 'critical' : bm_real > 1.22 ? 'warning' : 'nominal';
    const satBadge = bm_real > 1.30 ? '✗ RISCO SATURAÇÃO' : bm_real > 1.22 ? '⚠️ ATENÇÃO' : '✓ CONFORME';

    return `
      <tr class="${isNom ? 'row-active' : ''}">
        <td><b>${s.name}</b> ${isNom ? '<span style="color:var(--nom-text)">★ NOMINAL</span>' : ''}</td>
        <td class="text-right">${s.factor > 1 ? '+' : ''}${Math.round((s.factor - 1) * 100)}%</td>
        <td class="text-right"><b>${fmt(v1_real, 1)} V</b></td>
        <td class="text-right" style="color:${statusSat === 'critical' ? 'var(--crit-text)' : 'var(--blue-light)'}">
          <b>${fmt(bm_real, 2)} T</b>
        </td>
        <td class="text-right">${fmt(i0_est, 2)} A</td>
        <td class="text-right">${fmt(v2_vazio, 1)} V</td>
        <td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(v2_carga, 1)} V</td>
        <td class="text-right" style="color:${statusSat === 'critical' ? 'var(--crit-text)' : 'var(--nom-text)'};font-weight:700">
          ${satBadge}
        </td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="cae-grid-2">
      <!-- Curva B-H Chapa GNO (Grão Não Orientado) -->
      <div class="cae-panel">
        <div class="cae-panel-header">
          <span>📈 CURVA DE MAGNETIZAÇÃO B-H (CHAPA SILÍCIO GNO — JOELHO 1,25 T)</span>
          <span style="color:${m2.statusBm === 'critical' ? 'var(--crit-text)' : 'var(--nom-text)'}">Bm Operação = ${fmt(m2.Bm, 2)} T</span>
        </div>
        <div class="cae-panel-body">
          <svg viewBox="0 0 480 230" style="width:100%;height:210px;background:#050811;border:1px solid #1e293b;border-radius:4px;">
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="50" y2="190" stroke="#1e293b" stroke-width="1"/>
            <line x1="50" y1="190" x2="450" y2="190" stroke="#1e293b" stroke-width="1"/>
            <text x="35" y="44" fill="#64748b" font-size="9" font-family="monospace">1.6T</text>
            <text x="35" y="94" fill="#64748b" font-size="9" font-family="monospace">1.2T</text>
            <text x="35" y="144" fill="#64748b" font-size="9" font-family="monospace">0.8T</text>
            <text x="35" y="194" fill="#64748b" font-size="9" font-family="monospace">0.0T</text>
            <text x="250" y="212" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace">Intensidade de Campo H (A/m)</text>
            <!-- Curva B-H GNO -->
            <path d="M 50 190 Q 130 140 210 90 T 300 58 T 440 45" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
            <!-- Joelho GNO em 1.25 T -->
            <line x1="50" y1="88" x2="450" y2="88" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="4,4"/>
            <text x="440" y="84" text-anchor="end" fill="#ef4444" font-size="9" font-family="monospace">Joelho de Saturação GNO: 1.25 T</text>
            <!-- Ponto Atual -->
            ${(() => {
              const b = Math.min(1.6, m2.Bm);
              const py = 190 - (b / 1.6) * 150;
              const px = 50 + Math.pow(b / 1.25, 2.5) * 230;
              return `
                <circle cx="${px}" cy="${py}" r="6" fill="${m2.statusBm === 'critical' ? '#ef4444' : '#10b981'}" stroke="#ffffff" stroke-width="2"/>
                <text x="${px + 10}" y="${py - 4}" fill="${m2.statusBm === 'critical' ? '#ef4444' : '#6ee7b7'}" font-size="10" font-family="monospace" font-weight="bold">Bm = ${fmt(m2.Bm, 2)} T (${m2.Bm > 1.25 ? 'Saturado!' : 'Linear'})</text>
              `;
            })()}
          </svg>
        </div>
      </div>

      <!-- Curva de Rendimento e Regulação 1Ø -->
      <div class="cae-panel">
        <div class="cae-panel-header">
          <span>📊 RENDIMENTO η(%) E REGULAÇÃO ΔV(%) VS CARGA (10% A 120%)</span>
          <span style="color:var(--nom-text)">η = ${fmt(m2.rendimento_percent, 2)}% | ΔV = ${fmt(m2.reg_percent, 2)}%</span>
        </div>
        <div class="cae-panel-body">
          <svg viewBox="0 0 480 230" style="width:100%;height:210px;background:#050811;border:1px solid #1e293b;border-radius:4px;">
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="50" y2="190" stroke="#1e293b" stroke-width="1"/>
            <line x1="50" y1="190" x2="450" y2="190" stroke="#1e293b" stroke-width="1"/>
            <text x="25" y="44" fill="#64748b" font-size="9" font-family="monospace">95%</text>
            <text x="25" y="94" fill="#64748b" font-size="9" font-family="monospace">90%</text>
            <text x="25" y="144" fill="#64748b" font-size="9" font-family="monospace">85%</text>
            <text x="25" y="194" fill="#64748b" font-size="9" font-family="monospace">80%</text>
            <!-- Curva de Rendimento -->
            <path d="M 50 170 Q 130 75 220 52 T 340 68 T 440 98" fill="none" stroke="#10b981" stroke-width="2.5"/>
            <!-- Curva de Regulação (reta linear azul) -->
            <line x1="50" y1="190" x2="440" y2="125" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,2"/>
            <text x="440" y="120" text-anchor="end" fill="#60a5fa" font-size="9" font-family="monospace">Regulação ΔV%</text>
            <!-- Rótulos X -->
            <text x="120" y="206" fill="#94a3b8" font-size="9" font-family="monospace">25%</text>
            <text x="220" y="206" fill="#94a3b8" font-size="9" font-family="monospace">50%</text>
            <text x="320" y="206" fill="#94a3b8" font-size="9" font-family="monospace">75%</text>
            <text x="400" y="206" fill="#94a3b8" font-size="9" font-family="monospace">100%</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- PAINEL 2: FAIXA DE TENSÃO DE ENTRADA DA REDE DE COMANDO -->
    <div class="cae-panel" style="margin-top:12px;">
      <div class="cae-panel-header">
        <span>🔢 TABELA DE FAIXA DE TENSÃO DE ENTRADA DA REDE (SENSIBILIDADE A FLUTUAÇÕES ±10%)</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--nom-text)">V1 Nominal = ${m2.V1} V → V2 = ${m2.V2} V</span>
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <table class="cae-table">
          <thead>
            <tr>
              <th>Patamar de Rede</th>
              <th class="text-right">Variação (%)</th>
              <th class="text-right">Tensão Aplicada V1'</th>
              <th class="text-right">Indução Magnética Bm'</th>
              <th class="text-right">Corrente Vazio I0</th>
              <th class="text-right">V2 em Vazio</th>
              <th class="text-right">V2 com Carga</th>
              <th class="text-right">Conformidade Térmica</th>
            </tr>
          </thead>
          <tbody>
            ${netRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCurvesTabM3(el, m3) {
  // Gráfico do Perfil de Queda de Tensão ao Longo da Distância (0 a L)
  const limDv = m3.limDv;
  const realDv = m3.dV_percent;
  const maxAxisDv = Math.max(5.0, realDv * 1.25);
  const scaleY = 160 / maxAxisDv;
  const limY = 190 - limDv * scaleY;
  const endY = 190 - realDv * scaleY;

  // Tabela de Faixa de Tensão no Barramento Receptor por Nível de Carregamento
  const loadSteps = [
    { name: '0% (Em Vazio)', factor: 0.00 },
    { name: '25% (Carga Leve)', factor: 0.25 },
    { name: '50% (Meia Carga)', factor: 0.50 },
    { name: '75% (Três Quartos)', factor: 0.75 },
    { name: '100% (Nominal de Projeto)', factor: 1.00 },
    { name: '125% (Pico de Partida)', factor: 1.25 }
  ];

  const loadRows = loadSteps.map(s => {
    const cur_I = m3.Ib * s.factor;
    const dv_v = m3.dV_volts * s.factor;
    const dv_pct = m3.dV_percent * s.factor;
    const v_rec_line = m3.Vll - dv_v;
    const v_rec_phase = (m3.Vll / (m3.phases === '3F' ? Math.sqrt(3) : 1)) - (dv_v / (m3.phases === '3F' ? Math.sqrt(3) : 1));
    const isNom = s.factor === 1.0;
    const isAdeq = v_rec_line >= (m3.Vll * 0.92);
    const isPrecar = v_rec_line >= (m3.Vll * 0.87);
    const statusClass = isAdeq ? 'nominal' : isPrecar ? 'warning' : 'critical';
    const statusText = isAdeq ? '✓ FAIXA ADEQUADA' : isPrecar ? '⚠️ FAIXA PRECÁRIA' : '✗ FAIXA CRÍTICA';

    return `
      <tr class="${isNom ? 'row-active' : ''}">
        <td><b>${s.name}</b> ${isNom ? '<span style="color:var(--nom-text)">★ PROJETO</span>' : ''}</td>
        <td class="text-right">${fmt(cur_I, 1)} A</td>
        <td class="text-right">${fmt(dv_v, 2)} V</td>
        <td class="text-right" style="color:${dv_pct <= limDv ? 'var(--nom-text)' : 'var(--crit-text)'};font-weight:700">
          ${fmt(dv_pct, 2)} %
        </td>
        <td class="text-right"><b>${fmt(v_rec_line, 1)} V</b></td>
        <td class="text-right">${fmt(v_rec_phase, 1)} V</td>
        <td class="text-right" style="color:${statusClass === 'nominal' ? 'var(--nom-text)' : statusClass === 'warning' ? 'var(--warn-text)' : 'var(--crit-text)'};font-weight:700">
          ${statusText}
        </td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="cae-grid-2">
      <!-- Gráfico do Perfil de Queda de Tensão ΔV% ao longo de L -->
      <div class="cae-panel">
        <div class="cae-panel-header">
          <span>📈 PERFIL DE QUEDA DE TENSÃO ΔV% AO LONGO DO COMPRIMENTO (0 A ${m3.L} M)</span>
          <span style="color:${m3.statusDv === 'critical' ? 'var(--crit-text)' : 'var(--nom-text)'}">ΔV Total = ${fmt(m3.dV_percent, 2)}% (Limite: ${fmt(m3.limDv, 1)}%)</span>
        </div>
        <div class="cae-panel-body">
          <svg viewBox="0 0 480 230" style="width:100%;height:210px;background:#050811;border:1px solid #1e293b;border-radius:4px;">
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="50" y2="190" stroke="#1e293b" stroke-width="1"/>
            <line x1="50" y1="190" x2="450" y2="190" stroke="#1e293b" stroke-width="1"/>
            <text x="25" y="34" fill="#64748b" font-size="9" font-family="monospace">${fmt(maxAxisDv, 1)}%</text>
            <text x="25" y="110" fill="#64748b" font-size="9" font-family="monospace">${fmt(maxAxisDv / 2, 1)}%</text>
            <text x="25" y="194" fill="#64748b" font-size="9" font-family="monospace">0.0%</text>
            <!-- Linha Limite Normativo NBR 5410 (4.0%) -->
            <line x1="50" y1="${limY}" x2="450" y2="${limY}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="440" y="${limY - 5}" text-anchor="end" fill="#ef4444" font-size="9" font-family="monospace">Limite NBR 5410: ${fmt(limDv, 1)}%</text>
            <!-- Linha do Perfil Linear de Queda -->
            <line x1="50" y1="190" x2="420" y2="${endY}" stroke="#38bdf8" stroke-width="2.8"/>
            <!-- Ponto Terminal na Carga -->
            <circle cx="420" cy="${endY}" r="6" fill="${m3.statusDv === 'critical' ? '#ef4444' : '#10b981'}" stroke="#ffffff" stroke-width="2"/>
            <text x="415" y="${endY - 9}" text-anchor="end" fill="${m3.statusDv === 'critical' ? '#ef4444' : '#6ee7b7'}" font-size="10" font-family="monospace" font-weight="bold">
              Carga: ΔV = ${fmt(m3.dV_percent, 2)}% (${m3.statusDv === 'critical' ? '✗ NÃO VÁLIDO' : '✓ VÁLIDO'})
            </text>
            <!-- Rótulos X de Distância -->
            <text x="50" y="208" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="monospace">0 m (Fonte)</text>
            <text x="235" y="208" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="monospace">${fmt(m3.L / 2, 0)} m</text>
            <text x="420" y="208" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="monospace">${fmt(m3.L, 0)} m (Carga)</text>
          </svg>
        </div>
      </div>

      <!-- Curva de Perda Joule ΔP (kW) vs Corrente -->
      <div class="cae-panel">
        <div class="cae-panel-header">
          <span>📊 PERDAS JOULE NA LINHA ΔP (KW) VS CORRENTE DE CARGA</span>
          <span style="color:var(--nom-text)">ΔP Nominal = ${fmt(m3.pj_W / 1000, 2)} kW (${fmt((m3.pj_W / Math.max(1, m3.P)) * 100, 1)}% de P)</span>
        </div>
        <div class="cae-panel-body">
          <svg viewBox="0 0 480 230" style="width:100%;height:210px;background:#050811;border:1px solid #1e293b;border-radius:4px;">
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="50" y2="190" stroke="#1e293b" stroke-width="1"/>
            <line x1="50" y1="190" x2="450" y2="190" stroke="#1e293b" stroke-width="1"/>
            <text x="250" y="212" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace">Corrente Conduzida (A)</text>
            <!-- Curva Quadrática de Perdas Joule (R * I^2) -->
            <path d="M 50 190 Q 200 180 320 110 T 440 35" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
            <!-- Ponto de Operação Nominal Ib -->
            <circle cx="320" cy="110" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.8"/>
            <text x="325" y="102" fill="#fcd34d" font-size="9.5" font-family="monospace" font-weight="bold">Ib = ${fmt(m3.Ib, 1)} A: ΔP = ${fmt(m3.pj_W / 1000, 2)} kW</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- PAINEL 2: FAIXA DE TENSÃO NO BARRAMENTO DA CARGA / RECEPTOR -->
    <div class="cae-panel" style="margin-top:12px;">
      <div class="cae-panel-header">
        <span>🔢 TABELA DE FAIXA DE TENSÃO NO BARRAMENTO DA CARGA (PRODIST MÓDULO 8 / NBR 5410)</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--nom-text)">Tensão Fonte: ${m3.Vll} V | Arranjo: ${m3.cableLabelShort}</span>
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <table class="cae-table">
          <thead>
            <tr>
              <th>Nível de Carregamento</th>
              <th class="text-right">Corrente (A)</th>
              <th class="text-right">Queda de Tensão (V)</th>
              <th class="text-right">Queda Percentual (ΔV%)</th>
              <th class="text-right">Tensão de Linha Recebida</th>
              <th class="text-right">Tensão de Fase Recebida</th>
              <th class="text-right">Classificação PRODIST Módulo 8</th>
            </tr>
          </thead>
          <tbody>
            ${loadRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


// ----------------------------------------------------------------------------
// ABA [4]: FOLHA DE DADOS, TABELAS NORMATIVAS & CATÁLOGOS
// ----------------------------------------------------------------------------

function renderTableTab(m1, m2, m3) {
  const el = document.getElementById('tableTabContent');
  if (state.activeModule === 'trafo1ph') {
    renderTableTabM2(el, m2);
  } else if (state.activeModule === 'feeder') {
    renderTableTabM3(el, m3);
  } else {
    renderTableTabM1(el, m1);
  }
}

function renderTableTabM1(el, m1) {
  const stdRows = STD_POWERS_KVA.map(kva => {
    const isProj = kva === m1.stdKva;
    const estP0 = Math.round(180 * Math.pow(kva / 100, 0.65));
    const estPc = Math.round(1450 * Math.pow(kva / 100, 0.82));
    const estEz = kva <= 150 ? 3.5 : kva <= 500 ? 4.5 : kva <= 1500 ? 5.5 : 6.0;
    return `
      <tr class="${isProj ? 'row-active' : ''}">
        <td><b>${kva} kVA</b> ${isProj ? '<span style="color:var(--nom-text)">★ PADRÃO PROJETO</span>' : ''}</td>
        <td class="text-right">ABNT NBR 5356</td>
        <td class="text-right">${fmt(estEz, 1)}%</td>
        <td class="text-right">${estP0} W</td>
        <td class="text-right">${estPc} W</td>
        <td class="text-right">${fmt(100 - ((estP0 + estPc) / (kva * 1000)) * 100, 2)}%</td>
        <td class="text-right" style="color:var(--blue-light)">${Math.round(kva * 0.95)} L</td>
        <td class="text-right">${Math.round(kva * 4.2)} kg</td>
      </tr>
    `;
  }).join('');

  // Tabela de Rendimento e Regulação (25% a 125% de carga — Cap. 3 WEG DT-11)
  const loadFracs = [0.25, 0.50, 0.75, 1.00, 1.25];
  const effRows = loadFracs.map(b => {
    const calcEta = (pf) => {
      const pOut = b * m1.S_oper * 1000 * pf;
      const pLoss = m1.P0_W + (b * b * m1.Pc_W);
      return (pOut / Math.max(1, pOut + pLoss)) * 100;
    };
    const calcReg = (pf) => {
      const sinPhi = Math.sqrt(Math.max(0, 1 - pf * pf));
      const term1 = b * (m1.ER_pct * pf + m1.EX_pct * sinPhi);
      const term2 = Math.pow(b * (m1.EX_pct * pf - m1.ER_pct * sinPhi), 2) / 200;
      return term1 + term2;
    };
    const isNom = Math.abs(b - 1.0) < 0.01;
    return `
      <tr class="${isNom ? 'row-active' : ''}">
        <td><b>${Math.round(b * 100)}%</b> ${isNom ? '<span style="color:var(--nom-text)">(Nominal)</span>' : ''}</td>
        <td class="text-right">${fmt(calcEta(0.80), 2)}%</td>
        <td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(calcEta(0.92), 2)}%</td>
        <td class="text-right">${fmt(calcEta(1.00), 2)}%</td>
        <td class="text-right" style="color:var(--blue-light)">${fmt(calcReg(0.80), 2)}%</td>
        <td class="text-right">${fmt(calcReg(1.00), 2)}%</td>
      </tr>
    `;
  }).join('');

  const iccAT = (m1.I1_line / (m1.Ez_pct / 100));
  const iccBT = (m1.I2_line / (m1.Ez_pct / 100));
  const bMaxEff = Math.sqrt(m1.P0_W / Math.max(1, m1.Pc_W)) * 100;

  el.innerHTML = `
    <div class="cae-panel">
      <div class="cae-panel-header">
        <span>📋 [M1] FOLHA DE DADOS TÉCNICOS — TRANSFORMADOR TRIFÁSICO A ÓLEO (PADRÃO WEG DT-11 / NBR 5356 / NBR 5440)</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
          <button type="button" class="btn-action btn-slate" onclick="window.print()">🖨️ Imprimir A4</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <!-- SEÇÃO 1 E 2: IDENTIFICAÇÃO ELÉTRICA E ESTRUTURA MAGNÉTICA DO NÚCLEO -->
        <div class="cae-grid-2" style="margin-bottom:12px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              1. CARACTERÍSTICAS ELÉTRICAS GERAIS (WEG DT-11 &amp; NBR 5356)
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Potência Operacional Calculada (S_3Ø)</td><td class="text-right"><b>${fmt(m1.S_3ph, 2)} kVA</b></td></tr>
                <tr><td>Potência Direta por Fase (U1 × I1)</td><td class="text-right"><b>${fmt(m1.S_direct, 2)} kVA</b></td></tr>
                <tr><td>Potência Nominal Padronizada ABNT</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(m1.stdKva, 0)} kVA</td></tr>
                <tr><td>Número de Fases / Frequência</td><td class="text-right">3 Fases / ${m1.f} Hz</td></tr>
                <tr><td>Grupo de Ligação Vetorial (Tab. 2.6 DT-11)</td><td class="text-right"><b>${m1.vec}</b></td></tr>
                <tr><td>Refrigeração / Líquido Isolante Indicado</td><td class="text-right" style="color:var(--blue-light)"><b>ONAN — ${m1.oilSpec.shortName}</b></td></tr>
                <tr><td>Elevação Temp. Enrolamento / Topo Óleo</td><td class="text-right">55 °C (Média) / 65 °C (Pto. Quente) / 50 °C (Óleo)</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              2. DIMENSIONAMENTO DO NÚCLEO E ESPIRAS (CAP. 5 DT-11)
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Área Bruta / Efetiva da Coluna (Ac / Sm)</td><td class="text-right"><b>${fmt(m1.Ac, 1)} cm² / ${fmt(m1.Sm, 1)} cm²</b> (Ke=${m1.Ke})</td></tr>
                <tr><td>Área da Janela do Núcleo (Aj)</td><td class="text-right"><b>${fmt(m1.Aj, 1)} cm²</b> (Diâm. Circunscrito: ${m1.diamCoreMm} mm)</td></tr>
                <tr><td>Capacidade Máxima da Estrutura Atual</td><td class="text-right" style="color:${m1.statusCore === 'critical' ? 'var(--crit-text)' : 'var(--nom-text)'};font-weight:700">${fmt(m1.S_core_max, 2)} kVA (Máx. ${fmtInt(m1.maxTurnsAT)} esp AT)</td></tr>
                <tr><td>Seção Mínima Ideal p/ a Carga Atual</td><td class="text-right"><b>Ac ≈ ${m1.Ac_ideal} cm²</b> (Janela Aj ≈ ${m1.Aj_ideal} cm²)</td></tr>
                <tr><td>Chapa Magnética / Indução (Bmáx)</td><td class="text-right">Aço Silício GO / <b>${fmt(m1.Bm, 2)} T</b></td></tr>
                <tr><td>Relação Volts/Espira (V/e) e Espiras/Volt</td><td class="text-right"><b>${fmt(m1.voltsPerTurn, 2)} V/esp</b> (${fmt(m1.turnsPerVolt, 3)} esp/V)</td></tr>
                <tr><td>Ocupação Física da Janela / Densidade J</td><td class="text-right">Ocupação: <b>${fmt(m1.windowFillPct, 1)}%</b> | J = <b>${fmt(m1.J, 1)} A/mm²</b></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SEÇÃO 3: ESPECIFICAÇÃO DOS ENROLAMENTOS, CAMADAS E NBI (TABELA 2.5 ABNT) -->
        <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
          3. ESPECIFICAÇÃO TÉCNICA DOS ENROLAMENTOS, CAMADAS, CONDUTORES E ISOLAMENTO (TABELA 2.5 ABNT / SEÇÃO 7.1.5 DT-11)
        </div>
        <div style="margin-bottom:12px;border:1px solid #1e293b;border-radius:4px;overflow-x:auto;">
          <table class="cae-table">
            <thead>
              <tr>
                <th>Parâmetro Técnico de Bobinagem e Isolamento</th>
                <th class="text-right">Enrolamento Primário (Entrada / AT — Externo)</th>
                <th class="text-right">Enrolamento Secundário (Saída / BT — Interno)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tensão Nominal de Linha (UL) / Fase-Bobina (Uf)</td>
                <td class="text-right"><b>${fmtInt(m1.V1_line)} V (${fmt(m1.v1Kv, 1)} kV)</b> / ${fmtInt(m1.V1_phase)} V</td>
                <td class="text-right"><b>${fmt(m1.V2_line, 0)} V</b> / ${fmt(m1.V2_phase, 1)} V</td>
              </tr>
              <tr>
                <td>Corrente Nominal de Linha (IL) / Fase-Bobina (If)</td>
                <td class="text-right"><b>${fmt(m1.I1_line, 2)} A</b> / ${fmt(m1.I1_coil, 2)} A</td>
                <td class="text-right"><b>${fmt(m1.I2_line, 1)} A</b> / ${fmt(m1.I2_coil, 1)} A</td>
              </tr>
              <tr>
                <td>Número de Espiras por Fase (N1, N2)</td>
                <td class="text-right" style="color:var(--blue-light);font-weight:700">${fmtInt(m1.N1_nom)} espiras (Projeto ideal: ${fmtInt(m1.N1_des)} esp)</td>
                <td class="text-right" style="color:var(--nom-text);font-weight:700">${fmtInt(m1.N2_nom)} espiras (Projeto ideal: ${fmtInt(m1.N2_des)} esp)</td>
              </tr>
              <tr>
                <td>Seção do Condutor e Bitola Comercial (${m1.condMat.toUpperCase()})</td>
                <td class="text-right"><b>${fmt(m1.s1_mm2, 2)} mm²</b> (${m1.cond1.short})</td>
                <td class="text-right"><b>${fmt(m1.s2_mm2, 2)} mm²</b> (${m1.cond2.short})</td>
              </tr>
              <tr>
                <td>Arquitetura de Camadas e Espessura Radial</td>
                <td class="text-right">${m1.numLayersAT} camadas (${m1.turnsPerLayerAT} esp/cam) | Radial: ${fmt(m1.radialAT_mm, 1)} mm</td>
                <td class="text-right">${m1.numLayersBT} camadas (${m1.turnsPerLayerBT} esp/cam) | Radial: ${fmt(m1.radialBT_mm, 1)} mm</td>
              </tr>
              <tr>
                <td>Diâmetro Médio (Dm) / Comprimento Total de Fio (3Ø)</td>
                <td class="text-right">Dm = ${fmtInt(m1.meanDiamAT_mm)} mm | Comp. 3Ø = <b>${fmt(m1.totalLenAT_m, 1)} m</b> (${fmt(m1.massCondAT_kg, 1)} kg)</td>
                <td class="text-right">Dm = ${fmtInt(m1.meanDiamBT_mm)} mm | Comp. 3Ø = <b>${fmt(m1.totalLenBT_m, 1)} m</b> (${fmt(m1.massCondBT_kg, 1)} kg)</td>
              </tr>
              <tr>
                <td>Resistência Ôhmica por Fase a 20 °C / Corrigida a 75 °C</td>
                <td class="text-right">R₂₀ = ${fmt(m1.R20_AT, 3)} Ω → <b>R₇₅°C = ${fmt(m1.R75_AT, 3)} Ω</b></td>
                <td class="text-right">R₂₀ = ${fmt(m1.R20_BT * 1000, 2)} mΩ → <b>R₇₅°C = ${fmt(m1.R75_BT * 1000, 2)} mΩ</b></td>
              </tr>
              <tr>
                <td>Classe de Isolamento (Um) / Impulso Atmosférico NBI (Tab. 2.5)</td>
                <td class="text-right" style="color:var(--warn-text)"><b>Um = ${m1.insPri.um}</b> | NBI Pleno: <b>${m1.insPri.nbiFull}</b> (Cortado: ${m1.insPri.nbiChopped})</td>
                <td class="text-right"><b>Um = ${m1.insSec.um}</b> | NBI: ${m1.insSec.nbiFull}</td>
              </tr>
              <tr>
                <td>Tensão Aplicada à Frequência Industrial (60 Hz / 1 min)</td>
                <td class="text-right"><b>${m1.insPri.applied} eficaz</b></td>
                <td class="text-right"><b>${m1.insSec.applied} eficaz</b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SEÇÃO 4 E 5: VALORES GARANTIDOS DE DESEMPENHO (75 °C) + TABELA DE RENDIMENTO E REGULAÇÃO -->
        <div class="cae-grid-2" style="margin-bottom:12px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              4. VALORES GARANTIDOS DE DESEMPENHO A 75 °C (TABELAS 3.1 / 3.2 DT-11)
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Perdas em Vazio / no Ferro (P0)</td><td class="text-right"><b>${fmtInt(m1.P0_W)} W</b></td></tr>
                <tr><td>Perdas em Carga nos Enrolamentos a 75 °C (Pk)</td><td class="text-right"><b>${fmtInt(m1.Pc_W)} W</b></td></tr>
                <tr><td>Perdas Totais à Plena Carga (Pt = P0 + Pk)</td><td class="text-right" style="color:#fff;font-weight:700">${fmtInt(m1.Pt_W)} W</td></tr>
                <tr><td>Impedância de Curto-Circuito a 75 °C (Ez%)</td><td class="text-right"><b>${fmt(m1.Ez_pct, 2)}%</b> (ER: ${fmt(m1.ER_pct, 2)}% | EX: ${fmt(m1.EX_pct, 2)}%)</td></tr>
                <tr><td>Corrente de Excitação em Vazio (I0%)</td><td class="text-right">${fmt(m1.i0_pct, 2)}% (${fmt(m1.I1_line * m1.i0_pct / 100, 2)} A)</td></tr>
                <tr><td>Corrente de Curto-Circuito Simétrica (Icc — 2s)</td><td class="text-right">AT: <b>${fmt(iccAT, 1)} A</b> | BT: <b>${fmt(iccBT, 1)} A</b></td></tr>
                <tr><td>Ponto de Rendimento Máximo (b = √(P0 / Pk))</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(bMaxEff, 1)}% da carga nominal</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              5. RENDIMENTO (η%) E REGULAÇÃO (R%) POR FAIXA DE CARGA (CAP. 3 DT-11)
            </div>
            <table class="cae-table">
              <thead>
                <tr>
                  <th>Carga</th>
                  <th class="text-right">η (fp=0,8)</th>
                  <th class="text-right">η (fp=0,92)</th>
                  <th class="text-right">η (fp=1,0)</th>
                  <th class="text-right">Reg (0,8)</th>
                  <th class="text-right">Reg (1,0)</th>
                </tr>
              </thead>
              <tbody>
                ${effRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- SEÇÃO 6 E 7: ÓLEO ISOLANTE, TANQUE, BUCHAS E ACESSÓRIOS PADRONIZADOS WEG DT-11 -->
        <div class="cae-grid-2" style="margin-bottom:12px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              6. ÓLEO ISOLANTE, TANQUE, BUCHAS E MASSAS (CAP. 5 &amp; 7.3 DT-11)
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Líquido Isolante Indicado &amp; Norma</td><td class="text-right" style="color:var(--blue-light)"><b>${m1.oilSpec.shortName}</b> (${m1.oilSpec.norm})</td></tr>
                <tr><td>Volume Total de Óleo / Massa Líquida</td><td class="text-right"><b>${fmtInt(m1.volOilTotal_L)} L / ${fmtInt(m1.massOilTotal_kg)} kg</b> (+5% Compra: ${m1.volPurchase_L} L)</td></tr>
                <tr><td>Divisão de Óleo (Tanque / Radiadores / Conserv.)</td><td class="text-right">${m1.volOilTankFree_L} L / ${m1.volOilRadiators_L} L / ${m1.volOilConservator_L} L (ΔV: +${fmt(m1.volExpansion_L, 1)} L)</td></tr>
                <tr><td>Rigidez Dielétrica Tratada / Ponto de Fulgor</td><td class="text-right">${m1.oilSpec.dielectricTreated} / Fulgor ${m1.oilSpec.flashPoint}</td></tr>
                <tr><td>Buchas AT (NBR 5034) / Buchas BT (NBR 5437)</td><td class="text-right">AT: Classe ${m1.insPri.um} / BT: 1,2 kV (${fmtInt(m1.I2_line)} A)</td></tr>
                <tr><td>Dimensões Externas 3Ø (C × L × H)</td><td class="text-right"><b>${m1.extLen_mm} × ${m1.extWid_mm} × ${m1.extHei_mm} mm</b></td></tr>
                <tr><td>Massas (Parte Ativa / Óleo / Tanque / Total)</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${m1.massActiveTotal_kg} / ${m1.massOilTotal_kg} / ${m1.massTank_kg} / <b>${m1.massTotalTrafo_kg} kg</b></td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              7. ACESSÓRIOS PADRONIZADOS (TAB. 5.6 DT-11) E ENSAIOS DE ROTINA (CAP. 7)
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Indicador Magnético de Nível de Óleo</td><td class="text-right" style="color:var(--nom-text)">✓ Incluso (Padrão ABNT NBR 5440 / 5356)</td></tr>
                <tr><td>Termômetro de Óleo c/ Contatos + Poço Termométrico</td><td class="text-right" style="color:var(--nom-text)">${m1.S_oper >= 75 ? '✓ Incluso com 2 contatos NA/NF' : '✓ Poço Termométrico Padrão'}</td></tr>
                <tr><td>Comutador de Derivações (Taps) Sem Tensão</td><td class="text-right" style="color:var(--nom-text)">✓ Acionamento externo bloqueável (5/3 pos.)</td></tr>
                <tr><td>Dispositivo de Alívio de Pressão / Buchholz</td><td class="text-right" style="color:var(--nom-text)">${m1.hasConservator ? '✓ Relé Buchholz 2 bóias + Tubo Explosão' : '✓ Válvula de Alívio de Sobrepressão'}</td></tr>
                <tr><td>Válvula de Drenagem, Amostragem e Filtragem</td><td class="text-right" style="color:var(--nom-text)">✓ Registros superior e inferior + Aterramento</td></tr>
                <tr><td>Ensaios Elétricos de Rotina (Seção 7.1 DT-11)</td><td class="text-right">✓ Relação, Polaridade, R75°C, P0/I0, Pk/Ez, Aplicada/Induzida</td></tr>
                <tr><td>Ensaios do Óleo e DGA (Folha 01 WT / Seção 7.3)</td><td class="text-right">✓ Rigidez ≥ 50 kV, H₂O ≤ 15 ppm, DGA (C₂H₂ = 0 ppm)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
          8. TABELA DE LINHA PADRONIZADA WEG DT-11 (15 A 3000 kVA — REFERÊNCIA CONSTRUTIVA)
        </div>
        <div style="max-height:220px;overflow-y:auto;border:1px solid #1e293b;border-radius:4px;">
          <table class="cae-table">
            <thead>
              <tr>
                <th>Potência kVA</th>
                <th class="text-right">Norma</th>
                <th class="text-right">Ez%</th>
                <th class="text-right">Perdas P0</th>
                <th class="text-right">Perdas Pk</th>
                <th class="text-right">Rendimento</th>
                <th class="text-right">Volume Óleo</th>
                <th class="text-right">Massa Total</th>
              </tr>
            </thead>
            <tbody>
              ${stdRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderTableTabM2(el, m2) {
  // Matriz de Fios AWG 10 a 26 destacando primário e secundário
  const awgRows = AWG_TABLE.slice(13).map(w => {
    const isPri = w.gauge === m2.awg1.gauge;
    const isSec = w.gauge === m2.awg2.gauge;
    const isHighlight = isPri || isSec;
    const i_adm = w.area * m2.J;

    return `
      <tr class="${isHighlight ? 'row-active' : ''}">
        <td>
          <b>${w.gauge}</b>
          ${isPri ? '<span style="color:var(--blue-light);font-weight:700;margin-left:6px;">★ PRIMÁRIO (N1)</span>' : ''}
          ${isSec ? '<span style="color:var(--nom-text);font-weight:700;margin-left:6px;">★ SECUNDÁRIO (N2)</span>' : ''}
        </td>
        <td class="text-right">${fmt(w.d_mm, 3)} mm</td>
        <td class="text-right">${fmt(w.d_mm * 1.08, 3)} mm</td>
        <td class="text-right"><b>${fmt(w.area, 3)} mm²</b></td>
        <td class="text-right">${fmt(w.r_ohm_km, 2)} Ω/km</td>
        <td class="text-right">${fmt(w.r_ohm_km * 1.216, 2)} Ω/km</td>
        <td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(i_adm, 2)} A</td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="cae-panel">
      <div class="cae-panel-header">
        <span>📋 [M2] TABELA NORMATIVA DE FIOS AWG (10 A 26 AWG) &amp; FOLHA TÉCNICA DO TRAFO MONOFÁSICO</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
          <button type="button" class="btn-action btn-slate" onclick="window.print()">🖨️ Imprimir A4</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <div class="cae-grid-2" style="margin-bottom:12px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              ESPECIFICAÇÃO DE BOBINAMENTO E NÚCLEO E-I
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Potência Aparente Secundária</td><td class="text-right"><b>${fmt(m2.S, 1)} VA</b></td></tr>
                <tr><td>Tensão Primária / Secundária</td><td class="text-right">${fmt(m2.V1, 0)} V → ${fmt(m2.V2, 0)} V</td></tr>
                <tr><td>Corrente Primária (I1) / Secundária (I2)</td><td class="text-right"><b>${fmt(m2.I1, 2)} A / ${fmt(m2.I2, 2)} A</b></td></tr>
                <tr><td>Espiras Primárias (N1)</td><td class="text-right"><b>${fmtInt(m2.N1)} espiras</b> (${m2.awg1.gauge})</td></tr>
                <tr><td>Espiras Secundárias (N2)</td><td class="text-right"><b>${fmtInt(m2.N2)} espiras</b> (${m2.awg2.gauge})</td></tr>
                <tr><td>Perna Central (a) × Empilhamento (b)</td><td class="text-right"><b>${m2.a_mm} mm × ${m2.b_mm} mm</b></td></tr>
                <tr><td>Seção Geométrica / Magnética</td><td class="text-right">${fmt(m2.Sg, 2)} cm² / <b>${fmt(m2.Sm, 2)} cm²</b></td></tr>
                <tr><td>Indução Magnética Operacional (Bm)</td><td class="text-right"><b>${fmt(m2.Bm, 2)} T</b> (GNO)</td></tr>
                <tr><td>Fator de Ocupação da Janela (Ku)</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(m2.Ku_percent, 1)} % (≤ 42%)</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              RESISTÊNCIAS, PERDAS E PESOS DO TRAFO 1Ø
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Resistência Ôhmica Primária (R1)</td><td class="text-right">${fmt(m2.R1_ohm, 3)} Ω</td></tr>
                <tr><td>Resistência Ôhmica Secundária (R2)</td><td class="text-right">${fmt(m2.R2_ohm, 3)} Ω</td></tr>
                <tr><td>Perdas no Cobre a Plena Carga (Pcu)</td><td class="text-right">${fmt(m2.Pcu_W, 2)} W</td></tr>
                <tr><td>Perdas Magnéticas no Ferro (Pfe)</td><td class="text-right">${fmt(m2.Pfe_W, 2)} W</td></tr>
                <tr><td>Perdas Totais Dissipadas (Pt)</td><td class="text-right" style="color:#fff;font-weight:700">${fmt(m2.Ptot_W, 2)} W</td></tr>
                <tr><td>Rendimento Elétrico (η)</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(m2.rendimento_percent, 2)} %</td></tr>
                <tr><td>Regulação de Tensão (ΔV)</td><td class="text-right"><b>${fmt(m2.reg_percent, 2)} %</b></td></tr>
                <tr><td>Peso do Ferro Laminado / Cobre</td><td class="text-right">${fmt(m2.pesoFerro_kg, 2)} kg / ${fmt(m2.pesoCobre_kg, 2)} kg</td></tr>
                <tr><td>Peso Total Montado com Carretel</td><td class="text-right" style="color:var(--nom-text);font-weight:700">${fmt(m2.pesoTotal_kg, 2)} kg</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
          TABELA NORMATIVA COMPLETA DE FIOS DE COBRE ESMALTADOS (10 A 26 AWG)
        </div>
        <div style="max-height:260px;overflow-y:auto;border:1px solid #1e293b;border-radius:4px;">
          <table class="cae-table">
            <thead>
              <tr>
                <th>Calibre AWG</th>
                <th class="text-right">Diâmetro Nu</th>
                <th class="text-right">Diâmetro Esmaltado</th>
                <th class="text-right">Seção Cobre</th>
                <th class="text-right">Resistência (20°C)</th>
                <th class="text-right">Resistência (75°C)</th>
                <th class="text-right">Capacidade (J=${m2.J} A/mm²)</th>
              </tr>
            </thead>
            <tbody>
              ${awgRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderTableTabM3(el, m3) {
  // Catálogo Completo de Cabos de Cobre NBR 5410 de 1,5 a 300 mm²
  const cableRows = m3.evaluatedCables.map(c => {
    const isSelected = c.section === m3.selectedCable.section;
    const totalIzBank = c.Iz_real;
    const isCompliant = totalIzBank >= m3.Ib;

    return `
      <tr class="${isSelected ? 'row-active' : ''}">
        <td>
          <b>${c.section} mm²</b> <span class="mono" style="color:var(--text-muted)">(${c.awg})</span>
          ${isSelected ? `<span style="color:var(--nom-text);font-weight:700;margin-left:6px;">★ SELECIONADO (${m3.nParallel}×/fase)</span>` : ''}
        </td>
        <td class="text-right">${c.iz_b1_3c} A</td>
        <td class="text-right" style="color:var(--nom-text);font-weight:700">${c.iz_xlpe_3c} A</td>
        <td class="text-right">${c.iz_tray_3c} A</td>
        <td class="text-right">${fmt(c.r_cc_20, 3)}</td>
        <td class="text-right">${fmt(c.r_xlpe_km, 3)}</td>
        <td class="text-right">${fmt(c.x_ohm_km, 3)}</td>
        <td class="text-right">${fmt(c.d_ext, 1)} mm</td>
        <td class="text-right">${c.mass_kg_km} kg</td>
        <td class="text-right" style="color:${isCompliant ? 'var(--nom-text)' : 'var(--crit-text)'};font-weight:700">
          ${fmt(totalIzBank, 1)} A
        </td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="cae-panel">
      <div class="cae-panel-header">
        <span>📋 [M3] CATÁLOGO COMPLETO DE CABOS DE COBRE NBR 5410 (1,5 A 300 MM² — PADRÃO PRYSMIAN/COBRECOM)</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
          <button type="button" class="btn-action btn-slate" onclick="window.print()">🖨️ Imprimir A4</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <div class="cae-grid-2" style="margin-bottom:12px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              DADOS DO CIRCUITO E CONDUÇÃO (NBR 5410)
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Potência Ativa da Carga (P)</td><td class="text-right"><b>${fmt(m3.P_kW, 2)} kW (${fmtInt(m3.P)} W)</b></td></tr>
                <tr><td>Tensão de Linha / Fases</td><td class="text-right">${m3.Vll} V (${m3.phases}) | cosφ = ${m3.fp}</td></tr>
                <tr><td>Corrente de Projeto (Ib)</td><td class="text-right" style="color:var(--blue-light);font-weight:700"><b>${fmt(m3.Ib, 1)} A</b></td></tr>
                <tr><td>Corrente Corrigida Requerida (Iz_req)</td><td class="text-right"><b>${fmt(m3.Iz_req, 1)} A</b> (FCA=${m3.fca}, FCT=${m3.fct})</td></tr>
                <tr><td>Arranjo de Condutores por Fase</td><td class="text-right" style="color:var(--nom-text);font-weight:700"><b>${m3.cableLabelShort}</b></td></tr>
                <tr><td>Seção Total de Cobre por Fase</td><td class="text-right"><b>${fmtInt(m3.totalSec_mm2)} mm²/fase</b></td></tr>
                <tr><td>Ampacidade Real Corrigida (Iz')</td><td class="text-right" style="color:var(--nom-text);font-weight:700"><b>${fmt(m3.Iz_real, 1)} A</b> (≥ Ib)</td></tr>
                <tr><td>Disjuntor de Proteção WEG</td><td class="text-right"><b>${m3.breakerModel} (In = ${m3.In} A)</b></td></tr>
                <tr><td>Coordenação de Proteção</td><td class="text-right" style="color:${m3.coordOk ? 'var(--nom-text)' : 'var(--crit-text)'};font-weight:700">${m3.coordOk ? '✓ CONFORME (Ib ≤ In ≤ Iz\')' : '✗ NÃO COORDENADO'}</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
              QUEDA DE TENSÃO, PERDAS JOULE E BARRAMENTOS
            </div>
            <table class="cae-table">
              <tbody>
                <tr><td>Comprimento do Circuito (L)</td><td class="text-right"><b>${m3.L} metros</b></td></tr>
                <tr><td>Tipo de Isolação Adotada</td><td class="text-right">${m3.insulLabel}</td></tr>
                <tr><td>Queda de Tensão na Linha (ΔV)</td><td class="text-right"><b>${fmt(m3.dV_volts, 2)} Volts</b></td></tr>
                <tr><td>Queda de Tensão Percentual (ΔV%)</td><td class="text-right" style="color:${m3.statusDv === 'critical' ? 'var(--crit-text)' : 'var(--nom-text)'};font-weight:700"><b>${fmt(m3.dV_percent, 2)} %</b> (Limite: ${fmt(m3.limDv, 1)}%)</td></tr>
                <tr><td>Perdas Ôhmicas Joule (ΔP)</td><td class="text-right"><b>${fmt(m3.pj_W / 1000, 2)} kW</b> (${fmt((m3.pj_W / Math.max(1, m3.P)) * 100, 1)}% de P)</td></tr>
                <tr><td>Densidade de Corrente nos Cabos (J)</td><td class="text-right">${fmt(m3.J_cabo, 2)} A/mm²</td></tr>
                <tr><td>Barramento de Cobre QGBT Sugerido</td><td class="text-right" style="color:var(--blue-light)"><b>${m3.busBarSpec}</b></td></tr>
                <tr><td>Status Global do Alimentador</td><td class="text-right" style="color:${m3.globalStatus === 'critical' ? 'var(--crit-text)' : 'var(--nom-text)'};font-weight:700">${m3.globalStatus === 'critical' ? '✗ NÃO VÁLIDO' : '✓ VÁLIDO (NBR 5410)'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--blue-light);margin-bottom:6px;">
          CATÁLOGO COMPLETO DE CABOS DE COBRE DE 1,5 MM² A 300 MM² (NBR 5410 / NBR NM 280)
        </div>
        <div style="max-height:260px;overflow-y:auto;border:1px solid #1e293b;border-radius:4px;">
          <table class="cae-table">
            <thead>
              <tr>
                <th>Seção Nominal</th>
                <th class="text-right">B1 PVC (70°C)</th>
                <th class="text-right">B1 XLPE (90°C)</th>
                <th class="text-right">Leito F (XLPE)</th>
                <th class="text-right">Rcc 20°C (Ω/km)</th>
                <th class="text-right">Rca 90°C (Ω/km)</th>
                <th class="text-right">X 60Hz (Ω/km)</th>
                <th class="text-right">Diâmetro Ext.</th>
                <th class="text-right">Massa Linear</th>
                <th class="text-right">Capacidade Banco (${m3.nParallel}×)</th>
              </tr>
            </thead>
            <tbody>
              ${cableRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// ABA [5]: FORMA DE CÁLCULO ANALÍTICO (MEMORIAL PASSO A PASSO AUDITÁVEL)
// ----------------------------------------------------------------------------

function renderMemorialTab(m1, m2, m3) {
  const el = document.getElementById('memorialTabContent');
  if (state.activeModule === 'trafo1ph') {
    renderMemorialTabM2(el, m2);
  } else if (state.activeModule === 'feeder') {
    renderMemorialTabM3(el, m3);
  } else {
    renderMemorialTabM1(el, m1);
  }
}

function renderMemorialTabM1(el, m1) {
  const steps = [
    {
      step: '01. Capacidade Máxima de Potência e Espiras da Estrutura do Núcleo',
      formula: 'S_max = 3 × 2,22 × f × Bm × J × Ku × Sm × Aj × 10⁻⁸   |   N1_max = (Aj × 100 × Ku) / (2 × s1)',
      subst: `Sm = 0,95 × ${fmt(m1.Ac, 1)} = ${fmt(m1.Sm, 1)} cm² | Aj = ${fmt(m1.Aj, 1)} cm² | Bm = ${fmt(m1.Bm, 2)} T | J = ${fmt(m1.J, 1)} A/mm²`,
      result: `Cap. Máx. Estrutura = ${fmt(m1.S_core_max, 2)} kVA | Máx. Espiras AT na Janela = ${fmtInt(m1.maxTurnsAT)} esp (Ideal p/ carga: Ac ≈ ${m1.Ac_ideal} cm²)`
    },
    {
      step: '02. Potência Operacional Trifásica e Direta (Entrada 24 kV → Saída 380 V)',
      formula: 'S_3Ø = (√3 × U1L × I1L) / 1000   |   S_direto = (U1L × I1L) / 1000',
      subst: `S_3Ø = (1,732 × ${fmtInt(m1.V1_line)} × ${fmt(m1.I1_line, 1)}) / 1000 | S_sec = (1,732 × ${fmt(m1.V2_line, 0)} × ${fmt(m1.I2_line, 1)}) / 1000`,
      result: `S_3Ø = ${fmt(m1.S_3ph, 2)} kVA | S_direto (U×I) = ${fmt(m1.S_direct, 2)} kVA | Padrão ABNT = ${fmt(m1.stdKva, 0)} kVA`
    },
    {
      step: '03. Equação Fundamental de Volts/Espira e Número de Espiras (N1, N2)',
      formula: 'V/e = 4,44 × f × Bm × Sm × 10⁻⁴   |   N1 = U1f / (V/e)   |   N2 = U2f / (V/e)',
      subst: `V/e = 4,44 × 60 × ${fmt(m1.Bm, 2)} × ${fmt(m1.Sm, 1)} × 10⁻⁴ = ${fmt(m1.voltsPerTurn, 2)} V/esp (${fmt(m1.turnsPerVolt, 3)} esp/V)`,
      result: `Na área atual (${fmt(m1.Ac, 0)} cm²): N1 = ${fmtInt(m1.N1_nom)} esp, N2 = ${fmtInt(m1.N2_nom)} esp | No núcleo ideal (${m1.Ac_design} cm²): N1 = ${fmtInt(m1.N1_des)} esp, N2 = ${fmtInt(m1.N2_des)} esp`
    },
    {
      step: '04. Seção dos Condutores, Camadas e Resistências R75°C (Seção 7.1.5 DT-11)',
      formula: 's1 = I1f / J   |   s2 = I2f / J   |   R75°C = R20°C × (235 + 75) / (235 + 20)',
      subst: `s1 = ${fmt(m1.I1_coil, 2)} / ${fmt(m1.J, 1)} = ${fmt(m1.s1_mm2, 2)} mm² | s2 = ${fmt(m1.I2_coil, 1)} / ${fmt(m1.J, 1)} = ${fmt(m1.s2_mm2, 1)} mm²`,
      result: `AT: ${m1.numLayersAT} cam. (${fmt(m1.totalLenAT_m, 1)} m, R75°C = ${fmt(m1.R75_AT, 3)} Ω) | BT: ${m1.numLayersBT} cam. (${fmt(m1.totalLenBT_m, 1)} m, R75°C = ${fmt(m1.R75_BT * 1000, 2)} mΩ)`
    },
    {
      step: '05. Indicação Normativa do Tipo de Óleo Isolante (Tabelas 5.4, 5.5 e Seção 7.3 DT-11)',
      formula: 'U1 > 15 kV → Óleo Mineral Tipo A (Naftênico - CNP 06/85) | Ambiental → FR3 | Abrigado → Silicone',
      subst: `U1 = ${fmt(m1.v1Kv, 1)} kV (${m1.insPri.um}) | Ambiente = ${m1.env} | Ta = ${m1.Ta} °C`,
      result: `${m1.oilSpec.shortName} — Densidade = ${fmt(m1.oilSpec.density20C, 3)} kg/L | Fulgor ${m1.oilSpec.flashPoint} | Rigidez Tratada ${m1.oilSpec.dielectricTreated}`
    },
    {
      step: '06. Balanço Volumétrico do Tanque, Radiadores e Quantidade de Óleo (Litros e kg)',
      formula: 'V_total = (V_bruto_tq − V_parte_ativa) + V_radiadores + V_conservador   |   ΔV = V_total × β × ΔT',
      subst: `V_tq = ${m1.volOilTankFree_L} L (Desloc. Ativa = ${fmt(m1.volActiveDisplaced_L, 1)} L) + V_rad (${m1.totalFins} aletas) = ${m1.volOilRadiators_L} L + V_cons = ${m1.volOilConservator_L} L`,
      result: `Volume Nominal = ${fmtInt(m1.volOilTotal_L)} Litros (${fmtInt(m1.massOilTotal_kg)} kg) | Dilatação ΔV = +${fmt(m1.volExpansion_L, 1)} L | Compra (+5%) = ${m1.volPurchase_L} L`
    },
    {
      step: '07. Tamanho Físico Externo do Transformador e Pesos (Catálogo WEG DT-11)',
      formula: 'C × L × H (Escalonamento Volumétrico WEG DT-11 S^0,28)   |   M_total = M_ativa + M_óleo + M_tanque',
      subst: `Ref. WEG ${m1.catDim.kva} kVA (${m1.catDim.c_mm}×${m1.catDim.l_mm}×${m1.catDim.h_mm} mm) | Parte Ativa = ${fmtInt(m1.massActiveTotal_kg)} kg + Óleo = ${fmtInt(m1.massOilTotal_kg)} kg + Tanque = ${fmtInt(m1.massTank_kg)} kg`,
      result: `3Ø a Óleo: C=${m1.extLen_mm} × L=${m1.extWid_mm} × H=${m1.extHei_mm} mm | Peso Total = ${fmtInt(m1.massTotalTrafo_kg)} kg (Pegada: ${fmt(m1.footprint_m2, 2)} m²)`
    },
    {
      step: '08. Rendimento a Plena Carga, Regulação e Impedância de Curto-Circuito (NBR 5356)',
      formula: 'η = (P_saida / (P_saida + P0 + Pk)) × 100   |   Ez% = √(ER%² + EX%²)',
      subst: `P0 = ${m1.P0_W} W | Pk (a 75°C) = ${m1.Pc_W} W | Pt = ${m1.Pt_W} W | ER = ${fmt(m1.ER_pct, 2)}% | EX = ${fmt(m1.EX_pct, 2)}%`,
      result: `Rendimento η = ${fmt(m1.eff_pct, 2)}% | Impedância Ez = ${fmt(m1.Ez_pct, 2)}% | Regulação ΔV = ${fmt(m1.reg_pct, 2)}% (Conforme NBR 5356)`
    }
  ];

  el.innerHTML = renderMemorialHtml('MEMORIAL DE CÁLCULO ANALÍTICO AUDITÁVEL (TRANSFORMADOR TRIFÁSICO A ÓLEO WEG DT-11)', steps);
}

function renderMemorialTabM2(el, m2) {
  const steps = [
    {
      step: '01. Potência Aparente e Correntes Nominais Primária e Secundária',
      formula: 'Ps = V2 × I2   |   Pp = Ps / η   |   I1 = Pp / V1   |   I2 = Ps / V2',
      subst: `Ps = ${m2.V2} V × ${fmt(m2.I2, 2)} A = ${fmt(m2.S, 1)} VA | Pp = ${fmt(m2.S, 1)} / 0,92 = ${fmt(m2.S / 0.92, 1)} W | V1 = ${m2.V1} V`,
      result: `I1 = ${fmt(m2.I1, 2)} A | I2 = ${fmt(m2.I2, 2)} A | Relação de Transformação a = ${fmt(m2.V1 / m2.V2, 2)} : 1`
    },
    {
      step: '02. Dimensionamento da Seção Geométrica e Magnética do Núcleo',
      formula: 'Sgeo = 1,1 × √(Pp / (f / 50))   |   Sm = Sgeo × Ke (Fator de Empilhamento)',
      subst: `Sgeo = 1,15 × √(${fmt(m2.S, 1)} / (60 × ${m2.Bm} × (${m2.J}/3))) = ${fmt(m2.Sg, 2)} cm² | Ke = ${m2.Ke}`,
      result: `Seção Magnética Líquida Sm = ${fmt(m2.Sm, 2)} cm² | Perna central a = ${m2.a_mm} mm × Empilhamento b = ${m2.b_mm} mm`
    },
    {
      step: '03. Equação Fundamental da Indução Eletromagnética e Volts por Espira',
      formula: 'Ve = 4,44 × f × Bm × Sm × 10⁻⁴ [V/espira]   |   Esp/Volt = 1 / Ve',
      subst: `Ve = 4,44 × 60 × ${fmt(m2.Bm, 2)} × ${fmt(m2.Sm, 2)} × 10⁻⁴ = ${fmt(1 / m2.espPorVolt, 3)} V/esp`,
      result: `Esp/Volt = ${fmt(m2.espPorVolt, 3)} espiras por Volt | Bm = ${fmt(m2.Bm, 2)} Tesla (Chapa GNO de 1,25 T)`
    },
    {
      step: '04. Número de Espiras dos Enrolamentos Primário e Secundário',
      formula: 'N1 = V1 × (Esp/Volt)   |   N2 = V2 × (Esp/Volt) × 1,035 (Compensação de Queda ΔV)',
      subst: `N1 = ${m2.V1} × ${fmt(m2.espPorVolt, 3)} | N2 = ${m2.V2} × ${fmt(m2.espPorVolt, 3)} × 1,035`,
      result: `Primário N1 = ${fmtInt(m2.N1)} espiras | Secundário N2 = ${fmtInt(m2.N2)} espiras (+3,5% p/ compensar regulação)`
    },
    {
      step: '05. Seções dos Condutores de Cobre e Seleção dos Calibres AWG',
      formula: 'Sc1 = I1 / J   |   Sc2 = I2 / J   |   Seleção na Tabela de Fios AWG',
      subst: `Sc1 = ${fmt(m2.I1, 2)} / ${m2.J} = ${fmt(m2.Sc1, 3)} mm² | Sc2 = ${fmt(m2.I2, 2)} / ${m2.J} = ${fmt(m2.Sc2, 3)} mm²`,
      result: `Primário: ${m2.awg1.gauge} (${fmt(m2.awg1.area, 3)} mm²) | Secundário: ${m2.awg2.gauge} (${fmt(m2.awg2.area, 3)} mm²)`
    },
    {
      step: '06. Verificação do Fator de Ocupação da Janela do Núcleo (Ku)',
      formula: 'Acu = N1 × Sc1_isol + N2 × Sc2_isol   |   Ku = (Acu / A_janela) × 100 ≤ 42%',
      subst: `Acu = ${m2.N1}×${fmt(m2.awg1.area, 2)} + ${m2.N2}×${fmt(m2.awg2.area, 2)} = ${fmt(m2.Acu_mm2, 1)} mm² | Ajanela = ${fmt(m2.Aw_mm2, 1)} mm²`,
      result: `Fator de Ocupação Ku = ${fmt(m2.Ku_percent, 1)} % | ${m2.Ku_percent <= 42 ? '✓ APROVADO (Cabe no carretel)' : '⚠️ ALERTA (Janela apertada)'}`
    },
    {
      step: '07. Balanço de Perdas no Ferro, Perdas no Cobre e Rendimento Térmico',
      formula: 'Pfe = M_fe × p_esp × (Bm/1,1)²   |   Pcu = R1×I1² + R2×I2²   |   Pt = Pfe + Pcu',
      subst: `M_fe = ${fmt(m2.pesoFerro_kg, 2)} kg → Pfe = ${fmt(m2.Pfe_W, 2)} W | R1=${fmt(m2.R1_ohm, 2)}Ω, R2=${fmt(m2.R2_ohm, 3)}Ω → Pcu = ${fmt(m2.Pcu_W, 2)} W`,
      result: `Perdas Totais Pt = ${fmt(m2.Ptot_W, 2)} W | Rendimento Térmico η = ${fmt(m2.rendimento_percent, 2)} %`
    },
    {
      step: '08. Regulação de Tensão e Dimensões Externas do Conjunto Montado',
      formula: 'ΔV% = ((I1×R1)/V1 + (I2×R2)/V2) × 100   |   Dimensões: A × C × B [mm]',
      subst: `Queda primária = ${fmt((m2.I1*m2.R1_ohm/m2.V1)*100, 2)}% | Queda secundária = ${fmt((m2.I2*m2.R2_ohm/m2.V2)*100, 2)}%`,
      result: `Regulação ΔV = ${fmt(m2.reg_percent, 2)} % | Dimensões Externas: ${m2.extWidth_mm} × ${m2.extDepth_mm} × ${m2.extHeight_mm} mm | Peso Total = ${fmt(m2.pesoTotal_kg, 2)} kg`
    }
  ];

  el.innerHTML = renderMemorialHtml('MEMORIAL DE CÁLCULO ANALÍTICO AUDITÁVEL (TRANSFORMADOR MONOFÁSICO NÚCLEO E-I)', steps);
}

function renderMemorialTabM3(el, m3) {
  const steps = [
    {
      step: '01. Dados de Entrada da Carga e Rota do Alimentador de Baixa Tensão',
      formula: 'P [kW], Vll [V], FP = cos φ, L [m], Método de Instalação NBR 5410',
      subst: `P = ${fmt(m3.P_kW, 2)} kW (${fmtInt(m3.P)} W) | Vll = ${m3.Vll} V (${m3.phases}) | cos φ = ${m3.fp} | L = ${m3.L} m | Isolação: ${m3.insulLabel}`,
      result: `Potência Aparente S = ${fmt(m3.P_kW / m3.fp, 2)} kVA | Sen φ = ${fmt(Math.sqrt(Math.max(0, 1 - m3.fp * m3.fp)), 3)}`
    },
    {
      step: '02. Corrente de Projeto do Circuito Terminal (Ib)',
      formula: m3.phases === '3F' ? 'Ib = P / (√3 × Vll × cos φ)' : 'Ib = P / (Vll × cos φ)',
      subst: m3.phases === '3F'
        ? `Ib = ${fmtInt(m3.P)} / (1,732 × ${m3.Vll} × ${m3.fp})`
        : `Ib = ${fmtInt(m3.P)} / (${m3.Vll} × ${m3.fp})`,
      result: `Corrente de Projeto Ib = ${fmt(m3.Ib, 1)} A`
    },
    {
      step: '03. Fatores de Correção Normativos de Agrupamento e Temperatura',
      formula: 'Iz_req = Ib / (FCA × FCT)   |   FCA (Tab. 42 NBR 5410)   |   FCT (Tab. 40 NBR 5410)',
      subst: `FCA = ${fmt(m3.fca, 2)} | FCT = ${fmt(m3.fct, 2)} | Fator Global = ${fmt(m3.fca * m3.fct, 3)}`,
      result: `Corrente Corrigida Requerida Iz_req = ${fmt(m3.Iz_req, 1)} A`
    },
    {
      step: '04. Critério da Capacidade de Condução de Corrente (Ampacidade com Condutores em Paralelo)',
      formula: 'Iz\'_total = Np × Iz_tabela × FCA × FCT ≥ Ib',
      subst: `Cabo selecionado: ${m3.selectedCable.section} mm² (${m3.selectedCable.awg}) | Iz_unitário = ${fmt(m3.selectedCable.Iz_unit, 1)} A | Banco: ${m3.nParallel} cabo(s)/fase`,
      result: `Iz\' Total = ${fmt(m3.Iz_real, 1)} A | Condição Iz\' ≥ Ib (${fmt(m3.Iz_real, 1)} A ≥ ${fmt(m3.Ib, 1)} A): ✓ ATENDIDO`
    },
    {
      step: '05. Critério da Queda de Tensão Admissível (NBR 5410 Item 6.2.7)',
      formula: 'ΔV% = (k × Ib × L × (R × cos φ + X × sen φ)) / (Np × Vll × 10) ≤ Limite ΔV%',
      subst: `k = ${m3.phases === '3F' ? '√3 (1,732)' : '2'} | R = ${fmt(m3.selectedCable.rActive, 3)} Ω/km | X = ${fmt(m3.selectedCable.x_ohm_km, 3)} Ω/km | Np = ${m3.nParallel}`,
      result: `Queda ΔV = ${fmt(m3.dV_volts, 2)} V (${fmt(m3.dV_percent, 2)} %) | Limite = ${fmt(m3.limDv, 1)} %: ${m3.dV_percent <= m3.limDv ? '✓ ATENDIDO' : '✗ NÃO ATENDIDO'}`
    },
    {
      step: '06. Coordenação e Proteção Contra Sobrecargas e Curto-Circuito (NBR 5410 Item 5.3.4)',
      formula: 'Ib ≤ In ≤ Iz\'_total   e   I2 ≤ 1,45 × Iz\'_total',
      subst: `Ib = ${fmt(m3.Ib, 1)} A ≤ In = ${m3.In} A ≤ Iz\' = ${fmt(m3.Iz_real, 1)} A`,
      result: `Disjuntor Selecionado: ${m3.breakerModel} | Coordenação: ${m3.coordOk ? '✓ CONFORME' : '✗ NÃO CONFORME'}`
    },
    {
      step: '07. Dimensionamento do Neutro, PE de Proteção e Barramento QGBT',
      formula: 'S_neutro (Tab. 48)   |   S_pe (Tab. 51)   |   Barramento: S_cu = In / 1,35 A/mm²',
      subst: `Seção de Fase: ${m3.totalSec_mm2} mm² | Corrente In = ${m3.In} A | Densidade econômica = 1,35 A/mm²`,
      result: `Barramento QGBT: ${m3.busBarSpec} | Neutro: ${m3.totalSec_mm2 > 50 ? `${fmtInt(m3.totalSec_mm2 / 2)} mm²` : `${m3.totalSec_mm2} mm²`} | PE: ${m3.totalSec_mm2 > 35 ? `${fmtInt(m3.totalSec_mm2 / 2)} mm²` : `${m3.totalSec_mm2} mm²`}`
    },
    {
      step: '08. Perdas Joule na Linha, Ocupação no Eletroduto e Eficiência de Transmissão',
      formula: 'ΔP = 3 × (R_linha / Np) × Ib²   |   Taxa de Ocupação ≤ 40% (NBR 5410 Item 6.2.11)',
      subst: `R_fase = (${fmt(m3.selectedCable.rActive, 3)} × ${m3.L} / 1000) / ${m3.nParallel} = ${fmt((m3.selectedCable.rActive * m3.L / 1000) / m3.nParallel, 4)} Ω`,
      result: `Perdas Joule ΔP = ${fmt(m3.pj_W / 1000, 2)} kW (${fmt((m3.pj_W / Math.max(1, m3.P)) * 100, 1)}% de P) | Rendimento da Linha = ${fmt(100 - (m3.pj_W / Math.max(1, m3.P)) * 100, 2)} %`
    }
  ];

  el.innerHTML = renderMemorialHtml('MEMORIAL DE CÁLCULO ANALÍTICO AUDITÁVEL (ALIMENTADOR DE BAIXA TENSÃO NBR 5410)', steps);
}

function renderMemorialHtml(title, steps) {
  return `
    <div class="cae-panel">
      <div class="cae-panel-header">
        <span>📖 ${title}</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--blue-light)">REV. V5.0 // VOLT-CAD</span>
          <button type="button" class="preset-chip chip-emerald" onclick="window.triggerAutoRecalc(this)">⚡ Recalcular &amp; Auto-Dimensionar</button>
        </div>
      </div>
      <div class="cae-panel-body">
        <div class="memorial-grid">
          ${steps.map(s => `
            <div class="memo-card">
              <div class="memo-step-title"><span>${s.step}</span></div>
              <div style="color:var(--text-muted);font-size:11px;">Fórmula: <span style="color:var(--text-primary);font-family:var(--font-mono)">${s.formula}</span></div>
              <div style="color:var(--text-muted);font-size:11px;">Substituição: <span style="color:var(--blue-light);font-family:var(--font-mono)">${s.subst}</span></div>
              <div class="memo-result-box" style="margin-top:4px;">
                <b style="color:var(--nom-text)">Resultado:</b> ${s.result}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// ABA [6]: GERADOR DE SCRIPTS (MATLAB .M / PYTHON .PY / .CURSORRULES)
// ----------------------------------------------------------------------------

function getGeneratedScripts(m1, m2, m3) {
  if (state.activeModule === 'trafo1ph') {
    return getGeneratedScriptsM2(m2);
  } else if (state.activeModule === 'feeder') {
    return getGeneratedScriptsM3(m3);
  } else {
    return getGeneratedScriptsM1(m1, m3);
  }
}

function getGeneratedScriptsM1(m1, m3) {
  const matlab = `%% ========================================================================
% VOLT-CAD // WEG DT-11 WORKBENCH - SCRIPT MATLAB GERADO DINAMICAMENTE
% Transformador Trifásico a Óleo (${fmt(m1.S_oper, 2)} kVA | ${fmt(m1.v1Kv, 1)} kV -> ${m1.V2_line} V)
% ========================================================================
function voltcad_weg_dt11_app()
    % 1. Parâmetros Sincronizados do Workbench
    Ac_cm2   = ${m1.Ac};          % Área bruta da coluna do núcleo [cm²]
    Aj_cm2   = ${m1.Aj};          % Área da janela de espiras [cm²]
    V1_line  = ${m1.V1_line};     % Tensão primária de linha [V]
    I1_line  = ${m1.I1_line};     % Corrente primária de linha [A]
    V2_line  = ${m1.V2_line};     % Tensão secundária de linha [V]
    I2_line  = ${m1.I2_line};     % Corrente secundária de linha [A]
    Bm_T     = ${m1.Bm};          % Indução magnética máxima [T]
    J_Amm2   = ${m1.J};           % Densidade de corrente [A/mm²]
    Ku       = ${m1.Ku};          % Fator de ocupação da janela
    f_Hz     = ${m1.f};           % Frequência de operação [Hz]

    % 2. Equacionamento Eletromagnético Fundamental
    Sm_cm2   = 0.95 * Ac_cm2;
    V_per_e  = 4.44 * f_Hz * Bm_T * (Sm_cm2 * 1e-4);
    N1_espiras = round((V1_line / sqrt(3)) / V_per_e);
    N2_espiras = round((V2_line / sqrt(3)) / V_per_e);

    % 3. Capacidade Máxima e Operacional
    S_max_kVA  = (3 * 2.22 * f_Hz * Bm_T * J_Amm2 * Ku * Sm_cm2 * Aj_cm2 * 1e-8);
    S_oper_kVA = (sqrt(3) * V1_line * I1_line) / 1000;

    % 4. Dados Construtivos do Óleo e Tanque
    Dim_CxLxH_mm = [${m1.extLen_mm}, ${m1.extWid_mm}, ${m1.extHei_mm}];
    Peso_TotalKg = ${m1.massTotalTrafo_kg};
    Oleo_Litros  = ${m1.volOilTotal_L};
    Oleo_MassaKg = ${m1.massOilTotal_kg};

    fprintf('=== VOLT-CAD // MEMORIAL WEG DT-11 ===\\n');
    fprintf('Capacidade Máx. Núcleo (%.1f cm²): %.2f kVA (Máx %d esp AT)\\n', Ac_cm2, S_max_kVA, ${m1.maxTurnsAT});
    fprintf('Potência Operacional: %.2f kVA | Espiras: N1=%d, N2=%d\\n', S_oper_kVA, N1_espiras, N2_espiras);
    fprintf('Tamanho Externo (C x L x H): %d x %d x %d mm | Peso Total: %d kg\\n', Dim_CxLxH_mm(1), Dim_CxLxH_mm(2), Dim_CxLxH_mm(3), Peso_TotalKg);
    fprintf('Óleo Indicado: ${m1.oilSpec.shortName} (%d L / %d kg)\\n', Oleo_Litros, Oleo_MassaKg);
end`;

  const python = `# ========================================================================
# VOLT-CAD // WEG DT-11 & NBR 5410 - MOTOR DE ENGENHARIA EM PYTHON
# Exportado em tempo real do estado atual do Workbench
# ========================================================================
import math

class TrafoWEG_DT11:
    def __init__(self):
        self.Ac_cm2 = ${m1.Ac}
        self.Aj_cm2 = ${m1.Aj}
        self.V1_line = ${m1.V1_line}
        self.I1_line = ${m1.I1_line}
        self.V2_line = ${m1.V2_line}
        self.I2_line = ${m1.I2_line}
        self.Bm = ${m1.Bm}
        self.J = ${m1.J}
        self.Ku = ${m1.Ku}
        self.f = ${m1.f}

    def calcular(self):
        Sm = 0.95 * self.Ac_cm2
        v_per_e = 4.44 * self.f * self.Bm * (Sm * 1e-4)
        N1 = round((self.V1_line / math.sqrt(3)) / v_per_e)
        N2 = round((self.V2_line / math.sqrt(3)) / v_per_e)
        S_max = 3 * 2.22 * self.f * self.Bm * self.J * self.Ku * Sm * self.Aj_cm2 * 1e-8
        S_oper = (math.sqrt(3) * self.V1_line * self.I1_line) / 1000
        return {
            "S_max_kVA": round(S_max, 2),
            "S_oper_kVA": round(S_oper, 2),
            "N1": N1, "N2": N2, "V_per_e": round(v_per_e, 3),
            "Oleo_L": ${m1.volOilTotal_L},
            "Peso_Total_kg": ${m1.massTotalTrafo_kg}
        }

if __name__ == "__main__":
    t = TrafoWEG_DT11()
    print("Resultados:", t.calcular())`;

  const cursorrules = `# .cursorrules - Antigravity Engineering Software Standard (VOLT-CAD v5.0)
- Module: [M1] Trafo 3Ø a Óleo WEG DT-11 / NBR 5356
- Standard: WEG DT-11, ABNT NBR 5356-1..5, ABNT NBR 5440
- Core: Ac = ${m1.Ac} cm², Aj = ${m1.Aj} cm², Bm = ${m1.Bm} T, J = ${m1.J} A/mm²
- Tank: ${m1.extLen_mm} × ${m1.extWid_mm} × ${m1.extHei_mm} mm | Óleo: ${m1.volOilTotal_L} L (${m1.oilSpec.shortName})`;

  return { matlab, python, cursorrules };
}

function getGeneratedScriptsM2(m2) {
  const matlab = `%% ========================================================================
% VOLT-CAD // TRANSFORMADOR MONOFÁSICO NÚCLEO E-I - MATLAB
% Potência: ${m2.S} VA | ${m2.V1} V -> ${m2.V2} V | Núcleo: ${m2.a_mm}x${m2.b_mm} mm
% ========================================================================
function trafo_monofasico_ei()
    S_VA     = ${m2.S};
    V1_V     = ${m2.V1};
    V2_V     = ${m2.V2};
    f_Hz     = ${m2.f};
    Bm_T     = ${m2.Bm};
    J_Amm2   = ${m2.J};
    Ke       = ${m2.Ke};

    Sm_cm2   = ${fmt(m2.Sm, 2)};
    Ve       = 4.44 * f_Hz * Bm_T * (Sm_cm2 * 1e-4);
    N1       = ceil(V1_V / Ve);
    N2       = ceil((V2_V * 1.035) / Ve);

    fprintf('=== TRAFO MONOFÁSICO E-I ===\\n');
    fprintf('Potência: %.1f VA | Esp/Volt: %.3f\\n', S_VA, 1/Ve);
    fprintf('Espiras: N1 = %d (${m2.awg1.gauge}), N2 = %d (${m2.awg2.gauge})\\n', N1, N2);
    fprintf('Dimensões Externas: %d x %d x %d mm | Peso: %.2f kg\\n', ${m2.extWidth_mm}, ${m2.extDepth_mm}, ${m2.extHeight_mm}, ${fmt(m2.pesoTotal_kg, 2)});
    fprintf('Rendimento: %.2f %% | Regulação: %.2f %%\\n', ${fmt(m2.rendimento_percent, 2)}, ${fmt(m2.reg_percent, 2)});
end`;

  const python = `# ========================================================================
# VOLT-CAD // TRANSFORMADOR MONOFÁSICO NÚCLEO E-I - PYTHON CAE
# ========================================================================
import math

class TrafoMonofasicoEI:
    def __init__(self):
        self.S = ${m2.S}
        self.V1 = ${m2.V1}
        self.V2 = ${m2.V2}
        self.f = ${m2.f}
        self.Bm = ${m2.Bm}
        self.J = ${m2.J}
        self.Sm = ${fmt(m2.Sm, 2)}

    def dimensionar(self):
        Ve = 4.44 * self.f * self.Bm * (self.Sm * 1e-4)
        N1 = math.ceil(self.V1 / Ve)
        N2 = math.ceil((self.V2 * 1.035) / Ve)
        return {
            "Ve": round(Ve, 4),
            "N1": N1, "fio1": "${m2.awg1.gauge}",
            "N2": N2, "fio2": "${m2.awg2.gauge}",
            "Peso_Total_kg": ${fmt(m2.pesoTotal_kg, 2)},
            "Rendimento_pct": ${fmt(m2.rendimento_percent, 2)}
        }

if __name__ == "__main__":
    t = TrafoMonofasicoEI()
    print("Dimensionamento 1Ø:", t.dimensionar())`;

  const cursorrules = `# .cursorrules - Antigravity Engineering Software Standard (VOLT-CAD v5.0)
- Module: [M2] Trafo Monofásico Núcleo E-I (Comando / Painel)
- Specs: S = ${m2.S} VA, V1 = ${m2.V1} V, V2 = ${m2.V2} V, a = ${m2.a_mm} mm, b = ${m2.b_mm} mm
- Winding: N1 = ${m2.N1} (${m2.awg1.gauge}), N2 = ${m2.N2} (${m2.awg2.gauge}), Ku = ${fmt(m2.Ku_percent, 1)}%`;

  return { matlab, python, cursorrules };
}

function getGeneratedScriptsM3(m3) {
  const matlab = `%% ========================================================================
% VOLT-CAD // ALIMENTADOR DE BAIXA TENSÃO NBR 5410 - MATLAB
% Potência: ${fmt(m3.P_kW, 2)} kW | Ib = ${fmt(m3.Ib, 1)} A -> ${m3.cableLabelShort}
% ========================================================================
function alimentador_nbr5410()
    P_kW     = ${m3.P_kW};
    Vll      = ${m3.Vll};
    fp       = ${m3.fp};
    L_m      = ${m3.L};
    Np       = ${m3.nParallel};
    S_mm2    = ${m3.selectedCable.section};

    Ib       = (P_kW * 1000) / (sqrt(3) * Vll * fp);
    dV_pct   = ${fmt(m3.dV_percent, 2)};
    Iz_real  = ${fmt(m3.Iz_real, 1)};

    fprintf('=== ALIMENTADOR NBR 5410 ===\\n');
    fprintf('Ib = %.1f A | Iz Real = %.1f A | Np = %d x %d mm²\\n', Ib, Iz_real, Np, S_mm2);
    fprintf('Queda de Tensão: %.2f %% (Limite: %.1f %%)\\n', dV_pct, ${m3.limDv});
    fprintf('Disjuntor: ${m3.breakerModel}\\n');
    fprintf('Barramento: ${m3.busBarSpec}\\n');
end`;

  const python = `# ========================================================================
# VOLT-CAD // ALIMENTADOR DE BAIXA TENSÃO NBR 5410 - PYTHON CAE
# ========================================================================
import math

class AlimentadorBT_NBR5410:
    def __init__(self):
        self.P_kW = ${m3.P_kW}
        self.Vll = ${m3.Vll}
        self.fp = ${m3.fp}
        self.L_m = ${m3.L}
        self.Np = ${m3.nParallel}
        self.sec_mm2 = ${m3.selectedCable.section}

    def calcular(self):
        Ib = (self.P_kW * 1000) / (math.sqrt(3) * self.Vll * self.fp)
        return {
            "Ib_A": round(Ib, 1),
            "Arranjo": "${m3.cableLabelShort}",
            "Iz_real_A": ${fmt(m3.Iz_real, 1)},
            "dV_percent": ${fmt(m3.dV_percent, 2)},
            "Disjuntor": "${m3.breakerModel}",
            "Barramento": "${m3.busBarSpec}"
        }

if __name__ == "__main__":
    c = AlimentadorBT_NBR5410()
    print("Alimentador BT:", c.calcular())`;

  const cursorrules = `# .cursorrules - Antigravity Engineering Software Standard (VOLT-CAD v5.0)
- Module: [M3] Alimentador BT NBR 5410
- Specs: P = ${m3.P_kW} kW, Vll = ${m3.Vll} V, Ib = ${fmt(m3.Ib, 1)} A
- Cables: ${m3.cableLabelShort} (Iz' = ${fmt(m3.Iz_real, 1)} A, ΔV = ${fmt(m3.dV_percent, 2)}%)`;

  return { matlab, python, cursorrules };
}

function renderScriptsTab(m1, m2, m3) {
  const scripts = getGeneratedScripts(m1, m2, m3);
  const code = scripts[state.scriptLang] || scripts.matlab;
  const pre = document.getElementById('preScriptContent');
  if (pre) pre.textContent = code;
  const modalPre = document.getElementById('modalScriptPre');
  if (modalPre) modalPre.textContent = code;
}

// ----------------------------------------------------------------------------
// BOTTOM SUMMARY STRIP (6 KPIS NORMATIVOS COM STATUS EXPLÍCITO VÁLIDO / ALERTA / NÃO VÁLIDO)
// ----------------------------------------------------------------------------

function renderBottomKpis(m1, m2, m3) {
  const strip = document.getElementById('bottomKpiStrip');
  if (!strip) return;

  if (state.activeModule === 'trafo3ph') {
    strip.innerHTML = [
      kpiHtml('Cap. Máx. Núcleo 3Ø', 'S_max', fmt(m1.S_core_max, 2), 'kVA', m1.statusCore, `Carga=${fmt(m1.S_oper, 1)}kVA | Ac=${fmt(m1.Ac, 0)}cm² (Ideal≈${m1.Ac_ideal}cm²)`),
      kpiHtml('Limite Espiras & Janela', 'N₁_máx', fmtInt(m1.maxTurnsAT), 'esp', m1.statusCore, `Req: ${fmtInt(m1.N1_nom)} esp | Ocupação Janela=${fmt(m1.windowFillPct, 1)}%`),
      kpiHtml('Indução Magnética 3Ø', 'Bm', fmt(m1.Bm, 2), 'T', m1.statusBm, ` ≤ 1,72 T (Chapa GO WEG DT-11)`),
      kpiHtml('Óleo Isolante & Volume', 'V_óleo', fmtInt(m1.volOilTotal_L), 'Litros', m1.statusOil, `${m1.oilSpec.shortName.split('(')[0].trim()} (${fmtInt(m1.massOilTotal_kg)} kg)`),
      kpiHtml('Ponto Quente & Vida', 'Θe', fmt(m1.hotSpotTemp_ThetaE, 1), '°C', m1.statusOil, ` ≤ 105 °C (NBR 5416: ~${fmt(m1.estLifeYears, 0)} anos)`),
      kpiHtml('Rendimento & Impedância', 'η', fmt(m1.eff_pct, 2), '%', m1.statusEff, ` ≥ 98,0% | Ez = ${fmt(m1.Ez_pct, 2)}% (NBR 5356)`)
    ].join('');
  } else if (state.activeModule === 'trafo1ph') {
    strip.innerHTML = [
      kpiHtml('Seção Magnética E-I', 'Sm', fmt(m2.Sm, 2), 'cm²', m2.Sm >= 1 ? 'nominal' : 'critical', `Lâmina a=${m2.a_mm}mm × b=${m2.b_mm}mm (${fmt(m2.S, 0)} VA)`),
      kpiHtml('Indução Núcleo E-I', 'Bm', fmt(m2.Bm, 2), 'T', m2.statusBm, ' ≤ 1,25 T (Chapa GNO 1Ø)'),
      kpiHtml('Ocupação Carretel E-I', 'Ku', fmt(m2.Ku_percent, 1), '%', m2.statusKu, ` ≤ 42,0% (${m2.awg1.gauge} / ${m2.awg2.gauge})`),
      kpiHtml('Regulação Tensão 1Ø', 'ΔV', fmt(m2.reg_percent, 2), '%', m2.statusReg, ' ≤ 4,50% (Plena Carga)'),
      kpiHtml('Rendimento Trafo 1Ø', 'η', fmt(m2.rendimento_percent, 2), '%', m2.statusEta, ` ≥ 90,0% (Perdas=${fmt(m2.Ptot_W, 1)} W)`),
      kpiHtml('Tamanho & Peso 1Ø', 'M_tot', fmt(m2.pesoTotal_kg, 2), 'kg', m2.globalStatus, `C×L×H: ${m2.extWidth_mm}×${m2.extDepth_mm}×${m2.extHeight_mm} mm`)
    ].join('');
  } else {
    strip.innerHTML = [
      kpiHtml('Corrente de Projeto', 'Ib', fmt(m3.Ib, 1), 'A', 'nominal', `${fmt(m3.P_kW, 1)} kW (${m3.phases} ${m3.Vll}V, fp=${m3.fp})`),
      kpiHtml('Arranjo Condutores', 'S_fase', m3.cableLabelShort, '', m3.globalStatus, `Seção Total: ${fmtInt(m3.totalSec_mm2)} mm²/fase`),
      kpiHtml('Ampacidade Corrigida', 'Iz\'', fmt(m3.Iz_real, 1), 'A', m3.Iz_real >= m3.Ib ? 'nominal' : 'critical', ` ≥ Ib (${fmt(m3.Ib, 1)} A) | FCA×FCT=${fmt(m3.fca * m3.fct, 2)}`),
      kpiHtml('Proteção Disjuntor WEG', 'In', `${fmtInt(m3.In)}`, 'A', m3.statusCoord, `Ib ≤ In ≤ Iz' (${m3.breakerModel.split('(')[0].trim()})`),
      kpiHtml('Queda de Tensão BT', 'ΔV%', fmt(m3.dV_percent, 2), '%', m3.statusDv, ` ≤ ${fmt(m3.limDv, 1)}% (${fmt(m3.dV_volts, 1)} V em ${m3.L} m)`),
      kpiHtml('Perda Joule na Linha', 'ΔP', fmt(m3.pj_W / 1000, 2), 'kW', m3.pj_W / Math.max(1, m3.P) <= 0.03 ? 'nominal' : 'warning', ` ≤ 3,0% (${fmt((m3.pj_W / Math.max(1, m3.P)) * 100, 1)}% de P)`)
    ].join('');
  }
}



function autoFitCoreM1() {
  const m1 = computeM1();
  document.getElementById('m1_Ac').value = m1.Ac_ideal;
  document.getElementById('m1_Aj').value = m1.Aj_ideal;
  const side = Math.sqrt(m1.Ac_ideal);
  document.getElementById('m1_colA').value = side.toFixed(2);
  document.getElementById('m1_colB').value = side.toFixed(2);
  const wW = Math.sqrt(m1.Aj_ideal / 2.5);
  document.getElementById('m1_winW').value = wW.toFixed(2);
  document.getElementById('m1_winH').value = (m1.Aj_ideal / wW).toFixed(2);
  if (m1.Bm > 1.75) document.getElementById('m1_Bm').value = 1.65;
  if (m1.J > 3.5) document.getElementById('m1_J').value = 2.8;
  document.getElementById('m1_autoOil').checked = true;
  renderAll();
}

function autoFitM2() {
  // 1. Garante limites normativos padrão e parâmetros eletromagnéticos ideais
  const steelEl = document.getElementById('m2_steelType');
  const steelVal = steelEl ? parseFloat(steelEl.value) || 1.15 : 1.15;
  const targetBm = steelVal >= 1.35 ? 1.35 : steelVal >= 1.20 ? 1.20 : 1.15;

  document.getElementById('m2_Bm').value = targetBm.toFixed(2);
  document.getElementById('m2_Ke').value = '0.92';

  const limKuEl = document.getElementById('m2_limKu');
  if (limKuEl && (parseFloat(limKuEl.value) || 0) < 35) limKuEl.value = '42';
  const limRegEl = document.getElementById('m2_limReg');
  if (limRegEl && (parseFloat(limRegEl.value) || 0) < 3.5) limRegEl.value = '4.5';
  const compEl = document.getElementById('m2_compPct');
  if (compEl && (parseFloat(compEl.value) || 0) > 6.0) compEl.value = '3.5';

  // Ativa o modo Automático de Geometria (e sincroniza os campos manuais ao final)
  state.m2CoreMode = 'auto';
  const btnAuto = document.getElementById('btnM2CoreModeAuto');
  const btnMan = document.getElementById('btnM2CoreModeManual');
  const subAuto = document.getElementById('subM2CoreAuto');
  const subMan = document.getElementById('subM2CoreManual');
  if (btnAuto && btnMan && subAuto && subMan) {
    btnAuto.classList.add('active');
    btnMan.classList.remove('active');
    subAuto.classList.remove('hidden');
    subMan.classList.add('hidden');
  }

  // 2. Otimizador Iterativo Multi-Variável (ajusta J, Kc, proporção b/a e espaço da janela winScale
  //    até que Ku, Regulação ΔV, Rendimento η, Indução Bm e Temperatura fiquem 100% NOMINAIS)
  let jVal = 2.4;
  let kcVal = 1.18;
  let winScaleVal = 1.00;
  let stackRatioVal = 1.25;

  document.getElementById('m2_J').value = jVal.toFixed(1);
  document.getElementById('m2_Kc').value = kcVal.toFixed(2);
  if (document.getElementById('m2_winScale')) document.getElementById('m2_winScale').value = winScaleVal.toFixed(2);
  if (document.getElementById('m2_stackRatio')) document.getElementById('m2_stackRatio').value = stackRatioVal.toFixed(2);

  for (let iter = 0; iter < 45; iter++) {
    const m2 = computeM2();
    if (m2.globalStatus === 'nominal' && m2.Ku_percent <= m2.limKu * 0.90 && m2.reg_percent <= m2.limReg * 0.88) {
      break;
    }
    // Se a janela estiver apertada (Ku alto), amplia o espaço da janela e a seção do núcleo
    if (m2.statusKu !== 'nominal' || m2.Ku_percent > m2.limKu * 0.90) {
      winScaleVal = Math.min(2.4, +(winScaleVal + 0.08).toFixed(2));
      kcVal = Math.min(2.4, +(kcVal + 0.06).toFixed(2));
    }
    // Se a regulação ΔV estiver alta, rendimento baixo ou temperatura alta, reduz J (fio mais grosso) e aumenta o núcleo Kc
    if (m2.statusReg !== 'nominal' || m2.reg_percent > m2.limReg * 0.88 || m2.statusEta !== 'nominal' || m2.statusTemp !== 'nominal') {
      jVal = Math.max(1.3, +(jVal - 0.12).toFixed(2));
      kcVal = Math.min(2.4, +(kcVal + 0.07).toFixed(2));
    }
    document.getElementById('m2_J').value = jVal.toFixed(2);
    document.getElementById('m2_Kc').value = kcVal.toFixed(2);
    if (document.getElementById('m2_winScale')) document.getElementById('m2_winScale').value = winScaleVal.toFixed(2);
  }

  // Sincroniza os campos manuais (a, b, Lj, Hj) com a geometria otimizada final
  const finalM2 = computeM2();
  if (document.getElementById('m2_a')) document.getElementById('m2_a').value = finalM2.a_mm;
  if (document.getElementById('m2_b')) document.getElementById('m2_b').value = finalM2.b_mm;
  if (document.getElementById('m2_winW')) document.getElementById('m2_winW').value = finalM2.winW_mm;
  if (document.getElementById('m2_winH')) document.getElementById('m2_winH').value = finalM2.winH_mm;

  renderAll();
}

function autoFitM3() {
  document.getElementById('m3_parallel').value = '0';
  document.getElementById('m3_manualSec').value = '0';
  const m3 = computeM3();
  if (!m3.coordOk || m3.statusDv === 'critical') {
    document.getElementById('m3_insul').value = 'xlpe';
  }
  renderAll();
}

window.triggerAutoRecalc = function(btnEl) {
  if (state.activeModule === 'trafo3ph') {
    autoFitCoreM1();
  } else if (state.activeModule === 'trafo1ph') {
    autoFitM2();
  } else {
    autoFitM3();
  }
  if (btnEl) {
    const orig = btnEl.innerHTML;
    btnEl.innerHTML = '✓ Recalculado &amp; Otimizado!';
    setTimeout(() => { btnEl.innerHTML = orig; }, 1400);
  }
};

function initEvents() {
  // Troca de Módulo (M1, M2, M3)
  const modBtns = {
    trafo3ph: document.getElementById('btnMod3Ph'),
    trafo1ph: document.getElementById('btnMod1Ph'),
    feeder: document.getElementById('btnModFeeder')
  };
  const modDocks = {
    trafo3ph: document.getElementById('dockM1'),
    trafo1ph: document.getElementById('dockM2'),
    feeder: document.getElementById('dockM3')
  };

  Object.keys(modBtns).forEach(modKey => {
    modBtns[modKey].addEventListener('click', () => {
      state.activeModule = modKey;
      Object.keys(modBtns).forEach(k => {
        modBtns[k].classList.toggle('active', k === modKey);
        modDocks[k].classList.toggle('hidden', k !== modKey);
      });
      renderAll();
    });
  });

  // Troca de Abas Centrais
  document.querySelectorAll('.stage-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      state.activeTab = tab;
      document.querySelectorAll('.stage-tab').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('hidden', p.id !== `tabPane_${tab}`));
      document.getElementById('svgToolbar').classList.toggle('hidden', tab !== 'svg');
    });
  });

  // Accordions no Dock Esquerdo
  document.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-acc');
      const content = document.getElementById(targetId);
      content.classList.toggle('hidden');
    });
  });

  // Modo de Núcleo M1 (Por Área vs Por Medidas)
  document.getElementById('btnCoreModeArea').addEventListener('click', () => {
    document.getElementById('btnCoreModeArea').classList.add('active');
    document.getElementById('btnCoreModeDims').classList.remove('active');
    document.getElementById('subCoreArea').classList.remove('hidden');
    document.getElementById('subCoreDims').classList.add('hidden');
  });
  document.getElementById('btnCoreModeDims').addEventListener('click', () => {
    document.getElementById('btnCoreModeDims').classList.add('active');
    document.getElementById('btnCoreModeArea').classList.remove('active');
    document.getElementById('subCoreDims').classList.remove('hidden');
    document.getElementById('subCoreArea').classList.add('hidden');
  });

  // Sub-Abas do Módulo 2 (Trafo 1Ø E-I): Modo Elétrico (Potência S vs Corrente I2) e Modo de Núcleo (Auto Kc vs Manual Medidas)
  const btnM2Pwr = document.getElementById('btnM2ElecModePower');
  const btnM2Cur = document.getElementById('btnM2ElecModeCurrent');
  if (btnM2Pwr && btnM2Cur) {
    btnM2Pwr.addEventListener('click', () => {
      state.m2ElecMode = 'power';
      btnM2Pwr.classList.add('active');
      btnM2Cur.classList.remove('active');
      renderAll();
    });
    btnM2Cur.addEventListener('click', () => {
      state.m2ElecMode = 'current';
      btnM2Cur.classList.add('active');
      btnM2Pwr.classList.remove('active');
      renderAll();
    });
  }

  // Sincronização imediata ao digitar em S ou I2 no Módulo 2
  const inpM2S = document.getElementById('m2_S');
  const inpM2I2 = document.getElementById('m2_I2_in');
  if (inpM2S && inpM2I2) {
    inpM2S.addEventListener('input', () => {
      state.m2ElecMode = 'power';
      if (btnM2Pwr && btnM2Cur) { btnM2Pwr.classList.add('active'); btnM2Cur.classList.remove('active'); }
    });
    inpM2I2.addEventListener('input', () => {
      state.m2ElecMode = 'current';
      if (btnM2Pwr && btnM2Cur) { btnM2Cur.classList.add('active'); btnM2Pwr.classList.remove('active'); }
    });
  }

  const btnM2CoreAuto = document.getElementById('btnM2CoreModeAuto');
  const btnM2CoreMan = document.getElementById('btnM2CoreModeManual');
  if (btnM2CoreAuto && btnM2CoreMan) {
    btnM2CoreAuto.addEventListener('click', () => {
      state.m2CoreMode = 'auto';
      btnM2CoreAuto.classList.add('active');
      btnM2CoreMan.classList.remove('active');
      document.getElementById('subM2CoreAuto').classList.remove('hidden');
      document.getElementById('subM2CoreManual').classList.add('hidden');
      renderAll();
    });
    btnM2CoreMan.addEventListener('click', () => {
      state.m2CoreMode = 'manual';
      btnM2CoreMan.classList.add('active');
      btnM2CoreAuto.classList.remove('active');
      document.getElementById('subM2CoreManual').classList.remove('hidden');
      document.getElementById('subM2CoreAuto').classList.add('hidden');
      renderAll();
    });
  }

  // Botões rápidos de tensão secundária V2 no Módulo 2
  document.querySelectorAll('[data-m2v2]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v2 = parseFloat(btn.getAttribute('data-m2v2')) || 24;
      document.getElementById('m2_V2').value = v2;
      document.querySelectorAll('[data-m2v2]').forEach(b => b.classList.toggle('active', b === btn));
      renderAll();
    });
  });

  // Seletor de tipo de chapa no Módulo 2 atualiza Bm sugerido
  const selM2Steel = document.getElementById('m2_steelType');
  if (selM2Steel) {
    selM2Steel.addEventListener('change', () => {
      document.getElementById('m2_Bm').value = selM2Steel.value;
      renderAll();
    });
  }

  // Presets de Cenários do Módulo 2
  const btnM2P500 = document.getElementById('btnM2Preset500');
  if (btnM2P500) {
    btnM2P500.addEventListener('click', () => {
      state.m2ElecMode = 'power';
      document.getElementById('m2_S').value = 500;
      document.getElementById('m2_V1').value = 220;
      document.getElementById('m2_V2').value = 24;
      document.getElementById('m2_f').value = 60;
      autoFitM2();
    });
  }
  const btnM2P1000 = document.getElementById('btnM2Preset1000');
  if (btnM2P1000) {
    btnM2P1000.addEventListener('click', () => {
      state.m2ElecMode = 'power';
      document.getElementById('m2_S').value = 1000;
      document.getElementById('m2_V1').value = 380;
      document.getElementById('m2_V2').value = 110;
      document.getElementById('m2_f').value = 60;
      autoFitM2();
    });
  }
  const btnM2POver = document.getElementById('btnM2PresetOverload');
  if (btnM2POver) {
    btnM2POver.addEventListener('click', () => {
      state.m2CoreMode = 'manual';
      if (btnM2CoreAuto && btnM2CoreMan) {
        btnM2CoreMan.classList.add('active');
        btnM2CoreAuto.classList.remove('active');
        document.getElementById('subM2CoreManual').classList.remove('hidden');
        document.getElementById('subM2CoreAuto').classList.add('hidden');
      }
      document.getElementById('m2_a').value = 28;
      document.getElementById('m2_b').value = 32;
      document.getElementById('m2_winW').value = 12;
      document.getElementById('m2_winH').value = 38;
      document.getElementById('m2_Bm').value = 1.42;
      document.getElementById('m2_J').value = 4.2;
      renderAll();
    });
  }

  ['m1_colA', 'm1_colB', 'm1_winH', 'm1_winW'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      const a = parseFloat(document.getElementById('m1_colA').value) || 6.32;
      const b = parseFloat(document.getElementById('m1_colB').value) || 6.33;
      const h = parseFloat(document.getElementById('m1_winH').value) || 10;
      const l = parseFloat(document.getElementById('m1_winW').value) || 4;
      document.getElementById('m1_Ac').value = (a * b).toFixed(1);
      document.getElementById('m1_Aj').value = (h * l).toFixed(1);
      renderAll();
    });
  });

  // Modo de Potência M1 (3Ø vs Direto U*I)
  document.getElementById('btnPwr3Ph').addEventListener('click', () => {
    state.m1PowerMode = '3ph';
    document.getElementById('btnPwr3Ph').classList.add('active');
    document.getElementById('btnPwrDirect').classList.remove('active');
    renderAll();
  });
  document.getElementById('btnPwrDirect').addEventListener('click', () => {
    state.m1PowerMode = 'direct';
    document.getElementById('btnPwrDirect').classList.add('active');
    document.getElementById('btnPwr3Ph').classList.remove('active');
    renderAll();
  });

  // Quando o usuário muda o óleo manualmente, desmarca o modo automático
  document.getElementById('m1_Oil').addEventListener('change', () => {
    document.getElementById('m1_autoOil').checked = false;
    renderAll();
  });

  // Botões de Auto-Ajuste e Recálculo em todas as abas e módulos
  document.getElementById('btnDockAutoFit').addEventListener('click', function() { window.triggerAutoRecalc(this); });
  document.getElementById('btnPresetAutoFit').addEventListener('click', function() { window.triggerAutoRecalc(this); });
  document.getElementById('btnStageAutoRecalc').addEventListener('click', function() { window.triggerAutoRecalc(this); });
  document.getElementById('btnM3AutoRecalc').addEventListener('click', function() { window.triggerAutoRecalc(this); });

  // Preset de Alta Potência 2800 kW na Aba/Módulo 3
  document.getElementById('btnM3Preset2800').addEventListener('click', () => {
    document.getElementById('m3_pUnit').value = 'kW';
    document.getElementById('m3_P').value = 2800;
    state.m3Phases = '3F';
    document.getElementById('btnFeeder3F').classList.add('active');
    document.getElementById('btnFeeder1F').classList.remove('active');
    document.getElementById('m3_Vll').value = 380;
    document.getElementById('m3_fp').value = 0.88;
    document.getElementById('m3_L').value = 68;
    document.getElementById('m3_insul').value = 'xlpe';
    document.getElementById('m3_parallel').value = '0';
    document.getElementById('m3_manualSec').value = '0';
    renderAll();
  });

  // Conversão amigável ao alternar kW <-> W no Módulo 3
  const selM3Unit = document.getElementById('m3_pUnit');
  if (selM3Unit) {
    let lastUnit = selM3Unit.value;
    selM3Unit.addEventListener('change', () => {
      const inpP = document.getElementById('m3_P');
      const curVal = parseFloat(inpP.value) || 0;
      const newUnit = selM3Unit.value;
      if (lastUnit === 'kW' && newUnit === 'W') {
        inpP.value = Math.round(curVal * 1000);
      } else if (lastUnit === 'W' && newUnit === 'kW') {
        inpP.value = +(curVal / 1000).toFixed(2);
      }
      lastUnit = newUnit;
      renderAll();
    });
  }

  document.getElementById('btnPresetUser40').addEventListener('click', () => {
    document.getElementById('m1_Ac').value = 40;
    document.getElementById('m1_Aj').value = 40;
    document.getElementById('m1_V1_kV').value = 24;
    document.getElementById('m1_I1').value = 10;
    document.getElementById('m1_V2').value = 380;
    document.getElementById('m1_I2').value = 630;
    document.getElementById('m1_Bm').value = 1.65;
    document.getElementById('m1_J').value = 2.8;
    document.getElementById('m1_autoOil').checked = true;
    document.getElementById('m1_Env').value = 'tempo';
    renderAll();
  });

  document.getElementById('btnPresetCompact').addEventListener('click', () => {
    document.getElementById('m1_Ac').value = 285;
    document.getElementById('m1_Aj').value = 920;
    document.getElementById('m1_Bm').value = 1.72;
    document.getElementById('m1_J').value = 3.1;
    renderAll();
  });

  document.getElementById('btnPresetOverload').addEventListener('click', () => {
    document.getElementById('m1_Bm').value = 1.85;
    document.getElementById('m1_J').value = 4.2;
    renderAll();
  });

  // Topologia M3 (3F vs 1F)
  document.getElementById('btnFeeder3F').addEventListener('click', () => {
    state.m3Phases = '3F';
    document.getElementById('btnFeeder3F').classList.add('active');
    document.getElementById('btnFeeder1F').classList.remove('active');
    document.getElementById('m3_Vll').value = 380;
    renderAll();
  });
  document.getElementById('btnFeeder1F').addEventListener('click', () => {
    state.m3Phases = '1F';
    document.getElementById('btnFeeder1F').classList.add('active');
    document.getElementById('btnFeeder3F').classList.remove('active');
    document.getElementById('m3_Vll').value = 220;
    renderAll();
  });

  // Todos os inputs recalculam em tempo real
  document.querySelectorAll('input, select').forEach(inp => {
    inp.addEventListener('input', renderAll);
    inp.addEventListener('change', renderAll);
  });

  // Controles de Zoom e Cotas do SVG
  document.getElementById('btnToggleCotas').addEventListener('click', (e) => {
    state.showCotas = !state.showCotas;
    e.currentTarget.classList.toggle('active', state.showCotas);
    renderAll();
  });
  document.getElementById('btnZoomIn').addEventListener('click', () => {
    state.zoom = Math.min(1.45, +(state.zoom + 0.1).toFixed(2));
    document.getElementById('lblZoomPct').textContent = `${Math.round(state.zoom * 100)}%`;
    renderAll();
  });
  document.getElementById('btnZoomOut').addEventListener('click', () => {
    state.zoom = Math.max(0.7, +(state.zoom - 0.1).toFixed(2));
    document.getElementById('lblZoomPct').textContent = `${Math.round(state.zoom * 100)}%`;
    renderAll();
  });
  document.getElementById('btnZoomReset').addEventListener('click', () => {
    state.zoom = 1.0;
    document.getElementById('lblZoomPct').textContent = '100%';
    renderAll();
  });

  // Seletor de Linguagem de Script (Aba 6 e Modal)
  document.querySelectorAll('[data-script-lang], [data-modal-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.scriptLang = btn.getAttribute('data-script-lang') || btn.getAttribute('data-modal-lang');
      document.querySelectorAll('[data-script-lang], [data-modal-lang]').forEach(b => {
        const l = b.getAttribute('data-script-lang') || b.getAttribute('data-modal-lang');
        b.classList.toggle('active', l === state.scriptLang);
      });
      renderAll();
    });
  });

  // Copiar Script
  function copyCurrentScript(btnEl) {
    const txt = document.getElementById('preScriptContent').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt);
      const orig = btnEl.textContent;
      btnEl.textContent = '✓ Copiado!';
      setTimeout(() => { btnEl.textContent = orig; }, 1800);
    }
  }
  document.getElementById('btnCopyScriptInline').addEventListener('click', function() { copyCurrentScript(this); });
  document.getElementById('btnCopyModalScript').addEventListener('click', function() { copyCurrentScript(this); });

  // Modal de Exportação
  document.getElementById('btnOpenModal').addEventListener('click', () => {
    document.getElementById('exportModal').classList.remove('hidden');
  });
  document.getElementById('btnCloseModal').addEventListener('click', () => {
    document.getElementById('exportModal').classList.add('hidden');
  });
  document.getElementById('btnDoneModal').addEventListener('click', () => {
    document.getElementById('exportModal').classList.add('hidden');
  });

  // Botão de Impressão A4 (Abre a Aba 4 da Folha de Dados WEG e imprime)
  document.getElementById('btnPrintReport').addEventListener('click', () => {
    document.querySelector('[data-tab="table"]').click();
    setTimeout(() => window.print(), 150);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  renderAll();
});
