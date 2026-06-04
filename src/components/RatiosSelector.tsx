import { useState } from 'react';
import { 
  Activity, 
  Info,
  Scale
} from 'lucide-react';
import { Company } from '../types';

const ratioFormulas: Record<string, { formula: string; components: string }> = {
  cur_liq: {
    formula: 'Оборотные активы / Краткосрочные обязательства',
    components: 'Раздел II баланса (стр. 1200) / Раздел V баланса (стр. 1500)'
  },
  autonomy: {
    formula: 'Собственный капитал / Совокупные активы',
    components: 'Раздел III баланса (стр. 1300) / Пассив баланса (стр. 1700)'
  },
  roa: {
    formula: 'Чистая прибыль / Совокупные активы × 100%',
    components: 'Отчет о фин. результатах (стр. 2400) / Актив баланса (стр. 1600)'
  },
  ros: {
    formula: 'Чистая прибыль / Выручка × 100%',
    components: 'Отчет о фин. результатах (стр. 2400) / Отчет о фин. результатах (стр. 2110)'
  },
  abs_liq: {
    formula: '(Денежные средства + Краткосрочные финансовые вложения) / Краткосрочные обязательства',
    components: '(стр. 1250 + стр. 1240) / Раздел V баланса (стр. 1500)'
  },
  net_margin: {
    formula: 'Заемный капитал / Собственный капитал',
    components: '(Раздел IV стр. 1400 + Раздел V стр. 1500) / Раздел III стр. 1300'
  }
};

interface RatiosSelectorProps {
  company: Company;
}

export default function RatiosSelector({ company }: RatiosSelectorProps) {
  const [selectedRatioId, setSelectedRatioId] = useState<string>('cur_liq');

  const selectedRatio = company.ratios.find(r => r.id === selectedRatioId) || company.ratios[0];
  const formulaInfo = ratioFormulas[selectedRatio.id] || { formula: 'Данные ФНС', components: 'Бухгалтерская отчетность' };

  return (
    <div id="ratios" className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      
      {/* Bento Grid layout with Ratios cells (2/3 width) */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-500" />
                Финансовые коэффициенты контрагента
                <div className="relative group/tooltip inline-block">
                  <Info className="w-4 h-4 text-slate-400 hover:text-sky-500 cursor-pointer transition-colors" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-slate-950 text-white rounded-xl shadow-xl text-[10.5px] leading-relaxed hidden group-hover/tooltip:block z-50 animate-in fade-in slide-in-from-bottom-1 font-normal font-sans normal-case">
                    <span>Финансовые коэффициенты (ликвидность, автономия, рентабельность ROS/ROA) рассчитываются автоматически по формулам на основе данных бухгалтерской отчетности для оценки платежеспособности и надежности.</span>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-300">
                      <span className="font-bold block text-white mb-0.5">Дата актуальности (2025 г.):</span>
                      <span className="block">13 мая 2026 года</span>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                  </div>
                </div>
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">Нажмите на карточку для разбора</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.ratios.map((ratio) => {
                 const isSelected = ratio.id === selectedRatioId;

                 return (
                   <div
                     key={ratio.id}
                     onClick={() => setSelectedRatioId(ratio.id)}
                     className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                       isSelected
                         ? 'bg-sky-50/50 dark:bg-sky-550/10 dark:bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/10'
                         : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/20 dark:hover:bg-slate-900/30'
                     }`}
                   >
                     <div className="flex items-start justify-between gap-2 mb-3">
                       <span className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-normal block max-w-[15rem] truncate" title={ratio.name}>
                         {ratio.name}
                       </span>
                     </div>

                     <div className="flex items-baseline gap-2">
                       <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                         {ratio.id.includes('roa') || ratio.id.includes('ros') ? `${ratio.value}%` : ratio.value}
                       </span>
                     </div>

                     {/* Tiny selection dot indicator */}
                     {isSelected && (
                       <span className="absolute right-4 bottom-4 w-2 h-2 rounded-full bg-sky-600 dark:bg-sky-400" />
                     )}
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </div>

      {/* 2. Educational & legal insights sidebar (1/3 width) */}
      {selectedRatio && (
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/85 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 mb-3 animate-fadeIn">
              <div className="p-2 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5 leading-none font-mono">
                  Экономический Разбор
                </h4>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100 truncate max-w-[14rem]" title={selectedRatio.name}>
                  {selectedRatio.name}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {selectedRatio.description}
            </p>

            <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs space-y-3.5 font-sans animate-scaleUp">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                <span className="text-slate-400 dark:text-slate-500">Фактическое значение</span>
                <strong className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedRatio.id.includes('roa') || selectedRatio.id.includes('ros') ? `${selectedRatio.value}%` : selectedRatio.value}
                </strong>
              </div>
              
              <div className="space-y-1 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                <span className="text-slate-400 dark:text-slate-500 block">Порядок расчета</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 font-sans text-[11px] block leading-tight">
                  {selectedRatio.formula || formulaInfo.formula}
                </span>
              </div>

              <div className="space-y-1 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                <span className="text-slate-400 dark:text-slate-500 block">Компоненты (Бухг. баланс / ОФР)</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] leading-tight font-mono">
                  {formulaInfo.components}
                </span>
              </div>

              {selectedRatio.source && (
                <div className="space-y-1">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Источник</span>
                  <a
                    href={selectedRatio.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 block text-[10px] leading-tight hover:underline truncate"
                  >
                    {selectedRatio.source.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/85 mt-6 bg-sky-50/40 dark:bg-sky-950/20 p-3.5 rounded-xl border border-sky-100/80 dark:border-sky-900/30 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <Scale className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
            <span>
              <strong>Польза для юристов:</strong> Отклонение данных показателей от нормативных границ помогает квалифицировать признаки банкротства при подготовке юридических заключений.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
