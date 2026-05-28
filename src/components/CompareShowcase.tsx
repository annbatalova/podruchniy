import { useState } from 'react';
import { Company } from '../types';
import Button from './Button';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  FileSpreadsheet,
  Zap,
  Building
} from 'lucide-react';
import { mockCompanies } from '../data';

interface CompareShowcaseProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
}

export default function CompareShowcase({
  companies,
  selectedCompanyId,
  onSelectCompany
}: CompareShowcaseProps) {
  const [highlightMode, setHighlightMode] = useState<'none' | 'leader' | 'risk'>('none');

  const getRatioValue = (co: Company, ratioId: string) => {
    return co.ratios.find(r => r.id === ratioId)?.value ?? 0;
  };

  const getRatioStatus = (co: Company, ratioId: string) => {
    return co.ratios.find(r => r.id === ratioId)?.status ?? 'caution';
  };

  const currentList = companies.length ? companies : mockCompanies;

  return (
    <div className="space-y-6 font-sans select-none animate-fadeIn">
      {/* Tab intro container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            Сравнительная витрина контрагентов
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
            Сравнительный экспресс-анализ компаний из различных отраслей экономики. Оцените уровень риска, нормативы достаточности капитала и параметры ликвидности в едином структурированном окне.
          </p>
        </div>

        {/* Highlight modifiers */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setHighlightMode(highlightMode === 'leader' ? 'none' : 'leader')}
            variant={highlightMode === 'leader' ? 'solid' : 'light'}
            className="px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Подсветить лидеров
          </Button>
          <Button
            onClick={() => setHighlightMode(highlightMode === 'risk' ? 'none' : 'risk')}
            variant={highlightMode === 'risk' ? 'solid' : 'light'}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer ${
              highlightMode === 'risk'
                ? '!bg-rose-500 hover:!bg-rose-600 border-rose-600 shadow-sm shadow-rose-500/10 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Выделить зону риска
          </Button>
        </div>
      </div>

      {/* Grid Comparison Sheet */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto style-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Компания / ИНН</th>
                <th className="p-4 text-center">Рейтинг</th>
                <th className="p-4 text-center">Индекс стабильности</th>
                <th className="p-4">Тек. ликвидность</th>
                <th className="p-4">Коэф. автономии</th>
                <th className="p-4">Рентабельность (ROA)</th>
                <th className="p-4">Статус реестра</th>
                <th className="p-4 pr-6 text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {currentList.map((co) => {
                const isSelected = co.id === selectedCompanyId;
                const isLeader = co.scorePercent >= 85;
                const isRiskZone = co.scorePercent < 40;

                // Determine active highlights
                let rowHighlightClass = "hover:bg-slate-50/50 dark:hover:bg-slate-800/20";
                if (highlightMode === 'leader' && isLeader) {
                  rowHighlightClass = "bg-sky-500/5 hover:bg-sky-500/10 ring-2 ring-sky-500/20";
                } else if (highlightMode === 'risk' && isRiskZone) {
                  rowHighlightClass = "bg-rose-500/5 hover:bg-rose-500/10 ring-2 ring-rose-505/20 dark:ring-rose-500/10";
                } else if (isSelected) {
                  rowHighlightClass = "bg-slate-100/50 dark:bg-slate-800/40 font-medium";
                }

                const curLiq = getRatioValue(co, 'cur_liq');
                const autonomy = getRatioValue(co, 'autonomy');
                const roa = getRatioValue(co, 'roa');

                return (
                  <tr 
                    key={co.id} 
                    className={`transition duration-150 ${rowHighlightClass}`}
                  >
                    {/* Header info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                          isSelected 
                            ? 'bg-sky-500 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          <Building className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                            {co.shortName}
                            {isSelected && (
                              <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-1.5 py-0.5 rounded">
                                Активен
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            ИНН {co.inn} · {co.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Score Rating */}
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 text-xs font-black rounded ${
                        co.scoreMark === 'AAA' || co.scoreMark === 'AA'
                          ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30'
                          : co.scoreMark === 'A' || co.scoreMark === 'BBB'
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                      }`}>
                        {co.scoreMark}
                      </span>
                    </td>

                    {/* Stability Score Bar */}
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {co.scorePercent}%
                        </span>
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              co.scorePercent > 80 ? 'bg-sky-500' : co.scorePercent > 50 ? 'bg-yellow-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${co.scorePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Current Liquidity Metric */}
                    <td className="p-4 font-mono font-bold">
                      <span className={
                        getRatioStatus(co, 'cur_liq') === 'healthy' 
                          ? 'text-sky-600 dark:text-sky-400' 
                          : getRatioStatus(co, 'cur_liq') === 'critical' 
                          ? 'text-rose-500' 
                          : 'text-yellow-500'
                      }>
                        {curLiq.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Норма &gt; 1.5
                      </span>
                    </td>

                    {/* Autonomy Coefficient */}
                    <td className="p-4 font-mono font-bold">
                      <span className={
                        getRatioStatus(co, 'autonomy') === 'healthy' 
                          ? 'text-sky-600 dark:text-sky-400' 
                          : getRatioStatus(co, 'autonomy') === 'critical' 
                          ? 'text-rose-500' 
                          : 'text-yellow-500'
                      }>
                        {autonomy.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Норма &gt; 0.5
                      </span>
                    </td>

                    {/* ROA */}
                    <td className="p-4 font-mono font-bold">
                      <span className={roa >= 5.0 ? 'text-sky-600 dark:text-sky-400' : roa < 0 ? 'text-rose-500' : 'text-yellow-500'}>
                        {roa > 0 ? '+' : ''}{roa.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Норма &gt; 5%
                      </span>
                    </td>

                    {/* Legal Status */}
                    <td className="p-4">
                      {co.status === 'bankruptcy' ? (
                        <div className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Ликвидация / Банкротство</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Действующая</span>
                        </div>
                      )}
                    </td>

                    {/* Action Select link */}
                    <td className="p-4 pr-6 text-right">
                      {isSelected ? (
                        <span className="text-[11px] text-slate-400 font-mono italic">
                          Выбрана для скоринга
                        </span>
                      ) : (
                        <Button
                          onClick={() => onSelectCompany(co.id)}
                          variant="light"
                          className="px-3 py-1.5 rounded-xl transition font-bold text-xs cursor-pointer inline-flex items-center gap-1 border border-slate-200 dark:border-slate-700/60"
                        >
                          <Zap className="w-3 h-3" />
                          Исследовать
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Informative advice strip */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          <FileSpreadsheet className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <strong>Совет для академического анализа:</strong> Каждая колонка отражает критические параметры платежеспособности. Обратите внимание на <strong>АО "АЛЬФА-ТЕХНОЛОГИИ"</strong> — IT сектор во всем мире характерен высокими показателями рентабельности собственного капитала (ROA &gt; 40%) при крайне малой физической доле внеоборотных активов, в то время как ПАО "СБЕРБАНК" имеет колоссальные заемные пассивы в виде депозитов физических лиц, что нормально для финансового института, но было бы преддефолтной ситуацией для торговой компании вроде ООО "СЕРВИС".
          </div>
        </div>
      </div>
    </div>
  );
}
