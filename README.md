# VOLT-CAD v5.0 — Dimensionador WEG DT-11, Trafo E-I & NBR 5410

Workbench de Engenharia Elétrica 100% client-side / offline para dimensionamento normativo de transformadores e alimentadores de baixa tensão.

## 🌐 Acesso Online (GitHub Pages)
Acesse diretamente no navegador:
- **Aplicação Web:** https://victorvolkart100-code.github.io/dimensionador-weg-volt-cad/
- **Versão Única Offline (1 arquivo):** [`Dimensionador_WEG_Unico_Offline.html`](Dimensionador_WEG_Unico_Offline.html)

## ⚙️ Módulos Integrados

1. **[M1] Transformador Trifásico a Óleo (WEG DT-11 / ABNT NBR 5356 / NBR 5440)**
   - Dimensionamento magnético ($A_c$, $A_j$, $B_m$, $J$, $K_u$), espiras, camadas, resistência $R_{75^\circ\text{C}}$ e nível de isolamento NBI.
   - Seleção normativa de óleo isolante (Mineral Tipo A/B, Vegetal FR3, Silicone), cálculo volumétrico (tanque + radiadores + conservador) e vida útil térmica (ABNT NBR 5416).
   - Folha de dados técnicos completa no padrão WEG DT-11.

2. **[M2] Transformador Monofásico Núcleo E-I (IEC 60076 / Martignoni)**
   - Entrada por Potência ($S$) ou Corrente ($I_2$), modo automático ($K_c$) ou manual por medidas da lâmina e janela ($a, b, L_j, H_j$).
   - Seleção de bitolas AWG, cálculo de ocupação da janela ($K_u\%$), regulação de tensão ($\Delta V\%$), rendimento ($\eta\%$), dimensões externas e peso total.
   - Diagnóstico normativo em tempo real e otimizador automático para enquadramento integral na norma.

3. **[M3] Alimentador de Baixa Tensão (ABNT NBR 5410)**
   - Dimensionamento de cabos de cobre de $1{,}5\text{ mm}^2$ a $300\text{ mm}^2$ (PVC 70 °C e XLPE/EPR 90 °C), com suporte a condutores em paralelo por fase para altas potências.
   - Fatores de correção ($FCA$, $FCT$), queda de tensão ($\Delta V\%$), perdas Joule e coordenação de disjuntores WEG ($I_b \le I_n \le I_z'$).
