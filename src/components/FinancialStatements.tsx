import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Company } from '../types';
import Button from './Button';
import { 
  FileText, 
  Download, 
  Check, 
  FileSpreadsheet,
  Building,
  ShieldCheck,
  Info,
  Scale
} from 'lucide-react';

interface FinancialStatementsProps {
  company: Company;
  initialType?: StatementType;
  selectedYears?: number[];
  setSelectedYears?: Dispatch<SetStateAction<number[]>>;
}

type StatementType = 'balance' | 'ofr' | 'ratios';

const RATIO_DESCRIPTIONS: Record<string, string> = {
  'Коэффициент абсолютной ликвидности': 'Показывает, какую часть краткосрочной задолженности предприятие может погасить в ближайшее время за счет свободных денежных средств и эквивалентов. Нормативное значение: ≥ 0.2',
  'Коэффициент текущей ликвидности': 'Характеризует платежеспособность компании на горизонте до года. Отражает степень, в которой все оборотные активы покрывают краткосрочные обязательства. Норматив: 1.5 - 2.0',
  'Обеспеченность обязательств активами': 'Отражает величину активов компании, приходящуюся на один рубль общей кредиторской и займовой задолженности. Показывает общую платежеспособность. Норматив: > 1.0',
  'Степень платежеспособности по текущим обяз.': 'Характеризует период (в месяцах), необходимый для полного погашения краткосрочной задолженности за счет среднемесячной выручки. Чем ниже показатель, тем лучше.',
  'Коэффициент автономии': 'Отражает долю собственных средств в общем объеме баланса. Показывает степень финансовой независимости от кредиторов и инвесторов. Критический минимальный порог: 0.5',
  'Коэффициент обеспеченности СОС': 'Показывает наличие у предприятия собственных оборотных средств (СОС), необходимых для его устойчивой текущей деятельности. Рекомендуемое значение: ≥ 0.1',
  'Отношение дебиторской задолженности к активам': 'Отражает долю долгов контрагентов в структуре совокупного имущества компании. Позволяет оценить долю средств, отвлеченных из прямого оборота предприятия.',
  'Левередж': 'Отражает соотношение заемных средств и собственного капитала предприятия. Показывает степень зависимости от внешних заимствований и уровень финансового риска.',
  'Оборачиваемость дебиторской задолженности': 'Средний период (в днях), в течение которого компания собирает дебиторскую задолженность с покупателей. Снижение указывает на улучшение дисциплины платежей.',
  'Оборачиваемость кредиторской задолженности': 'Средний срок (в днях), в течение которого предприятие рассчитывается по своим обязательствам перед поставщиками и подрядчиками.',
  'Оборачиваемость запасов': 'Средний срок (в днях), в течение которого сырье и товары переводятся в готовую форму и продаются. Меньшее количество дней указывает на высокую эффективность продаж.',
  'Фондоотдача ОС': 'Показывает эффективность использования основных средств. Отражает сумму выручки, полученной с каждого рубля, вложенного в здания, оборудование и технику.',
  'Рентабельность активов (ROA)': 'Показывает общую эффективность использования имущества компании. Отражает процент чистой прибыли, приходящийся на каждый рубль совокупных активов.',
  'Рентабельность продаж (ROS)': 'Показывает операционную маржинальность. Отражает, сколько копеек чистой прибыли приносит каждый рубль выручки от продаж. Оценивает эффективность бизнеса.',
  'Норма чистой прибыли': 'Доля чистой прибыли в общей структуре доходов компании. Отражает реальную отдачу бизнеса от всех видов деятельности после уплаты налогов.'
};


const getYearUpdateDate = (year: number): string => {
  if (year >= 2023 && year <= 2025) {
    return '13.05.2025';
  }
  return `16.04.${year + 1}`;
};

function renderRatioName(name: string, isBold: boolean = false) {
  const desc = RATIO_DESCRIPTIONS[name] || '';
  return (
    <td className="p-3 pl-6 text-left relative align-middle group/ratio bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-850">
      <div className="flex items-center justify-between gap-1.5 cursor-help w-full select-none">
        <span className={`text-slate-705 text-slate-700 dark:text-slate-300 transition-colors group-hover/ratio:text-sky-600 dark:group-hover/ratio:text-sky-400 ${isBold ? 'font-bold' : 'font-medium'}`}>
          {name}
        </span>
        <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover/ratio:text-sky-500 shrink-0 transition-colors duration-155" />
      </div>
      
      {/* Tooltip */}
      {desc && (
        <div className="absolute left-6 bottom-full mb-2 w-80 p-3 bg-slate-95 /95 bg-slate-950 text-white rounded-xl shadow-xl border border-slate-800 text-[10.5px] leading-relaxed opacity-0 pointer-events-none group-hover/ratio:opacity-100 group-hover/ratio:pointer-events-auto transition-all duration-200 z-50 font-normal font-sans normal-case">
          <div className="font-bold text-sky-450 text-sky-400 mb-1">{name}</div>
          <div className="text-slate-205 text-slate-200">{desc}</div>
          <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-950" />
        </div>
      )}
    </td>
  );
}

export default function FinancialStatements({ company, initialType, selectedYears, setSelectedYears }: FinancialStatementsProps) {
  // Available periods from company financials
  const years = company.financials.map(f => f.year).sort((a, b) => b - a);
  
  // Selection states (Default select newest 35 years to display as columns)
  const [localSelectedYears, setLocalSelectedYears] = useState<number[]>(
    years.slice(0, 3).length > 0 ? years.slice(0, 3) : [2025]
  );
  const activeSelectedYears = selectedYears !== undefined ? selectedYears : localSelectedYears;
  const activeSetSelectedYears = setSelectedYears !== undefined ? setSelectedYears : setLocalSelectedYears;

  const [statementType, setStatementType] = useState<StatementType>('balance');

  useEffect(() => {
    if (initialType) {
      setStatementType(initialType);
    }
  }, [initialType]);
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'pdf' | 'csv' | null>(null);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);

  // States for explanation and audit downloads
  const [downloadingDoc, setDownloadingDoc] = useState<'explanation' | 'audit' | 'methodology' | null>(null);
  const [docSuccessMessage, setDocSuccessMessage] = useState<string>('');

  // Sberbank (7707083893) has both, Meridian (5032296052) has explanation only, Alfa (7725492104) has audit only, Servis (6234160787) has neither
  const hasExplanation = company.id === '7707083893' || company.id === '5032296052';
  const hasAudit = company.id === '7707083893' || company.id === '7725492104';

  const handleDownloadDoc = (type: 'explanation' | 'audit' | 'methodology') => {
    setDownloadingDoc(type);
    setDocSuccessMessage('');
    setTimeout(() => {
      setDownloadingDoc(null);
      const title = type === 'explanation' 
        ? 'Пояснение к бухгалтерскому балансу' 
        : type === 'audit' 
        ? 'Аудиторское заверение' 
        : 'Полная методика расчета финансового состояния';
      setDocSuccessMessage(`Файл "${title}" успешно загружен на устройство.`);
      setTimeout(() => {
        setDocSuccessMessage('');
      }, 3500);
    }, 1200);
  };

  useEffect(() => {
    if (!isExportDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#btn_zmew67hxo') && !target.closest('#export_dropdown_menu')) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isExportDropdownOpen]);

  // --- MATHEMATICAL MAPPER (balances everything perfectly to integers) ---
  const getStructure = (fin: typeof company.financials[0]) => {
    const A = fin.assets;
    const E = fin.equity;
    const L = A - E;

    // Assets allocations
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

    // Equity allocations
    const charterCapital = Math.round(E * 0.08);
    const reserveCapital = Math.round(E * 0.05);
    const additionalCapital = Math.round(E * 0.22);
    const retainedEarnings = E - charterCapital - reserveCapital - additionalCapital;

    // Liabilities allocations
    const longTerm = Math.round(L * 0.35);
    const longTermLoans = Math.round(longTerm * 0.75);
    const longTermLease = longTerm - longTermLoans;

    const shortTerm = L - longTerm;
    const shortTermLoans = Math.round(shortTerm * 0.38);
    const accountsPayable = Math.round(shortTerm * 0.48);
    const shortTermLease = shortTerm - shortTermLoans - accountsPayable;

    // Income Statement mappings
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

  // Get structure and years sorted descending
  const sortedSelectedYears = [...activeSelectedYears].sort((a, b) => b - a);

  const selectedFinData = sortedSelectedYears.map(year => {
    const fin = company.financials.find(f => f.year === year);
    return {
      year,
      data: fin ? getStructure(fin) : null
    };
  }).filter(item => item.data !== null) as { year: number; data: ReturnType<typeof getStructure> }[];

  // Format helper (thousands to readable format or empty if 0)
  const fVal = (val: number) => {
    return val.toLocaleString('ru-RU');
  };

  const getLeverageForYear = (yr: number): string => {
    const fin = company.financials.find(f => f.year === yr);
    if (!fin) return '—';
    const struct = getStructure(fin);
    if (struct.E === 0) return '—';
    const val = (struct.longTerm + struct.shortTerm) / struct.E;
    return val.toLocaleString('ru-RU', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  const executeExport = (format: 'xlsx' | 'pdf' | 'csv') => {
    setExportFormat(format);
    setExportSuccess(false);
    setTimeout(() => {
      setExportSuccess(true);
      setTimeout(() => {
        setExportFormat(null);
        setExportSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div id="financial_reporting_section" className="space-y-6 font-sans select-none animate-fadeIn">
      
      {/* 1. Header Information Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/85 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              Финансовая отчетность предприятия
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Анализ бухгалтерского баланса и отчета о финансовых результатах {company.shortName}.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top-level Horizontal Navigation Controls Dashboard */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/85 dark:border-slate-800 shadow-sm grid grid-cols-1 gap-6">
        
        {/* Row A: Document Type Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Выберите документ</span>
            <div className="flex flex-wrap bg-slate-100/70 dark:bg-slate-850 p-1 rounded-2xl gap-1 self-start">
              <Button
                onClick={() => setStatementType('balance')}
                variant="light"
                isActive={statementType === 'balance'}
                className="rounded-xl flex items-center gap-2 cursor-pointer text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Бухгалтерский баланс (Форма №1)</span>
              </Button>

              <Button
                onClick={() => setStatementType('ofr')}
                variant="light"
                isActive={statementType === 'ofr'}
                className="rounded-xl flex items-center gap-2 cursor-pointer text-xs"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Отчет о фин. результатах (Форма №2)</span>
              </Button>

              <Button
                onClick={() => setStatementType('ratios')}
                variant="light"
                isActive={statementType === 'ratios'}
                className="rounded-xl flex items-center gap-2 cursor-pointer text-xs"
              >
                <Scale className="w-4 h-4" />
                <span>Финансовые коэффициенты</span>
              </Button>
            </div>
          </div>

          {/* Export triggers */}
          <div className="relative self-start sm:self-end">
            <Button
              id="btn_zmew67hxo"
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              variant="outline"
              className="rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Экспортировать отчетность
            </Button>
            {isExportDropdownOpen && (
              <div id="export_dropdown_menu" className="absolute right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/85 dark:border-slate-800 w-56 z-50 p-2">
                <Button 
                  onClick={() => {
                    executeExport('xlsx');
                    setIsExportDropdownOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-sky-505 text-sky-500" /> Экспорт в Excel (.xlsx)
                </Button>
                <Button 
                  onClick={() => {
                    executeExport('pdf');
                    setIsExportDropdownOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer transition"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-505 text-sky-500" /> Экспорт PDF-отчета (.pdf)
                </Button>
                <Button 
                  onClick={() => {
                    executeExport('csv');
                    setIsExportDropdownOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer transition"
                >
                  <Download className="w-3.5 h-3.5 text-sky-505 text-sky-500" /> Экспорт csv-файлом (.csv)
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Row C: Dynamic Year/Period Pill Selector */}
        {statementType !== 'ratios' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Периоды отчетности для вывода в таблицу (не более 10 лет):</span>
              <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded font-bold font-mono">
                Выбрано: {sortedSelectedYears.length} / 10
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {years.map(y => {
                const isSelected = activeSelectedYears.includes(y);
                return (
                  <div key={y} className="relative group/year inline-block">
                    <Button
                      onClick={() => {
                        if (isSelected) {
                          // Preserve at least 1 selected year
                          if (activeSelectedYears.length > 1) {
                            activeSetSelectedYears(activeSelectedYears.filter(year => year !== y));
                          }
                        } else {
                          if (activeSelectedYears.length < 10) {
                            activeSetSelectedYears([...activeSelectedYears, y]);
                          }
                        }
                      }}
                      variant="pill"
                      isActive={isSelected}
                      className="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-sky-400 dark:bg-sky-600'}`} />
                      {y} г.
                    </Button>

                    {/* Tooltip on hovering the year */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 p-2.5 bg-slate-900 border border-slate-750 dark:bg-slate-950 dark:border-slate-800 text-white rounded-xl shadow-xl text-[10.5px] leading-relaxed opacity-0 pointer-events-none group-hover/year:opacity-100 transition-all duration-150 z-50 text-center font-normal font-sans normal-case">
                      <span className="text-slate-400 font-bold block mb-0.5">Обновлено:</span>
                      <span className="font-mono text-sky-405 text-sky-400 font-extrabold">{getYearUpdateDate(y)}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-955" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Export Status Banner */}
      {exportFormat && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-2xl flex items-center gap-4 transition animate-pulse">
          <div className="p-1 px-2.5 bg-slate-250 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase font-bold rounded">
            {exportFormat.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {exportSuccess ? 'Файл успешно сгенерирован!' : 'Формирование отчетной книги...'}
            </h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
              {exportSuccess 
                ? `Отчет за периоды [${sortedSelectedYears.join(', ')}] гг. успешно скачан на устройство студента.`
                : `Обработка выбранных колонок строк баланса и ОФР компании ${company.shortName}.`
              }
            </p>
          </div>
          {exportSuccess && <Check className="w-5 h-5 text-slate-550 shrink-0" />}
        </div>
      )}

      {/* 4. Full Width Statement Table Viewer and Spreadsheet */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/85 dark:border-slate-800 shadow-sm overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-tight flex items-center gap-2">
              <span>
                {statementType === 'balance' 
                  ? 'Бухгалтерский баланс' 
                  : statementType === 'ofr'
                  ? 'Отчет о финансовых результатах (ОФР)'
                  : 'Финансовые коэффициенты'
                }
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {statementType === 'ratios'
                ? `Сравнение показателей компании с медианными отраслевыми значениями по РФ и Москве`
                : `Единица измерения: тыс. рублей (RUB) · Анализ горизонта развития за выбранные периоды [${sortedSelectedYears.join(', ')}] гг.`
              }
            </p>
          </div>
        </div>

        {/* Dynamic Spreadsheet Engine */}
        {statementType === 'ratios' ? (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800/65 scrollbar-thin">
              <table className="w-full min-w-[900px] border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 text-slate-450">
                    <th rowSpan={2} className="p-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] min-w-[280px] align-middle">Наименование коэффициента</th>
                    <th colSpan={3} className="p-3 font-semibold uppercase tracking-wider text-[10px] text-center border-l border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 font-mono">2023 г.</th>
                    <th colSpan={3} className="p-3 font-semibold uppercase tracking-wider text-[10px] text-center border-l border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 font-mono">2024 г.</th>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 text-slate-450 font-medium">
                    <th className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold text-[10px] uppercase tracking-wider">Компания</th>
                    <th className="p-3 text-center text-slate-500 dark:text-slate-400">Отрасль (РФ)</th>
                    <th className="p-3 text-center text-slate-500 dark:text-slate-400">Отрасль (Москва)</th>
                    <th className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold text-[10px] uppercase tracking-wider">Компания</th>
                    <th className="p-3 text-center text-slate-500 dark:text-slate-400">Отрасль (РФ)</th>
                    <th className="p-3 text-center text-slate-500 dark:text-slate-400">Отрасль (Москва)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  <tr className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-900/10">
                    <td className="p-3 pl-6 font-sans font-bold text-slate-800 dark:text-slate-200">Рассматриваемый ОКВЭД</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-bold text-sky-600 dark:text-sky-400">{company.okved}</td>
                    <td className="p-3 text-center text-slate-500 dark:text-slate-400">{company.okved}</td>
                    <td className="p-3 text-center text-slate-500 dark:text-slate-400">{company.okved}</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-bold text-sky-600 dark:text-sky-400">{company.okved}</td>
                    <td className="p-3 text-center text-slate-500 dark:text-slate-400">{company.okved}</td>
                    <td className="p-3 text-center text-slate-500 dark:text-slate-400">{company.okved}</td>
                  </tr>

                  {/* Section 1 */}
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3 pl-6 uppercase text-[11px] tracking-wider" colSpan={7}>1. Ликвидность и платежеспособность</td>
                  </tr>
                  <tr>
                    {renderRatioName('Коэффициент абсолютной ликвидности')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,8376</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,6675</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,5084</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,7464</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,6266</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,5084</td>
                  </tr>
                  <tr>
                    {renderRatioName('Коэффициент текущей ликвидности')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">1,5138</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,9695</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,7529</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">1,5729</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,9241</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,7529</td>
                  </tr>
                  <tr>
                    {renderRatioName('Обеспеченность обязательств активами', true)}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">1,6681</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,8921</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,6373</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">1,5929</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,8397</td>
                    <td className="p-3 text-center font-mono text-slate-500">2,6373</td>
                  </tr>
                  <tr>
                    {renderRatioName('Степень платежеспособности по текущим обяз.')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">4,3076</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,4962</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,7365</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">3,66</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,4546</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,7365</td>
                  </tr>
 
                  {/* Section 2 */}
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3 pl-6 uppercase text-[11px] tracking-wider" colSpan={7}>2. Финансовая устойчивость</td>
                  </tr>
                  <tr>
                    {renderRatioName('Коэффициент автономии')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,4013</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,7014</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,6069</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,4405</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,708</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,6069</td>
                  </tr>
                  <tr>
                    {renderRatioName('Коэффициент обеспеченности СОС')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono text-slate-400">—</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,5417</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,9625</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono text-slate-400">—</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,7833</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,9625</td>
                  </tr>
                  <tr>
                    {renderRatioName('Отношение дебиторской задолженности к активам')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,3004</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,6598</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,6508</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-905 text-slate-900 dark:text-slate-100">0,3566</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,70</td>
                    <td className="p-3 text-center font-mono text-slate-500">0,6508</td>
                  </tr>
                  <tr>
                    {renderRatioName('Левередж')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">{getLeverageForYear(2023)}</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,4300</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,3500</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">{getLeverageForYear(2024)}</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,4800</td>
                    <td className="p-3 text-center font-mono text-slate-500">1,3500</td>
                  </tr>
 
                  {/* Section 3 */}
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3 pl-6 uppercase text-[11px] tracking-wider" colSpan={7}>3. Оборачиваемость (в днях)</td>
                  </tr>
                  <tr>
                    {renderRatioName('Оборачиваемость дебиторской задолженности')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">73,5586</td>
                    <td className="p-3 text-center font-mono text-slate-500">84,32</td>
                    <td className="p-3 text-center font-mono text-slate-500">90,65</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">88,4462</td>
                    <td className="p-3 text-center font-mono text-slate-500 font-semibold">83,64</td>
                    <td className="p-3 text-center font-mono text-slate-500">90,65</td>
                  </tr>
                  <tr>
                    {renderRatioName('Оборачиваемость кредиторской задолженности', true)}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">178,0161</td>
                    <td className="p-3 text-center font-mono text-slate-500">49,97</td>
                    <td className="p-3 text-center font-mono text-slate-500">61,99</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">158,6977</td>
                    <td className="p-3 text-center font-mono text-slate-500">51,64</td>
                    <td className="p-3 text-center font-mono text-slate-500">61,99</td>
                  </tr>
                  <tr>
                    {renderRatioName('Оборачиваемость запасов')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">32,9986</td>
                    <td className="p-3 text-center font-mono text-slate-500">6,50</td>
                    <td className="p-3 text-center font-mono text-slate-500">8,19</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">33,5063</td>
                    <td className="p-3 text-center font-mono text-slate-500">6,42</td>
                    <td className="p-3 text-center font-mono text-slate-500">8,19</td>
                  </tr>
                  <tr>
                    {renderRatioName('Фондоотдача ОС')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">18,5199</td>
                    <td className="p-3 text-center font-mono text-slate-500">28,0801</td>
                    <td className="p-3 text-center font-mono text-slate-500">46,5452</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">13,2643</td>
                    <td className="p-3 text-center font-mono text-slate-500">28,276</td>
                    <td className="p-3 text-center font-mono text-slate-500">46,5452</td>
                  </tr>
 
                  {/* Section 4 */}
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3 pl-6 uppercase text-[11px] tracking-wider" colSpan={7}>4. Рентабельность (%)</td>
                  </tr>
                  <tr>
                    {renderRatioName('Рентабельность активов (ROA)')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,98%</td>
                    <td className="p-3 text-center font-mono text-slate-500">10,32%</td>
                    <td className="p-3 text-center font-mono text-slate-500">9,27%</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">1,23%</td>
                    <td className="p-3 text-center font-mono text-slate-500">12,34%</td>
                    <td className="p-3 text-center font-mono text-slate-500">9,27%</td>
                  </tr>
                  <tr>
                    {renderRatioName('Рентабельность продаж (ROS)')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">-7,91%</td>
                    <td className="p-3 text-center font-mono text-slate-500 font-semibold">11,53%</td>
                    <td className="p-3 text-center font-mono text-slate-500 font-semibold">10,49%</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">-1,40%</td>
                    <td className="p-3 text-center font-mono text-slate-500 font-semibold">10,41%</td>
                    <td className="p-3 text-center font-mono text-slate-500 font-semibold">10,49%</td>
                  </tr>
                  <tr>
                    {renderRatioName('Норма чистой прибыли')}
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,73%</td>
                    <td className="p-3 text-center font-mono text-slate-500">5,73%</td>
                    <td className="p-3 text-center font-mono text-slate-500">5,68%</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono font-bold text-slate-900 dark:text-slate-100">0,86%</td>
                    <td className="p-3 text-center font-mono text-slate-500">6,15%</td>
                    <td className="p-3 text-center font-mono text-slate-500">5,68%</td>
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/15 font-bold">
                    <td className="p-3 pl-6 text-slate-500 font-semibold">Количество компаний в выборке</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono text-slate-650 dark:text-slate-400 font-semibold">1</td>
                    <td className="p-3 text-center font-mono text-slate-650 dark:text-slate-400">1 954</td>
                    <td className="p-3 text-center font-mono text-slate-650 dark:text-slate-400">601</td>
                    <td className="p-3 text-center border-l border-slate-100 dark:border-slate-800/60 font-mono text-slate-650 dark:text-slate-400 font-semibold">1</td>
                    <td className="p-3 text-center font-mono text-slate-650 dark:text-slate-400 font-semibold">1 751</td>
                    <td className="p-3 text-center font-mono text-slate-650 dark:text-slate-400">601</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Brief Methodology Panel */}
            <div className="bg-slate-100/40 dark:bg-slate-850/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed mt-4">
              <p>
                Отраслевые значения коэффициентов финансового состояния рассчитываются на основе официальных данных ФНС России (ГИРБО).
              </p>
              <p>
                В выборку включаются только действующие компании с ненулевой выручкой. Исключаются организации в стадии банкротства и ликвидации.
              </p>
              <p>
                Коэффициенты рассчитываются по Правилам финансового анализа (Постановление Правительства РФ № 367 от 25.06.2003). Для сравнения используются медианные значения по отрасли за соответствующий год — в целом по РФ и по региону присутствия компании.
              </p>
              <p>
                Такая методика обеспечивает объективность, статистическую корректность и полную применимость результатов в судебных, арбитражных и иных официальных процедурах.
              </p>
              
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-4 flex-wrap">
                <button
                  onClick={() => handleDownloadDoc('methodology')}
                  disabled={downloadingDoc === 'methodology'}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 select-none shrink-0 cursor-pointer ${
                    downloadingDoc === 'methodology'
                      ? 'bg-sky-500/20 text-sky-500 font-bold'
                      : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white active:scale-95 shadow-sm font-bold'
                  }`}
                  id="download_full_methodology_btn"
                >
                  {downloadingDoc === 'methodology' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-sky-650 border-t-transparent rounded-full animate-spin" />
                      <span>Скачивание...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Скачать полную методику</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800/65 scrollbar-thin">
            <table className="w-full min-w-[700px] border-collapse text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 text-slate-450">
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px] min-w-[280px]">Наименование показателя</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-24 text-center">Код строки</th>
                {selectedFinData.map(({ year }) => (
                  <th key={year} className="p-3 font-semibold uppercase tracking-wider text-[10px] text-right min-w-[120px] shrink-0 font-mono text-slate-800 dark:text-slate-200">{year} г.</th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {statementType === 'balance' ? (
                // --- INTEGRATED COMPREHENSIVE BALANCE SHEET MODULE ---
                <>
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3" colSpan={2 + selectedFinData.length}>РАЗДЕЛ I. ВНЕОБОРОТНЫЕ АКТИВЫ</td>
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Нематериальные активы</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1110</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.intangible)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Основные средства</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1150</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.fixedAssets)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">
                      Активы в форме права пользования (Аренда / Лизинг)
                    </td>
                    <td className="p-3 text-center text-slate-400 font-mono">1160</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.leaseAPP)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Прочие внеоборотные активы</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1190</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.otherNC)}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3" colSpan={2 + selectedFinData.length}>РАЗДЕЛ II. ОБОРОТНЫЕ АКТИВЫ</td>
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Запасы</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1210</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.inventories)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Дебиторская задолженность</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1230</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.receivables)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Денежные средства и денежные эквиваленты</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1250</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.cashEq)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Прочие оборотные активы</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1260</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-400">{fVal(data.otherCurr)}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/90 font-extrabold text-slate-900 dark:text-slate-100">
                    <td className="p-3 uppercase">БАЛАНС АКТИВА</td>
                    <td className="p-3 text-center font-mono">1600</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-black">{fVal(data.A)}</td>
                    ))}
                  </tr>
                  <tr className="divider-row-text">
                    <td colSpan={2 + selectedFinData.length} className="bg-slate-100/50 dark:bg-slate-850/80 text-[10px] px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider">ПАССИВЫ И КАПИТАЛ</td>
                  </tr>
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3" colSpan={2 + selectedFinData.length}>РАЗДЕЛ III. КАПИТАЛ И РЕЗЕРВЫ</td>
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Уставный капитал</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1310</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-650 dark:text-slate-400">{fVal(data.charterCapital)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Добавочный капитал</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1350</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-650 dark:text-slate-404 text-slate-400">{fVal(data.additionalCapital + data.reserveCapital)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300 font-bold">Нераспределенная прибыль (непокрытый убыток)</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1370</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-200">{fVal(data.retainedEarnings)}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3" colSpan={2 + selectedFinData.length}>РАЗДЕЛ IV. ДОЛГОСРОЧНЫЕ ОБЯЗАТЕЛЬСТВА</td>
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Заемные средства</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1410</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-650 dark:text-slate-400">{fVal(data.longTermLoans)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300 font-bold">Обязательства по аренде и лизингу (долгосрочные)</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1420</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-200">{fVal(data.longTermLease)}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-100">
                    <td className="p-3" colSpan={2 + selectedFinData.length}>РАЗДЕЛ V. КРАТКОСРОЧНЫЕ ОБЯЗАТЕЛЬСТВА</td>
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Заемные средства (краткосрочные)</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1510</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-650 dark:text-slate-400">{fVal(data.shortTermLoans)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300">Кредиторская задолженность</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1520</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-650 dark:text-slate-404 text-slate-400">{fVal(data.accountsPayable)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-700 dark:text-slate-300 font-bold">Обязательства по аренде и лизингу (краткосрочные)</td>
                    <td className="p-3 text-center text-slate-400 font-mono">1530</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-200">{fVal(data.shortTermLease)}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/90 font-extrabold text-slate-900 dark:text-slate-100">
                    <td className="p-3 uppercase">БАЛАНС ПАССИВА</td>
                    <td className="p-3 text-center font-mono">1700</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-black">{fVal(data.A)}</td>
                    ))}
                  </tr>
                </>
              ) : (
                // --- INCOME STATEMENT (ОФР) MODULE ---
                <>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/15 font-bold text-slate-950 dark:text-slate-100">
                    <td className="p-3 font-extrabold uppercase text-slate-900 dark:text-slate-100">Выручка от продаж (нетто)</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2110</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-bold text-slate-950 dark:text-slate-105 dark:text-slate-100">{fVal(data.rev)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-600 dark:text-slate-404">Себестоимость технологических продаж</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2120</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-rose-600">{fVal(data.cost)}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-200">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-200">Валовая прибыль (убыток)</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2100</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-200">{fVal(data.grossProfit)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-600 dark:text-slate-404">Коммерческие и корпоративные расходы</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2210</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-rose-600">({fVal(data.sellingAdmin)})</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/70 dark:bg-slate-850/90 font-bold text-slate-900 dark:text-slate-200">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-200">Прибыль (убыток) от продаж</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2200</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-200">{fVal(data.grossProfit - data.sellingAdmin)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-600 dark:text-slate-404">Сальдо прочих доходов и расходов</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2340</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-slate-600 dark:text-slate-404 text-slate-400">{fVal(data.otherNet)}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/15 font-bold">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-200">Прибыль (убыток) до налогообложения</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2300</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-200">{fVal(data.pbt)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 pl-6 text-slate-600 dark:text-slate-404">Текущий налог на прибыль и ОНА/ОНО</td>
                    <td className="p-3 text-center text-slate-400 font-mono">2410</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono text-rose-600">({fVal(data.tax)})</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/90 font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    <td className="p-3 uppercase font-black">ЧИСТАЯ ПРИБЫЛЬ (УБЫТОК) ПЕРИОДА</td>
                    <td className="p-3 text-center font-mono">2400</td>
                    {selectedFinData.map(({ year, data }) => (
                      <td key={year} className="p-3 text-right font-mono font-black">{fVal(data.netProf)}</td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Supplemental documents download panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/85 dark:border-slate-800 shadow-sm space-y-4 font-sans">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" />
            Сопроводительные документы и аудиторские заключения
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Официальные данные предоставлены государственным информационным ресурсом бухгалтерской (финансовой) отчетности БОНАЛОГ (bo.nalog.ru) Федеральной налоговой службы РФ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Explanation Document Card */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            hasExplanation 
              ? 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-200 dark:border-slate-800 hover:border-slate-300' 
              : 'bg-slate-50/20 dark:bg-slate-950/5 border-slate-150 dark:border-slate-850/40 opacity-70'
          }`}>
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                hasExplanation 
                  ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-500' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Пояснение к бухгалтерскому балансу</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Подробная расшифровка долговых обязательств, нематериальных активов и материальных запасов за отчетный период.
                </p>
                {!hasExplanation && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 mt-2 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded leading-none">
                    Не представлено в ФНС
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDownloadDoc('explanation')}
              disabled={!hasExplanation || downloadingDoc === 'explanation'}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 select-none ${
                hasExplanation
                  ? downloadingDoc === 'explanation'
                    ? 'bg-sky-500/20 text-sky-500'
                    : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white cursor-pointer shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border border-slate-200/50'
              }`}
            >
              {downloadingDoc === 'explanation' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-sky-600 border-sky-450 border-t-transparent rounded-full animate-spin" />
                  <span>Скачивание...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Скачать PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Assurance/Report Card */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            hasAudit 
              ? 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-200 dark:border-slate-800 hover:border-slate-300' 
              : 'bg-slate-50/20 dark:bg-slate-950/5 border-slate-150 dark:border-slate-850/40 opacity-70'
          }`}>
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                hasAudit 
                  ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-500' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Аудиторское заверение (заключение)</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Официальное заключение независимой аудиторской организации, подтверждающее достоверность представленной отчетности.
                </p>
                {!hasAudit && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 mt-2 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded leading-none">
                    Аудит не предусмотрен
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDownloadDoc('audit')}
              disabled={!hasAudit || downloadingDoc === 'audit'}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 select-none ${
                hasAudit
                  ? downloadingDoc === 'audit'
                    ? 'bg-sky-500/20 text-sky-500'
                    : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white cursor-pointer shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border border-slate-200/50'
              }`}
            >
              {downloadingDoc === 'audit' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-sky-600 border-sky-450 border-t-transparent rounded-full animate-spin" />
                  <span>Скачивание...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Скачать PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert Banner for Additional Docs */}
        {docSuccessMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400 animate-fadeIn font-extrabold">
            <Check className="w-4 h-4 text-emerald-550 shrink-0" />
            <span>{docSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* 5. Footer notes */}
      {statementType !== 'ratios' && (
        <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-sm leading-relaxed max-w-full">
          <p className="text-[11px] text-slate-500">
            * Бухгалтерская отчетность составлена на основе сводных данных регистров учета предприятия. Горизонтальный анализ отражает динамику изменения внеоборотных и оборотных активов, собственного капитала и обязательств за выбранные периоды.
          </p>
        </div>
      )}
    </div>
  );
}
