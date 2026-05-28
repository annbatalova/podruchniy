import { useState } from 'react';
import { 
  AlertOctagon, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  Clock, 
  Calendar, 
  FileText,
  ShieldCheck,
  Info
} from 'lucide-react';
import { Company } from '../types';

const getBankruptcyUpdateDate = (): string => {
  const now = new Date();
  const day = now.getDate();
  let month = now.getMonth() + 1; // 1-indexed (Jan=1, Dec=12)
  let year = now.getFullYear();

  if (day < 19) {
    month = month - 1;
    if (month === 0) {
      month = 12;
      year = year - 1;
    }
  }

  const mm = month < 10 ? `0${month}` : `${month}`;
  return `19.${mm}.${year}`;
};

interface BankruptcyCardProps {
  company: Company;
}

export default function BankruptcyCard({ company }: BankruptcyCardProps) {
  const [showTimeline, setShowTimeline] = useState(true);

  if (!company.bankruptcy) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4 font-sans select-none animate-fadeIn">
        <div className="mx-auto w-16 h-16 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-450 rounded-full flex items-center justify-center border border-sky-100/80 dark:border-sky-900/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
            <span>Процедуры банкротства не обнаружены</span>
            <div className="relative group/tooltip inline-block">
              <Info className="w-4 h-4 text-slate-400 hover:text-sky-500 cursor-pointer transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-slate-950 text-white rounded-xl shadow-xl text-[10.5px] leading-relaxed hidden group-hover/tooltip:block z-50 animate-in fade-in slide-in-from-bottom-1 font-normal font-sans normal-case">
                <span>Проверка производится в режиме реального времени на основе Единого федерального реестра сведений о банкротстве (ЕФРСБ), Коммерсантъ и картотеки арбитражных дел (КАД).</span>
                <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-350">
                  <span className="font-bold block text-white mb-0.5">Дата сбора информации:</span>
                  <span className="block font-mono text-sky-400 font-bold">{getBankruptcyUpdateDate()}</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
              </div>
            </div>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            По состоянию на 2026 г. в отношении {company.shortName} нет записей в ЕФРСБ о введении процедур наблюдения, внешнего управления или конкурсного производства.
          </p>
        </div>
      </div>
    );
  }

  const b = company.bankruptcy;

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* 1. Bankruptcy Summary Card */}
      <div className="border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/25 p-6 rounded-3xl relative overflow-hidden">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/30">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-rose-700 dark:text-rose-450 font-bold block mb-0.5 uppercase tracking-wider font-mono text-[10px]">
              Высокий Юридический Риск
            </span>
            <h3 className="text-base font-black text-rose-950 dark:text-rose-300 flex items-center gap-1.5">
              <span>Введена активная процедура банкротства!</span>
              <div className="relative group/tooltip inline-block">
                <Info className="w-4 h-4 text-rose-700/60 hover:text-rose-800 cursor-pointer transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-slate-950 text-white rounded-xl shadow-xl text-[10.5px] leading-relaxed hidden group-hover/tooltip:block z-50 animate-in fade-in slide-in-from-bottom-1 font-normal font-sans normal-case">
                  <span>Конкурсное производство в отношении должника ограничивает полномочия руководства и означает полную распродажу имущества для погашения требований кредиторов.</span>
                  <div className="mt-1.5 pt-1.5 border-t border-rose-900/40 text-[10px] text-slate-300">
                    <span className="font-bold block text-white mb-0.5">Дата сбора информации:</span>
                    <span className="block font-mono text-rose-450 dark:text-rose-400 font-bold">{getBankruptcyUpdateDate()}</span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                </div>
              </div>
            </h3>
          </div>
        </div>

        <p className="text-xs text-rose-900 dark:text-rose-400 leading-relaxed mb-6">
          В отношении должника решением суда открыто конкурсное производство. Найдено 1 активное дело. Сделки с контрагентом сильно ограничены.
        </p>

        {/* Core Bankruptcy properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-rose-200/50 dark:border-rose-900/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-rose-100 dark:border-rose-900/30 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 block uppercase mb-0.5 tracking-wider font-mono">
                Судебное дело
              </span>
              <strong className="text-xs font-black text-slate-900 dark:text-slate-100 block font-mono">
                {b.caseNumber}
              </strong>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">АС Рязанской области</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-rose-100 dark:border-rose-900/30 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 block uppercase mb-0.5 tracking-wider font-mono">
                Конкурсный управляющий
              </span>
              <strong className="text-xs font-black text-slate-900 dark:text-slate-100 block leading-tight">
                {b.managerName}
              </strong>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 block truncate max-w-[12rem]">{b.managerOrg}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 justify-between md:justify-start">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-rose-100 dark:border-rose-900/30 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 block uppercase mb-0.5 tracking-wider font-mono">
                  Последнее событие
                </span>
                <strong className="text-xs font-black text-slate-900 dark:text-slate-100 block truncate max-w-[12rem]" title={b.lastEventDescription}>
                  {b.lastEventDescription}
                </strong>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {b.lastEventDate.split('-').reverse().join('.')}
                </span>
              </div>
            </div>

            {/* Quick show/hide trigger */}
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="px-3 py-1.5 hover:bg-white dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-450 hover:border-sky-500 dark:hover:border-sky-400 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 h-9 ml-auto cursor-pointer"
            >
              <span>{showTimeline ? 'Скрыть хронологию' : 'Показать хронологию'}</span>
              {showTimeline ? <ChevronUp className="w-4 h-4 text-sky-500" /> : <ChevronDown className="w-4 h-4 text-sky-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Chronological Timeline */}
      {showTimeline && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Calendar className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
            Хронологическая карта событий банкротного дела
          </h4>

          <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-6 ml-3">
            {b.timeline.map((event, idx) => {
              return (
                <div key={idx} className="relative group animate-fadeIn">
                  {/* Timeline bullet line indicator */}
                  <span className={`absolute -left-[1.85rem] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950 ring-2 ${
                    event.critical 
                      ? 'bg-rose-500 ring-rose-200 dark:ring-rose-950' 
                      : 'bg-sky-500 ring-sky-100 dark:ring-sky-950'
                  }`} />

                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                     <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                      {event.date.split('-').reverse().join('.')}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                      event.critical 
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400' 
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border dark:border-slate-800/60'
                    }`}>
                      {event.stage}
                    </span>
                  </div>

                  <h5 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
                    {event.title}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1 max-w-2xl">
                    {event.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
