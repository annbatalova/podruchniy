import { motion, AnimatePresence } from 'motion/react';
import { Company } from '../types';
import { Sparkles, MessageCircle, RefreshCw, X, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

// Highly detailed SVG Mascot representing the sleek futuristic analytical capsule assistant
const AssistantMascotSvg = ({ className = "w-24 h-24" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 200 230" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      id="assistant_mascot_svg"
    >
      {/* Outer shadow / glow */}
      <defs>
        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0ea5e9" floodOpacity="0.2" />
        </filter>
        <linearGradient id="bodyGradient" x1="100" y1="20" x2="100" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="50%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      <g filter="url(#glow)">
        {/* Friendly Robotic / Analytical Assistant Capsule body */}
        <rect x="40" y="30" width="120" height="150" rx="60" fill="url(#bodyGradient)" stroke="#38bdf8" strokeWidth="4" />
        
        {/* Glass Screen face */}
        <rect x="52" y="42" width="96" height="80" rx="40" fill="#0b1329" stroke="#1e3a8a" strokeWidth="2" />

        {/* Happy dynamic eyes on screen */}
        <circle cx="80" cy="80" r="10" fill="#38bdf8" />
        <circle cx="120" cy="80" r="10" fill="#38bdf8" />
        {/* Eye reflections */}
        <circle cx="83" cy="77" r="3" fill="#ffffff" />
        <circle cx="123" cy="77" r="3" fill="#ffffff" />

        {/* Digital smiling mouth bar */}
        <path d="M85 102 Q100 115 115 102" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Golden Analytics Badge on collar */}
        <circle cx="100" cy="145" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <path d="M94 145 H106 M100 139 V151" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

        {/* Upward soar sparks inside body */}
        <path d="M65 165 L80 155 L95 165" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M105 165 L120 155 L135 165" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Pedestal Stand */}
        <path d="M80 180 L60 215 C60 215 100 225 140 215 L120 180 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <ellipse cx="100" cy="215" rx="45" ry="8" fill="#0ea5e9" opacity="0.4" />
      </g>
    </svg>
  );
};

interface MascotAssistantProps {
  company: Company;
  statementType: 'balance' | 'ofr';
  balanceVariant: 'standard_66n' | 'fsbu_4_2023' | 'simplified';
  selectedYears: number[];
  isEnabled: boolean;
  onToggle: () => void;
}

export default function MascotAssistant({
  company,
  statementType,
  balanceVariant,
  selectedYears,
  isEnabled,
  onToggle
}: MascotAssistantProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'mascot_story' | 'calc_tips'>('analysis');
  const [speechBubbleText, setSpeechBubbleText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  useEffect(() => {
    if (!isEnabled) return;
    
    setIsThinking(true);
    const thinkingTimer = setTimeout(() => {
      setIsThinking(false);
      
      let tipsText = "";
      
      if (statementType === 'balance') {
        const companyRating = company.scorePercent;
        const ratingComment = companyRating > 80 
          ? `У ${company.shortName} потрясающий кредитный рейтинг (${companyRating}%)! Нам повезло — компания устойчива.`
          : companyRating < 40
            ? `Осторожно! У ${company.shortName} критически низкий рейтинг безопасности (${companyRating}%). Изучай баланс с пристрастием!`
            : `У ${company.shortName} средний стабильный уровень надёжности (${companyRating}%). Нужен умеренный контроль.`;

        if (balanceVariant === 'fsbu_4_2023') {
          tipsText = `💼 Привет, будущий финансовый директор! Мы открыли баланс по новому стандарту **ФСБУ 4/2023**.\n\n` +
            `Моё фирменное напутствие: обязательно посмотри на **строку 1160 (АПП)** в долгосрочных активах и **строку 1420/1530** в пассивах. Это права пользования активами (наша аренда и лизинг). ` +
            `По новому ФСБУ мы обязаны выделять их отдельно от классических кредитов! Это огромный плюс для инвесторов: сразу видно реальную аренду офисов и оборудования.\n\n` +
            `${ratingComment} А также обрати внимание на то, что задействовано сразу ${selectedYears.length} лет для горизонтального анализа!`;
        } else if (balanceVariant === 'standard_66n') {
          tipsText = `📑 Рассматриваем баланс по традиционному **Приказу №66н**.\n\n` +
            `Здесь вся долгосрочная аренда вшита прямо в заемные средства или "прочие обязательства". Это немного размывает картину при Due Diligence: юристам сложнее оценить забалансовое лизинговое бремя. ` +
            `Сравни этот классический вид с современным ФСБУ 4/2023, чтобы наглядно закрепить учебный материал.\n\n` +
            `${ratingComment} Попробуй добавить больше периодов для сравнения динамики.`;
        } else {
          tipsText = `⚡ Открыт **Упрощенный баланс**!\n\n` +
            `Он сокращен в разы: материальные активы сгруппированы в одну компактную строку 1150. Такой баланс подают субъекты малого бизнеса. ` +
            `Это сильно экономит время бухгалтера, но увы, не даёт детального представления о структуре патентов, Goodwill или лизинговом праве при крупной проверке.`;
        }
      } else {
        // OFR
        const hasGrowth = company.financials.length >= 2 
          ? company.financials[0].revenue > company.financials[1].revenue 
          : true;
        
        tipsText = `📊 Мы перешли в **Отчет о финансовых результатах (ОФР или Форма №2)**. Моя любимая таблица!\n\n` +
          `Тут правят бал выручка **(строка 2110)** и чистая прибыль **(строка 2400)**. Наша цель как скор-аналитиков — проверить маржинальность. Если выручка компании растет, а её чистая прибыль падает, значит у компании сильно выросли издержки (например, технологическая себестоимость).\n\n` +
          `Кстати, в ${company.shortName} за последний год наблюдается ${hasGrowth ? 'положительный тренд по росту выручки' : 'небольшое проседание выручки, обрати внимание на структуру коммерческих расходов'}.`;
      }

      // Add educational context for selected years length
      if (selectedYears.length < 3) {
        tipsText += `\n\n💡 *Совет от Подручного:* Выбрано маловато лет. Для солидного анализа динамики включи в верхнем меню хотя бы 3-4 года!`;
      } else if (selectedYears.length > 5) {
        tipsText += `\n\n🔥 *Молодец:* Ты выбрал глубокий анализ за ${selectedYears.length} лет. Это позволяет увидеть цикличность развития компании и её долгосрочную стабильность!`;
      }

      setSpeechBubbleText(tipsText);
    }, 600);

    return () => clearTimeout(thinkingTimer);
  }, [isEnabled, statementType, balanceVariant, selectedYears, company.id]);

  const getSidebarQuote = () => {
    if (statementType === 'balance') {
      return "Активы всегда равны пассивам. Если баланс не сошелся — ищи ошибку в проводках или лизинговых правах!";
    }
    return "Выручка — это тщеславие, прибыль — это здравый смысл, а деньги на расчетном счете — это реальность!";
  };

  return (
    <div id="advisor_mascot_root" className="space-y-4">
      {/* Dynamic toggle trigger panel */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 px-5 py-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 transition">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-500 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
              Интерактивный учебный ассистент
              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded uppercase font-black tracking-wider">
                Ваш помощник
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Подручный подскажет тонкости учета ФСБУ, баланса и поможет быстро разобраться в цифрах
            </p>
          </div>
        </div>

        {/* Elegant Toggle Switch */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isEnabled ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-700'
          }`}
          aria-label="Toggle assistant mascot"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-indigo-50/40 via-sky-50/20 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 p-6 rounded-3xl border-2 border-sky-500/20 dark:border-sky-500/10 shadow-lg relative overflow-hidden"
          >
            {/* Ambient Background decoration */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl -z-10" />

            {/* Mascot section */}
            <div className="md:col-span-3 flex flex-col items-center text-center space-y-2 border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300 animate-spin-slow" />
                <div className="relative bg-white dark:bg-slate-850 p-1.5 rounded-full shadow-md border border-sky-400/20">
                  <AssistantMascotSvg className="w-24 h-24 sm:w-28 sm:h-28" />
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Подручный
                </span>
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                  Персональный финансовый ассистент
                </span>
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <p className="text-[10px] text-slate-550 dark:text-slate-400 italic leading-relaxed text-center">
                  "{getSidebarQuote()}"
                </p>
              </div>
            </div>

            {/* Content/Interaction Section */}
            <div className="md:col-span-9 flex flex-col space-y-4">
              {/* Interaction nav menu */}
              <div className="flex border-b border-slate-150 dark:border-slate-800 pb-2 gap-3">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`text-xs font-bold pb-2 transition cursor-pointer relative ${
                    activeTab === 'analysis' 
                      ? 'text-sky-600 dark:text-sky-450 border-b-2 border-sky-500' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  Совет по текущей форме
                </button>
                <button
                  onClick={() => setActiveTab('calc_tips')}
                  className={`text-xs font-bold pb-2 transition cursor-pointer relative ${
                    activeTab === 'calc_tips' 
                      ? 'text-sky-600 dark:text-sky-450 border-b-2 border-sky-500' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  Методика разбора ОФР и Баланса
                </button>
                <button
                  onClick={() => setActiveTab('mascot_story')}
                  className={`text-xs font-bold pb-2 transition cursor-pointer relative ${
                    activeTab === 'mascot_story' 
                      ? 'text-sky-600 dark:text-sky-450 border-b-2 border-sky-500' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  Об ассистенте
                </button>
              </div>

              {/* Dynamic Bubble/Speech layout */}
              <div className="flex-1 bg-white/75 dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between">
                {isThinking ? (
                  <div className="flex flex-col items-center justify-center py-6 space-y-2">
                    <RefreshCw className="w-5 h-5 text-sky-500 animate-spin" />
                    <span className="text-[11px] text-slate-400">Подручный рассчитывает финансовые коэффициенты...</span>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans"
                  >
                    {activeTab === 'analysis' && (
                      <div className="space-y-2 whitespace-pre-wrap">
                        {speechBubbleText}
                      </div>
                    )}

                    {activeTab === 'calc_tips' && (
                      <div className="space-y-3">
                        <p className="font-bold text-sky-600 dark:text-sky-450 text-[13px]">
                          🎓 Шпаргалка студента по анализу отчетности:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-[11px]">
                          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">1. Анализ Пассивов (Откуда деньги)</span>
                            <span className="text-slate-600 dark:text-slate-400 block block">
                              Обрати внимание на долю собственного капитала. Если обязательств (долгов) больше 70% от всех пассивов — у компании критический уровень зависимости от кредиторов.
                            </span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">2. Анализ Ликвидности (Легкость выплат)</span>
                            <span className="text-slate-600 dark:text-slate-400 block block">
                              Сравни Денежные средства (строка 1250) с краткосрочными долгами. Денег на счете должно хватать для покрытия кассовых разрывов без распродажи складов.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'mascot_story' && (
                      <div className="space-y-2">
                        <p className="font-bold text-[13px]">🤖 Познакомьтесь с Вашим Подручным!</p>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          Умный интерактивный ассистент «Подручный» спроектирован как высокотехнологичный цифровой модуль финансовой экспертизы. 
                          Золотой отличительный знак в центре его корпуса символизирует стремление к абсолютной сбалансированности и точности расчетов. 
                          Он в режиме реального времени сканирует структуру финансовой отчетности компании и преобразует сложные математические данные в наглядные и понятные советы.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          Он живет в нашей скоринговой системе специально, чтобы помогать студентам и юристам с легкостью осваивать правила финансового анализа и ФСБУ.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Bubble Footer Actions */}
                <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-800/80 pt-3.5 mt-3.5">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {company.shortName} · ИНН {company.id}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsThinking(true);
                        setTimeout(() => setIsThinking(false), 400);
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 dark:bg-sky-500/10 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Обновить совет
                    </button>
                    <button
                      onClick={onToggle}
                      className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <EyeOff className="w-3 h-3" /> Скрыть ассистента
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
