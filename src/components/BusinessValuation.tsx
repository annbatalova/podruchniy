import React, { useState, useEffect, useMemo } from 'react';
import Button from './Button';
import { 
  TrendingUp, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  Coins, 
  LineChart, 
  Table, 
  Info, 
  GitCommit, 
  Layers, 
  DollarSign, 
  Settings2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Company } from '../types';

interface BusinessValuationProps {
  company: Company;
}

// Preset Multipliers based on industry
const INDUSTRY_MULTIPLIERS: Record<string, { pe: number; ps: number; pb: number; evEbitda: number }> = {
  'Авиастроение': { pe: 8.5, ps: 1.8, pb: 2.2, evEbitda: 6.8 },
  'Оптовая торговля': { pe: 4.8, ps: 0.35, pb: 1.1, evEbitda: 3.8 },
  'Информационные технологии': { pe: 14.5, ps: 3.2, pb: 5.5, evEbitda: 10.5 },
  'Банковский сектор': { pe: 5.2, ps: 1.1, pb: 0.9, evEbitda: 4.5 },
  'Строительство': { pe: 5.5, ps: 0.6, pb: 1.4, evEbitda: 4.2 }
};

export default function BusinessValuation({ company }: BusinessValuationProps) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(true);
  const [selectedSubTab, setSelectedSubTab] = useState<'multipliers' | 'dcf' | 'capitalization'>('multipliers');
  const [dcfFlowType, setDcfFlowType] = useState<'fcff' | 'fcfe'>('fcff');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Grab company default financials
  const baseFinancials = company.financials[company.financials.length - 1]; // Latest year

  // --- Form fields state ---
  const [evaluationDate, setEvaluationDate] = useState('26.05.2026');
  const [selectedIndustry, setSelectedIndustry] = useState<string>(() => {
    if (company.id === '7707083893') return 'Банковский сектор';
    if (company.id === '6234160787') return 'Оптовая торговля';
    return 'Авиастроение';
  });

  // Numeric inputs in million rubles
  const [revenue, setRevenue] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);
  const [equity, setEquity] = useState<number>(0);
  const [assets, setAssets] = useState<number>(0);

  const [interestIncome, setInterestIncome] = useState<number>(12.5);
  const [interestExpenses, setInterestExpenses] = useState<number>(8.2);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [capex, setCapex] = useState<number>(15.0);
  const [netDebt, setNetDebt] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(15.0);
  const [sga, setSga] = useState<number>(0); // SGA (коммерческие и управленческие)
  const [cash, setCash] = useState<number>(0); // cash & equivalents
  const [depreciation, setDepreciation] = useState<number>(0);
  const [otherOpIncome, setOtherOpIncome] = useState<number>(5.0);
  const [otherNonOpIncome, setOtherNonOpIncome] = useState<number>(2.0);
  const [workingCapitalChange, setWorkingCapitalChange] = useState<number>(2.5);
  const [onaOnoDiff, setOnaOnoDiff] = useState<number>(1.1);
  const [growthRateG, setGrowthRateG] = useState<number>(3.0);

  // Sync state values when company changes
  useEffect(() => {
    if (baseFinancials) {
      const revM = baseFinancials.revenue / 1000;
      const profitM = baseFinancials.netProfit / 1000;
      const eqM = baseFinancials.equity / 1000;
      const asM = baseFinancials.assets / 1000;

      setRevenue(Math.round(revM * 10) / 10);
      setNetProfit(Math.round(profitM * 10) / 10);
      setEquity(Math.round(eqM * 10) / 10);
      setAssets(Math.round(asM * 10) / 10);

      // Default helper assignments
      const calculatedNetDebt = Math.round((asM - eqM) * 0.5 * 10) / 10;
      setNetDebt(calculatedNetDebt > 0 ? calculatedNetDebt : 15);
      setSga(Math.round(revM * 0.12 * 10) / 10);
      setCash(Math.round(asM * 0.08 * 10) / 10);
      setDepreciation(Math.round(asM * 0.04 * 10) / 10);

      if (company.id === '7707083893') setSelectedIndustry('Банковский сектор');
      else if (company.id === '6234160787') setSelectedIndustry('Оптовая торговля');
      else setSelectedIndustry('Авиастроение');
    }
  }, [company, baseFinancials]);

  // Retrieve current multipliers
  const multipliers = useMemo(() => {
    return INDUSTRY_MULTIPLIERS[selectedIndustry] || INDUSTRY_MULTIPLIERS['Авиастроение'];
  }, [selectedIndustry]);

  // --- Dynamic calculations ---
  const calculatedMetrics = useMemo(() => {
    // 1. EBITDA estimate = Operating profit + Depreciation. Or rough estimate: Net Profit + Interest + Tax + Depreciation
    // For simplicity: EBITDA = EBIT + Depreciation
    // EBIT = Revenue - cost - SGA (Operating margin baseline)
    const costEstimated = revenue * 0.7; // default implicit cost of sale is 70% if not specified
    const EBIT = Math.round((revenue - costEstimated - sga + otherOpIncome) * 10) / 10;
    const EBITDA = Math.round((EBIT + depreciation) * 10) / 10;

    // --- Scomparative approach details (Multipliers) ---
    const peEquity = Math.round((netProfit * multipliers.pe) * 10) / 10;
    const peEV = Math.round((peEquity + netDebt - cash) * 10) / 10;

    const psEquity = Math.round((revenue * multipliers.ps) * 10) / 10;
    const psEV = Math.round((psEquity + netDebt - cash) * 10) / 10;

    const pbEquity = Math.round((equity * multipliers.pb) * 10) / 10;
    const pbEV = Math.round((pbEquity + netDebt - cash) * 10) / 10;

    const evEbitdaEV = Math.round((EBITDA * multipliers.evEbitda) * 10) / 10;
    const evEbitdaEquity = Math.round((evEbitdaEV - netDebt + cash) * 10) / 10;

    // Total average equity from multipliers (simple average of P/E, P/S, P/B and EV/EBITDA equity estimates)
    const averageMultiplierEquity = Math.round(((peEquity + psEquity + pbEquity + evEbitdaEquity) / 4) * 10) / 10;

    // --- Income approach details (DCF Discounted Cash Flows) ---
    // Make 4 years forecasting
    const dcfYears = Array.from({ length: 4 }).map((_, i) => {
      const yearIndex = i + 1;
      // Assume a 5% forecast growth rate for years 1-4
      const growthFactor = Math.pow(1 + 0.05, yearIndex);
      const projRev = Math.round((revenue * growthFactor) * 10) / 10;
      const projEBIT = Math.round((EBIT * growthFactor) * 10) / 10;
      const projNOPAT = Math.round((projEBIT * (1 - taxRate / 100)) * 10) / 10;
      
      // FCFF = NOPAT + Depr - Capex - Change WC
      const projFCFF = Math.round((projNOPAT + depreciation * growthFactor - capex * growthFactor - workingCapitalChange) * 10) / 10;
      
      // FCFE = NetProfit + Depr - Capex - Change WC + Net debt addition
      const projNetProfit = Math.round((netProfit * growthFactor) * 10) / 10;
      const projFCFE = Math.round((projNetProfit + depreciation * growthFactor - capex * growthFactor - workingCapitalChange + 5) * 10) / 10;

      const chosenFlow = dcfFlowType === 'fcff' ? projFCFF : projFCFE;

      // Discount factor using mid-year discounting (period - 0.5)
      const discountFactor = Math.round((1 / Math.pow(1 + discountRate / 100, yearIndex - 0.5)) * 1000) / 1000;
      const pv = Math.round((chosenFlow * discountFactor) * 10) / 10;

      return {
        year: `Год ${yearIndex}`,
        date: `31.12.${2025 + yearIndex}`,
        rev: projRev,
        ebit: projEBIT,
        nopat: projNOPAT,
        flow: chosenFlow,
        degree: yearIndex - 0.5,
        factor: discountFactor,
        pv: pv
      };
    });

    const sumPVFlows = Math.round(dcfYears.reduce((sum, y) => sum + y.pv, 0) * 10) / 10;
    
    // Terminal value
    // TV = Flow_4 * (1+g) / (r - g)
    const flowLast = dcfYears[dcfYears.length - 1].flow;
    const gRate = growthRateG / 100;
    const dRate = discountRate / 100;
    const tvInMillions = dRate > gRate ? (flowLast * (1 + gRate)) / (dRate - gRate) : (flowLast * 1.03) / 0.12;
    const pvFactorLast = dcfYears[dcfYears.length - 1].factor;
    const sumPVTerminal = Math.round((tvInMillions * pvFactorLast) * 10) / 10;

    const totalDCF_EV = Math.round((sumPVFlows + sumPVTerminal) * 10) / 10;
    const totalDCF_Equity = dcfFlowType === 'fcff' 
      ? Math.round((totalDCF_EV - netDebt + cash) * 10) / 10
      : totalDCF_EV; // FCFE already represents Equity directly

    // --- Capitalization Method ---
    const capRate = (discountRate - growthRateG) / 100;
    const stableCapRate = capRate > 0 ? capRate : 0.12;
    const firstForecastFlow = dcfYears[0].flow;
    const capValueRaw = firstForecastFlow / stableCapRate;

    const capValue_Equity = dcfFlowType === 'fcfe'
      ? Math.round(capValueRaw * 10) / 10
      : Math.round((capValueRaw - netDebt + cash) * 10) / 10;

    const capValue_EV = dcfFlowType === 'fcff'
      ? Math.round(capValueRaw * 10) / 10
      : Math.round((capValue_Equity + netDebt - cash) * 10) / 10;

    // --- Asset based approach ---
    const costBasedEquity = Math.round((equity + onaOnoDiff) * 10) / 10;

    return {
      EBIT,
      EBITDA,
      peEquity,
      peEV,
      psEquity,
      psEV,
      pbEquity,
      pbEV,
      evEbitdaEV,
      evEbitdaEquity,
      averageMultiplierEquity,
      dcfYears,
      sumPVFlows,
      sumPVTerminal,
      totalDCF_EV,
      totalDCF_Equity,
      capValue: capValue_Equity,
      capValue_Equity,
      capValue_EV,
      costBasedEquity
    };
  }, [revenue, netProfit, equity, assets, taxRate, capex, netDebt, discountRate, sga, depreciation, otherOpIncome, otherNonOpIncome, workingCapitalChange, onaOnoDiff, growthRateG, cash, multipliers, dcfFlowType, selectedIndustry]);

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* SECTION 1: MAIN SCORE / DISPLAY CARDS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-500" />
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            Оценка стоимости бизнеса
          </h2>
        </div>

        {/* The 3 key approach summary containers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Comparative */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-sky-500/30 transition-all duration-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Сравнительный подход (Мультипликаторы)
              </span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {calculatedMetrics.averageMultiplierEquity.toLocaleString('ru-RU')} млн ₽
              </div>
            </div>
            <div className="text-[10px] text-sky-600 font-semibold mt-2.5 flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span>Оценка Equity через {selectedIndustry}</span>
            </div>
          </div>

          {/* Income Approach */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-sky-500/30 transition-all duration-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Доходный подход (Модель DCF)
              </span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {calculatedMetrics.totalDCF_Equity.toLocaleString('ru-RU')} млн ₽
              </div>
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Дисконтирование потоков ({dcfFlowType.toUpperCase()})</span>
            </div>
          </div>

          {/* Asset/Cost-based Approach */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-sky-500/30 transition-all duration-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Затратный подход (Собственные средства)
              </span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {calculatedMetrics.costBasedEquity.toLocaleString('ru-RU')} млн ₽
              </div>
            </div>
            <div className="text-[10px] text-indigo-600 font-semibold mt-2.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>С учетом ОНА/ОНО разниц</span>
            </div>
          </div>

        </div>

        {/* Toggle details section */}
        <div className="flex justify-start">
          <Button
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
            variant="solid"
            className="px-4 py-2 shrink-0 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-sky-600/10"
          >
            <Settings2 className="w-4 h-4 text-white" />
            <span>{isCalculatorOpen ? 'Скрыть калькулятор' : 'Открыть калькулятор'}</span>
            <span className="opacity-70">
              {isCalculatorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </Button>
        </div>
      </div>

      {/* SECTION 2: WORKSPACE / DETAILED CALCULATOR FORM */}
      {isCalculatorOpen && (
        <div className="space-y-6">
          
          {/* A. INPUT FORMS BOX */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <Calculator className="w-4 h-4 text-sky-500" />
              Финансовые данные и макро-параметры контрагента
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1 */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Дата оценки</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={evaluationDate}
                    onChange={(e) => setEvaluationDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Выручка, млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                    value={revenue}
                    onChange={(e) => setRevenue(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Чистая прибыль, млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                    value={netProfit}
                    onChange={(e) => setNetProfit(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Собственный капитал, млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                    value={equity}
                    onChange={(e) => setEquity(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Активы баланса, млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={assets}
                    onChange={(e) => setAssets(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Отрасль сравнения</label>
                  <select
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                  >
                    {Object.keys(INDUSTRY_MULTIPLIERS).map((indName) => (
                      <option key={indName} value={indName}>{indName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Ставка налога на прибыль, %</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Чистый долг (Net Debt), млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold text-rose-650"
                    value={netDebt}
                    onChange={(e) => setNetDebt(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Денежные средства и экв., млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={cash}
                    onChange={(e) => setCash(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Управленческие и Комм., млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={sga}
                    onChange={(e) => setSga(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Ставка дисконтирования WACC / Ke, %</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Ежегодный CapEx, млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono hover:border-slate-300"
                    value={capex}
                    onChange={(e) => setCapex(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Амортизация (D&A), млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={depreciation}
                    onChange={(e) => setDepreciation(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Долгосрочный темп роста g, %</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={growthRateG}
                    onChange={(e) => setGrowthRateG(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Разность ОНА - ОНО, млн ₽</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={onaOnoDiff}
                    onChange={(e) => setOnaOnoDiff(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* B. DETAILED TABS BY METHODOLOGIES */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            
            {/* Nav within Methodologies */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1">
              <button
                onClick={() => setSelectedSubTab('multipliers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedSubTab === 'multipliers'
                    ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50'
                    : 'text-slate-550 hover:bg-white/40 text-slate-500'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Мультипликаторы
              </button>

              <button
                onClick={() => setSelectedSubTab('dcf')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedSubTab === 'dcf'
                    ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50'
                    : 'text-slate-550 hover:bg-white/40 text-slate-500'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                Дисконтированные потоки (DCF)
              </button>

              <button
                onClick={() => setSelectedSubTab('capitalization')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedSubTab === 'capitalization'
                    ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50'
                    : 'text-slate-550 hover:bg-white/40 text-slate-500'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                Метод капитализации
              </button>
            </div>

            <div className="p-6">
              
              {/* SUBTAB 1: MULTIPLIERS */}
              {selectedSubTab === 'multipliers' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Сравнительный подход — Результаты оценки по мультипликаторам
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Оценка бизнеса производится методом сопоставления финансовых баз компании с рыночными коэффициентами отрасли «{selectedIndustry}»
                    </p>
                  </div>

                  {/* Multipliers Matrix Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Метрика</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Отраслевой мультипликатор</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">База компании, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Оценка EV, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Оценка Equity, млн ₽</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        <tr className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                          <td className="p-4 font-black text-slate-900 dark:text-slate-100">P/E <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(чистая прибыль)</span></td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{multipliers.pe.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{netProfit.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right text-slate-400 dark:text-slate-500">{calculatedMetrics.peEV.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right font-bold text-sky-600 dark:text-sky-450">{calculatedMetrics.peEquity.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                          <td className="p-4 font-black text-slate-900 dark:text-slate-100">P/S <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(выручка)</span></td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{multipliers.ps.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{revenue.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right text-slate-400 dark:text-slate-500">{calculatedMetrics.psEV.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right font-bold text-sky-600 dark:text-sky-450">{calculatedMetrics.psEquity.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                          <td className="p-4 font-black text-slate-900 dark:text-slate-100">P/B <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(собственный капитал)</span></td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{multipliers.pb.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{equity.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right text-slate-400 dark:text-slate-500">{calculatedMetrics.pbEV.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right font-bold text-sky-600 dark:text-sky-450">{calculatedMetrics.pbEquity.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                          <td className="p-4 font-black text-slate-900 dark:text-slate-100">EV/EBITDA <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">(операционная EBITDA)</span></td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{multipliers.evEbitda.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right text-slate-700 dark:text-slate-400">{calculatedMetrics.EBITDA.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right font-bold text-indigo-600 dark:text-indigo-400">{calculatedMetrics.evEbitdaEV.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                          <td className="p-4 font-mono text-right font-bold text-sky-600 dark:text-sky-450">{calculatedMetrics.evEbitdaEquity.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Single estimates details & Final simple average */}
                  <div className="bg-slate-50/50 p-5 border border-slate-200 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 text-[10px] block font-bold uppercase mb-0.5">P/E (equity)</span>
                        <strong className="font-mono font-black text-slate-800">{calculatedMetrics.peEquity} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-bold uppercase mb-0.5">P/S (equity)</span>
                        <strong className="font-mono font-black text-slate-800">{calculatedMetrics.psEquity} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-bold uppercase mb-0.5">P/B (equity)</span>
                        <strong className="font-mono font-black text-slate-800">{calculatedMetrics.pbEquity} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-bold uppercase mb-0.5">EV/EBITDA (EV)</span>
                        <strong className="font-mono font-black text-indigo-600">{calculatedMetrics.evEbitdaEV} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-bold uppercase mb-0.5">EV/EBITDA (equity)</span>
                        <strong className="font-mono font-black text-slate-800">{calculatedMetrics.evEbitdaEquity} млн ₽</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-250 border-slate-200">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-extrabold leading-none shadow-sm shadow-sky-500/10">
                        Средняя оценка equity (простая): {calculatedMetrics.averageMultiplierEquity.toLocaleString('ru-RU')} млн ₽
                      </span>
                    </div>
                  </div>

                  {/* Commentary block */}
                  <div className="p-4 border border-sky-100 rounded-2xl bg-sky-50/20 text-xs text-slate-500 leading-relaxed space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-sky-600 shrink-0" />
                      Аналитическая заметка по мультипликаторам
                    </div>
                    <div>
                      Отраслевая база определена на основе медианных рыночных мультипликаторов по отрасли «{selectedIndustry}».
                      Мультипликаторы P/E, P/S и P/B дают прямые ориентиры капитализации (Equity), в то время как EV/EBITDA формирует стоимость всего предприятия (EV) с последующим переходом к собственному капиталу через вычитание Чистого долга ({netDebt} млн ₽) и возвращением свободных Денежных средств ({cash} млн ₽).
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: DISCOUNTED CASH FLOW (DCF) */}
              {selectedSubTab === 'dcf' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Доходный подход — Модель многопериодного дисконтирования денежных потоков (DCF)
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Прогнозирование денежных потоков на 4 года с расчетом терминальной стоимости по ставке дисконтирования {discountRate}%
                      </p>
                    </div>

                    {/* Flow Type selector */}
                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                      <button
                        onClick={() => setDcfFlowType('fcff')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          dcfFlowType === 'fcff'
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        FCFF (инвест капитал)
                      </button>
                      <button
                        onClick={() => setDcfFlowType('fcfe')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          dcfFlowType === 'fcfe'
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        FCFE (собственный капитал)
                      </button>
                    </div>
                  </div>

                  {/* Flow Projections Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Период</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Дата конца периода</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Выручка, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">EBIT, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">NOPAT, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">{dcfFlowType.toUpperCase()}, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Степень дисконта</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Дисконт-фактор</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Текущая стоимость (PV), млн ₽</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {calculatedMetrics.dcfYears.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                            <td className="p-4 font-black text-slate-900 dark:text-slate-100">{row.year}</td>
                            <td className="p-4 font-sans text-slate-400 dark:text-slate-500">{row.date}</td>
                            <td className="p-4 font-mono text-right">{row.rev.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                            <td className="p-4 font-mono text-right">{row.ebit.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                            <td className="p-4 font-mono text-right">{row.nopat.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                            <td className="p-4 font-mono text-right font-bold text-slate-800 dark:text-slate-200">{row.flow.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                            <td className="p-4 font-mono text-right text-slate-500 dark:text-slate-400">{row.degree.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                            <td className="p-4 font-mono text-right text-slate-500 dark:text-slate-400">{row.factor.toLocaleString('ru-RU', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                            <td className="p-4 font-mono text-right font-black text-sky-600 dark:text-sky-400">{row.pv.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} млн ₽</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Flow summary variables & Final Enterprise / Equity Values */}
                  <div className="bg-slate-50/50 p-5 border border-slate-200 rounded-2xl space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">EBIT (базовый)</span>
                        <strong className="font-mono text-slate-800">{calculatedMetrics.EBIT} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">FCFF (базовый)</span>
                        <strong className="font-mono text-slate-800">
                          {Math.round((calculatedMetrics.EBIT * (1 - taxRate / 100) + depreciation - capex - workingCapitalChange) * 10) / 10} млн ₽
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">1-й Прогнозный Поток</span>
                        <strong className="font-mono text-slate-800">{calculatedMetrics.dcfYears[0].flow} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">PV потоков (4 года)</span>
                        <strong className="font-mono text-slate-800">{calculatedMetrics.sumPVFlows} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">PV terminal value</span>
                        <strong className="font-mono text-indigo-600">{calculatedMetrics.sumPVTerminal} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Метод дисконта</span>
                        <strong className="font-sans text-emerald-600 font-bold">Mid-year period</strong>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200 flex flex-wrap gap-2">
                      {dcfFlowType === 'fcff' ? (
                        <>
                          <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black font-mono">
                            Стоимость бизнеса (EV) по DCF: {calculatedMetrics.totalDCF_EV.toLocaleString('ru-RU')} млн ₽
                          </span>
                          <span className="px-3.5 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm shadow-emerald-500/10">
                            Стоимость капитала (equity): {calculatedMetrics.totalDCF_Equity.toLocaleString('ru-RU')} млн ₽
                          </span>
                        </>
                      ) : (
                        <span className="px-3.5 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm shadow-emerald-500/10">
                          Оценка по методу FCFE (equity): {calculatedMetrics.totalDCF_Equity.toLocaleString('ru-RU')} млн ₽
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Commentary block */}
                  <div className="p-4 border border-emerald-200 bg-emerald-50/20 text-xs text-slate-500 leading-relaxed space-y-1.5 rounded-2xl">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-600 select-none" />
                      Аналитическая заметка по DCF модели
                    </div>
                    <div>
                      Прогноз строится на основе темпов расширения операционной эффективности с выходом на стабильный терминальный уровень по формуле Гордона со скоростью долгосрочного роста <strong className="text-slate-700 font-bold">{growthRateG}%</strong>. Допущение mid-year discounting (дисконтирование на середину периода) предполагает непрерывное поступление средств в течение года, что делает оценку значительно точнее и реалистичнее.
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: CAPITALIZATION */}
              {selectedSubTab === 'capitalization' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Доходный подход — Метод капитализации прибыли
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Оценка бизнеса для стабильных компаний с постоянным уровнем чистого дохода по бессрочной ренте
                      </p>
                    </div>

                    {/* Flow Type selector */}
                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                      <button
                        onClick={() => setDcfFlowType('fcff')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          dcfFlowType === 'fcff'
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        FCFF (инвест капитал)
                      </button>
                      <button
                        onClick={() => setDcfFlowType('fcfe')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          dcfFlowType === 'fcfe'
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        FCFE (собственный капитал)
                      </button>
                    </div>
                  </div>

                  {/* Flow Projections Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Период</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Дата конца периода</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Выручка, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">EBIT, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">NOPAT, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">{dcfFlowType.toUpperCase()}, млн ₽</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Коэфф. капитализации</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Множитель (1/K)</th>
                          <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Капитализированная стоимость, млн ₽</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        <tr className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                          <td className="p-4 font-black text-slate-900 dark:text-slate-100">Год 1 (Прогноз)</td>
                          <td className="p-4 font-sans text-slate-400 dark:text-slate-500">{calculatedMetrics.dcfYears[0].date}</td>
                          <td className="p-4 font-mono text-right">{calculatedMetrics.dcfYears[0].rev.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                          <td className="p-4 font-mono text-right">{calculatedMetrics.dcfYears[0].ebit.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                          <td className="p-4 font-mono text-right">{calculatedMetrics.dcfYears[0].nopat.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                          <td className="p-4 font-mono text-right font-bold text-slate-800 dark:text-slate-200">{calculatedMetrics.dcfYears[0].flow.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                          <td className="p-4 font-mono text-right text-sky-600 font-bold">{(discountRate - growthRateG).toFixed(1)}%</td>
                          <td className="p-4 font-mono text-right text-slate-500">{(100 / (discountRate - growthRateG)).toFixed(3)}</td>
                          <td className="p-4 font-mono text-right font-black text-sky-600 dark:text-sky-400">
                            {dcfFlowType === 'fcff' 
                              ? calculatedMetrics.capValue_EV.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) 
                              : calculatedMetrics.capValue_Equity.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} млн ₽
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Flow summary variables or values */}
                  <div className="bg-slate-50/50 p-5 border border-slate-200 rounded-2xl space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">EBIT (базовый)</span>
                        <strong className="font-mono text-slate-800">{calculatedMetrics.EBIT} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">NOPAT (базовый)</span>
                        <strong className="font-mono text-slate-800">
                          {Math.round((calculatedMetrics.EBIT * (1 - taxRate / 100)) * 10) / 10} млн ₽
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold font-sans">Чистая прибыль NI</span>
                        <strong className="font-mono text-slate-800">{netProfit} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">{dcfFlowType.toUpperCase()} (базовый)</span>
                        <strong className="font-mono text-slate-800">
                          {dcfFlowType === 'fcff' 
                            ? Math.round((calculatedMetrics.EBIT * (1 - taxRate / 100) + depreciation - capex - workingCapitalChange) * 10) / 10
                            : Math.round((netProfit + depreciation - capex - workingCapitalChange + 5) * 10) / 10} млн ₽
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold text-indigo-600">Поток 1-го прогноза</span>
                        <strong className="font-mono text-indigo-600">{calculatedMetrics.dcfYears[0].flow} млн ₽</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold text-emerald-600">Коэфф-т r - g</span>
                        <strong className="font-sans text-emerald-600 font-bold">{(discountRate - growthRateG).toFixed(1)}% (капитализация)</strong>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200 flex flex-wrap gap-2">
                      {dcfFlowType === 'fcff' ? (
                        <>
                          <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black font-mono">
                            Стоимость бизнеса (EV) по методу капитализации: {calculatedMetrics.capValue_EV.toLocaleString('ru-RU')} млн ₽
                          </span>
                          <span className="px-3.5 py-1.5 bg-sky-500 text-white rounded-xl text-xs font-black shadow-sm shadow-sky-500/10">
                            Стоимость собственного капитала (equity): {calculatedMetrics.capValue_Equity.toLocaleString('ru-RU')} млн ₽
                          </span>
                        </>
                      ) : (
                        <span className="px-3.5 py-1.5 bg-sky-500 text-white rounded-xl text-xs font-black shadow-sm shadow-sky-500/10">
                          Оценка по методу капитализации (equity): {calculatedMetrics.capValue_Equity.toLocaleString('ru-RU')} млн ₽
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Commentary block */}
                  <div className="p-4 border border-sky-100 bg-sky-50/20 text-xs text-slate-500 leading-relaxed space-y-1.5 rounded-2xl">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-sky-600 shrink-0" />
                      Аналитическая заметка по методу капитализации прибыли
                    </div>
                    <div>
                      Метод капитализации прибыли представляет собой упрощенную версию DCF-модели Гордона, предполагающую одинаковый объем дивидендного/чистого потока, сохраняющегося неограниченный период времени при стабильном долгосрочном темпе прироста <strong className="text-slate-700 font-bold">{growthRateG}%</strong>. Дилинговые поправки на чистый долг ({netDebt} млн ₽) and свободные денежные средства ({cash} млн ₽) вносятся при выборе типа потока FCFF для перехода к оценке капитала (Equity).
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* C. GENERAL SYSTEM ACCORDION FOR METHODOLOGY */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <button
              onClick={() => setIsMethodologyOpen(!isMethodologyOpen)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2 text-slate-800">
                <Info className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Краткая методика оценки стоимости бизнеса</span>
              </div>
              <span className="text-slate-450 text-slate-400">
                {isMethodologyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {isMethodologyOpen && (
              <div className="p-6 border-t border-slate-100 text-xs text-slate-550 leading-relaxed space-y-5 text-slate-600 bg-slate-50/20 max-w-none">
                
                <div className="space-y-2">
                  <h5 className="font-extrabold text-slate-850 text-slate-900 flex items-center gap-1.5">
                    <GitCommit className="w-4 h-4 text-sky-500 shrink-0" />
                    Доходный подход (DCF - Discounted Cash Flows)
                  </h5>
                  <p>
                    В рамках доходного подхода строится модель дисконтированных денежных потоков (DCF) на основе финансовых операционных бюджетов контрагента.
                    Исходные показатели баланса и результатов (выручка, себестоимость, расходы, прочие операционные доходы/расходы) преобразуются в показатели <strong className="text-slate-800 font-bold">EBIT</strong> (прибыль до вычета процентов и налогов) и <strong className="text-slate-800 font-bold">NOPAT</strong>.
                    Свободные денежные потоки (FCFF) рассчитываются как сумма NOPAT и амортизационных начислений за вычетом капитальных затрат (CapEx) и изменений в чистом оборотном капитале.
                    Для оценки собственного капитала (Equity), полученная суммарная дисконтированная стоимость предприятия (Enterprise Value) корректируется на фактический чистый долг (Net Debt) и свободные средства.
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <h5 className="font-extrabold text-slate-850 text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-500 shrink-0" />
                    Сравнительный подход (Мультипликаторы)
                  </h5>
                  <p>
                    В рамках сравнительного подхода выбираются репрезентативные мультипликаторы российских публичных корпораций или профильных ассоциаций за прошедший торговый год (коэффициенты P/E, P/S, P/B, EV/EBITDA).
                    Для каждого соответствующего базиса оцениваемой компании (чистая прибыль, выручка, собственный капитал, EBITDA) применяется мультипликатор, что в результате формирует несколько параллельных ценовых ориентиров собственного капитала или Enterprise Value, которые затем объединяются в интегральную среднюю оценку.
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <h5 className="font-extrabold text-slate-850 text-slate-900 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-sky-500 shrink-0" />
                    Метод капитализации и затратный подход
                  </h5>
                  <p>
                    Метод капитализации используется как вспомогательный маркер устойчивости для устоявшихся зрелых компаний при отсутствии значительных колебаний на рынках.
                    Затратный подход основывается на фактической стоимости чистых активов по строке собственного баланса капитала, скорректированного на имеющиеся внебалансовые налоговые активы (Разность ОНА - ОНО).
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
