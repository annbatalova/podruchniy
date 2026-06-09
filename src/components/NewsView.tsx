import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  BookOpen, 
  Newspaper, 
  Compass, 
  User, 
  Share2, 
  Clock, 
  Bookmark, 
  HelpCircle, 
  CheckCircle,
  Hash,
  AlertTriangle,
  Flame,
  MousePointer,
  Award,
  Maximize2,
  ShieldCheck,
  Grid
} from 'lucide-react';
import NewsCarousel from './NewsCarousel';
import ArticleDetailView from './ArticleDetailView';

export interface Author {
  firstName: string;
  lastName: string;
  avatarUrl: string; // fallback SVG or gradient
  role: string;
  companyName?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'company_news' | 'market_analytics' | 'taxes_and_regulations' | 'cases_interviews' | 'guides_tutorials';
  imageGradient: string; // stylish background simulation
  imagePatternId: number; // custom SVG element choice
  author: Author;
  readTime: string;
  summary: string;
  likes: number;
  blocks?: any[];
}

// 25+ High Quality News and Articles
export const MOCK_NEWS_DATA: NewsItem[] = [
  {
    id: 'news-1',
    title: 'ПАО «Сбербанк России» увеличил чистые активы на 14.5% за счет корпоративных займов',
    date: '28 мая 2026 г.',
    category: 'company_news',
    imageGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    imagePatternId: 1,
    author: {
      firstName: 'Станислав',
      lastName: 'Кравченко',
      avatarUrl: 'bg-gradient-to-tr from-sky-400 to-blue-600',
      role: 'Главный редактор фин. вещания ФинВульф'
    },
    readTime: '3 мин чтения',
    summary: 'Новый финансовый отчет Сбербанка демонстрирует рекордную маржинальность. Коэффициент текущей ликвидности банка держится на запредельно высоком уровне, укрепляя показатели надежности.',
    likes: 142
  },
  {
    id: 'news-2',
    title: 'Изменение ключевой ставки ЦБ РФ: Сценарии развития ликвидности для оптового и розничного ритейла',
    date: '27 мая 2026 г.',
    category: 'market_analytics',
    imageGradient: 'from-amber-500 via-orange-600 to-red-700',
    imagePatternId: 2,
    author: {
      firstName: 'Екатерина',
      lastName: 'Воронцова',
      avatarUrl: 'bg-gradient-to-tr from-amber-400 to-rose-600',
      role: 'Руководитель департамента макроэкономики'
    },
    readTime: '5 мин чтения',
    summary: 'Регулятор ужесточает нормы резервирования. Анализируем, как новые меры отразятся на калькуляторах абсолютной ликвидности средних торговых компаний.',
    likes: 98
  },
  {
    id: 'news-3',
    title: 'Новый ФСБУ 25/2018 «Аренда»: Практическое руководство по дисконтированию платежей',
    date: '26 мая 2026 г.',
    category: 'taxes_and_regulations',
    imageGradient: 'from-blue-500 via-indigo-600 to-violet-700',
    imagePatternId: 3,
    author: {
      firstName: 'Мария',
      lastName: 'Соколова',
      avatarUrl: 'bg-gradient-to-tr from-pink-400 to-indigo-600',
      role: 'Налоговый консультант, Аудитор высшей категории'
    },
    readTime: '8 мин чтения',
    summary: 'Подробный юридический и бухгалтерский чек-лист о том, как правильно рассчитывать амортизацию прав пользования активами (ППА) без ошибок.',
    likes: 210
  },
  {
    id: 'news-4',
    title: 'Как финансовый директор ГК «СтройРесурс» сократил дебиторскую задолженность на 45 млн за два клика',
    date: '25 мая 2026 г.',
    category: 'cases_interviews',
    imageGradient: 'from-rose-500 via-pink-600 to-purple-700',
    imagePatternId: 4,
    author: {
      firstName: 'Дмитрий',
      lastName: 'Орлов',
      avatarUrl: 'bg-gradient-to-tr from-violet-400 to-orange-500',
      role: 'Финансовый директор холдинга «СтройРесурс»'
    },
    readTime: '4 мин чтения',
    summary: 'Интервью и практический кейс интеграции аналитической панели Подручный в ежедневную работу казначейства строительной компании.',
    likes: 175
  },
  {
    id: 'news-5',
    title: 'Что такое EBITDA простым языком и почему банки требуют этот коэффициент при одобрении лимитов',
    date: '24 мая 2026 г.',
    category: 'guides_tutorials',
    imageGradient: 'from-fuchsia-500 via-purple-600 to-pink-700',
    imagePatternId: 5,
    author: {
      firstName: 'Артур',
      lastName: 'Шарапов',
      avatarUrl: 'bg-gradient-to-tr from-teal-400 to-emerald-600',
      role: 'Академический директор курса финансовой грамотности'
    },
    readTime: '6 мин чтения',
    summary: 'Пошаговый разбор операционной прибыли до вычета процентов и налогов. Разница между EBITDA, EBIT и чистой прибылью на пальцах.',
    likes: 320
  },
  {
    id: 'news-6',
    title: 'Внезапное банкротство крупного дистрибьютора электроники: уроки экспресс-проверки контрагентов',
    date: '23 мая 2026 г.',
    category: 'company_news',
    imageGradient: 'from-red-500 via-rose-600 to-orange-700',
    imagePatternId: 1,
    author: {
      firstName: 'Олег',
      lastName: 'Михайлов',
      avatarUrl: 'bg-gradient-to-tr from-red-400 to-yellow-500',
      role: 'Специалист по экономической безопасности бизнеса'
    },
    readTime: '4 мин чтения',
    summary: 'Как вовремя заметить тревожные сигналы падения коэффициента автономии субподрядчика до критических 0.15 за полгода до официального иска.',
    likes: 189
  },
  {
    id: 'news-7',
    title: 'Секторы оптовой торговли в РФ показывают рекордную оборачиваемость запасов во втором квартале 2026 года',
    date: '22 мая 2026 г.',
    category: 'market_analytics',
    imageGradient: 'from-cyan-500 via-blue-600 to-indigo-750',
    imagePatternId: 2,
    author: {
      firstName: 'Елена',
      lastName: 'Попова',
      avatarUrl: 'bg-gradient-to-tr from-cyan-400 to-purple-600',
      role: 'Старший аналитик отраслевых бенчмарков'
    },
    readTime: '5 мин чтения',
    summary: 'Сравнительный анализ 45 компаний по ОКВЭД 46 продемонстрировал, что лидеры рынка ускорили расчеты с поставщиками в среднем на 8 дней.',
    likes: 115
  },
  {
    id: 'news-8',
    title: 'Разъяснения ФНС по НДС для ИТ-компаний в 2026 году: Кого затронут льготы и кто лишится статуса',
    date: '21 мая 2026 г.',
    category: 'taxes_and_regulations',
    imageGradient: 'from-purple-500 via-violet-600 to-fuchsia-800',
    imagePatternId: 3,
    author: {
      firstName: 'Григорий',
      lastName: 'Власов',
      avatarUrl: 'bg-gradient-to-tr from-purple-400 to-pink-500',
      role: 'Советник государственной гражданской службы'
    },
    readTime: '7 мин чтения',
    summary: 'Анализируем свежее постановление Минцифры и налоговой службы по критериям аккредитации разработчиков программного обеспечения за этот месяц.',
    likes: 245
  },
  {
    id: 'news-9',
    title: 'Интервью с аудитором: Самые частые ошибки при сдаче финансовой отчетности малым бизнесом',
    date: '20 мая 2026 г.',
    category: 'cases_interviews',
    imageGradient: 'from-orange-500 via-red-600 to-pink-700',
    imagePatternId: 4,
    author: {
      firstName: 'Светлана',
      lastName: 'Карпова',
      avatarUrl: 'bg-gradient-to-tr from-yellow-400 to-red-600',
      role: 'Партнер аудиторского бюро «Карпова и партнеры»'
    },
    readTime: '9 мин чтения',
    summary: 'Почему балансы мелких производств часто содержат некорректное соотношение дебиторской и кредиторской задолженностей и как это исправить.',
    likes: 156
  },
  {
    id: 'news-10',
    title: 'Тренажер финансового аналитика: Как за 5 минут оценить долговую нагрузку незнакомого контрагента',
    date: '19 мая 2026 г.',
    category: 'guides_tutorials',
    imageGradient: 'from-teal-500 via-cyan-600 to-blue-700',
    imagePatternId: 5,
    author: {
      firstName: 'Павел',
      lastName: 'Резник',
      avatarUrl: 'bg-gradient-to-tr from-emerald-400 to-blue-600',
      role: 'Разработчик интерактивных тренажеров ФинВульф'
    },
    readTime: '5 мин чтения',
    summary: 'Интерактивная методика быстрого сканирования баланса — учимся смотреть только на критически важные показатели устойчивости.',
    likes: 280
  },
  {
    id: 'news-11',
    title: 'Кадровые изменения: ООО «ФармЛогистика» сменило генерального директора на фоне падения маржи',
    date: '18 мая 2026 г.',
    category: 'company_news',
    imageGradient: 'from-sky-505 via-indigo-600 to-slate-800',
    imagePatternId: 1,
    author: {
      firstName: 'Станислав',
      lastName: 'Кравченко',
      avatarUrl: 'bg-gradient-to-tr from-sky-400 to-blue-600',
      role: 'Главный редактор фин. вещания ФинВульф'
    },
    readTime: '2 мин чтения',
    summary: 'Аналитики предсказывают реструктуризацию долгов компании. Новое руководство планирует сосредоточиться на оптимизации операционных издержек.',
    likes: 67
  },
  {
    id: 'news-12',
    title: 'Рынок облачных вычислений в РФ демонстрирует рост доли собственного капитала над заемным',
    date: '17 мая 2026 г.',
    category: 'market_analytics',
    imageGradient: 'from-violet-500 via-indigo-700 to-cyan-600',
    imagePatternId: 2,
    author: {
      firstName: 'Елена',
      lastName: 'Попова',
      avatarUrl: 'bg-gradient-to-tr from-cyan-400 to-purple-600',
      role: 'Старший аналитик отраслевых бенчмарков'
    },
    readTime: '4 мин чтения',
    summary: 'Обзор ИТ-индустрии показал, что средний по рынку индикатор финансовой независимости вырос до 0.62 благодаря притоку частных инвестиций.',
    likes: 122
  },
  {
    id: 'news-13',
    title: 'Приказ Минфина №45н: Изменение правил оценки нематериальных активов (НМА)',
    date: '16 мая 2026 г.',
    category: 'taxes_and_regulations',
    imageGradient: 'from-yellow-600 via-amber-600 to-red-800',
    imagePatternId: 3,
    author: {
      firstName: 'Мария',
      lastName: 'Соколова',
      avatarUrl: 'bg-gradient-to-tr from-pink-400 to-indigo-600',
      role: 'Налоговый консультант, Аудитор высшей категории'
    },
    readTime: '6 мин чтения',
    summary: 'Определяем новое понятие гудвилла в отечественном бухучете и разбираем, кого затронет обязанность переоценки интеллектуальной собственности.',
    likes: 167
  },
  {
    id: 'news-14',
    title: 'Кейс: Как кредитный брокер сэкономил клиентам миллиарды рублей, вовремя отсеяв рискованные банки',
    date: '15 мая 2026 г.',
    category: 'cases_interviews',
    imageGradient: 'from-lime-600 via-emerald-600 to-teal-700',
    imagePatternId: 4,
    author: {
      firstName: 'Илья',
      lastName: 'Мельников',
      avatarUrl: 'bg-gradient-to-tr from-green-400 to-yellow-600',
      role: 'Основатель консалтинговой группы FinancePro'
    },
    readTime: '7 мин чтения',
    summary: 'Детальный разбор скоринговых карт Банков России на примере данных платформы ФинВульф. Карта ликвидности и обязательств финансовых гигантов.',
    likes: 194
  },
  {
    id: 'news-15',
    title: 'Анализ рентабельности продаж (ROS): Отличие грязной и чистой рентабельности предприятия',
    date: '14 мая 2026 г.',
    category: 'guides_tutorials',
    imageGradient: 'from-blue-600 via-sky-600 to-emerald-600',
    imagePatternId: 5,
    author: {
      firstName: 'Артур',
      lastName: 'Шарапов',
      avatarUrl: 'bg-gradient-to-tr from-teal-400 to-emerald-600',
      role: 'Академический директор курса финансовой грамотности'
    },
    readTime: '5 мин чтения',
    summary: 'Изучаем базовый финансовый маркер операционной привлекательности. Расчетная формула с примерами из действующего бизнеса.',
    likes: 211
  },
  {
    id: 'news-16',
    title: 'Новая лицензия: ООО «ТехноГрупп» получила разрешение Минпромторга на сборку прецизионных станков',
    date: '12 мая 2026 г.',
    category: 'company_news',
    imageGradient: 'from-emerald-400 via-teal-600 to-indigo-800',
    imagePatternId: 1,
    author: {
      firstName: 'Станислав',
      lastName: 'Кравченко',
      avatarUrl: 'bg-gradient-to-tr from-sky-400 to-blue-600',
      role: 'Главный редактор фин. вещания ФинВульф'
    },
    readTime: '3 мин чтения',
    summary: 'Лицензирование позволит компании претендовать на госсубсидии и льготное инвестиционное финансирование под 3% годовых.',
    likes: 83
  },
  {
    id: 'news-17',
    title: 'Исследование: Коэффициенты быстрой ликвидности оптовиков резко снижаются из-за задержек контейнерных цепочек',
    date: '10 мая 2026 г.',
    category: 'market_analytics',
    imageGradient: 'from-pink-500 via-rose-600 to-amber-700',
    imagePatternId: 2,
    author: {
      firstName: 'Елена',
      lastName: 'Попова',
      avatarUrl: 'bg-gradient-to-tr from-cyan-400 to-purple-600',
      role: 'Старший аналитик отраслевых бенчмарков'
    },
    readTime: '6 мин чтения',
    summary: 'Товарные запасы оседают в логистических хабах, снижая оперативную платежеспособность. Издержки торговых компаний выросли на 12%.',
    likes: 119
  },
  {
    id: 'news-18',
    title: 'Изменения в налоге на прибыль для экспортеров сырьевой продукции с июля 2026 года',
    date: '08 мая 2026 г.',
    category: 'taxes_and_regulations',
    imageGradient: 'from-purple-600 via-pink-700 to-rose-600',
    imagePatternId: 3,
    author: {
      firstName: 'Мария',
      lastName: 'Соколова',
      avatarUrl: 'bg-gradient-to-tr from-pink-400 to-indigo-600',
      role: 'Налоговый консультант, Аудитор высшей категории'
    },
    readTime: '5 мин чтения',
    summary: 'Разбираемся в новых коэффициентах при расчете налогооблагаемой базы и исключениях в отношении дружественных стран Азии.',
    likes: 130
  },
  {
    id: 'news-19',
    title: 'Как аудитор за 15 минут обнаружил сомнительные выплаты руководству в банкротящемся холдинге',
    date: '06 мая 2026 г.',
    category: 'cases_interviews',
    imageGradient: 'from-amber-600 via-orange-600 to-indigo-800',
    imagePatternId: 4,
    author: {
      firstName: 'Олег',
      lastName: 'Михайлов',
      avatarUrl: 'bg-gradient-to-tr from-red-400 to-yellow-500',
      role: 'Специалист по экономической безопасности бизнеса'
    },
    readTime: '8 мин чтения',
    summary: 'Реальный детективный кейс из аудиторской практики: вывод активов через фиктивные сублицензионные выплаты по оценкам ФинВульф.',
    likes: 228
  },
  {
    id: 'news-20',
    title: 'Что такое Дюпоновский анализ рентабельности собственного капитала (ROE) и из каких трех факторов он состоит',
    date: '04 мая 2026 г.',
    category: 'guides_tutorials',
    imageGradient: 'from-indigo-600 via-violet-600 to-fuchsia-700',
    imagePatternId: 5,
    author: {
      firstName: 'Артур',
      lastName: 'Шарапов',
      avatarUrl: 'bg-gradient-to-tr from-teal-400 to-emerald-600',
      role: 'Академический директор курса финансовой грамотности'
    },
    readTime: '7 мин чтения',
    summary: 'Подробная формула Дюпона: операционная рентабельность, оборачиваемость активов и финансовый леверидж. Почему это гениально.',
    likes: 412
  },
  {
    id: 'news-21',
    title: 'ПАО «Магнит» заключил контракт на поставку альтернативного импорта фруктов из стран Латинской Америки',
    date: '02 мая 2026 г.',
    category: 'company_news',
    imageGradient: 'from-orange-500 via-amber-500 to-yellow-600',
    imagePatternId: 1,
    author: {
      firstName: 'Станислав',
      lastName: 'Кравченко',
      avatarUrl: 'bg-gradient-to-tr from-sky-400 to-blue-600',
      role: 'Главный редактор фин. вещания ФинВульф'
    },
    readTime: '2 мин чтения',
    summary: 'Крупнейшая ритейл-сеть снижает зависимость от турецких экспортеров, создавая распределенные каналы прямых логистических цепочек.',
    likes: 93
  },
  {
    id: 'news-22',
    title: 'Суверенный долг и процентные ставки: новые векторы движения ликвидности в коммерческом банкинге',
    date: '28 апреля 2026 г.',
    category: 'market_analytics',
    imageGradient: 'from-teal-600 via-cyan-700 to-emerald-700',
    imagePatternId: 2,
    author: {
      firstName: 'Екатерина',
      lastName: 'Воронцова',
      avatarUrl: 'bg-gradient-to-tr from-amber-400 to-rose-600',
      role: 'Руководитель департамента макроэкономики'
    },
    readTime: '6 мин чтения',
    summary: 'Оцениваем риск перетока денежной массы из классических текущих счетов юрлиц в депозитные сертификаты повышенной доходности.',
    likes: 111
  },
  {
    id: 'news-23',
    title: 'ФНС готовит запуск полностью автоматических проверок кассовой дисциплины с июня 2026 года',
    date: '25 апреля 2026 г.',
    category: 'taxes_and_regulations',
    imageGradient: 'from-slate-700 via-zinc-800 to-neutral-900',
    imagePatternId: 3,
    author: {
      firstName: 'Григорий',
      lastName: 'Власов',
      avatarUrl: 'bg-gradient-to-tr from-purple-400 to-pink-500',
      role: 'Советник государственной гражданской службы'
    },
    readTime: '4 мин чтения',
    summary: 'Предупреждение для торговых точек: искусственный интеллект ФНС будет автоматически выявлять расхождения логов ОФД с декларациями.',
    likes: 185
  },
  {
    id: 'news-24',
    title: 'Интервью с ИТ-предпринимателем: Как мы вышли на самоокупаемость за счет контроля оборачиваемости запасов',
    date: '20 апреля 2026 г.',
    category: 'cases_interviews',
    imageGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    imagePatternId: 4,
    author: {
      firstName: 'Илья',
      lastName: 'Мельников',
      avatarUrl: 'bg-gradient-to-tr from-green-400 to-yellow-600',
      role: 'Основатель консалтинговой группы FinancePro'
    },
    readTime: '6:50 мин чтения',
    summary: 'Практические инсайты от основателя облачного стартапа о том, как грамотная инвентарная политика спасает от затяжного кассового разрыва.',
    likes: 147
  },
  {
    id: 'news-25',
    title: 'Коэффициент абсолютной ликвидности: Самый строгий критерий платежеспособности в финансовом анализе',
    date: '15 апреля 2026 г.',
    category: 'guides_tutorials',
    imageGradient: 'from-rose-600 via-purple-600 to-blue-600',
    imagePatternId: 5,
    author: {
      firstName: 'Артур',
      lastName: 'Шарапов',
      avatarUrl: 'bg-gradient-to-tr from-teal-400 to-emerald-600',
      role: 'Академический директор курса финансовой грамотности'
    },
    readTime: '4:30 мин чтения',
    summary: 'Какая норма считается здоровой для производственного предприятия и как повысить этот коэффициент без привлечения займов.',
    likes: 295
  }
];

export interface NewsViewProps {
  companies: any[];
  onSelectCompany: (id: string) => void;
  setActiveTab: (tab: 'dashboard' | 'compare' | 'standards' | 'calculators' | 'cabinet' | 'news' | 'moderator') => void;
  isBentoEditActive?: boolean;
}

// Category definition helper
const CATEGORIES = [
  { id: 'all', name: 'Все', icon: Compass },
  { id: 'company_news', name: 'Новости компаний', icon: Newspaper },
  { id: 'market_analytics', name: 'Аналитика рынка', icon: Sparkles },
  { id: 'taxes_and_regulations', name: 'Регуляторика & Налоги', icon: BookOpen },
  { id: 'cases_interviews', name: 'Кейсы и интервью', icon: Award },
  { id: 'guides_tutorials', name: 'Гайды & Обучение', icon: HelpCircle },
] as const;

type CategoryType = string;

export default function NewsView({ 
  companies, 
  onSelectCompany, 
  setActiveTab,
  isBentoEditActive = false
}: NewsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Shadow CATEGORIES with dynamic set from localStorage supporting moderator changes in real-time
  const CATEGORIES = useMemo(() => {
    try {
      const saved = localStorage.getItem('news_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            icon: cat.id === 'all' ? Compass :
                  cat.id === 'company_news' ? Newspaper :
                  cat.id === 'market_analytics' ? Sparkles :
                  cat.id === 'taxes_and_regulations' ? BookOpen :
                  cat.id === 'cases_interviews' ? Award :
                  cat.id === 'guides_tutorials' ? HelpCircle : BookOpen
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'all', name: 'Все', icon: Compass },
      { id: 'company_news', name: 'Новости компаний', icon: Newspaper },
      { id: 'market_analytics', name: 'Аналитика рынка', icon: Sparkles },
      { id: 'taxes_and_regulations', name: 'Регуляторика & Налоги', icon: BookOpen },
      { id: 'cases_interviews', name: 'Кейсы и интервью', icon: Award },
      { id: 'guides_tutorials', name: 'Гайды & Обучение', icon: HelpCircle },
    ];
  }, []);

  // Load custom publications from localStorage and merge them on top of mock data

  const allArticles = useMemo(() => {
    try {
      const saved = localStorage.getItem('custom_publications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter: only show articles with 'published' status, or with no status (from older templates)
          const published = parsed.filter(p => !p.status || p.status === 'published');
          return [...published, ...MOCK_NEWS_DATA];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return MOCK_NEWS_DATA;
  }, [selectedArticle]);

  // Dynamic home carousels configurations
  const carouselsConfig = useMemo(() => {
    try {
      const saved = localStorage.getItem('home_carousels_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'carousel_1', categoryId: 'company_news', articleIds: [] },
      { id: 'carousel_2', categoryId: 'market_analytics', articleIds: [] },
      { id: 'carousel_3', categoryId: 'taxes_and_regulations', articleIds: [] }
    ];
  }, [allArticles]);

  const parsedCarouselsData = useMemo(() => {
    return carouselsConfig.map((carousel: any) => {
      const catObj = CATEGORIES.find((c: any) => c.id === carousel.categoryId);
      const categoryName = catObj ? catObj.name : 'Категория';
      
      let articles: NewsItem[] = [];
      if (Array.isArray(carousel.articleIds) && carousel.articleIds.length > 0) {
        articles = carousel.articleIds
          .map((id: string) => allArticles.find((a: any) => a.id === id))
          .filter((a: any): a is NewsItem => !!a);
      }
      
      if (articles.length < 3) {
        articles = allArticles.filter((item: any) => item.category === carousel.categoryId).slice(0, 5);
      }

      return {
        ...carousel,
        categoryName,
        articles
      };
    });
  }, [carouselsConfig, allArticles, CATEGORIES]);
  
  // Custom message for development click simulations
  const [devViewAlert, setDevViewAlert] = useState<string | null>(null);

  // Edit mode states to dynamically stretch and shrink news blocks
  const [isEditMode, setIsEditMode] = useState<boolean>(isBentoEditActive);
  const [customSpans, setCustomSpans] = useState<Record<string, number>>({});

  // Sync isEditMode with parent trigger
  useEffect(() => {
    setIsEditMode(isBentoEditActive);
  }, [isBentoEditActive]);

  // Load custom bento spans from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom_bento_spans');
      if (saved) {
        setCustomSpans(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save custom bento spans on change
  useEffect(() => {
    if (Object.keys(customSpans).length > 0) {
      localStorage.setItem('custom_bento_spans', JSON.stringify(customSpans));
    }
  }, [customSpans]);


  // Pagination increments: load items line-by-line
  // When 'Все' category is active:
  // - Top Bento grid: 5 lines of popular news (we display 8 specific items)
  // - Sliders: 3 separate sliders (5 items each)
  // - "Еще новости и статьи": initially 8 items (representing other 5 rows in Bento style), clicking "Load more" adds 4 items per click.
  // When a specific category is active:
  // - Single Bento Grid: initially we specify 12 items, load more adds 6.
  const [morePopularLimit, setMorePopularLimit] = useState<number>(8);
  const [moreCategoryLimit, setMoreCategoryLimit] = useState<number>(12);
  const [moreExtraLimit, setMoreExtraLimit] = useState<number>(8);

  const slidersRef = {
    company_news: useRef<HTMLDivElement>(null),
    market_analytics: useRef<HTMLDivElement>(null),
    taxes_and_regulations: useRef<HTMLDivElement>(null)
  };

  const handleSliderScroll = (cat: 'company_news' | 'market_analytics' | 'taxes_and_regulations', direction: 'left' | 'right') => {
    const el = slidersRef[cat].current;
    if (el) {
      const scrollAmt = direction === 'left' ? -340 : 340;
      el.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  // Alert dismiss
  useEffect(() => {
    if (devViewAlert) {
      const timer = setTimeout(() => setDevViewAlert(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [devViewAlert]);

  // Click on news handler
  const handleNewsClick = (pub: NewsItem) => {
    setSelectedArticle(pub);
  };

  // Filter based on search input
  const filteredData = useMemo(() => {
    return allArticles.filter(item => {
      if (searchQuery.trim() === '') return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        `${item.author?.firstName || ''} ${item.author?.lastName || ''}`.toLowerCase().includes(q) ||
        (item.author?.role || '').toLowerCase().includes(q)
      );
    });
  }, [allArticles, searchQuery]);

  // CATEGORY SUBSETS (for the home view sliders)
  const categorySubsets = useMemo(() => {
    return {
      company_news: filteredData.filter(i => i.category === 'company_news').slice(0, 5),
      market_analytics: filteredData.filter(i => i.category === 'market_analytics').slice(0, 5),
      taxes_and_regulations: filteredData.filter(i => i.category === 'taxes_and_regulations').slice(0, 5),
    };
  }, [filteredData]);

  // SPLITTING DATA FOR "Все" CATEGORY SCREEN
  // Popular section gets first 8 matching items
  const popularNews = useMemo(() => {
    return filteredData.slice(0, morePopularLimit);
  }, [filteredData, morePopularLimit]);

  // Extra items section gets items starting after the 8th popular item
  const extraNews = useMemo(() => {
    return filteredData.slice(8, 8 + moreExtraLimit);
  }, [filteredData, moreExtraLimit]);

  // SINGLE CATEGORY NEWS (for category specific displays)
  const categorySpecificNews = useMemo(() => {
    if (selectedCategory === 'all') return [];
    return filteredData.filter(item => item.category === selectedCategory).slice(0, moreCategoryLimit);
  }, [filteredData, selectedCategory, moreCategoryLimit]);

  // Bento Span generator helper based on index to create beautiful organic sizing variation
  const getBentoSpanClasses = (index: number, newsId?: string) => {
    // If we have custom dimension configured for this news item, use it
    if (newsId && customSpans[newsId]) {
      const span = customSpans[newsId];
      if (span === 1) {
        return 'col-span-1 lg:col-span-1 min-h-[410px] md:min-h-[435px]';
      } else if (span === 2) {
        return 'col-span-1 md:col-span-2 lg:col-span-2 min-h-[410px] md:min-h-[435px]';
      } else if (span === 3) {
        return 'col-span-1 md:col-span-2 lg:col-span-3 min-h-[410px] md:min-h-[435px]';
      }
    }

    // Beautiful cyclical list of horizontal cells: spans of 1, 2, or 3 cells wide (no vertical row spanning)
    // All blocks have exactly the same height, keeping internal element height and layout fully uniform.
    const bentoPatterns = [
      'col-span-1 md:col-span-2 lg:col-span-2 min-h-[410px] md:min-h-[435px]',  // Horizontal length 2
      'col-span-1 md:col-span-1 lg:col-span-1 min-h-[410px] md:min-h-[435px]',  // Horizontal length 1 (Short/square)
      'col-span-1 md:col-span-2 lg:col-span-3 min-h-[410px] md:min-h-[435px]',  // Horizontal length 3 (Full row banner!)
      'col-span-1 md:col-span-1 lg:col-span-1 min-h-[410px] md:min-h-[435px]',  // Horizontal length 1 (Short/square)
      'col-span-1 md:col-span-2 lg:col-span-2 min-h-[410px] md:min-h-[435px]',  // Horizontal length 2
      'col-span-1 md:col-span-1 lg:col-span-1 min-h-[410px] md:min-h-[435px]',  // Horizontal length 1 (Short/square)
      'col-span-1 md:col-span-1 lg:col-span-1 min-h-[410px] md:min-h-[435px]',  // Horizontal length 1 (Short/square)
      'col-span-1 md:col-span-2 lg:col-span-2 min-h-[410px] md:min-h-[435px]',  // Horizontal length 2
    ];
    return bentoPatterns[index % bentoPatterns.length];
  };

  // Modern abstract SVG dynamic backgrounds to simulate actual image placeholders beautifully
  const renderCardImagePattern = (patternId: number, gradient: string) => {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-95 transition-all duration-500 group-hover:scale-105`}>
        {/* Generative grid patterns in vector styles */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          {patternId % 2 === 0 ? (
            <defs>
              <pattern id={`grid-${patternId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
            </defs>
          ) : (
            <defs>
              <pattern id={`grid-${patternId}`} width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1.5" fill="white" />
              </pattern>
            </defs>
          )}
          <rect width="100%" height="100%" fill={`url(#grid-${patternId})`} />
        </svg>
        
        {/* Soft floating orb lights based on type */}
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-black/10 blur-2xl rounded-full" />
      </div>
    );
  };

  // Reusable highly polished News Card component supporting both standard templates and full light-mint solid highlight cards
  const renderNewsCard = (pub: any, idx: number, isSolidCard: boolean = false, bentoSpans: string) => {
    // Determine large bento states
    const isLarge = bentoSpans.includes('col-span-2') || bentoSpans.includes('col-span-3');

    // Soft colored background gradients depending on category for solid cards to match the requested reference style perfectly
    let solidBgClass = 'bg-indigo-50/60 hover:bg-indigo-55/80 border-indigo-200/50 text-indigo-950 shadow-sm';
    if (pub.category === 'company_news') {
      solidBgClass = 'bg-emerald-50/60 hover:bg-emerald-55/80 border-emerald-250/50 text-emerald-950 shadow-sm';
    } else if (pub.category === 'market_analytics') {
      solidBgClass = 'bg-amber-50/60 hover:bg-amber-55/80 border-amber-250/50 text-amber-950 shadow-sm';
    } else if (pub.category === 'taxes_and_regulations') {
      solidBgClass = 'bg-[#f0f9ff]/60 hover:bg-[#f0f9ff]/80 border-sky-200/50 text-sky-950 shadow-sm';
    }

    return (
      <div
        key={pub.id}
        onClick={() => {
          if (isEditMode) return;
          handleNewsClick(pub);
        }}
        className={`group ${bentoSpans} rounded-[32px] border ${
          isEditMode ? 'border-dashed border-indigo-500 ring-2 ring-indigo-500/15 animate-pulse' : 'border-slate-200/80 hover:border-indigo-600/60'
        } ${isSolidCard ? solidBgClass : 'bg-white'} hover:shadow-xl transition-all duration-350 cursor-pointer flex flex-col overflow-hidden relative`}
      >
        {/* Dynamic Sizing Toolbar for Edit Mode */}
        {isEditMode && (
          <div className="absolute inset-x-0 top-0 bg-slate-900/95 backdrop-blur-md border-b border-indigo-500/20 py-2.5 px-3 flex items-center justify-between z-30 transition-all">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Ширина разметки:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomSpans(prev => ({ ...prev, [pub.id]: 1 }));
                }}
                className={`px-2.5 py-1 text-[10px] font-mono font-black rounded-lg transition-all ${
                  bentoSpans.includes('col-span-1 lg:col-span-1') && !bentoSpans.includes('col-span-2') && !bentoSpans.includes('col-span-3')
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/10 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="1 колонка"
              >
                1x
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomSpans(prev => ({ ...prev, [pub.id]: 2 }));
                }}
                className={`px-2.5 py-1 text-[10px] font-mono font-black rounded-lg transition-all ${
                  bentoSpans.includes('col-span-2') && !bentoSpans.includes('col-span-3')
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/10 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="2 колонки"
              >
                2x
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomSpans(prev => ({ ...prev, [pub.id]: 3 }));
                }}
                className={`px-2.5 py-1 text-[10px] font-mono font-black rounded-lg transition-all ${
                  bentoSpans.includes('col-span-3')
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/10 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="3 колонки (во всю ширину)"
              >
                3x
              </button>
            </div>
          </div>
        )}

        {isSolidCard ? (
          // ================= SOLID DECORATIVE CARD LAYOUT (Matches reference Item 3 exactly) =================
          <div className="p-6 md:p-8 flex flex-col justify-between h-full flex-grow">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-white/80 backdrop-blur-sm text-slate-800 text-[9px] font-black rounded-full uppercase tracking-wider shadow-sm">
                  {CATEGORIES.find(c => c.id === pub.category)?.name || 'Инсайт'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-semibold">
                  {pub.readTime}
                </span>
              </div>

              <h3 className="font-extrabold font-sans text-slate-900 group-hover:text-indigo-755 transition-colors leading-snug text-sm md:text-base lg:text-md line-clamp-4 pt-1">
                {pub.title}
              </h3>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono font-bold mt-2">
                <span>{pub.date}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-505 font-sans font-medium">Спецматериал</span>
              </div>

              <p className="text-[11px] md:text-[11.5px] text-slate-655 leading-relaxed font-sans line-clamp-4 pt-1">
                {pub.summary}
              </p>
            </div>

            {/* Author details bottom bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-900/10 mt-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`${pub.author?.avatarUrl || 'bg-slate-500'} w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black uppercase flex-shrink-0 border border-white shadow-sm`}>
                  {(pub.author?.firstName?.charAt(0) || '')}{(pub.author?.lastName?.charAt(0) || '') || '?'}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-black text-slate-800 truncate font-sans">
                    {pub.author?.firstName || 'Автор'} {pub.author?.lastName || ''}
                  </span>
                  <span className="block text-[9.5px] text-slate-500 truncate font-sans whitespace-nowrap leading-none mt-0.5">
                    {pub.author?.role || 'Пользователь'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-500">
                <span className="text-[9.5px] font-mono font-bold">{pub.likes} ♥</span>
              </div>
            </div>
          </div>
        ) : (
          // ================= STANDARD CARD LAYOUT (With Top Illustration Pattern) =================
          <>
            <div className="relative h-44 md:h-48 w-full overflow-hidden flex-shrink-0">
              {renderCardImagePattern(pub.patternId, pub.imageGradient)}
              
              {/* Date overlay tag */}
              <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white/95 text-[10px] font-mono font-black py-1 px-2.5 rounded-full z-10 border border-white/10">
                <span>{pub.readTime}</span>
              </div>

              {/* Top corner category */}
              <div className="absolute top-4 right-4 bg-white/95 text-slate-900 text-[9.5px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full z-10 font-sans shadow-sm">
                {CATEGORIES.find(c => c.id === pub.category)?.name || 'Инсайт'}
              </div>
            </div>

            {/* Content panel */}
            <div className="p-5 flex flex-col justify-between flex-grow">
              <div className="space-y-2">
                <div className="text-[10px] text-slate-455 font-mono font-extrabold">
                  <span>{pub.date}</span>
                </div>
                
                <h3 className="font-extrabold font-sans text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2 text-xs md:text-sm">
                  {pub.title}
                </h3>

                {/* Extra description shown on all blocks for layout uniformity */}
                <p className="text-[11.5px] text-slate-550 leading-relaxed font-sans line-clamp-3 pt-1">
                  {pub.summary}
                </p>
              </div>

              {/* Author Credentials Bottom Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`${pub.author?.avatarUrl || 'bg-slate-500'} w-8.5 h-8.5 rounded-xl flex items-center justify-center text-white text-[11px] font-black uppercase flex-shrink-0 border border-white shadow-sm`}>
                    {(pub.author?.firstName?.charAt(0) || '')}{(pub.author?.lastName?.charAt(0) || '') || '?'}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-black text-slate-800 truncate font-sans">
                      {pub.author?.firstName || 'Автор'} {pub.author?.lastName || ''}
                    </span>
                    <span className="block text-[9.5px] text-slate-450 truncate font-sans leading-none">
                      {pub.author?.role || 'Пользователь'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
                  <span className="text-[9.5px] font-mono font-bold">{pub.likes} ♥</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  if (selectedArticle) {
    return (
      <ArticleDetailView 
        article={selectedArticle}
        allArticles={allArticles}
        onBack={() => setSelectedArticle(null)}
        onNavigateToArticle={(pub) => setSelectedArticle(pub)}
        onSelectCompany={onSelectCompany}
        onTabChange={(tab) => {
          if (setActiveTab) {
            setActiveTab(tab as any);
          }
        }}
        onCategoryChange={(cat) => {
          setSelectedCategory(cat);
          setSelectedArticle(null);
        }}
        onNewsHomeClick={() => {
          setSelectedCategory('all');
          setSelectedArticle(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Крупная строка поиска во всю ширину страницы */}
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по статьям, аналитике, правовым новостям или авторам..."
          className="w-full bg-white/90 backdrop-blur-md border-2 border-slate-200/80 rounded-3xl pl-14 pr-24 py-4.5 text-sm md:text-base font-sans text-slate-800 placeholder-slate-450 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold shadow-md md:shadow-lg hover:border-slate-300"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-5 inset-y-0 my-auto h-9 text-xs font-black text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 rounded-xl transition-all shadow-sm"
          >
            Очистить
          </button>
        )}
      </div>

      {/* Floating System-Wide Alerts for 개발 (Development/Click preview info) */}
      {devViewAlert && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md bg-indigo-950 border border-indigo-500/40 text-white rounded-3xl p-4 shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-6 duration-300">
          <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="block text-[10px] font-black uppercase text-indigo-300 font-mono tracking-wider">Интеграционная сводка</span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{devViewAlert}</p>
          </div>
          <button 
            onClick={() => setDevViewAlert(null)}
            className="text-slate-400 hover:text-white text-xs font-bold leading-none pl-2 parent-hover:scale-110"
          >
            ×
          </button>
        </div>
      )}

      {/* Блок быстрого управления для модераторов */}
      {localStorage.getItem('profile_userRole') === 'moderator' && (
        <div className="bg-indigo-50 border border-indigo-200/50 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center justify-center md:justify-start gap-1.5 leading-none">
              <ShieldCheck className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Редактор сетки публикаций</span>
            </h4>
            <p className="text-[11px] text-indigo-700 leading-normal font-medium">
              Редактируйте ширину каждого блока новостей (25%, 50%, 75% или 100%) кликая по стрелкам на карточках ниже. Изменения сохранятся в реальном времени.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-full sm:w-auto px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                isEditMode 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-md shadow-rose-500/10'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-md shadow-indigo-650/10'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>{isEditMode ? 'Выйти из режима сетки' : 'Редактировать бенто-сетку'}</span>
            </button>

            <button
              onClick={() => setActiveTab('moderator')}
              className="w-full sm:w-auto px-4.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-slate-100 hover:text-white border border-slate-700 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Кабинет модератора</span>
            </button>
          </div>
        </div>
      )}

      {/* Categories Horizontal Selector */}
      <div className="pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-grow">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // Reset pagination counts to design specifications
                  setMorePopularLimit(8);
                  setMoreCategoryLimit(12);
                  setMoreExtraLimit(8);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11.5px] font-bold font-sans transition-all duration-250 flex-shrink-0 cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15 scale-[1.02]' 
                    : 'bg-white text-slate-650 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 font-sans font-medium'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER LOGIC BY SELECTION */}
      {selectedCategory === 'all' ? (
        // ================= "ВСЕ" CATEGORY HOMEPAGE VIEW =================
        <div className="space-y-12">
          
          {/* A. Popular News Section in Bento Grid Layout */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <h2 className="text-sm font-black font-sans uppercase tracking-wider text-slate-800">
                Популярное & Тренды недели
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9.5px] font-mono font-bold">
                Бенто-сетка
              </span>
            </div>

            {popularNews.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                Подходящих популярных публикаций не найдено
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {popularNews.map((pub, idx) => renderNewsCard(pub, idx, false, getBentoSpanClasses(idx, pub.id)))}
              </div>
            )}
          </section>

          {/* B. 3 SEPARATE CATEGORY BLOCKS (Dynamic Configured Carousels) */}
          {parsedCarouselsData.map((car: any) => {
            const title = car.id === 'carousel_1' ? `Сводка: ${car.categoryName}` :
                          car.id === 'carousel_2' ? `Кабинет: ${car.categoryName}` :
                          car.id === 'carousel_3' ? `Право: ${car.categoryName}` : car.categoryName;
            
            const subtitle = car.id === 'carousel_1' ? 'Все изменения у контрагентов РФ' :
                             car.id === 'carousel_2' ? 'Бенчмаркинг и детальные окупаемости' :
                             car.id === 'carousel_3' ? 'Извещения Минфина и ФСБУ' : 'Избранные материалы по вашему выбору';

            return (
              <section key={car.id} className="space-y-6 relative">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <div>
                    <h2 className="text-sm md:text-base font-black uppercase font-sans tracking-wider text-slate-800 leading-none">
                      {title}
                    </h2>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-1.5 font-sans font-medium">
                      {subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pr-22">
                    <button 
                      onClick={() => setSelectedCategory(car.categoryId)}
                      className="text-[10px] md:text-xs font-black text-indigo-600 hover:text-indigo-700 transition font-sans cursor-pointer bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-sm"
                    >
                      Смотреть все
                    </button>
                  </div>
                </div>

                <NewsCarousel 
                  items={car.articles}
                  categoryKey={car.categoryId}
                  renderCard={(pub, idx, isSolid, classes) => renderNewsCard(pub, idx, isSolid, classes)}
                />
              </section>
            );
          })}

          {/* C. SECTION "ЕЩЕ НОВОСТИ И СТАТЬИ" (Next 5 rows with Bento Grid) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                <h2 className="text-sm font-black font-sans uppercase tracking-wider text-slate-800 font-sans font-extrabold pb-0.5">
                  Еще новости и статьи
                </h2>
              </div>
              <span className="text-[10.5px] text-slate-450 font-mono font-bold">
                Показано: {extraNews.length} материалов
              </span>
            </div>

            {extraNews.length === 0 ? (
              <div className="bg-slate-50 p-12 text-center text-xs text-slate-400 rounded-3xl border border-dashed border-slate-300">
                Записей для этого блока больше нет. Все материалы подгружены в первом блоке!
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {extraNews.map((pub, idx) => {
                    const bentoSpans = getBentoSpanClasses(idx + 1, pub.id); // Shift pattern index for varied visual rhythm
                    return renderNewsCard(pub, idx, false, bentoSpans);
                  })}
                </div>

                {/* LOAD MORE PAGINATION TRIGGERS IN FIVE-ROWS STRUCTURE */}
                {filteredData.length > 8 + moreExtraLimit && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={() => setMoreExtraLimit(prev => prev + 6)}
                      type="button"
                      className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-350 text-xs font-black font-sans tracking-wide rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm active:scale-97 transition"
                    >
                      <Compass className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>Загрузить еще публикации</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

        </div>
      ) : (
        // ================= CATEGORY SPECIFIC VIEW =================
        // Clicking specific category, or clicking "View All" on any slider opens this clean layout.
        // It has NO separate slider grids or sub-sections, just a beautifully styled Bento Grid.
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-sm font-black font-sans uppercase tracking-wider text-slate-850">
                Категория: {CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Архив'}
              </h2>
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-extrabold font-sans hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>← Назад к главной</span>
            </button>
          </div>

          {categorySpecificNews.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-16 text-center max-w-lg mx-auto flex flex-col items-center justify-center">
              <Newspaper className="w-12 h-12 text-slate-300 stroke-[1.2] mb-3" />
              <h4 className="font-extrabold text-sm text-slate-800">Материалов не найдено</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-normal max-w-sm">
                В выбранной категории "{CATEGORIES.find(c => c.id === selectedCategory)?.name}" сейчас нет подходящих по поисковому фильтру материалов.
              </p>
              <button
                onClick={() => { setSearchQuery(''); }}
                type="button"
                className="mt-4 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black rounded-lg transition"
              >
                Сбросить поиск
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {categorySpecificNews.map((pub, idx) => {
                  const bentoSpans = getBentoSpanClasses(idx, pub.id);
                  return renderNewsCard(pub, idx, false, bentoSpans);
                })}
              </div>

              {/* PAGINATION FOR SPECIFIC CATEGORY TRIGGER */}
              {filteredData.filter(item => item.category === selectedCategory).length > moreCategoryLimit && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={() => setMoreCategoryLimit(prev => prev + 6)}
                    type="button"
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-205 text-xs font-black font-sans tracking-wide rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm transition"
                  >
                    <span>Загрузить еще материалы</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
