import { useState } from 'react';
import { 
  Building2, 
  HelpCircle, 
  Scale, 
  Calculator, 
  Network, 
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Search,
  X
} from 'lucide-react';

interface EmptyStateProps {
  onSelectSampleCompany: (id: string) => void;
  companies: {
    id: string;
    shortName: string;
    fullName: string;
    inn: string;
    scoreMark: string;
    scorePercent?: number;
    scoringDetails?: string;
    location?: string;
    status?: 'active' | 'bankruptcy';
  }[];
}

export default function EmptyState({ onSelectSampleCompany, companies }: EmptyStateProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Live filter logic matching our main search
  const filtered = companies.filter(
    (c) =>
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.inn.includes(searchQuery) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pre-defined key features with robust, rich descriptions for our USP
  const utps = [
    {
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40',
      title: 'Автоматический экспресс-скоринг',
      desc: 'Мгновенная калибровка кредитного рейтинга и присвоение классов надежности (от ААА до СС) на основе актуальных коэффициентов ликвидности, прибыльности и долговой нагрузки.'
    },
    {
      icon: HelpCircle,
      color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40',
      title: 'Прогнозирование банкротства',
      desc: 'Интеллектуальный расчет рисков по классическим пятифакторным моделям Альтмана (Z-score) и Таффлера, адаптированным под специфику российского законодательства.'
    },
    {
      icon: BookOpen,
      color: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40',
      title: 'Интерактивный финансовый анализ',
      desc: 'Преобразование сухих таблиц Баланса (Форма 1) и Отчёта о финансовых результатах (Форма 2) в наглядные структурные графики динамики активов, капитала и резервов.'
    },
    {
      icon: Scale,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
      title: 'Мониторинг арбитражного давления',
      desc: 'Анализ общего объема судебной нагрузки в роли ответчика и истца. Мониторинг динамики исков и расчет критического уровня правового риска.'
    },
    {
      icon: Network,
      color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/40',
      title: 'Карта аффилированных связей',
      desc: 'Генерация древовидного графа связей: учредители, дочерние структуры, руководители и ассоциированные юридические лица для выявления бенефициаров.'
    },
    {
      icon: Calculator,
      color: 'text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950/40',
      title: 'Мультимодельный калькулятор стоимости',
      desc: 'Моделирование стоимости собственного (Equity) и инвестированного (EV) капитала доходными методами (DCF Гордона) и сравнительными отраслевыми мультипликаторами.'
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500 space-y-12 select-none">
      
      {/* 1. Value Proposition (USP) / Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 shadow-lg">
        {/* Decorative ambient background blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-300/10 dark:bg-pink-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Sparkles className="w-3 h-3" />
            Интеллектуальная финансовая экосистема
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Глубокий скоринг, оценка стоимости и аудит рисков юридических лиц
          </h2>

          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl font-normal">
            Рассчитайте комплексную надежность компании, визуализируйте структуру активов, анализируйте аффилированность, судебную активность и моделируйте капитализацию бизнеса в едином аналитическом пространстве.
          </p>

          {/* Интерактивный интеллектуальный поиск */}
          <div className="pt-2 space-y-4">
            <div className="relative w-full max-w-2xl group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-12 py-3.5 bg-white/95 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 rounded-2xl text-sm placeholder-slate-400 font-sans text-slate-800 dark:text-slate-100 transition duration-150"
                placeholder="Поиск контрагентов по ИНН, ОГРН, адресу или названию компании..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-rose-500 text-slate-400 bg-transparent cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Подсказки / Результаты поиска */}
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {searchQuery ? 'Результаты поиска:' : 'Попробуйте платформу на готовых кейсах:'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(searchQuery ? filtered.slice(0, 3) : companies.slice(0, 3)).map((co) => {
                  return (
                    <button
                      key={co.id}
                      onClick={() => onSelectSampleCompany(co.id)}
                      className="p-3.5 bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950 hover:text-sky-600 rounded-2xl text-left transition select-none cursor-pointer shadow-xs active:scale-95 duration-100 flex flex-col justify-between h-[88px] group"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono text-slate-400 group-hover:text-sky-500 transition-colors">ИНН {co.inn}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded leading-none text-white ${
                          co.scoreMark === 'AAA' || co.scoreMark === 'AA'
                            ? 'bg-emerald-500'
                            : co.scoreMark === 'A' || co.scoreMark === 'BBB'
                            ? 'bg-sky-500'
                            : 'bg-rose-500'
                        }`}>
                          {co.scoreMark}
                        </span>
                      </div>
                      <div className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 truncate w-full mt-1.5 flex items-center gap-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        <span className="truncate">{co.shortName}</span>
                        <ArrowRight className="w-3 h-3 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition duration-150" />
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full">
                        {co.location || 'Разработка ПО'} · {co.status === 'bankruptcy' ? 'Ликвидация' : 'Активна'}
                      </div>
                    </button>
                  );
                })}
                {searchQuery && filtered.length === 0 && (
                  <div className="col-span-full py-4 px-4 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl text-xs text-slate-400 font-sans text-center">
                    Результатов не найдено. Нажмите крестик справа от ввода, чтобы сбросить фильтр.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-4 text-xs">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Базы данных ФНС и Росстат обновлены
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Быстрый поиск готов
            </span>
          </div>
        </div>
      </div>

      {/* 2. Detailed USP Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase font-sans">
            Ключевые модули анализа
          </h3>
          <div className="h-px bg-slate-200 dark:bg-slate-800 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {utps.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/40 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-9 h-9 rounded-xl ${feat.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 font-sans">
                      {feat.title}
                    </h5>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
