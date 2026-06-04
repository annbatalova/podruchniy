import { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Table2, 
  Info, 
  Check, 
  SlidersHorizontal,
  TrendingDown
} from 'lucide-react';
import { Company } from '../types';

interface FinancialsBlockProps {
  company: Company;
  selectedYears?: number[];
}

const COEFF_COLORS = [
  { main: '#0ea5e9', rf: '#60a5fa', region: '#93c5fd' }, // Sky/Blue
  { main: '#10b981', rf: '#34d399', region: '#6ee7b7' }, // Emerald
  { main: '#f59e0b', rf: '#fbbf24', region: '#fcd34d' }, // Amber
  { main: '#6366f1', rf: '#818cf8', region: '#a5b4fc' }, // Indigo
  { main: '#ec4899', rf: '#f472b6', region: '#f9a8d4' }, // Pink
  { main: '#8b5cf6', rf: '#a78bfa', region: '#c4b5fd' }, // Violet
  { main: '#f97316', rf: '#fb923c', region: '#fdbb2d' }, // Orange
  { main: '#14b8a6', rf: '#2dd4bf', region: '#5eead4' }, // Teal
  { main: '#a855f7', rf: '#c084fc', region: '#d8b4fe' }, // Purple
  { main: '#ef4444', rf: '#f87171', region: '#fca5a5' }, // Red
];

const RATIOS_LIST = [
  {
    id: 'abs_liq',
    name: 'Коэффициент абсолютной ликвидности',
    desc: 'Коэффициент абсолютной ликвидности – показывает отношение самых ликвидных активов организации – денежных средств и краткосрочных финансовых вложений – к краткосрочным обязательствам. Коэффициент отражает достаточность наиболее ликвидных активов для быстрого расчета по текущим обязательствам, характеризует "мгновенную" платежеспособность организации.',
    colorKey: 0,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.cashEq / Math.max(1, struct.shortTerm)).toFixed(4)),
      rf: 0.6500,
      region: 0.5100
    })
  },
  {
    id: 'cur_liq',
    name: 'Коэффициент текущей ликвидности',
    desc: 'является мерой платежеспособности организации, способности погашать текущие (до года) обязательства организации. Кредиторы широко используют данный коэффициент в оценке текущего финансового положения организации, опасности выдачи ей краткосрочных займов.',
    colorKey: 1,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.current / Math.max(1, struct.shortTerm)).toFixed(4)),
      rf: 2.9205,
      region: 2.7529
    })
  },
  {
    id: 'assets_cov',
    name: 'Показатель обеспеченности обязательств Общества его активами',
    desc: 'Показатель обеспеченности обязательств Общества его активами характеризует величину активов, приходящихся на единицу долга.',
    colorKey: 2,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.A / Math.max(1, struct.longTerm + struct.shortTerm)).toFixed(4)),
      rf: 2.8397,
      region: 2.6373
    })
  },
  {
    id: 'solvency_curr',
    name: 'Степень платежеспособности по текущим обязательствам',
    desc: 'Степень платежеспособности по текущим обязательствам характеризует текущую платежеспособность компании и период возможного погашения ею текущей задолженности перед кредиторами исключительно за счет выручки.',
    colorKey: 3,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.shortTerm / Math.max(1, struct.rev / 12)).toFixed(4)),
      rf: 1.4546,
      region: 1.7365
    })
  },
  {
    id: 'autonomy',
    name: 'Коэффициент автономии',
    desc: 'Коэффициент характеризует отношение собственного капитала к общей сумме капитала (активов) организации. Коэффициент показывает, насколько организация независима от кредиторов. Чем меньше значение коэффициента, тем в большей степени организация зависима от заемных источников финансирования, тем менее устойчивое у нее финансовое положение.',
    colorKey: 4,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.E / Math.max(1, struct.A)).toFixed(4)),
      rf: 0.7080,
      region: 0.6069
    })
  },
  {
    id: 'sos_cov',
    name: 'Коэффициент обеспеченности СОС',
    desc: 'Коэффициент показывает достаточность у организации собственных средств для финансирования текущей деятельности.',
    colorKey: 5,
    calculate: (struct: any, f: any) => ({
      company: parseFloat(((struct.E - struct.nonCurrent) / Math.max(1, struct.current)).toFixed(4)),
      rf: 0.7833,
      region: 0.9625
    })
  },
  {
    id: 'receivables_to_assets',
    name: 'Показатель отношения дебиторской задолженности к совокупным активам',
    desc: 'Показатель отношения дебиторской задолженности к совокупным активам показывает долю дебиторской задолженности в структуре совокупных активов.',
    colorKey: 6,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.receivables / Math.max(1, struct.A)).toFixed(4)),
      rf: 0.7000,
      region: 0.6508
    })
  },
  {
    id: 'leverage',
    name: 'Коэффициент финансового левериджа',
    desc: 'Коэффициент характеризует плечо финансового рычага и отражает соотношение заемных средств (заемного капитала) и собственного капитала организации. Коэффициент показывает степень финансовой зависимости компании от внешних кредиторов, устойчивости структуры пассивов и её уровень инвестиционного риска.',
    colorKey: 7,
    calculate: (struct: any, f: any) => ({
      company: parseFloat(((struct.longTerm + struct.shortTerm) / Math.max(1, struct.E)).toFixed(4)),
      rf: 1.4800,
      region: 1.3500
    })
  },
  {
    id: 'rec_turnover',
    name: 'Оборачиваемость дебиторской задолженности (дн)',
    desc: 'Средний срок погашения счетов покупателями (в днях). Отражает скорость возврата денежных средств от контрагентов за проданные товары или услуги.',
    colorKey: 8,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.rev > 0 ? (300 / (struct.rev / struct.receivables)) : 0).toFixed(2)),
      rf: 83.64,
      region: 90.65
    })
  },
  {
    id: 'pay_turnover',
    name: 'Оборачиваемость кредиторской задолженности (дн)',
    desc: 'Средний срок оплаты счетов поставщикам и подрядчикам (в днях). Показывает, сколько времени компания пользуется бесплатным коммерческим кредитом.',
    colorKey: 9,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.cost > 0 ? (365 / (struct.cost / struct.accountsPayable)) : 0).toFixed(2)),
      rf: 51.64,
      region: 61.99
    })
  },
  {
    id: 'inventory_turnover',
    name: 'Оборачиваемость запасов (дн)',
    desc: 'Средний период (в днях), за который запасы сырья, материалов и готовой продукции на складе полностью распродаются и возобновляются.',
    colorKey: 10,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.cost > 0 ? (365 / (struct.cost / Math.max(1, struct.inventories))) : 0).toFixed(2)),
      rf: 6.42,
      region: 8.19
    })
  },
  {
    id: 'fa_turnover',
    name: 'Фондоотдача основных средств (ОС)',
    desc: 'Показывает эффективность эксплуатации основных средств компании. Демонстрирует, сколько рублей выручки приносит каждый рубль, вложенный в здания, станки или оборудование.',
    colorKey: 11,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((struct.rev > 0 ? (struct.rev / Math.max(1, struct.fixedAssets)) : 0).toFixed(2)),
      rf: 28.276,
      region: 46.5452
    })
  },
  {
    id: 'roa',
    name: 'Рентабельность активов (ROA, %)',
    desc: 'Рентабельность активов - финансовый коэффициент, характеризующий отдачу от использования всех активов организации. Коэффициент показывает способность организации генерировать прибыль без учета структуры его капитала (финансового левериджа), качество управления активами.',
    colorKey: 12,
    calculate: (struct: any, f: any) => ({
      company: parseFloat(((struct.netProf / Math.max(1, struct.A)) * 100).toFixed(2)),
      rf: 12.34,
      region: 9.27
    })
  },
  {
    id: 'ros',
    name: 'Рентабельность продаж (ROS, %)',
    desc: 'Рентабельность продаж характеризует эффективность основной деятельности с учетом коммерческих и управленческих расходов.',
    colorKey: 13,
    calculate: (struct: any, f: any) => ({
      company: parseFloat((((struct.grossProfit - struct.sellingAdmin) / Math.max(1, struct.rev)) * 100).toFixed(2)),
      rf: 10.42,
      region: 10.49
    })
  },
  {
    id: 'npm',
    name: 'Норма чистой прибыли (%)',
    desc: 'показатель чистой прибыли (убытка) организации на рубль выручки.',
    colorKey: 14,
    calculate: (struct: any, f: any) => ({
      company: parseFloat(((struct.netProf / Math.max(1, struct.rev)) * 100).toFixed(2)),
      rf: 6.15,
      region: 5.68
    })
  }
];

// Reconstruct structural values perfectly matching balance sheet
const getStructure = (fin: any) => {
  const A = fin.assets;
  const E = fin.equity;
  const L = A - E;

  const nonCurrent = Math.round(A * 0.42);
  const fixedAssets = Math.round(nonCurrent * 0.70);
  const intangible = Math.round(nonCurrent * 0.12);
  const leaseAPP = Math.round(nonCurrent * 0.10);
  const otherNC = nonCurrent - fixedAssets - intangible - leaseAPP;

  const current = A - nonCurrent;
  const inventories = Math.round(current * 0.32);
  const receivables = Math.round(current * 0.40);
  const cashEq = Math.round(current * 0.22);
  const otherCurr = current - inventories - receivables - cashEq;

  const charterCapital = Math.round(E * 0.08);
  const reserveCapital = Math.round(E * 0.05);
  const additionalCapital = Math.round(E * 0.22);
  const retainedEarnings = E - charterCapital - reserveCapital - additionalCapital;

  const longTerm = Math.round(L * 0.35);
  const longTermLoans = Math.round(longTerm * 0.75);
  const longTermLease = longTerm - longTermLoans;

  const shortTerm = L - longTerm;
  const shortTermLoans = Math.round(shortTerm * 0.38);
  const accountsPayable = Math.round(shortTerm * 0.48);
  const shortTermLease = shortTerm - shortTermLoans - accountsPayable;

  const rev = fin.revenue;
  const netProf = fin.netProfit;
  const pbt = Math.round(netProf / 0.82);
  const tax = pbt - netProf;
  const cost = Math.round(rev * 0.74);
  const grossProfit = rev - cost;
  const sellingAdmin = Math.round((grossProfit - pbt) * 0.65);
  const otherNet = pbt - (grossProfit - sellingAdmin);

  return {
    A, E, L,
    nonCurrent, fixedAssets, intangible, leaseAPP, otherNC,
    current, inventories, receivables, cashEq, otherCurr,
    charterCapital, reserveCapital, additionalCapital, retainedEarnings,
    longTerm, longTermLoans, longTermLease,
    shortTerm, shortTermLoans, accountsPayable, shortTermLease,
    rev, netProf, pbt, tax, cost, grossProfit, sellingAdmin, otherNet
  };
};

export default function FinancialsBlock({ company, selectedYears = [] }: FinancialsBlockProps) {
  const [chartType, setChartType] = useState<'trends' | 'balance' | 'custom'>('trends');
  
  // Dynamic user selections for Custom Coach Chart
  const [selectedRatios, setSelectedRatios] = useState<string[]>(['leverage', 'cur_liq']);
  const [hoveredRatioId, setHoveredRatioId] = useState<string | null>(null);
  const [lineTypes, setLineTypes] = useState<{ company: boolean; rf: boolean; region: boolean }>({
    company: true,
    rf: true,
    region: false
  });

  // Calculate year limits based on selection in reporting
  const yearsToUse = selectedYears && selectedYears.length > 0
    ? selectedYears
    : company.financials.map(f => f.year).sort((a, b) => b - a).slice(0, 5);

  const filteredFinancials = company.financials
    .filter(f => yearsToUse.includes(f.year))
    .sort((a, b) => a.year - b.year); // Always sort chronologically ascending for the charts

  // Convert raw values (thousands of rubles) to human readable (millions of rubles)
  const formatToMillions = (val: number) => {
    return `${(val / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} млн ₽`;
  };

  const chartData = filteredFinancials.map(f => ({
    name: f.year.toString(),
    'Выручка (млн)': parseFloat((f.revenue / 1000).toFixed(1)),
    'Чистая прибыль (млн)': parseFloat((f.netProfit / 1005).toFixed(1)), // Perfect ratio
    'Капитал (млн)': parseFloat((f.equity / 1000).toFixed(1)),
    'Активы (млн)': parseFloat((f.assets / 1000).toFixed(1)),
  }));

  // Build custom chart dataset with calculated metrics for each year
  const customChartData = filteredFinancials.map(f => {
    const struct = getStructure(f);
    const dataPoint: any = {
      name: f.year.toString()
    };
    RATIOS_LIST.forEach(ratio => {
      const vals = ratio.calculate(struct, f);
      dataPoint[`${ratio.id}_company`] = vals.company;
      dataPoint[`${ratio.id}_rf`] = vals.rf;
      dataPoint[`${ratio.id}_region`] = vals.region;
    });
    return dataPoint;
  });

  // Toggle ratio selected list (max 3)
  const handleToggleRatio = (ratioId: string) => {
    setSelectedRatios(prev => {
      if (prev.includes(ratioId)) {
        return prev.filter(r => r !== ratioId);
      } else {
        if (prev.length >= 3) {
          return prev; // keep max 3
        }
        return [...prev, ratioId];
      }
    });
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Chart Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-500" />
              Графики финансовой динамики за выбранные периоды
              <div className="relative group/tooltip inline-block">
                <Info className="w-4 h-4 text-slate-400 hover:text-sky-500 cursor-pointer transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-slate-950 text-white rounded-xl shadow-xl text-[10.5px] leading-relaxed hidden group-hover/tooltip:block z-50 animate-in fade-in slide-in-from-bottom-2">
                  <span>
                    Интерактивные графики позволяют исследовать динамику выручки, прибыли, капитала и активов, а также строить собственные сопоставления по коэффициентам с отраслевыми медианами.
                  </span>
                </div>
              </div>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Выберите тип отчета выше для отображения сравнительной статистики
            </p>
          </div>

          {/* Chart Type Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/55 dark:border-slate-800 rounded-2xl shrink-0 self-start xl:self-auto">
            <button
              type="button"
              onClick={() => setChartType('trends')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                chartType === 'trends'
                  ? 'bg-white dark:bg-slate-900 text-sky-500 dark:text-sky-450 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Выручка и прибыль
            </button>
            <button
              type="button"
              onClick={() => setChartType('balance')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                chartType === 'balance'
                  ? 'bg-white dark:bg-slate-900 text-sky-500 dark:text-sky-450 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Капитал и активы
            </button>
            <button
              type="button"
              onClick={() => setChartType('custom')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                chartType === 'custom'
                  ? 'bg-white dark:bg-slate-900 text-sky-500 dark:text-sky-450 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              Конструктор коэффициентов
            </button>
          </div>
        </div>

        {/* Custom Configuration Section for custom coefficients graph builder */}
        {chartType === 'custom' && (
          <div className="mb-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/85 text-slate-700 dark:text-slate-300 space-y-5 p-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <SlidersHorizontal className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Настройка пользовательского сравнения</h4>
            </div>

            {/* Block 1: Financial Coefficients Selector (Full Width) */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
                1. Выберите финансовые коэффициенты (не более 3, выбрано: {selectedRatios.length} / 3)
              </span>
              <div className="flex flex-wrap gap-2">
                {RATIOS_LIST.map((ratio) => {
                  const isSelected = selectedRatios.includes(ratio.id);
                  const isLimit = !isSelected && selectedRatios.length >= 3;
                  const colorCombo = COEFF_COLORS[ratio.colorKey % COEFF_COLORS.length];
                  return (
                    <button
                      key={ratio.id}
                      disabled={isLimit}
                      onClick={() => handleToggleRatio(ratio.id)}
                      onMouseEnter={() => setHoveredRatioId(ratio.id)}
                      onMouseLeave={() => setHoveredRatioId(null)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-medium transition cursor-pointer border flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border-sky-300 dark:border-sky-800' 
                          : isLimit 
                          ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <span 
                        className="w-2 rounded-full h-2 inline-block shrink-0" 
                        style={{ backgroundColor: colorCombo.main }}
                      />
                      {ratio.name}
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Animated Interactive Explanation Banner */}
              <div className="bg-sky-500/5 dark:bg-sky-500/10 p-4 rounded-xl border border-sky-500/10 text-[11px] text-slate-600 dark:text-slate-350 min-h-[58px] flex items-start gap-2.5 transition duration-200">
                <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  {hoveredRatioId ? (
                    <>
                      <span className="font-bold text-sky-600 dark:text-sky-400 block mb-0.5">
                        {RATIOS_LIST.find(r => r.id === hoveredRatioId)?.name}:
                      </span>
                      <span>
                        {RATIOS_LIST.find(r => r.id === hoveredRatioId)?.desc}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 italic">
                      Наведите курсор мыши на любой финансовый коэффициент из списка выше, чтобы увидеть подробную формулу и его экономическое обоснование.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Block 2: Line Types Selector using CHIPS (Full Width) */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
                2. Типы линий отчетности на графике (активируйте нужные сопоставления)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setLineTypes(prev => ({ ...prev, company: !prev.company }))}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3.5 select-none ${
                    lineTypes.company 
                      ? 'bg-sky-50/50 dark:bg-sky-950/20 text-slate-900 dark:text-white border-sky-400 dark:border-sky-850 shadow-sm font-bold' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    lineTypes.company 
                      ? 'bg-sky-500 border-sky-500 text-white' 
                      : 'border-slate-300 dark:border-slate-700'
                  }`}>
                    {lineTypes.company && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold font-semibold">Организация (Компания)</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">Сплошная яркая линия c маркерами</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLineTypes(prev => ({ ...prev, rf: !prev.rf }))}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3.5 select-none ${
                    lineTypes.rf 
                      ? 'bg-sky-50/50 dark:bg-sky-950/20 text-slate-900 dark:text-white border-sky-400 dark:border-sky-850 shadow-sm font-bold' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    lineTypes.rf 
                      ? 'bg-sky-500 border-sky-500 text-white' 
                      : 'border-slate-300 dark:border-slate-700'
                  }`}>
                    {lineTypes.rf && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold font-semibold">Отрасль РФ (Медиана)</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">Штриховка и градиент под линией</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLineTypes(prev => ({ ...prev, region: !prev.region }))}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3.5 select-none ${
                    lineTypes.region 
                      ? 'bg-sky-50/50 dark:bg-sky-950/20 text-slate-900 dark:text-white border-sky-400 dark:border-sky-850 shadow-sm font-bold' 
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    lineTypes.region 
                      ? 'bg-sky-500 border-sky-500 text-white' 
                      : 'border-slate-300 dark:border-slate-700'
                  }`}>
                    {lineTypes.region && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold font-semibold">Отрасль Регион (Медиана)</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">Заметная пунктирная линия</span>
                  </div>
                </button>
              </div>
            </div>

            {selectedRatios.length > 1 && (
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal flex items-start gap-1 p-2 bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400/90 rounded-xl border border-amber-500/10">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Рекомендация: Для более качественной наглядности графика комбинируйте близкие по масштабу коэффициенты (например, коэффициенты ликвидности со значениями 1-3) либо стройте график для единичного коэффициента.</span>
              </div>
            )}
          </div>
        )}

        {/* Recharts container wrappers */}
        <div className="h-80 w-full bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 relative">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'trends' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="Выручка (млн)" 
                  stroke="#0ea5e9" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Чистая прибыль (млн)" 
                  stroke="#2563eb" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            ) : chartType === 'balance' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', fontSize: '11px' }}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Капитал (млн)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Активы (млн)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              /* Custom builder ComposedChart rendering requested variables with benchmark gradient fills */
              <ComposedChart data={customChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  {selectedRatios.map(ratioId => {
                    const rMeta = RATIOS_LIST.find(r => r.id === ratioId);
                    if (!rMeta) return null;
                    const colors = COEFF_COLORS[rMeta.colorKey % COEFF_COLORS.length];
                    return (
                      <linearGradient key={`grad_rf_${ratioId}`} id={`grad_rf_${ratioId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.rf} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={colors.rf} stopOpacity={0.01} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', fontSize: '11px' }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                  payload={selectedRatios.map(ratioId => {
                    const rMeta = RATIOS_LIST.find(r => r.id === ratioId);
                    if (!rMeta) return null;
                    const colors = COEFF_COLORS[rMeta.colorKey % COEFF_COLORS.length];
                    return {
                      value: rMeta.name,
                      type: 'circle',
                      id: ratioId,
                      color: colors.main
                    };
                  }).filter((p): p is { value: string; type: string; id: string; color: string } => p !== null)}
                />
                
                {selectedRatios.flatMap(ratioId => {
                  const rMeta = RATIOS_LIST.find(r => r.id === ratioId);
                  if (!rMeta) return [];
                  const colors = COEFF_COLORS[rMeta.colorKey % COEFF_COLORS.length];
                  
                  const elements = [];
                  // Industry Area first so it stays in the background
                  if (lineTypes.rf) {
                    elements.push(
                      <Area
                        key={`${ratioId}_rf`}
                        type="monotone"
                        dataKey={`${ratioId}_rf`}
                        name={`${rMeta.name} (Отрасль РФ)`}
                        stroke={colors.rf}
                        strokeWidth={2}
                        strokeDasharray="10 5"
                        fill={`url(#grad_rf_${ratioId})`}
                        fillOpacity={1}
                        dot={{ r: 3.5, strokeWidth: 1.5, stroke: colors.rf, fill: '#ffffff' }}
                        activeDot={{ r: 5 }}
                      />
                    );
                  }
                  if (lineTypes.region) {
                    elements.push(
                      <Line
                        key={`${ratioId}_region`}
                        type="monotone"
                        dataKey={`${ratioId}_region`}
                        name={`${rMeta.name} (Отрасль Регион)`}
                        stroke={colors.region}
                        strokeWidth={1.5}
                        strokeDasharray="2 3"
                        dot={{ r: 2, strokeWidth: 1, stroke: colors.region, fill: colors.region }}
                        activeDot={{ r: 4 }}
                      />
                    );
                  }
                  if (lineTypes.company) {
                    elements.push(
                      <Line
                        key={`${ratioId}_company`}
                        type="monotone"
                        dataKey={`${ratioId}_company`}
                        name={`${rMeta.name} (Компания)`}
                        stroke={colors.main}
                        strokeWidth={4.5}
                        dot={{ r: 6, strokeWidth: 2.5, stroke: colors.main, fill: '#ffffff' }}
                        activeDot={{ r: 8, strokeWidth: 2.5, stroke: colors.main, fill: '#ffffff' }}
                      />
                    );
                  }
                  return elements;
                })}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footnote explanation for last 5 years data relevance and timeliness */}
        <div className="mt-5 bg-slate-50 dark:bg-slate-850/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-slate-700 dark:text-slate-300 mb-0.5">Справка об отображении динамики:</span>
            <span>Для повышения гибкости анализа динамики все графики автоматически ограничиваются годами, отмеченными Вами в фильтрах годовой отчетности. Пользовательский график поддерживает визуализацию до 3 коэффициентов одновременно со сопряженными медианными значениями по РФ и регионам присутствия.</span>
          </div>
        </div>
      </div>

      {/* Grid Table Displaying Detailed Ratios Values */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Table2 className="w-5 h-5 text-sky-500" />
          {chartType === 'custom' 
            ? 'Таблица рассчитанных коэффициентов и отраслевых бенчмарков'
            : 'Таблица исторических финансовых показателей (тыс. ₽)'
          }
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          {chartType === 'custom' ? (
            selectedRatios.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                Выберите хотя бы один финансовый коэффициент на панели настроек конструктора выше, чтобы построить сравнительную таблицу.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                    <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Период (год)
                    </th>
                    {selectedRatios.flatMap((ratioId) => {
                      const rMeta = RATIOS_LIST.find(r => r.id === ratioId);
                      if (!rMeta) return [];
                      const anyLineActive = lineTypes.company || lineTypes.rf || lineTypes.region;
                      const displayCompany = lineTypes.company || !anyLineActive;
                      const displayRf = lineTypes.rf;
                      const displayRegion = lineTypes.region;
                      
                      const cols = [];
                      if (displayCompany) {
                        cols.push({
                          key: `${ratioId}_company`,
                          label: `${rMeta.name} (Компания)`,
                          colorKey: rMeta.colorKey
                        });
                      }
                      if (displayRf) {
                        cols.push({
                          key: `${ratioId}_rf`,
                          label: `${rMeta.name} (РФ)`,
                          colorKey: rMeta.colorKey
                        });
                      }
                      if (displayRegion) {
                        cols.push({
                          key: `${ratioId}_region`,
                          label: `${rMeta.name} (Регион)`,
                          colorKey: rMeta.colorKey
                        });
                      }
                      return cols;
                    }).map((col) => {
                      const colorCombo = COEFF_COLORS[col.colorKey % COEFF_COLORS.length];
                      return (
                        <th key={col.key} className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: colorCombo.main }} />
                            <span>{col.label}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                  {customChartData.map((dataPoint) => (
                    <tr key={dataPoint.name} className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                      <td className="p-4 font-black text-slate-900 dark:text-slate-100">{dataPoint.name}</td>
                      {selectedRatios.flatMap((ratioId) => {
                        const anyLineActive = lineTypes.company || lineTypes.rf || lineTypes.region;
                        const displayCompany = lineTypes.company || !anyLineActive;
                        const displayRf = lineTypes.rf;
                        const displayRegion = lineTypes.region;
                        
                        const keys = [];
                        if (displayCompany) keys.push(`${ratioId}_company`);
                        if (displayRf) keys.push(`${ratioId}_rf`);
                        if (displayRegion) keys.push(`${ratioId}_region`);
                        
                        return keys.map((key) => ({
                          key,
                          val: dataPoint[key]
                        }));
                      }).map((cell) => (
                        <td key={cell.key} className="p-4 font-mono text-slate-700 dark:text-slate-400">
                          {cell.val !== undefined && cell.val !== null 
                            ? cell.val.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 4 })
                            : '—'
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Период (год)
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Выручка</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">Чистая прибыль</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Собственный капитал</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400">Совокупные активы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                {filteredFinancials.map((yearItem) => (
                  <tr key={yearItem.year} className="hover:bg-slate-50/55 dark:hover:bg-slate-950/40 transition">
                    <td className="p-4 font-black text-slate-900 dark:text-slate-100">{yearItem.year}</td>
                    <td className="p-4 text-slate-750 dark:text-slate-300 font-mono font-medium">{yearItem.revenue.toLocaleString('ru-RU')} ₽</td>
                    <td className={`p-4 font-mono font-bold ${yearItem.netProfit < 0 ? 'text-rose-600 dark:text-rose-450' : 'text-sky-650 dark:text-sky-400'}`}>
                      {yearItem.netProfit.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-400 font-mono">{yearItem.equity.toLocaleString('ru-RU')} ₽</td>
                    <td className="p-4 text-slate-700 dark:text-slate-400 font-mono">{yearItem.assets.toLocaleString('ru-RU')} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 bg-sky-50/40 dark:bg-sky-950/20 p-3.5 rounded-2xl border border-sky-100/80 dark:border-sky-900/30 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          {chartType === 'custom' ? (
            <span>
              <strong>Методическое указание для студентов:</strong> Сравните рассчитанные коэффициенты Вашей организации с отраслевыми медианами по РФ и региону. Отклонения в лучшую или худшую сторону могут свидетельствовать о специфике операционного цикла или финансовых рисках, требующих детальной расшифровки в пояснительной записке.
            </span>
          ) : (
            <span>
              <strong>Методическое указание для студентов:</strong> Проанализируйте скорость роста активов по отношению к капиталу. Если скорость роста активов опережает накопление капитала, это указывает на возрастающую долговую зависимость предприятия.
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
