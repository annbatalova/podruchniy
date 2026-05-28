import { useState } from 'react';
import Button from './Button';
import { 
  Building2, 
  User, 
  MapPin, 
  Cpu, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Network,
  AlertTriangle,
  Users,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  Download,
  Star,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Company } from '../types';

const OKVED_CHANGES_LIST: Record<string, Array<{ period: string; code: string; desc: string; status: 'active' | 'changed' }>> = {
  '7707083893': [ // SBER
    { period: 'с 2023 по н.в.', code: '64.19', desc: 'Деятельность других финансовых институтов, за исключением учреждений страхования и пенсионного обеспечения', status: 'active' },
    { period: 'с 2016 по 2022', code: '64.12', desc: 'Деятельность Центрального банка Российской Федерации (Банка России)', status: 'changed' },
    { period: 'с 2012 по 2015', code: '65.12', desc: 'Прочее денежное посредничество', status: 'changed' }
  ],
  '7701358912': [ // Meridian
    { period: 'с 2023 по н.в.', code: '62.01', desc: 'Разработка компьютерного программного обеспечения', status: 'active' },
    { period: 'с 2016 по 2022', code: '62.02', desc: 'Деятельность консультативная и работы в области компьютерных технологий', status: 'changed' },
    { period: 'с 2012 по 2015', code: '63.11', desc: 'Деятельность по обработке данных, предоставление услуг по размещению информации и связанная с этим деятельность', status: 'changed' }
  ],
  '6234160787': [ // Service
    { period: 'с 2023 по н.в.', code: '52.29', desc: 'Деятельность вспомогательная прочая, связанная с перевозками', status: 'active' },
    { period: 'с 2016 по 2022', code: '46.90', desc: 'Торговля оптовая неспециализированная', status: 'changed' },
    { period: 'с 2012 по 2015', code: '49.41', desc: 'Деятельность автомобильного грузового транспорта', status: 'changed' }
  ]
};

function getOkvedHistory(companyId: string, currentOkved: string, currentOkvedDesc: string) {
  if (OKVED_CHANGES_LIST[companyId]) {
    return OKVED_CHANGES_LIST[companyId];
  }
  return [
    { period: 'с 2023 по н.в.', code: currentOkved, desc: currentOkvedDesc, status: 'active' as const },
    { period: 'с 2016 по 2022', code: '70.22', desc: 'Консультирование по вопросам коммерческой деятельности и управления', status: 'changed' as const },
    { period: 'с 2012 по 2015', code: '46.19', desc: 'Деятельность агентов по оптовой торговле универсальным ассортиментом товаров', status: 'changed' as const }
  ];
}

interface ExecutiveSummaryProps {
  company: Company;
  onViewConnections: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ExecutiveSummary({ 
  company, 
  onViewConnections,
  isFavorite,
  onToggleFavorite
}: ExecutiveSummaryProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copyingOverview, setCopyingOverview] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showOkvedHistory, setShowOkvedHistory] = useState(false);

  const handleCopyOverview = () => {
    const dataToCopy = `Компания: ${company.fullName}\nИНН: ${company.id}\nОГРН: ${company.ogrn || ''}\nАдрес: ${company.address}`;
    navigator.clipboard.writeText(dataToCopy);
    setCopyingOverview(true);
    setTimeout(() => setCopyingOverview(false), 2000);
  };

  const handleDownload = (format: string) => {
    setDownloadSuccess(format);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Copy helper
  const triggerCopyFeedback = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const ratingColorClass = company.scorePercent >= 80 
    ? 'text-emerald-500 bg-emerald-500/10' 
    : company.scorePercent >= 40 
      ? 'text-sky-500 bg-sky-500/10' 
      : 'text-rose-500 bg-rose-500/10';

  // Compute connections stats count dynamically based on company ID for realistic presentation
  const getConnectionsSummary = (id: string) => {
    switch (id) {
      case '7707083893': // ПАО СБЕРБАНК
        return { founders: 2, subsidiaries: 3, affiliates: 1, alertNodes: 0, level: 'Минимальный', levelColor: 'text-emerald-500' };
      case '6234160787': // ООО СЕРВИС
        return { founders: 2, subsidiaries: 2, affiliates: 1, alertNodes: 3, level: 'Критический', levelColor: 'text-rose-500 font-bold' };
      case '7701358912': // ООО МЕРИДИАН
        return { founders: 1, subsidiaries: 2, affiliates: 1, alertNodes: 1, level: 'Умеренный', levelColor: 'text-amber-500' };
      case '7725492104': // АО АЛЬФА-ТЕХНОЛОГИИ
        return { founders: 2, subsidiaries: 1, affiliates: 1, alertNodes: 0, level: 'Минимальный', levelColor: 'text-emerald-500' };
      default:
        return { founders: 1, subsidiaries: 1, affiliates: 1, alertNodes: 0, level: 'Умеренный', levelColor: 'text-slate-500' };
    }
  };

  const connSummary = getConnectionsSummary(company.id);

  return (
    <div id="executive_summary_root" className="space-y-6 font-sans">

      {/* COMPACT COMPANY OVERVIEW HEADER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans animate-fadeIn">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {company.shortName}
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
              {company.location}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold leading-none ${
              company.status === 'bankruptcy' 
                ? 'bg-rose-100 dark:bg-rose-955 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-455 text-rose-400 border border-rose-200/50 dark:border-rose-900/40' 
                : 'bg-emerald-100 dark:bg-emerald-955 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-455 text-emerald-450 border border-emerald-200/50 dark:border-emerald-900/40'
            }`}>
              {company.status === 'bankruptcy' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                  Процедура банкротства
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  Компания активна
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-550 dark:text-slate-400 max-w-2xl leading-normal font-medium">
            {company.fullName}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <Button
            onClick={onToggleFavorite}
            variant={isFavorite ? 'light' : 'outline'}
            className={`rounded-2xl transition cursor-pointer flex items-center gap-1.5 ${
              isFavorite 
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-600 font-bold hover:bg-amber-500/20' 
                : 'border-slate-200 text-slate-500 hover:text-amber-500'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current text-amber-500' : 'text-slate-400'}`} />
            <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
          </Button>

          <Button
            onClick={handleCopyOverview}
            variant="outline"
            className="rounded-2xl transition cursor-pointer"
          >
            {copyingOverview ? (
              <>
                <Check className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-sky-500" />
                <span>Скопировать реквизиты</span>
              </>
            )}
          </Button>

          <div className="relative group">
            <Button variant="outline" className="rounded-2xl transition cursor-pointer flex items-center gap-2">
              <span>Экспортировать</span>
              <ChevronDown className="w-4 h-4 text-sky-500" />
            </Button>
            <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 w-48 hidden group-hover:block z-50 p-1 animate-scaleUp">
              <Button 
                onClick={() => handleDownload('xlsx')}
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2 cursor-pointer font-bold transition"
              >
                <Download className="w-3.5 h-3.5 text-sky-500" /> Скачать в Excel (.xlsx)
              </Button>
              <Button 
                onClick={() => handleDownload('pdf')}
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2 cursor-pointer font-bold transition"
              >
                <Download className="w-3.5 h-3.5 text-sky-500" /> Скачать PDF-отчет (.pdf)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success notification for export */}
      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-xs font-semibold rounded-2xl border border-emerald-100/50 dark:border-emerald-900/40 flex items-center gap-2.5 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Отчет в формате {downloadSuccess.toUpperCase()} успешно подготовлен. Начнется автоматическая выгрузка.</span>
        </div>
      )}

      {/* 1. PASSPORT OF THE COUNTERPARTY (Full width) */}
      <div id="passport_block" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-5 transition duration-150">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-sky-500" />
              Паспорт контрагента
            </h3>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">
              сведения егрюл
            </span>
          </div>

          {/* Structured modular info tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Director field */}
            <div id="passport_director" className="flex gap-3 items-start p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/40">
              <div className="p-2 bg-white dark:bg-slate-900 text-slate-500 rounded-xl border border-slate-200/60 dark:border-slate-800/40 shrink-0">
                <User className="w-4 h-4 text-sky-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
                  Генеральный Директор
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate block">
                  {company.director}
                </span>
              </div>
            </div>

            {/* OKVED Sector */}
            <div 
              id="passport_okved" 
              onClick={() => setShowOkvedHistory(!showOkvedHistory)}
              className="flex gap-3 items-start p-3 bg-slate-50/50 hover:bg-sky-500/5 dark:bg-slate-950/40 dark:hover:bg-sky-500/5 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 cursor-pointer select-none transition-all duration-150 group/okved"
              title="Нажмите для просмотра истории изменений ОКВЭД"
            >
              <div className="p-2 bg-white dark:bg-slate-900 text-slate-500 rounded-xl border border-slate-200/60 dark:border-slate-800/40 shrink-0 group-hover/okved:border-sky-500/30 transition-colors">
                <Cpu className="w-4 h-4 text-sky-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
                    Код деятельности ОКВЭД
                  </span>
                  <span className="text-[8px] bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 transition-transform duration-150 active:scale-95 shrink-0">
                    История
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${showOkvedHistory ? 'rotate-180' : ''}`} />
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200 block font-mono">
                  {company.okved}
                </span>
              </div>
            </div>

            {/* Address field */}
            <div id="passport_address" className="flex gap-3 md:col-span-2 lg:col-span-1 items-start p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/40">
              <div className="p-2 bg-white dark:bg-slate-900 text-slate-500 rounded-xl border border-slate-200/60 dark:border-slate-800/40 shrink-0">
                <MapPin className="w-4 h-4 text-sky-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
                  Юридический зарегистрированный адрес
                </span>
                <span className="text-xs font-semibold text-slate-650 dark:text-slate-350 block truncate" title={company.address}>
                  {company.address}
                </span>
              </div>
            </div>

          </div>

          {/* Collapsible OKVED Changes History (Section 1) */}
          <AnimatePresence initial={false}>
            {showOkvedHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-slate-50/70 dark:bg-slate-950/30 rounded-2xl border border-slate-200 dark:border-slate-800/50 space-y-3 font-sans">
                  <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-sky-500" />
                      История изменений кодов ОКВЭД
                    </span>
                    <button 
                      onClick={() => setShowOkvedHistory(false)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold cursor-pointer"
                    >
                      Скрыть
                    </button>
                  </div>
                  
                  <div className="relative pl-4 space-y-4 border-l border-slate-250 dark:border-slate-800 ml-2 py-1">
                    {getOkvedHistory(company.id, company.okved, company.okvedDesc).map((item, idx) => (
                      <div key={idx} className="relative group/item">
                        {/* Timeline bubble */}
                        <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-slate-900 transition-colors ${
                          item.status === 'active' 
                            ? 'border-emerald-500' 
                            : 'border-slate-300 dark:border-slate-600 group-hover/item:border-sky-500'
                        }`} />
                        
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-slate-150 dark:bg-slate-800 px-1.5 py-0.5 rounded leading-none shrink-0">
                                {item.code}
                              </span>
                              <span className="text-xs text-slate-700 dark:text-slate-355 font-medium leading-normal">
                                {item.desc}
                              </span>
                            </div>
                            <div className="text-[9.5px] text-slate-400 dark:text-slate-500 font-mono">
                              Основание изменений: Запись ГРН в ЕГРЮЛ
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-start shrink-0">
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                              {item.period}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                              item.status === 'active'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400'
                            }`}>
                              {item.status === 'active' ? 'Действующий' : 'Архивный'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compact copyable registry codes bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2.5">
            Государственные идентификаторы
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'ИНН', val: company.inn },
              { label: 'КПП', val: company.kpp },
              { label: 'ОГРН', val: company.ogrn }
            ].map((code) => (
              <Button
                id={`btn_copy_${code.label.toLowerCase()}`}
                key={code.label}
                onClick={() => triggerCopyFeedback(code.label, code.val)}
                variant="ghost"
                className="flex flex-col items-start px-2.5 py-1.5 border border-sky-500/10 hover:border-sky-500/30 hover:bg-sky-500/5 rounded-xl text-left transition relative group font-normal w-full shadow-none"
                title="Скопировать"
              >
                <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500">
                  {code.label}
                </span>
                <span className="text-[10px] font-black text-slate-755 dark:text-slate-250 font-mono tracking-wider truncate w-full flex items-center justify-between">
                  {code.val}
                  {copiedText === code.label ? (
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : (
                    <Copy className="w-3 h-3 text-sky-400 opacity-0 group-hover:opacity-100 transition shrink-0 ml-1" />
                  )}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. COMBINED CONNECTIONS & TRUSTWORTHINESS BLOCK (Full width, white background) */}
      <div id="connections_trust_combined_block" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 transition duration-150">
        
        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-500" />
              Комплексный анализ связей и надежности
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Единая аналитическая панель безопасности бизнеса и структуры владения
            </p>
          </div>
          <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 px-2.5 py-1 rounded-lg font-mono uppercase tracking-wider self-start sm:self-auto font-bold">
            комплаенс-контроль
          </span>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Express Rating / Reliability (6 cols) */}
          <div id="compliance_reliability_column" className="md:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Рейтинг надежности и скоринг
              </h4>
              
              <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="4.5"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      className={company.scorePercent >= 80 ? 'stroke-emerald-500' : company.scorePercent >= 40 ? 'stroke-sky-500' : 'stroke-rose-500'}
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - company.scorePercent / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-slate-850 dark:text-slate-150 leading-none">
                      {company.scorePercent}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block uppercase tracking-wider ${ratingColorClass}`}>
                    {company.scorePercent >= 80 ? 'Высокая надежность' : company.scorePercent >= 40 ? 'Умеренный риск' : 'Высокий риск'}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Итоговый комплаенс-балл сформирован на основе комплексной финансовой устойчивости.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/30 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 font-semibold">
                {company.scoringDetails}
              </p>
            </div>
          </div>

          {/* Right Column: Connection stats / affiliates (6 cols) */}
          <div id="compliance_connections_column" className="md:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Аффилированные лица и структура холдинга
              </h4>

              <div className="bg-slate-50/50 dark:bg-slate-950/30 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 space-y-1">
                <div className="flex items-center justify-between text-xs p-2.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Users className="w-4 h-4 text-slate-400" />
                    Учредители и бенефициары:
                  </span>
                  <span className="font-extrabold text-slate-850 dark:text-slate-100 font-mono">
                    {connSummary.founders}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    Дочерние и зависимые общества:
                  </span>
                  <span className="font-extrabold text-slate-850 dark:text-slate-100 font-mono">
                    {connSummary.subsidiaries}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Network className="w-4 h-4 text-slate-400" />
                    Связанных юрлиц по адресу:
                  </span>
                  <span className="font-extrabold text-slate-850 dark:text-slate-100 font-mono">
                    {connSummary.affiliates}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5">
                  <span className="text-slate-550 dark:text-slate-400 flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    Узлы критических факторов риска:
                  </span>
                  <span className={`px-2 py-0.5 text-[11px] font-black rounded-lg ${
                    connSummary.alertNodes > 0 
                      ? 'bg-rose-500/15 text-rose-500' 
                      : 'bg-emerald-500/15 text-emerald-500'
                  }`}>
                    {connSummary.alertNodes}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Active visual button at the bottom */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            id="combined_service_inactive_cta"
            type="button"
            className="w-full bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/15 hover:border-sky-500/35 rounded-2xl py-3.5 px-5 text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer text-slate-700 dark:text-slate-200 select-none gap-3 active:scale-[0.995]"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-[#d8f2fe] dark:bg-sky-500/20 text-[#0ea5e9] flex items-center justify-center shrink-0 shadow-sm transition group-hover:scale-105">
                <Network className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[12px] font-black text-slate-800 dark:text-slate-100 leading-none group-hover:text-[#0ea5e9] transition-colors">Перейти к интерактивному сервису комплаенса и связей</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">Визуализация полного интерактивного графа аффилированности, структуры владения и комплаенс-проверок</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
              <span className="text-[9px] font-black uppercase bg-[#d8f2fe] text-[#0ea5e9] dark:bg-sky-500/20 dark:text-sky-400 px-2.5 py-1.5 rounded-lg tracking-wider border border-sky-500/10 self-start sm:self-auto font-bold shadow-sm">
                Перейти в сервис
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0ea5e9] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        </div>

      </div>

    </div>
  );
}
