import { useState, useEffect } from 'react';
import Button from './Button';
import { 
  Building2, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  BookmarkCheck,
  Award,
  BookOpen,
  Star
} from 'lucide-react';

interface StandardsViewProps {
  favoriteIndustries?: string[];
  onToggleFavoriteIndustry?: (id: 'banking' | 'wholesale' | 'software') => void;
  initialIndustry?: 'banking' | 'wholesale' | 'software';
}

export default function StandardsView({
  favoriteIndustries = [],
  onToggleFavoriteIndustry,
  initialIndustry
}: StandardsViewProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<'banking' | 'wholesale' | 'software'>('wholesale');
  
  useEffect(() => {
    if (initialIndustry) {
      setSelectedIndustry(initialIndustry);
    }
  }, [initialIndustry]);
  
  // Interactive mini quiz for students
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<'none' | 'success' | 'fail'>('none');

  const quizQuestion = {
    question: "Почему коэффициент автономии ПАО Сбербанк составляет всего 0.67, но у него максимальный рейтинг ААА, тогда как для ООО 'Сервис' схожий показатель был бы оценен критически?",
    options: [
      "Банки вообще не используют нормативы автономии, только ликвидность.",
      "Для коммерческих банков привлечение средств вкладчиков (пассивы) — основа бизнес-модели. Отношение своего капитала к сумме привлеченных обязательств естественным образом ниже, чем в торговле.",
      "У Сбербанка есть поддержка государства, поэтому коэффициенты не имеют веса.",
      "В банковской отчетности ОГРН заменяет показатели автономии."
    ],
    correctIdx: 1,
    explanation: "Верно! Главный источник ресурсов любого коммерческого банка — клиентские депозиты. В классической индустрии автономия менее 0.5 критична, но для устойчивого банка высокая доля привлеченного клиентского капитала при контроле резервов и нормативов ЦБ — абсолютный нормативный стандарт."
  };

  const handleQuizSubmit = (idx: number) => {
    setSelectedAnswer(idx);
    if (idx === quizQuestion.correctIdx) {
      setQuizScore('success');
    } else {
      setQuizScore('fail');
    }
  };

  const standardsData = {
    banking: {
      title: "Финансовый сектор и банкинг",
      desc: "Особая сфера финансового регулирования. Обычные нормативы ликвидности здесь заменены жесточайшим контролем Банка России (Базель III). Основное имущество — высоколиквидные финансовые инструменты.",
      ratios: [
        { name: "Коэффициент автономии (Equity Ratio)", norm: "> 0.10 - 0.15", description: "Низкое значение обусловлено огромными пассивами из депозитов клиентов физических и юридических лиц." },
        { name: "Коэффициент текущей ликвидности", norm: "Н/Д (Н2, Н3, Н4)", description: "Заменен нормативами мгновенной (Н2), текущей (Н3) и долгосрочной (Н4) ликвидности ЦБ РФ." },
        { name: "Рентабельность капитала (ROE)", norm: "> 15% - 20%", description: "Основной маркер эффективности управления разницей между ставками привлечения и размещения." },
        { name: "Рентабельность активов (ROA)", norm: "> 1.5% - 3.0%", description: "Очень высокие значения рентабельности активов редки из-за гигантской валюты баланса у крупных банков." }
      ]
    },
    wholesale: {
      title: "Оптовая торговля и логистика",
      desc: "Отрасль с высокой скоростью оборота средств и значительной долей дебиторской задолженности в запасах. Требует прочного оборотного капитала для бесперебойных отгрузок.",
      ratios: [
        { name: "Коэффициент автономии (Equity Ratio)", norm: "> 0.30 - 0.50", description: "Не менее 30-50% активов должны финансироваться за счет собственных средств учредителей." },
        { name: "Коэффициент текущей ликвидности", norm: "> 1.20 - 1.50", description: "Оборотные активы (в т.ч. склады готовой продукции) должны превышать краткосрочные долги поставщикам." },
        { name: "Рентабельность капитала (ROE)", norm: "> 10% - 15%", description: "Стабильный средний показатель здоровой оптовой компании." },
        { name: "Рентабельность продаж (ROS)", norm: "> 5% - 10%", description: "В опте маржинальность невысока, прибыль ставится за счет скорости объемов оборота." }
      ]
    },
    software: {
      title: "Разработка ПО и IT-сектор",
      desc: "Высокоэффективный наукоемкий бизнес. Высокая доля нематериальных активов, отсутствие тяжелого производственного оборудования и складов. Традиционно низкие заимствования.",
      ratios: [
        { name: "Коэффициент автономии (Equity Ratio)", norm: "> 0.50 - 0.70", description: "Долгов перед банками крайне мало, активы представлены собственным разработаным софтом и серверами." },
        { name: "Коэффициент текущей ликвидности", norm: "> 2.0 - 2.5", description: "Ликвидные активы намного превосходят краткосрочные задолженности за счет высокого кеша на счете." },
        { name: "Рентабельность капитала (ROE)", norm: "> 30% - 50%", description: "Сверхвысокая отдача на капитал благодаря малой потребности в основных средствах (капексе)." },
        { name: "Рентабельность продаж (ROS)", norm: "> 20% - 35%", description: "Маржинальность IT продуктов является мировым лидером среди отраслей из-за нулевой себестоимости дистрибуции копий." }
      ]
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none animate-fadeIn">
      
      {/* 1. Standard levels by industry */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-sky-500" />
              Референтные границы по отраслям (ОКВЭД)
            </h3>
            <span className="text-xs text-slate-400">Выберите индустрию для просмотра норм</span>
          </div>

          {/* Industry selectors */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6">
            <Button
              onClick={() => setSelectedIndustry('wholesale')}
              variant={selectedIndustry === 'wholesale' ? 'solid' : 'ghost'}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Оптовая торговля
            </Button>
            <Button
              onClick={() => setSelectedIndustry('software')}
              variant={selectedIndustry === 'software' ? 'solid' : 'ghost'}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Информационные технологии
            </Button>
            <Button
              onClick={() => setSelectedIndustry('banking')}
              variant={selectedIndustry === 'banking' ? 'solid' : 'ghost'}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Банковский сектор
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {standardsData[selectedIndustry].title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1.5">
                  {standardsData[selectedIndustry].desc}
                </p>
              </div>

              {onToggleFavoriteIndustry && (
                <button
                  type="button"
                  onClick={() => onToggleFavoriteIndustry(selectedIndustry)}
                  className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    favoriteIndustries.includes(selectedIndustry)
                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-500 hover:bg-amber-500/15'
                      : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200'
                  }`}
                  title={favoriteIndustries.includes(selectedIndustry) ? "Убрать из избранного" : "Добавить в избранное"}
                >
                  <Star className={`w-4 h-4 ${favoriteIndustries.includes(selectedIndustry) ? 'fill-current text-amber-500' : 'text-slate-400'}`} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {standardsData[selectedIndustry].ratios.map((r, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    {r.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-sky-600 dark:text-sky-400">
                      {r.norm}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (таргет-коридор)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pt-1 border-t border-slate-50 dark:border-slate-800 mt-1">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Academic Quiz panel */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-400" />
            Учебно-методический зачет
          </h3>

          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              {quizQuestion.question}
            </p>

            <div className="space-y-2">
              {quizQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                let btnStyle = "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300";
                
                if (isSelected) {
                  btnStyle = idx === quizQuestion.correctIdx 
                    ? "bg-sky-500/20 border-sky-500/80 text-sky-400 font-bold"
                    : "bg-rose-500/20 border-rose-500/80 text-rose-400 font-bold";
                }

                return (
                  <Button
                    key={idx}
                    onClick={() => handleQuizSubmit(idx)}
                    disabled={quizScore !== 'none'}
                    variant={isSelected ? "outline" : "ghost"}
                    className={`w-full text-left p-3 rounded-2xl text-xs leading-normal transition-all cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex gap-2.5 items-start justify-start w-full">
                      <span className="font-mono text-slate-550 shrink-0">{String.fromCharCode(65 + idx)})</span>
                      <span className="min-w-0 flex-1">{opt}</span>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Explanations */}
            {quizScore === 'success' && (
              <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-sky-300 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Отлично! Зачет сдан!</strong>
                  <p className="mt-1 text-slate-400">{quizQuestion.explanation}</p>
                </div>
              </div>
            )}

            {quizScore === 'fail' && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300 leading-relaxed">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Неверный ответ.</strong>
                  <p className="mt-1 text-slate-400">Попробуйте проанализировать банковскую структуру баланса еще раз. Обратите внимание на депозиты физических лиц.</p>
                  <Button 
                    onClick={() => { setSelectedAnswer(null); setQuizScore('none'); }}
                    variant="ghost"
                    className="mt-2 text-[10px] font-black underline text-sky-400 hover:text-sky-550 uppercase cursor-pointer block p-0 bg-transparent hover:bg-transparent"
                  >
                    Сбросить попытку
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80 mt-6 flex items-start gap-2.5 text-[10px] text-slate-400">
          <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Рекомендуется для студентов экономических и юридических специальностей в целях разграничения оценки разных секторов.</span>
        </div>
      </div>
    </div>
  );
}
