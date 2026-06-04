import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  Clock, 
  Calendar, 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  CornerDownRight, 
  MapPin, 
  HelpCircle, 
  AlertCircle, 
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  AlertOctagon,
  ShieldCheck,
  UserCheck,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Building2,
  Cpu,
  History,
  Info,
  X,
  ArrowLeftRight,
  ShieldAlert,
  Scale,
  User,
  Plus,
  Image as ImageIcon,
  FileText,
  Download
} from 'lucide-react';
import { Author, NewsItem } from './NewsView';
import { mockCompanies } from '../data';
import { Company } from '../types';

interface ArticleDetailViewProps {
  article: NewsItem;
  allArticles: NewsItem[];
  onBack: () => void;
  onNavigateToArticle: (pub: NewsItem) => void;
  onTabChange?: (tab: string) => void;
  onCategoryChange?: (category: any) => void;
  onNewsHomeClick?: () => void;
  onSelectCompany?: (id: string) => void;
}

function SpoilerQuoteBlock({ block }: { block: any }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div 
      onClick={() => setRevealed(!revealed)}
      className="bg-white dark:bg-slate-905 border border-sky-100 dark:border-sky-900/40 p-5 rounded-[24px] shadow-sm space-y-3 relative overflow-hidden select-none my-6 cursor-pointer group transition-all duration-300 hover:border-sky-200"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-450/10 rounded-full blur-2xl opacity-40 -translate-y-6" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{block.spoilerLabel || 'Подробнее'}</span>
        <span className="text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400">
          {revealed ? '👁 Скрыть' : '👁 Показать подробности'}
        </span>
      </div>
      <p className={`mt-3 text-xs md:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium italic relative z-10 pl-2 border-l-2 border-indigo-400 transition-all duration-300 ${
        revealed ? 'blur-none opacity-100 select-all' : 'blur-[5px] opacity-40 select-none'
      }`}>
        {block.spoilerContent || 'Скрытое содержимое'}
      </p>
    </div>
  );
}

interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  avatarClass: string;
  text: string;
  date: string;
  likes: number;
  hasLiked?: boolean;
  replies?: Comment[];
}

const RATIO_METADATA_FALLBACK: Record<string, { formula: string; source: string }> = {
  cur_liq: {
    formula: 'Коэффициент текущей ликвидности = Оборотные активы / Краткосрочные обязательства',
    source: 'https://www.audit-it.ru/finanaliz/terms/liquidity/current_ratio.html'
  },
  autonomy: {
    formula: 'Коэффициент автономии = Собственный капитал / Активы',
    source: 'https://www.audit-it.ru/finanaliz/terms/solvency/coefficient_of_autonomy.html'
  },
  roa: {
    formula: 'Рентабельность активов = Чистая прибыль / Активы',
    source: 'https://www.audit-it.ru/finanaliz/terms/performance/return_on_assets.html?sphrase_id=6715777'
  },
  ros: {
    formula: 'Рентабельность продаж = Прибыль от продаж / Выручка',
    source: 'https://www.audit-it.ru/finanaliz/terms/performance/return_on_sales.html?sphrase_id=6715780'
  },
  abs_liq: {
    formula: 'Коэффициент абсолютной ликвидности = (Денежные средства + Краткосрочные финансовые вложения) / Текущие обязательства',
    source: 'https://www.audit-it.ru/finanaliz/terms/liquidity/cash_ratio.html'
  },
  net_margin: {
    formula: 'Коэффициент финансового левериджа = Заемный капитал / Собственный капитал',
    source: 'https://www.audit-it.ru/finanaliz/terms/solvency/gearing_ratio.html'
  }
};

// Generate realistic dummy accounting related articles from same author or category for recommendations
export default function ArticleDetailView({ 
  article, 
  allArticles, 
  onBack, 
  onNavigateToArticle,
  onTabChange,
  onCategoryChange,
  onNewsHomeClick,
  onSelectCompany
}: ArticleDetailViewProps) {
  const [activeSection, setActiveSection] = useState('intro');
  
  // Interactive Counterparty Dossier States
  const [selectedCompId, setSelectedCompId] = useState('6234160787'); // ООО СЕРВИС (bankruptcy) as default showcase
  const [compTab, setCompTab] = useState<'passport' | 'bankruptcy' | 'arbitration' | 'financials'>('passport');
  const [fieldCopied, setFieldCopied] = useState<Record<string, boolean>>({});
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [forecastSimulationTab, setForecastSimulationTab] = useState<'cashflow' | 'aiReport' | 'stressTest'>('cashflow');

  // Article Images with Captions States
  interface ArticleImage {
    id: string;
    url: string;
    caption: string;
    section: 'intro' | 'rules' | 'numbers' | 'solutions' | 'summary';
  }

  const [articleImages, setArticleImages] = useState<ArticleImage[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      caption: 'Рис. 1. Аналитический разбор структуры обязательств по аренде согласно ФСБУ 25/2018.',
      section: 'intro'
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      caption: 'Рис. 2. Оценка рисков и дисконтирование платежей при расчете приведенной стоимости.',
      section: 'numbers'
    }
  ]);

  const [showAddFormForSection, setShowAddFormForSection] = useState<string | null>(null);
  const [newImageType, setNewImageType] = useState<'finance' | 'workspace' | 'meeting1' | 'analytics' | 'calculator' | 'custom'>('finance');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80');
  const [newImageCaption, setNewImageCaption] = useState('');

  const handleAddImage = (sectionKey: string) => {
    if (!newImageUrl.trim() || !newImageCaption.trim()) {
      alert('Пожалуйста, выберите изображение и укажите подпись!');
      return;
    }

    const newImg: ArticleImage = {
      id: `usr-img-${Date.now()}`,
      url: newImageUrl,
      caption: newImageCaption,
      section: sectionKey as any
    };

    setArticleImages(prev => [...prev, newImg]);
    setShowAddFormForSection(null);
    setNewImageCaption('');
  };

  const handleDeleteImage = (id: string) => {
    setArticleImages(prev => prev.filter(img => img.id !== id));
  };

  const activeCompany = mockCompanies.find(c => c.id === selectedCompId) || mockCompanies[0];

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setFieldCopied(prev => ({ ...prev, [fieldKey]: true }));
    setTimeout(() => {
      setFieldCopied(prev => ({ ...prev, [fieldKey]: false }));
    }, 1500);
  };

  const renderWidgetHeader = (title: string, IconComponent: any) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-605 dark:text-indigo-400 rounded-xl">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 font-sans leading-none">
              {title}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-none font-sans">Сверка данных в реальном времени</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Проверить контрагента:</span>
          <select 
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-black text-slate-850 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all cursor-pointer font-sans"
          >
            {mockCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName} (ИНН {c.inn})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderCompanyStatusCard = (company: Company) => {
    return (
      <div className="bg-slate-50/50 dark:bg-slate-950/30 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-850 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-650 dark:text-indigo-400 border border-slate-200/60 dark:border-slate-800/60 shadow-xs shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-105 uppercase tracking-tight">
                {company.fullName}
              </span>
              {company.status === 'bankruptcy' ? (
                <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-955/50 text-rose-600 dark:text-rose-400 border border-rose-150/40 rounded-lg text-[9px] font-black uppercase tracking-wide font-mono">
                  Банкротство
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-955/50 text-emerald-600 dark:text-emerald-400 border border-emerald-150/40 rounded-lg text-[9px] font-black uppercase tracking-wide font-mono">
                  Активна
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1.5 font-medium leading-normal">
              Юридический адрес: {company.address}
            </span>
          </div>
        </div>
        
        {/* Score Badge */}
        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-200/60 dark:border-slate-800/80 shrink-0">
          <span className="text-[9.5px] text-slate-400 uppercase font-black font-mono block">Кредитный рейтинг</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${
              company.scorePercent > 80 
                ? 'bg-emerald-100/30 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-250/30' 
                : company.scorePercent > 50 
                  ? 'bg-amber-100/30 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-250/30' 
                  : 'bg-rose-100/30 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-250/30'
            }`}>
              {company.scoreMark}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">({company.scorePercent}%)</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSectionImages = (sectionKey: 'intro' | 'rules' | 'numbers' | 'solutions' | 'summary') => {
    const images = articleImages.filter(img => img.section === sectionKey);
    if (images.length === 0) return null;
    return (
      <div className="space-y-6 my-6">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-[22px] overflow-hidden border border-slate-200 dark:border-slate-850 shadow-sm bg-slate-50 dark:bg-slate-900/40 max-w-2xl mx-auto">
            <img 
              src={img.url} 
              alt={img.caption} 
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-[360px]"
            />
            <div className="p-3.5 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-850 text-center">
              <p className="text-xs md:text-sm font-semibold text-slate-500 font-sans italic">
                {img.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAddImageButtonAndForm = (sectionKey: 'intro' | 'rules' | 'numbers' | 'solutions' | 'summary') => {
    return null;
  };
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c-1',
      authorName: 'Виталий Селезнев',
      authorRole: 'Главбух ГК «Альфа-Терминал»',
      avatarClass: 'bg-indigo-600',
      text: 'Отличный гайд! По ФСБУ 25/2018 у нас возникли колоссальные споры с аудиторами касательно ставки дисконтирования. Они настаивали на рыночной стоимости заимствования, хотя по договору лизинга ставка была прямо прописана. Данная статья раскладывает всё по полочкам.',
      date: 'Сегодня в 10:15',
      likes: 18,
      replies: [
        {
          id: 'c-1-1',
          authorName: 'Мария Соколова',
          authorRole: 'Автор статьи, Налоговый консультант',
          avatarClass: 'bg-emerald-600',
          text: 'Виталий, рада слышать! Да, это типичная ловушка. Аудиторы часто берут среднюю ставку ЦБ + рисковый спред. Рекомендую фиксировать расчетную ставку лизингодателя непосредственно в протоколах разногласий к договору.',
          date: 'Сегодня в 11:30',
          likes: 24,
        }
      ]
    },
    {
      id: 'c-2',
      authorName: 'Ольга Прохорова',
      authorRole: 'Финансовый аналитик, MBA',
      avatarClass: 'bg-amber-600',
      text: 'Подскажите, а если мы арендуем помещение у КУГИ (муниципальное имущество), то переоценка права пользования активом (ППА) при продлении договора идет по первоначальной ставке или на дату пролонгации?',
      date: 'Вчера в 18:42',
      likes: 9,
      replies: [
        {
          id: 'c-2-1',
          authorName: 'Кирилл Демидов',
          authorRole: 'Аудитор ООО «ФинОценка»',
          avatarClass: 'bg-purple-650',
          text: 'Ольга, в момент пролонгации происходит существенное изменение условий договора. Согласно п. 21 стандарта, вы обязаны пересчитать обязательство по аренде с использованием новой ставки дисконтирования, актуальной на дату изменения условий.',
          date: 'Вчера в 19:15',
          likes: 12
        }
      ]
    }
  ]);

  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [articleLikes, setArticleLikes] = useState(article.likes);
  const [articleLiked, setArticleLiked] = useState(false);
  const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false);
  const [isFormulaExpanded, setIsFormulaExpanded] = useState(false);

  // Section references for intersection observer
  const sectionRefs = {
    intro: useRef<HTMLDivElement>(null),
    rules: useRef<HTMLDivElement>(null),
    numbers: useRef<HTMLDivElement>(null),
    solutions: useRef<HTMLDivElement>(null),
    summary: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setArticleLikes(article.likes);
    setArticleLiked(false);
  }, [article]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      let active = 'intro';

      for (const [key, ref] of Object.entries(sectionRefs)) {
        if (ref.current && ref.current.offsetTop <= scrollPos) {
          active = key;
        }
      }
      setActiveSection(active);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionKey: keyof typeof sectionRefs) => {
    const el = sectionRefs[sectionKey].current;
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 90,
        behavior: 'smooth'
      });
      setActiveSection(sectionKey);
    }
  };

  // Find similar recommended articles (exclude current)
  const recommendations = React.useMemo(() => {
    let customRecs: any[] = [];
    if (article && Array.isArray((article as any).recommendedIds) && (article as any).recommendedIds.length > 0) {
      customRecs = (article as any).recommendedIds
        .map((id: string) => allArticles.find(item => item.id === id))
        .filter((item: any): item is any => !!item && item.id !== article.id);
    }
    
    if (customRecs.length >= 3) {
      return customRecs.slice(0, 3);
    }
    
    // Fill up to 3 with other articles
    const otherArticles = allArticles.filter(item => {
      if (item.id === article.id) return false;
      return !customRecs.some(cr => cr.id === item.id);
    });
    
    return [...customRecs, ...otherArticles].slice(0, 3);
  }, [allArticles, article]);

  // Support comment submitting
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c-user-${Date.now()}`,
      authorName: 'Вы (Гость)',
      authorRole: 'Финансовый специалист',
      avatarClass: 'bg-gradient-to-tr from-slate-700 to-indigo-900',
      text: newCommentText,
      date: 'Только что',
      likes: 0,
      replies: []
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
  };

  // Support nested replying
  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Comment = {
      id: `c-reply-${Date.now()}`,
      authorName: 'Вы (Гость)',
      authorRole: 'Финансовый специалист',
      avatarClass: 'bg-gradient-to-tr from-slate-705 to-indigo-900',
      text: replyText,
      date: 'Только что',
      likes: 0
    };

    setComments(prev => {
      return prev.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        }
        // In case of second nesting level, handle with flat push
        if (c.replies?.some(r => r.id === parentId)) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        }
        return c;
      });
    });

    setReplyText('');
    setReplyingToId(null);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => {
      return prev.map(c => {
        if (c.id === commentId) {
          const hasLikedAlready = c.hasLiked;
          return {
            ...c,
            likes: hasLikedAlready ? c.likes - 1 : c.likes + 1,
            hasLiked: !hasLikedAlready
          };
        }
        if (c.replies) {
          const updatedReplies = c.replies.map(r => {
            if (r.id === commentId) {
              const hasRepliedLiked = r.hasLiked;
              return {
                ...r,
                likes: hasRepliedLiked ? r.likes - 1 : r.likes + 1,
                hasLiked: !hasRepliedLiked
              };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      });
    });
  };

  const toggleArticleLike = () => {
    if (articleLiked) {
      setArticleLikes(prev => prev - 1);
    } else {
      setArticleLikes(prev => prev + 1);
    }
    setArticleLiked(!articleLiked);
  };

  // Abstract SVG dynamic cover pattern
  const renderBigCover = (patternId: number, gradient: string) => {
    return (
      <div className={`relative w-full h-[260px] md:h-[380px] rounded-3xl bg-gradient-to-br ${gradient} overflow-hidden shadow-lg border border-white/10`}>
        {/* Generative grid patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="big-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1.2" />
              <circle cx="20" cy="20" r="2.5" fill="white" fillOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#big-grid-pattern)" />
        </svg>

        {/* Diagonal flare orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/15 blur-[120px] rounded-full" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-black/20 blur-[140px] rounded-full" />

        {/* Graphic accent */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-extrabold text-sm border border-white/5">
            ФВ
          </div>
          <div>
            <span className="block text-[11px] font-mono tracking-widest text-slate-300 uppercase leading-none">Бизнес Медиа</span>
            <span className="text-[12px] font-sans font-extrabold text-white mt-1 block">Материал подготовлен Редакцией</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-8 space-y-8 animate-in fade-in duration-350">
      
      {/* 1. BREADCRUMBS NAVIGATION */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-sans font-semibold">
        <button 
          onClick={() => {
            if (onTabChange) {
              onTabChange('dashboard');
            } else {
              onBack();
            }
          }}
          className="hover:text-indigo-650 transition-colors flex items-center gap-1 cursor-pointer hover:underline"
        >
          <span>Главная</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-350 flex-shrink-0" />
        <button 
          onClick={() => {
            if (onNewsHomeClick) {
              onNewsHomeClick();
            } else {
              onBack();
            }
          }}
          className="hover:text-indigo-650 transition-colors cursor-pointer hover:underline"
        >
          <span>Новости и Статьи</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-350 flex-shrink-0" />
        <button 
          onClick={() => {
            if (onCategoryChange) {
              onCategoryChange(article.category);
            } else {
              onBack();
            }
          }}
          className="text-indigo-600 hover:text-indigo-700 transition-colors capitalize truncate max-w-[150px] md:max-w-none hover:underline cursor-pointer font-bold"
        >
          {article.category === 'company_news' && 'Новости Компаний'}
          {article.category === 'market_analytics' && 'Аналитика Рынка'}
          {article.category === 'taxes_and_regulations' && 'Налоги и Регуляторика'}
          {article.category === 'cases_interviews' && 'Кейсы и Интервью'}
          {article.category === 'guides_tutorials' && 'Практические Гайды'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-350 flex-shrink-0" />
        <span className="text-slate-800 font-extrabold truncate max-w-[200px] md:max-w-md" title={article.title}>
          {article.title}
        </span>
      </nav>

      {/* Article Title Header */}
      <div className="space-y-3.5 py-1">
        <h1 className="text-[28px] md:text-[32px] font-black text-slate-900 dark:text-white leading-tight tracking-tight font-sans">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
          <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.date}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.readTime} чтения</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN GRID LAYOUT: LEFT SIDEBAR FOR READING INFO & TOC, RIGHT DETAILED CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================================= */}
        {/* LEFT COMPACT COLUMN - TOC, METRICS & STICKY AUTHOR PANEL (4 cols) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-12">
          
          {/* Author info card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            
            <div className="flex items-center gap-3">
              <div className={`${article.author?.avatarUrl || 'bg-indigo-900'} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-md font-black uppercase border border-slate-100 shadow-sm flex-shrink-0`}>
                {article.author?.firstName?.charAt(0) || '?'}{article.author?.lastName?.charAt(0) || ''}
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-extrabold text-slate-800 leading-tight font-sans">
                  {article.author?.firstName || 'Автор'} {article.author?.lastName || ''}
                </span>
                <span className="block text-[11px] text-indigo-600 font-bold font-sans mt-0.5">
                  Ведущий редактор
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 flex justify-between items-center text-center text-xs">
              <div>
                <span className="block font-mono font-black text-slate-800">142</span>
                <span className="text-[9.5px] text-slate-400">публикаций</span>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <span className="block font-mono font-black text-slate-800">4.9</span>
                <span className="text-[9.5px] text-slate-400">рейтинг</span>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <span className="block font-mono font-black text-slate-800">22.4k</span>
                <span className="text-[9.5px] text-slate-400">просмотров</span>
              </div>
            </div>
          </div>

          {/* ACTIVE TABLE OF CONTENTS STICKY PANEL */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            
            <ul className="space-y-1 text-[12px] font-sans">
              <li>
                <button
                  onClick={() => scrollToSection('intro')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                    activeSection === 'intro'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeSection === 'intro' ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span>1. Введение и суть проблемы</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('rules')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                    activeSection === 'rules'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeSection === 'rules' ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span>2. Регуляторные изменения</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('numbers')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                    activeSection === 'numbers'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeSection === 'numbers' ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span>3. Финансовый разбор и цифры</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('solutions')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                    activeSection === 'solutions'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeSection === 'solutions' ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span>4. Инструкция и решения</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('summary')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                    activeSection === 'summary'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeSection === 'summary' ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span>5. Итоги и суждения</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Floating actions menu */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={toggleArticleLike}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  articleLiked 
                    ? 'bg-red-500 text-white border-red-500 shadow-sm' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Like ({articleLikes})</span>
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Ссылка скопирована в буфер обмена!');
                }}
                className="py-2 px-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Поделиться</span>
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN - DETAILED LONGREAD TEMPLATE (9 cols) */}
        {/* ======================================================================= */}
        {/* ====================== ARTICLE LONGREAD BODY ====================== */}
        <div className="lg:col-span-9 space-y-8">
          {article.blocks ? (
            <div className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-xs space-y-6">
              {(article.blocks as any[]).map((block: any, bIdx: number) => {
                switch (block.type) {
                  case 'heading_1':
                    return (
                      <h1 key={block.id || bIdx} className="text-lg md:text-xl font-black text-slate-900 leading-tight tracking-tight mt-8 pb-2 border-b border-slate-100">
                        {block.content}
                      </h1>
                    );
                  case 'heading_2':
                    return (
                      <h2 key={block.id || bIdx} className="text-base md:text-md font-extrabold text-slate-900 leading-snug mt-6">
                        {block.content}
                      </h2>
                    );
                  case 'heading_3':
                    return (
                      <h3 key={block.id || bIdx} className="text-sm md:text-sm font-bold text-slate-900 leading-normal mt-4">
                        {block.content}
                      </h3>
                    );
                  case 'paragraph':
                    return (
                      <p key={block.id || bIdx} className="text-slate-700 leading-relaxed text-xs md:text-sm">
                        {block.content}
                      </p>
                    );
                  case 'bullet_list':
                    return (
                      <ul key={block.id || bIdx} className="list-disc pl-5 space-y-2 text-slate-700 text-xs md:text-sm">
                        {(block.listItems || []).map((item: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    );
                  case 'numbered_list':
                    return (
                      <ol key={block.id || bIdx} className="list-decimal pl-5 space-y-2 text-slate-700 text-xs md:text-sm">
                        {(block.listItems || []).map((item: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                      </ol>
                    );
                  case 'image':
                    return (
                      <div key={block.id || bIdx} className="my-6 space-y-2 text-center">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 max-h-96 flex items-center justify-center">
                          <img 
                            src={block.imageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'} 
                            alt={block.imageCaption || 'Иллюстрация'} 
                            className="w-full h-full object-cover select-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {block.imageCaption && (
                          <span className="text-xs text-slate-400 italic block font-sans">
                            {block.imageCaption}
                          </span>
                        )}
                      </div>
                    );
                  case 'table':
                    if (!block.tableData) return null;
                    return (
                      <div key={block.id || bIdx} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              {block.tableData.headers.map((hdr: string, idx: number) => (
                                <th key={idx} className="p-3 border-r border-slate-200/60 font-extrabold text-slate-800">
                                  {hdr}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.tableData.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="p-3 border-r border-slate-200/60 text-slate-650 font-medium">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  case 'formula':
                    return (
                      <div key={block.id || bIdx} className="my-6 p-6 bg-slate-50 border border-slate-200/80 rounded-[24px] space-y-4">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 flex flex-col items-center justify-center space-y-4 shadow-2xs relative overflow-hidden select-none">
                          <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                          <div className="flex items-center justify-center font-serif text-lg md:text-xl text-slate-800 gap-1.5 select-all">
                            {block.content ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold italic text-indigo-650">{block.content.split('=')[0]?.trim() || 'PV'}</span>
                                {block.content.includes('=') && (
                                  <>
                                    <span className="mx-2.5 text-slate-400 font-sans font-light">=</span>
                                    <span className="text-slate-800 font-sans font-extrabold tracking-wide">
                                      {block.content.split('=')[1]?.trim()}
                                    </span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span>PV = SUM( PMT_t / (1 + r)^t )</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans font-semibold tracking-tight uppercase">
                            Математическая формула
                          </span>
                        </div>
                      </div>
                    );
                  case 'spoiler_quote':
                    return (
                      <div key={block.id || bIdx}>
                        <SpoilerQuoteBlock block={block} />
                      </div>
                    );
                  case 'small_quote':
                    return (
                      <div key={block.id || bIdx} className="my-6 pl-4 border-l-3 border-amber-500 bg-amber-50/10 py-2.5 rounded-r-15 pr-4">
                        <p className="text-slate-700 italic leading-relaxed font-sans text-xs md:text-sm">
                          {block.content}
                        </p>
                      </div>
                    );
                  case 'large_quote':
                    return (
                      <div key={block.id || bIdx} className="my-8 bg-sky-50/50 border border-sky-100/80 p-6 rounded-[28px] space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-450/5 rounded-full blur-2xl pointer-events-none" />
                        
                        {/* Title header */}
                        {block.largeQuoteTitle && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-indigo-700 border border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-wider font-sans shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{block.largeQuoteTitle}</span>
                          </div>
                        )}

                        {/* Rendering dynamic sub-blocks if they exist */}
                        {block.largeQuoteBlocks && block.largeQuoteBlocks.length > 0 ? (
                          <div className="space-y-3.5 relative z-10">
                            {block.largeQuoteBlocks.map((sb: any) => {
                              switch (sb.type) {
                                case 'heading_3':
                                  return (
                                    <h4 key={sb.id} className="text-sm md:text-base text-indigo-950 font-black font-sans leading-snug">
                                      {sb.content}
                                    </h4>
                                  );
                                case 'paragraph':
                                  return (
                                    <p key={sb.id} className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed font-sans whitespace-pre-wrap">
                                      {sb.content}
                                    </p>
                                  );
                                case 'small_quote':
                                  return (
                                    <blockquote key={sb.id} className="pl-3.5 border-l-3 border-amber-400 bg-amber-50/15 py-2 rounded-r-xl pr-3 text-xs md:text-sm text-slate-700 font-semibold italic">
                                      {sb.content}
                                    </blockquote>
                                  );
                                case 'bullet_list':
                                  return (
                                    <ul key={sb.id} className="list-disc pl-5 my-1.5 space-y-1.5 text-xs text-slate-600 font-medium font-sans">
                                      {(sb.listItems || []).map((item: string, idx: number) => (
                                        <li key={idx}>{item}</li>
                                      ))}
                                    </ul>
                                  );
                                case 'numbered_list':
                                  return (
                                    <ol key={sb.id} className="list-decimal pl-5 my-1.5 space-y-1.5 text-xs text-slate-600 font-medium font-sans">
                                      {(sb.listItems || []).map((item: string, idx: number) => (
                                        <li key={idx}>{item}</li>
                                      ))}
                                    </ol>
                                  );
                                default:
                                  return null;
                              }
                            })}
                          </div>
                        ) : (
                          /* Fallback render for legacy custom large quotes */
                          <div className="space-y-4">
                            {block.largeQuoteText && (
                              <p className="text-xs md:text-sm text-slate-850 font-bold leading-relaxed whitespace-pre-wrap">
                                {block.largeQuoteText}
                              </p>
                            )}
                            {block.largeQuoteBullets && block.largeQuoteBullets.length > 0 && (
                              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-slate-600">
                                {block.largeQuoteBullets.map((bullet: string, idx: number) => (
                                  <li key={idx}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                            {block.largeQuoteNumbers && block.largeQuoteNumbers.length > 0 && (
                              <div className="h-[1px] bg-slate-200/80 my-3" />
                            )}
                            {block.largeQuoteNumbers && block.largeQuoteNumbers.length > 0 && (
                              <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-xs text-slate-600">
                                {block.largeQuoteNumbers.map((num: string, idx: number) => (
                                  <li key={idx}>{num}</li>
                                ))}
                              </ol>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  case 'company_card':
                    const targetComp = mockCompanies?.find((c: any) => c.id === block.companyId);
                    return (
                      <div key={block.id || bIdx} className="my-8 bg-slate-50 border border-slate-200/90 p-6 rounded-[24px] relative overflow-hidden select-none">
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                          <div className="space-y-1 z-10">
                            <h4 className="text-sm md:text-base font-extrabold text-slate-900 font-sans leading-snug">
                              Узнайте больше о контрагенте {targetComp?.shortName || block.companyId}
                            </h4>
                            <p className="text-xs text-slate-500 max-w-xl leading-relaxed font-sans mt-1">
                              Отраслевой разбор финансового левериджа, закредитованности и ревизии ППА обязательств.
                            </p>
                          </div>
                          {onSelectCompany && block.companyId && (
                            <button 
                              onClick={() => {
                                onSelectCompany(block.companyId);
                              }}
                              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1 shrink-0 duration-100 z-10 focus:outline-none"
                            >
                              <span>Карточка компании</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  case 'file_download':
                    return (
                      <div key={block.id || bIdx} className="my-6">
                        <div className="p-4 bg-emerald-50/10 border border-dashed border-emerald-250 rounded-2xl flex items-center gap-3 z-10 transition hover:border-emerald-350 pr-4 w-full md:max-w-xl">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-605 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <h5 className="font-extrabold text-xs text-slate-800 truncate" title={block.fileName}>{block.fileName || 'Вложение'}</h5>
                            <span className="block text-[10px] text-slate-450 font-mono mt-0.5 uppercase font-bold">{block.fileSize || '145 КБ'} · EXCEL</span>
                          </div>
                          <button 
                            onClick={() => alert(`Калькулятор «${block.fileName}» скачан на жесткий диск.`)}
                            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 bg-white rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
                          >
                            <Download className="w-4 h-4 cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ) : (
            <div className="prose prose-slate max-w-none text-slate-755 dark:text-slate-200 font-sans text-sm md:text-base leading-relaxed space-y-6">

          {/* ---------------- 1. INTRODUCTION ---------------- */}
          <div ref={sectionRefs.intro} className="space-y-4 pt-4">
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 font-sans pb-2 flex items-center gap-2">
              <span className="text-indigo-600 font-mono">1.</span> Введение и суть проблемы
            </h2>
            <p>
              Современные подходы к бухгалтерскому учету в Российской Федерации переживают масштабную цифровую и регуляторную трансформацию. Опыт крупнейших холдингов свидетельствует, что простое пассивное следование стандартным правилам проводок уходит в прошлое. В условиях колебания процентных ставок, компании обязаны выстраивать гибкие защищенные структуры управления ликвидностью и оборотными средствами.
            </p>

            <p>
              Показательно, как на фоне удорожания внешнего заемного капитала коммерческие организации фокусируются на внутренних скрытых резервах. Одной из таких критических зон остается корректный аудит обязательств по аренде, лизингу основных фондов, а также нематериальным цифровым активам в полном соответствии с новыми федеральными стандартами бухгалтерского учета (ФСБУ).
            </p>

            {/* Informative Callout Text Block (With custom seamless blur-spoiler) */}
            <div 
              onClick={() => setIsSpoilerRevealed(!isSpoilerRevealed)}
              className="bg-white dark:bg-slate-905 border border-sky-100 dark:border-sky-900/40 p-5 rounded-[24px] shadow-sm space-y-3 relative overflow-hidden select-none my-6 cursor-pointer group transition-all duration-300 hover:border-sky-200"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-450/10 rounded-full blur-2xl opacity-40 -translate-y-6" />
              <div className={`transition-all duration-350 ${isSpoilerRevealed ? 'blur-none select-text' : 'blur-[6px] opacity-70 select-none'}`}>
                <div className="relative flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30 rounded-xl text-[10px] font-black uppercase tracking-wider font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Мнение финансового директора ГК ФинВульф</span>
                  </div>
                </div>
                <p className="mt-3 text-xs md:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium italic relative z-10 pl-2 border-l-2 border-sky-400">
                  «Оптимизация расчета ППА (права пользования активом) по новым принципам снижает искусственно раздутый валютный баланс лизингополучателя в среднем на 8.5%. Это автоматически улучшает коэффициент финансового левериджа и открывает путь к льготным банковским лимитам.»
                </p>
              </div>
            </div>

            {/* Section Images with Captions */}
            {renderSectionImages('intro')}
            {renderAddImageButtonAndForm('intro')}
          </div>

          {/* ---------------- 2. REGULATORY CHANGES (RULES) ---------------- */}
          <div ref={sectionRefs.rules} className="space-y-4 pt-4">
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 font-sans pb-2 flex items-center gap-2">
              <span className="text-indigo-600 font-mono">2.</span> Регуляторные изменения и ФСБУ 25/2018
            </h2>
            <p>
              Вступление в силу ФСБУ 25/2018 кардинально изменило методологию учета лизинговых операций у арендаторов. Ключевое нововведение заключается в необходимости признания права пользования активом (ППА) и обязательства по аренде в бухгалтерском балансе, за исключением краткосрочной аренды и аренды малоценных активов.
            </p>
            <p>
              Теперь большинство договоров аренды де-факто приравниваются к привлечению заемного финансирования для приобретения внеоборотных активов. Это требует от бухгалтерских служб регулярного проведения дисконтирования будущих арендных платежей, что усложняет расчеты и повышает требования к аудиту контрагентов-лизингодателей.
            </p>

            {/* Section Images with Captions */}
            {renderSectionImages('rules')}
            {renderAddImageButtonAndForm('rules')}

            {/* РЕКОМЕНДОВАННЫЙ ВИДЖЕТ-ПЕРЕХОД: УЗНАЙТЕ БОЛЬШЕ О КОНТРАГЕНТЕ */}
            <div className="my-8 bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/40 p-6 rounded-[24px] shadow-sm relative overflow-hidden select-none">
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="space-y-1.5 z-10">
                  <h4 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-100 font-sans">
                    Узнайте больше о контрагенте {activeCompany.shortName}
                  </h4>
                  <p className="text-xs md:text-[13px] text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-sans">
                    Перейдите в карточку компании, чтобы изучить кредитный рейтинг, отчетность, арбитражные процессы и всю справочную информацию о контрагенте.
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    if (onSelectCompany) onSelectCompany(activeCompany.id);
                    if (onTabChange) onTabChange('dashboard');
                  }}
                  className="px-5 py-3 bg-sky-600 hover:bg-sky-650 text-white text-xs font-black uppercase rounded-2xl transition cursor-pointer shadow-md shadow-sky-600/15 shrink-0 font-sans tracking-wide active:scale-95 flex items-center gap-1.5"
                >
                  <span>В карточку компании</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- 3. NUMBERS ---------------- */}
          <div ref={sectionRefs.numbers} className="space-y-4 pt-4">
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 font-sans pb-2 flex items-center gap-2">
              <span className="text-indigo-600 font-mono">3.</span> Финансовый разбор и плановые показатели
            </h2>
            <p>
              Давайте перейдем от теории к строгим бухгалтерским вычислениям. На примере условного договора финансовой аренды сроком на 3 года (с ежегодным платежом 1,000,000 рублей) при рыночной ставке дисконтирования 12% годовых, приведем сравнительный расчет влияния аренды на финансовые показатели контрагента:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 my-6 bg-white dark:bg-slate-950">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-905 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4 font-bold">Показатель статьи</th>
                    <th className="py-3 px-4 font-bold text-center">До реформы (ФСБУ 25)</th>
                    <th className="py-3 px-4 font-bold text-center">После реформы (ФСБУ 25)</th>
                    <th className="py-3 px-4 font-bold text-right">Влияние на Оценочный риск</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-805 font-medium text-slate-705 dark:text-slate-300">
                  <tr>
                    <td className="py-3.5 px-4 font-sans font-bold">Стоимость внеоборотных активов (ППА)</td>
                    <td className="py-3.5 px-4 text-center font-mono">0 ₽</td>
                    <td className="py-3.5 px-4 text-center font-mono text-indigo-600 font-bold">2,401,831 ₽</td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 font-bold">Повышение капитализации (+)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-sans font-bold">Обязательства по лизингу (Заемные средства)</td>
                    <td className="py-3.5 px-4 text-center font-mono">0 ₽</td>
                    <td className="py-3.5 px-4 text-center font-mono text-rose-500">2,401,831 ₽</td>
                    <td className="py-3.5 px-4 text-right text-amber-500">Рост долговой нагрузки (-)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-sans font-bold">Чистая прибыль за 1-й год (с учетом амортизации)</td>
                    <td className="py-3.5 px-4 text-center font-mono">1,500,000 ₽</td>
                    <td className="py-3.5 px-4 text-center font-mono text-rose-500">1,411,780 ₽</td>
                    <td className="py-3.5 px-4 text-right text-slate-450">Снижение базы налога (Нейтрально)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Таким образом, новые правила заставляют баланс «раздуваться», что может отрицательно сказаться на показателях финансовой автономии и доле собственного капитала контрагента, увеличивая его воспринимаемую долговую нагрузку в глазах кредитных аналитиков и лизингодателей.
            </p>

            {/* FORMULA BLOCK */}
            <div className="bg-slate-50 dark:bg-slate-905 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6.5 my-6 space-y-4 font-sans shadow-xs">
              {/* Beautiful math-editor style formula block */}
              <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center justify-center space-y-4 shadow-2xs relative overflow-hidden select-none">
                <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-center font-serif text-2xl md:text-3xl text-slate-800 dark:text-slate-100 gap-1.5 select-all selection:bg-indigo-100/80">
                  <span className="font-bold italic text-indigo-600 dark:text-indigo-400">PV</span>
                  <span className="mx-2.5 text-slate-400 dark:text-slate-600 font-sans font-light">=</span>
                  
                  <div className="flex flex-col items-center mr-3 relative translate-y-[-1px]">
                    <span className="text-[10px] font-mono leading-none text-slate-400 dark:text-slate-500 mb-0.5 font-bold">n</span>
                    <span className="text-3xl md:text-4xl font-extralight text-slate-700 dark:text-slate-300 -my-1 font-sans">∑</span>
                    <span className="text-[10px] font-mono leading-none text-slate-400 dark:text-slate-500 mt-0.5 font-bold">t=1</span>
                  </div>

                  <div className="flex flex-col items-center font-sans">
                    <span className="text-sm md:text-base font-extrabold text-indigo-600 dark:text-indigo-400 pb-1 px-3 tracking-wide">
                      PMT<sub className="text-[11px] lowercase italic font-semibold">t</sub>
                    </span>
                    <div className="h-[1.5px] w-full bg-slate-200 dark:bg-slate-800" />
                    <span className="text-sm md:text-base font-extrabold text-indigo-600 dark:text-indigo-400 pt-1 px-3 tracking-wide">
                      (1 + r)<sup className="text-[11px] font-semibold">t</sup>
                    </span>
                  </div>
                </div>
                
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans font-semibold tracking-tight uppercase">
                  Формула приведенной стоимости аннуитета
                </span>
              </div>

              {/* Toggler button for elements/descriptions */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors select-none"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFormulaExpanded ? 'rotate-180' : ''}`} />
                  <span>Показать составляющие формулы</span>
                </button>

                {/* Smooth appearance container */}
                {isFormulaExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs md:text-[12.5px] transition-all duration-300 animate-fadeIn">
                    <div className="space-y-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-4 rounded-2xl">
                      <span className="block font-sans font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/55 pb-1.5 mb-1.5">
                        PV <span className="text-[11px] text-slate-450 font-normal italic">(Present Value)</span>
                      </span>
                      <p className="text-slate-500 dark:text-slate-400 text-[11.5px] leading-relaxed">Текущая дисконтированная стоимость обязательства по аренде.</p>
                    </div>
                    <div className="space-y-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-4 rounded-2xl">
                      <span className="block font-sans font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/55 pb-1.5 mb-1.5">
                        PMT_t <span className="text-[11px] text-slate-450 font-normal italic">(Payment)</span>
                      </span>
                      <p className="text-slate-500 dark:text-slate-400 text-[11.5px] leading-relaxed">Размер арендного или лизингового платежа в конкретном интервале t.</p>
                    </div>
                    <div className="space-y-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-4 rounded-2xl">
                      <span className="block font-sans font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/55 pb-1.5 mb-1.5">
                        r / t <span className="text-[11px] text-slate-450 font-normal italic">(Rate & Period)</span>
                      </span>
                      <p className="text-slate-500 dark:text-slate-400 text-[11.5px] leading-relaxed font-sans">
                        <strong className="text-slate-600 dark:text-slate-350">r</strong> — эффективная ставка дисконтирования за период;<br />
                        <strong className="text-slate-600 dark:text-slate-355">t</strong> — порядковый номер периода аренды.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section Images with Captions */}
            {renderSectionImages('numbers')}
            {renderAddImageButtonAndForm('numbers')}
          </div>

            {/* ---------------- 4. SOLUTIONS ---------------- */}
            <div ref={sectionRefs.solutions} className="space-y-4 pt-4">
              <h3 className="text-md md:text-lg font-extrabold text-slate-900 font-sans pb-2 flex items-center gap-2">
                <span className="text-indigo-600 font-mono">4.</span> Готовое решение: Пошаговая инструкция бухгалтеру
              </h3>
              
              <p>
                Как минимизировать риски и повысить точность при сдаче отчетности? Мы сформировали готовый сводный чек-лист. Вы можете использовать его прямо сейчас:
              </p>

              {/* RICH QUOTE BLOCK WITH ICON, TITLE, QUOTE & BULLETS */}
              <div className="bg-white dark:bg-slate-905 border border-sky-100 dark:border-sky-900/40 p-6 rounded-[24px] shadow-sm space-y-4 my-6 relative overflow-hidden select-none">
                <div className="absolute top-0 right-0 w-28 h-28 bg-sky-450/10 rounded-full blur-2xl opacity-40 -translate-y-6" />
                <div className="relative flex items-center gap-2.5">
                  <div className="p-1.5 bg-sky-50 dark:bg-sky-950/40 text-sky-705 dark:text-sky-450 border border-sky-100 dark:border-sky-900/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-black uppercase tracking-wider text-sky-900 dark:text-sky-105 font-sans leading-none">
                      Критический регламент перепроверки лизинга
                    </h4>
                    <p className="text-[10px] text-sky-700/80 dark:text-sky-450 mt-1 leading-none font-sans">Обязательно к внедрению до закрытия полугодия</p>
                  </div>
                </div>

                <blockquote className="text-[13px] md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic border-l-2 border-sky-400 pl-3 relative z-10">
                  «Бухгалтерские ошибки при исчислении коэффициента приведенной стоимости ведут к искажению строки 1150 внеоборотных активов в форме №1 Баланса. Штрафные санкции ст. 120 НК РФ здесь вторичны; куда страшнее дефолт по ковенантам перед консорциумом банков.»
                </blockquote>

                <div className="space-y-2 border-t border-sky-100 dark:border-sky-900/30 pt-3 relative z-10">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    Списковые шаги внутри регламента:
                  </span>
                  
                  <ul className="space-y-1.5 pl-3 text-xs md:text-[13px] text-slate-700 dark:text-slate-300 font-sans font-semibold">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-550 dark:text-sky-400">•</span>
                      <span>Запросить актуальную справочную процентную ставку лизингодателя в письменной форме.</span>
                    </li>
                    <li className="flex items-start gap-2">
          <span className="text-sky-550 dark:text-sky-400">•</span>
                      <span>Произвести расчет ППА в специализированном калькуляторе на портале ФинВульф.</span>
                    </li>
                    <li className="flex items-start gap-2">
          <span className="text-sky-550 dark:text-sky-400">•</span>
                      <span>Зафиксировать полученный дисконт распорядительным приказом по Учетной политике.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Использование данного чек-листа гарантирует отсутствие методологических нареканий со стороны проверяющих органов первой инстанции FNS РФ. Рекомендуется использовать встроенный скрипт автоматической верификации контрагентов для проверки ликвидности самого лизингодателя.
              </p>

            </div>

              {/* ====================== INTERACTIVE COUNTERPARTY DOSSIER IN THE LONGREAD (REPLACED BY DISTRIBUTED CATEGORIZED WIDGETS) ====================== */}
              {false ? (
              <div className="my-10 bg-slate-50/60 dark:bg-slate-900/40 p-6 md:p-8 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-inner space-y-6">
                
                {/* Header inside the dossier */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-705 dark:text-indigo-400 border border-indigo-150/30 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono">
                      <History className="w-3 h-3 animate-spin" />
                      Интерактивный Виджет
                    </div>
                    <h3 className="text-md md:text-lg font-black text-slate-900 dark:text-slate-100 font-sans tracking-tight leading-none">
                      Досье контрагента: Экспресс-анализ рисков
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal max-w-xl">
                      Анализируйте любого контрагента из базы данных ФНС / ЕФРСБ в режиме реального времени непосредственно внутри материала лонгрида.
                    </p>
                  </div>
                  
                  {/* Company Select Dropdown */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Компания:</span>
                    <select 
                      value={selectedCompId}
                      onChange={(e) => {
                        setSelectedCompId(e.target.value);
                      }}
                      className="bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-850 px-3.5 py-2 rounded-xl text-xs font-black text-slate-850 dark:text-slate-150 focus:outline-none focus:border-indigo-505 shadow-sm transition-all"
                    >
                      {mockCompanies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.shortName} (ИНН {c.inn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Core Active Company Selection info */}
                {(() => {
                  const activeCompany = mockCompanies.find(c => c.id === selectedCompId) || mockCompanies[0];
                  return (
                    <div className="space-y-6">
                      
                      {/* Top company brief card with status and score */}
                      <div className="bg-white dark:bg-slate-950 p-4.5 rounded-2.5xl border border-slate-200/70 dark:border-slate-850 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                                {activeCompany.fullName}
                              </span>
                              {activeCompany.status === 'bankruptcy' ? (
                                <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-150/40 rounded-md text-[9px] font-black uppercase font-mono tracking-wide">
                                  Банкротство
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-150/40 rounded-md text-[9px] font-black uppercase font-mono tracking-wide">
                                  Активна
                              </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Юридический адрес: {activeCompany.address}
                            </span>
                          </div>
                        </div>
                        
                        {/* Score Badge */}
                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-bold font-mono block">Кредитный рейтинг</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${
                              activeCompany.scorePercent > 80 
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 border-emerald-200 dark:border-emerald-900' 
                                : activeCompany.scorePercent > 50 
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border-amber-200' 
                                  : 'bg-red-50 dark:bg-red-950/60 text-red-700 border-red-200'
                            }`}>
                              {activeCompany.scoreMark}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">({activeCompany.scorePercent}%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Tabs Selector inside dossier */}
                      <div className="flex bg-slate-100 dark:bg-slate-950/60 p-1 rounded-2xl border border-slate-250/50 dark:border-slate-850 gap-1 overflow-x-auto scrollbar-none">
                        {(['passport', 'bankruptcy', 'arbitration', 'financials'] as const).map((tab) => {
                          const labels = {
                            passport: 'Паспорт Юрлица',
                            bankruptcy: 'Банкротства',
                            arbitration: 'Арбитражные Дела',
                            financials: 'Коэффициенты & Тренды'
                          };
                          const icons = {
                            passport: Cpu,
                            bankruptcy: AlertOctagon,
                            arbitration: FileSpreadsheet,
                            financials: TrendingUp
                          };
                          const Icon = icons[tab];
                          const isActive = compTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => setCompTab(tab)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 justify-center ${
                                isActive 
                                  ? 'bg-white dark:bg-slate-900 text-indigo-705 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800' 
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/20'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 animate-pulse-slow" />
                              <span>{labels[tab]}</span>
                              {tab === 'bankruptcy' && activeCompany.bankruptcy && (
                                <span className="text-[8.5px] px-1 bg-rose-500 text-white font-black rounded-md animate-pulse">1</span>
                              )}
                              {tab === 'arbitration' && activeCompany.arbitration && (
                                <span className="text-[8.5px] px-1 bg-slate-800 text-slate-200 font-black rounded-md">
                                  {activeCompany.arbitration.cases.length}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Sub-Tab Panel content */}
                      <div className="bg-white dark:bg-slate-950 rounded-2.5xl border border-slate-200/70 dark:border-slate-850 p-5 md:p-6 shadow-xs min-h-[220px]">
                        
                        {/* 1. PASSPORT TAB CONTENT */}
                        {compTab === 'passport' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <div>
                              <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider font-sans">Регистрационные данные («Паспорт контрагента»)</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Официальные реквизиты юридического лица в базах ФНС РФ</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 relative group/copy">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Полное название</span>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug mt-1 pr-6 uppercase">
                                  {activeCompany.fullName}
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 relative group/copy">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono block">ИНН</span>
                                  <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 mt-1">
                                    {activeCompany.inn}
                                  </div>
                                  <button 
                                    onClick={() => handleCopyText(activeCompany.inn, 'inn')}
                                    className="absolute top-2 right-2 text-slate-350 hover:text-slate-500 transition cursor-pointer"
                                  >
                                    {fieldCopied.inn ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  {fieldCopied.inn && <span className="absolute bottom-1 right-2 text-[8px] font-bold text-emerald-500 animate-fadeIn">Скопировано!</span>}
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 relative group/copy">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono block">КПП</span>
                                  <div className="text-xs font-mono font-bold text-slate-650 dark:text-slate-350 mt-1">
                                    {activeCompany.kpp}
                                  </div>
                                  <button 
                                    onClick={() => handleCopyText(activeCompany.kpp, 'kpp')}
                                    className="absolute top-2 right-2 text-slate-355 hover:text-slate-500 transition cursor-pointer"
                                  >
                                    {fieldCopied.kpp ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  {fieldCopied.kpp && <span className="absolute bottom-1 right-2 text-[8px] font-bold text-emerald-500 animate-fadeIn">Скопировано!</span>}
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 relative group/copy">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono block">ОГРН</span>
                                  <div className="text-xs font-mono font-bold text-slate-655 dark:text-slate-350 mt-1">
                                    {activeCompany.ogrn}
                                  </div>
                                  <button 
                                    onClick={() => handleCopyText(activeCompany.ogrn, 'ogrn')}
                                    className="absolute top-2 right-2 text-slate-355 hover:text-slate-500 transition cursor-pointer"
                                  >
                                    {fieldCopied.ogrn ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  {fieldCopied.ogrn && <span className="absolute bottom-1 right-2 text-[8px] font-bold text-emerald-500 animate-fadeIn">Скопировано!</span>}
                                </div>
                              </div>

                              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 relative group/copy">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Генеральный директор</span>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5 pr-6">
                                  <UserCheck className="w-3.5 h-3.5 text-sky-505 flex-shrink-0" />
                                  <span>{activeCompany.director}</span>
                                </div>
                                <button 
                                  onClick={() => handleCopyText(activeCompany.director, 'director')}
                                  className="absolute top-2 right-2 text-slate-350 hover:text-slate-500 transition cursor-pointer"
                                >
                                  {fieldCopied.director ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                {fieldCopied.director && <span className="absolute bottom-1 right-2 text-[8px] font-bold text-emerald-500 animate-fadeIn">Скопировано!</span>}
                              </div>

                              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 relative group/copy">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Основной ОКВЭД код</span>
                                <div className="text-xs text-slate-750 dark:text-slate-250 mt-1 leading-tight pr-6">
                                  <strong className="font-mono text-indigo-700 dark:text-indigo-400 font-extrabold">{activeCompany.okved}</strong> — {activeCompany.okvedDesc}
                                </div>
                                <button 
                                  onClick={() => handleCopyText(`${activeCompany.okved} ${activeCompany.okvedDesc}`, 'okved')}
                                  className="absolute top-2 right-2 text-slate-350 hover:text-slate-500 transition cursor-pointer"
                                >
                                  {fieldCopied.okved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                {fieldCopied.okved && <span className="absolute bottom-1 right-2 text-[8px] font-bold text-emerald-500 animate-fadeIn">Скопировано!</span>}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. BANKRUPTCY TAB CONTENT */}
                        {compTab === 'bankruptcy' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <div>
                              <h4 className="text-xs font-black uppercase text-rose-900 dark:text-rose-350 tracking-wider font-sans flex items-center gap-1.5">
                                <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
                                <span>Анализ несостоятельности в реестрах ЕФРСБ</span>
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Информация по банкротным делам, ликвидации и назначенным управляющим</p>
                            </div>

                            {!activeCompany.bankruptcy ? (
                              <div className="bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4.5 rounded-2.5xl flex items-center gap-4.5 animate-fadeIn">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/5 flex-shrink-0 animate-pulse">
                                  <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                  <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Юридические процедуры банкротства отсутствуют</strong>
                                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                                    В отношении {activeCompany.shortName} в справочных реестрах Коммерсантъ и судебных инстанциях не зарегистрировано возбужденных дел.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="bg-rose-50/30 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4.5 rounded-2.5xl">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-rose-100/50 dark:border-rose-900/20 pb-3 mb-3">
                                    <div className="space-y-0.5">
                                      <span className="text-[9px] uppercase font-bold text-rose-800 dark:text-rose-405 tracking-wider font-mono block">Текущий Статус</span>
                                      <strong className="text-xs text-rose-955 dark:text-rose-350 font-black uppercase tracking-wider block font-sans">
                                        {activeCompany.bankruptcy.status}
                                      </strong>
                                    </div>
                                    <div className="text-left sm:text-right">
                                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Номер дела</span>
                                      <strong className="text-xs text-slate-800 dark:text-slate-105 font-mono block font-black">
                                        {activeCompany.bankruptcy.caseNumber}
                                      </strong>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                                    <div className="flex items-start gap-2.5">
                                      <UserCheck className="w-4 h-4 text-rose-505 shrink-0 mt-0.5 animate-pulse" />
                                      <div>
                                        <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Конкурсный Управляющий</span>
                                        <strong className="text-slate-800 dark:text-slate-205 py-0.5 block font-bold">{activeCompany.bankruptcy.managerName}</strong>
                                        <span className="text-[9.5px] text-slate-405 block leading-tight">{activeCompany.bankruptcy.managerOrg}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 border-t sm:border-t-0 sm:border-l border-rose-100/40 sm:pl-4 pt-2.5 sm:pt-0">
                                      <Clock className="w-4 h-4 text-rose-505 shrink-0 mt-0.5" />
                                      <div>
                                        <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Последнее событие</span>
                                        <strong className="text-slate-805 dark:text-slate-200 py-0.5 block truncate max-w-[15rem]" title={activeCompany.bankruptcy.lastEventDescription}>
                                          {activeCompany.bankruptcy.lastEventDescription}
                                        </strong>
                                        <span className="text-[9.5px] text-slate-405 font-mono font-bold text-rose-600 block">Дата: {activeCompany.bankruptcy.lastEventDate.split('-').reverse().join('.')}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Short timeline */}
                                <div className="space-y-2 pt-1 border-t border-slate-100/50">
                                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Историческая цепочка событий по делу:</span>
                                  <div className="space-y-2.5 pl-1.5">
                                    {activeCompany.bankruptcy.timeline.slice(0, 2).map((item, idx) => (
                                      <div key={idx} className="flex gap-2.5 items-start pl-2 relative border-l border-rose-100 dark:border-rose-900/35 pb-1 select-none">
                                        <div className={`w-1.5 h-1.5 rounded-full absolute -left-[4px] top-1.5 ${item.critical ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
                                        <div className={`w-1.5 h-1.5 rounded-full absolute -left-[4px] top-1.5 ${item.critical ? 'bg-red-500' : 'bg-slate-405'}`} />
                                        <div className="text-xs leading-tight">
                                          <span className="font-mono text-[9px] font-bold text-slate-400 block">{item.date.split('-').reverse().join('.')} • {item.stage}</span>
                                          <strong className="text-slate-800 dark:text-slate-200 mt-0.5 block font-bold leading-tight">{item.title}</strong>
                                          <p className="text-[9.5px] text-slate-455 mt-0.5">{item.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 3. ARBITRATION TAB CONTENT */}
                        {compTab === 'arbitration' && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <div>
                              <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider font-sans">Судебный скоринг и арбитражные споры</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">В судах первой инстанции зафиксированы иски (КАД ВАС РФ)</p>
                            </div>

                            {(!activeCompany.arbitration || activeCompany.arbitration.cases.length === 0) ? (
                              <div className="py-6 text-center text-slate-400 font-sans text-xs">
                                Судебных споров за последние 3 года не зарегистрировано.
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Summary claims */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className="bg-emerald-50/10 dark:bg-emerald-950/5 border border-slate-100 dark:border-slate-800/40 p-3 rounded-2xl">
                                    <span className="text-[9px] uppercase font-bold text-slate-405 font-mono block leading-snug">Роль Истца (Взыскание долга)</span>
                                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                      {activeCompany.arbitration.plaintiffAmount} млн ₽
                                    </div>
                                    <span className="text-[8.5px] text-slate-400 block">{activeCompany.arbitration.plaintiffCount} активных дел</span>
                                  </div>

                                  <div className="bg-rose-50/10 dark:bg-rose-950/5 border border-slate-100 dark:border-slate-800/40 p-3 rounded-2xl">
                                    <span className="text-[9px] uppercase font-bold text-slate-405 font-mono block leading-snug">Роль Ответчика (Риски уплаты)</span>
                                    <div className="text-base font-black text-rose-650 dark:text-rose-400 mt-1">
                                      {activeCompany.arbitration.defendantAmount} млн ₽
                                    </div>
                                    <span className="text-[8.5px] text-slate-400 block">{activeCompany.arbitration.defendantCount} активных дел</span>
                                  </div>

                                  <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 p-3 rounded-2xl col-span-2 md:col-span-1">
                                    <span className="text-[9px] uppercase font-bold text-slate-405 font-mono block leading-snug font-sans">Споры третьих лиц</span>
                                    <div className="text-base font-black text-slate-700 dark:text-slate-350 mt-1">
                                      {activeCompany.arbitration.unknownAmount} млн ₽
                                    </div>
                                    <span className="text-[8.5px] text-slate-405 block">{activeCompany.arbitration.unknownCount} активных дел</span>
                                  </div>
                                </div>

                                {/* Cases list */}
                                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 style-scrollbar border border-slate-100 dark:border-slate-850 rounded-2xl p-2 bg-slate-50/30 dark:bg-slate-900/10">
                                  {activeCompany.arbitration.cases.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 transition duration-150">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-black text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer">{item.number}</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide font-mono ${
                                          item.role === 'Ответчик' 
                                            ? 'bg-rose-50 text-rose-700' 
                                            : item.role === 'Истец'
                                              ? 'bg-emerald-50 text-emerald-700'
                                              : 'bg-slate-100 text-slate-600'
                                        }`}>
                                          {item.role}
                                        </span>
                                      </div>
                                      <div className="text-left sm:text-right flex items-center sm:block gap-2 text-xs">
                                        <span className="text-slate-400 font-mono text-[9px] block mb-0.5">{item.date.split('-').reverse().join('.')} • {item.court}</span>
                                        <strong className={`font-mono font-black text-xs ${item.role === 'Ответчик' ? 'text-rose-650' : 'text-emerald-600'}`}>{item.amount} млн ₽</strong>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                        )}
                        </div>
                      )}

                      {/* 4. FINANCIALS TAB CONTENT */}
                      {compTab === 'financials' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider font-sans">Финансовые показатели и тренды контрагента</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Динамика выручки / прибыли и расчетные коэффициенты покрытия</p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono text-left shrink-0">Статистика: 2020-2025 гг.</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                            
                            {/* Custom SVG Trend Graph */}
                            <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2.5xl border border-slate-100 dark:border-slate-800/40 flex flex-col justify-between h-[155px]">
                              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider font-mono">Динамика выручки и чистой прибыли (Млн Руб)</span>
                              
                              <div className="h-24 w-full flex items-end justify-between gap-2 pt-3">
                                {(() => {
                                  const list = activeCompany.financials.slice(-6); // Last 6 years
                                  const revenues = list.map(f => f.revenue);
                                  const profits = list.map(f => f.netProfit);
                                  const maxRev = Math.max(...revenues, 1);
                                  const minProf = Math.min(...profits, 0);
                                  const maxProf = Math.max(...profits, 1);
                                  const absMax = Math.max(maxRev, Math.abs(minProf));
                                  return list.map((f, i) => {
                                    const revHeight = Math.max(8, (f.revenue / absMax) * 60);
                                    const profHeight = Math.max(6, (Math.abs(f.netProfit) / absMax) * 60);
                                    const isProfitNegative = f.netProfit < 0;
                                    return (
                                      <div key={i} className="flex-1 flex flex-col items-center group/bar relative">
                                        
                                        {/* Inline simulated tooltip */}
                                        <div className="absolute bottom-full mb-1.5 hidden group-hover/bar:block bg-slate-950 text-white rounded-lg p-2 text-[9px] w-28 text-center z-40 shadow-xl leading-normal animate-in fade-in duration-100">
                                          <strong className="block text-sky-400 font-mono">{f.year} г.</strong>
                                          <span className="block text-slate-350">Выручка: <b className="font-mono text-white">{(f.revenue / 1000).toFixed(1)}к</b></span>
                                          <span className="block text-slate-355">Прибыль: <b className={`font-mono ${isProfitNegative ? 'text-red-400' : 'text-emerald-400'}`}>{(f.netProfit / 1000).toFixed(1)}k</b></span>
                                        </div>

                                        {/* Simple visual dual bars */}
                                        <div className="w-full flex items-end justify-center gap-[2.5px] h-16">
                                          <div 
                                            style={{ height: `${revHeight}%` }} 
                                            className="w-2.5 rounded-t-[3px] bg-sky-500 shadow-neutral animate-fadeIn"
                                          />
                                          <div 
                                            style={{ height: `${profHeight}%` }} 
                                            className={`w-2.5 rounded-t-[3px] ${isProfitNegative ? 'bg-red-500' : 'bg-indigo-505 shadow-neutral animate-fadeIn'}`}
                                          />
                                        </div>
                                        
                                        <span className="text-[8.5px] font-mono text-slate-400 font-bold mt-1.5">{f.year}</span>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>

                              <div className="flex items-center gap-4 text-[8.5px] font-mono justify-center border-t border-slate-100/50 pt-1">
                                <div className="flex items-center gap-1.5 animate-pulse-slow">
                                  <div className="w-2 h-2 bg-sky-500 rounded" />
                                  <span className="text-slate-500">Выручка</span>
                                </div>
                                <div className="flex items-center gap-1.5 animate-pulse-slow">
                                  <div className="w-2 h-2 bg-indigo-505 rounded" />
                                  <span className="text-slate-500">Чистая прибыль</span>
                                </div>
                              </div>
                            </div>

                            {/* Coefficients Table List */}
                            <div className="space-y-1.5 text-xs">
                              {activeCompany.ratios.slice(0, 4).map((rat, rIndex) => {
                                const statusTheme = rat.status === 'healthy' 
                                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/40 dark:border-emerald-900/30' 
                                  : rat.status === 'caution' 
                                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100/40' 
                                    : 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-100/40';
                                return (
                                  <div key={rIndex} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 gap-4 text-xs">
                                    <div className="min-w-0 flex-1 leading-tight">
                                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[15rem] text-[11px]" title={rat.description}>
                                        {rat.name}
                                      </span>
                                      <span className="text-[9.5px] text-slate-500 block leading-tight mt-1 font-sans">
                                        Порядок расчета: {rat.formula || RATIO_METADATA_FALLBACK[rat.id]?.formula || rat.norm}
                                      </span>
                                      {(rat.source || RATIO_METADATA_FALLBACK[rat.id]?.source) && (
                                        <a 
                                          href={rat.source || RATIO_METADATA_FALLBACK[rat.id]?.source} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-[8.5px] text-indigo-505 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline block truncate max-w-[12rem] mt-0.5"
                                        >
                                          Источник: {(rat.source || RATIO_METADATA_FALLBACK[rat.id]?.source)?.replace('https://', '')}
                                        </a>
                                      )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <span className={`px-2 py-0.5 rounded-lg border font-mono font-extrabold text-[10.5px] ${statusTheme}`}>
                                        {rat.id === 'ros' || rat.id === 'roa' ? `${rat.value}%` : rat.value}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Footer Actions inside the dossier */}
                    <div className="flex flex-col sm:flex-row items-center gap-4.5 pt-4 border-t border-slate-200/50">
                      <button
                        onClick={() => {
                          if (onSelectCompany) {
                            onSelectCompany(activeCompany.id);
                          }
                          if (onTabChange) {
                            onTabChange('dashboard');
                          }
                        }}
                        className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer leading-none"
                      >
                        <span>Перейти в полную карточку контрагента</span>
                        <ExternalLink className="w-4 h-4 text-white" />
                      </button>

                      <button
                        onClick={() => setShowAnalysisModal(true)}
                        className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-850 hover:scale-[1.01] text-white dark:bg-slate-800 dark:hover:bg-slate-755 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 cursor-pointer leading-none border border-slate-750"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>Финансовый Прогноз-Анализ (v2.0)</span>
                      </button>
                    </div>

                  </div>
                );
              })()}

              </div>
              ) : null}


            {/* MOCK ADVERTISEMENT BANNER 2 */}
            <div className="my-8 bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/40 p-6 rounded-[24px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden select-none">
              <div className="flex items-center gap-3.5 z-10">
                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-450 border border-sky-100 dark:border-sky-900/30 rounded-2xl flex-shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                    Шаблон Excel расчета дисконтирования по ФСБУ 25/2018
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-405 mt-1 max-w-lg font-sans">
                    Скачайте готовый калькулятор со встроенными формулами аннуитета и автоматическим графиком проводок совершенно бесплатно.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => alert('Файл fsbu_25_discount_model.xlsx успешно подготовлен и отправлен на ваш Email!')}
                className="px-5 py-3 bg-sky-600 hover:bg-sky-600 text-white text-xs font-black uppercase rounded-2xl transition cursor-pointer shadow-md shadow-sky-600/15 shrink-0 font-sans tracking-wide active:scale-95 z-10"
              >
                Скачать шаблон (.XLSX)
              </button>
            </div>

            {/* ---------------- 5. SUMMARY ---------------- */}
            <div ref={sectionRefs.summary} className="space-y-4 pt-4">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 font-sans pb-2 flex items-center gap-2">
                <span className="text-indigo-600 font-mono">5.</span> Итоги и профессиональное суждение
              </h2>
              <p>
                Подводя итог, хочется подчеркнуть, что регуляторные требования Минфина — это не усложнение жизни бизнеса, а попытка сблизить национальные стандарты учета с МСФО. Такой подход повышает прозрачность отечественных компаний для международных инвесторов и упрощает дальнейшую масштабируемость предприятий.
              </p>
              
              <p>
                Развертывание новых аналитических сервисов внутри организации должно сопровождаться непрерывным обучением специалистов низшего и среднего звена бухгалтерии. Только в этом случае компания получит стабильный синергетический эффект снижения внутренних нефинансовых рисков.
              </p>
            </div>

          </div>
          )}



          {/* ======================================================================= */}
          {/* Related recommendation blocks */}
          {/* ======================================================================= */}
          <div className="space-y-5 pt-4">
            <h3 className="text-xs md:text-sm font-black uppercase font-sans tracking-wider text-slate-900 border-l-4 border-indigo-605 pl-3 leading-none">
              Рекомендуем прочитать из той же рубрики
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendations.map(item => (
                <div 
                  key={item.id}
                  onClick={() => onNavigateToArticle(item)}
                  className="bg-slate-50 border border-slate-200/80 rounded-[32px] p-5.5 hover:bg-white hover:border-indigo-600/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3.5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono text-slate-400 font-bold">{item.date}</span>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-black uppercase">
                        {item.readTime}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-850 leading-snug line-clamp-2 group-hover:text-indigo-600 transition font-sans">
                      {item.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 leading-normal line-clamp-3 font-sans">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200/60 mt-2">
                    <div className={`${item.author?.avatarUrl || 'bg-slate-350'} w-6.5 h-6.5 rounded-lg flex items-center justify-center text-white text-[9.5px] font-black uppercase`}>
                      {item.author?.firstName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10.5px] font-black text-slate-700 truncate font-sans">
                        {item.author?.firstName || 'Автор'} {item.author?.lastName || ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* COMMENTS SYSTEM SECTION WITH PRELOADED CONVERSATION & NEW POSTS */}
          {/* ======================================================================= */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs md:text-sm font-black uppercase font-sans tracking-wider text-slate-900 leading-none">
              <span>Дискуссия бухгалтеров и экспертов ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)} сообщений)</span>
            </h3>

            {/* Leave Comment Form Box */}
            <form onSubmit={handleAddComment} className="bg-slate-50/60 border border-slate-200 rounded-[32px] p-5.5 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-900 border border-white shadow-sm flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  Вы
                </div>
                <div className="w-full relative">
                  <textarea
                    rows={3}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Напишите профессиональное мнение, задайте вопрос автору или оставьте комментарий..."
                    className="w-full bg-white border border-slate-250 rounded-2xl p-3.5 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-450 font-sans">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Учетная запись: Гость форума (Москва)</span>
                </div>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white text-[11px] font-black uppercase rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Опубликовать на форуме</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Existing Comments Tree Loop */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  
                  {/* Commment parent line */}
                  <div className="bg-white hover:bg-slate-50/30 rounded-2xl p-1 transition-all">
                    <div className="flex items-start gap-3.5">
                      <div className={`${comment.avatarClass} w-9.5 h-9.5 rounded-xl flex items-center justify-center text-white text-xs font-black uppercase flex-shrink-0 border shadow-xs`}>
                        {comment.authorName.charAt(0)}
                      </div>
                      
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div>
                            <span className="text-xs font-black text-slate-800 font-sans">
                              {comment.authorName}
                            </span>
                            <span className="inline-block text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded ml-2 uppercase">
                              {comment.authorRole}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">
                            {comment.date}
                          </span>
                        </div>
                        
                        <p className="text-xs md:text-[13px] text-slate-700 leading-relaxed font-sans">
                          {comment.text}
                        </p>

                        <div className="flex items-center gap-4 pt-1">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center gap-1 text-[10.5px] font-bold transition-colors cursor-pointer ${
                              comment.hasLiked ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Полезно ({comment.likes})</span>
                          </button>

                          <button
                            onClick={() => {
                              setReplyingToId(comment.id);
                              setReplyText('');
                            }}
                            className="text-[10.5px] text-slate-450 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>Ответить</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inline nested reply form */}
                  {replyingToId === comment.id && (
                    <div className="ml-10.5 bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100 flex flex-col gap-2 animate-in slide-in-from-top-1">
                      <div className="flex items-center justify-between text-[11px] text-indigo-700 font-sans font-bold">
                        <span>Ваш экспресс-ответ для {comment.authorName}:</span>
                        <button 
                          onClick={() => setReplyingToId(null)}
                          className="text-slate-400 hover:text-slate-650 font-black text-xs cursor-pointer"
                        >
                          Отменить
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Напишите ваш ответ...`}
                        className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs font-sans text-slate-800 placeholder-slate-405 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 text-white text-[10.5px] font-black uppercase rounded-lg transition shadow-sm cursor-pointer"
                        >
                          Ответить
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Child Nested Replies chain */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-10.5 pl-4 border-l-2 border-indigo-100 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3.5 bg-slate-50/40 hover:bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/50 transition-all">
                          <div className={`${reply.avatarClass} w-8.5 h-8.5 rounded-xl flex items-center justify-center text-white text-[11px] font-black uppercase flex-shrink-0 border border-white shadow-xs`}>
                             {reply.authorName.charAt(0)}
                          </div>
                          
                          <div className="space-y-1.5 flex-grow min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <div>
                                <span className="text-xs font-black text-slate-800 font-sans">
                                  {reply.authorName}
                                </span>
                                <span className="inline-block text-[8.5px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded ml-2 uppercase font-sans">
                                  {reply.authorRole}
                                </span>
                              </div>
                              <span className="text-[9.5px] text-slate-400 font-mono font-semibold">
                                {reply.date}
                              </span>
                            </div>

                            <p className="text-xs md:text-[12.5px] text-slate-650 leading-relaxed font-sans">
                              {reply.text}
                            </p>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleLikeComment(reply.id)}
                                className={`flex items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
                                  reply.hasLiked ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>Полезно ({reply.likes})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* ====================== FUTURE FINANCIAL INTELLIGENCE PREVIEW MODAL (v2.0) ====================== */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[36px] max-w-4xl w-full border border-slate-200/95 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Top Header Bar */}
            <div className="bg-slate-950 text-white p-6 md:p-7 flex items-center justify-between border-b border-slate-800 relative">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/25 text-amber-400 border border-amber-500/20 rounded-md text-[9px] font-black uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Релиз v2.0-Alpha
                </div>
                <h3 className="text-base md:text-lg font-black tracking-tight font-sans mt-0.5">
                  Интеллектуальный аудит & Стресс-моделирование
                </h3>
                <p className="text-[10px] text-slate-400 leading-none">
                  Прототип экспертного модуля глубокого финансового анализа и нейро-прогнозирования ликвидности.
                </p>
              </div>
              
              <button 
                onClick={() => setShowAnalysisModal(false)}
                className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Tab selectors */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 style-scrollbar flex-grow bg-slate-50/50 dark:bg-slate-950/25">
              
              {/* Info block */}
              <div className="bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-150/30 p-4.5 rounded-2.5xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
                    Компоненты аналитического прогнозирования
                  </strong>
                  <p className="text-[11px] text-slate-505 max-w-xl font-sans leading-normal">
                    Этот прототип позволяет пользователям моделировать внешние экономические шоки и просматривать автоматические прогнозы финансовой устойчивости контрагента на основе ИИ-скоринга.
                  </p>
                </div>
                
                {/* Visual state badge */}
                <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-mono font-bold border border-emerald-150/45 shrink-0">
                  ● Подключено к ядру v2
                </div>
              </div>

              {/* Simulation Selectors Tab */}
              <div className="flex border-b border-slate-205 dark:border-slate-800 p-0.5 gap-2 overflow-x-auto scrollbar-none">
                {[
                  { id: 'cashflow', name: 'Нейро-прогноз Потоков (2026)', icon: ArrowLeftRight },
                  { id: 'aiReport', name: 'ИИ-Экспертиза (Gemini)', icon: Sparkles },
                  { id: 'stressTest', name: 'Интерактивный Стресс-Тест шоков', icon: ShieldAlert }
                ].map((itab) => {
                  const Icon = itab.icon;
                  const isActive = forecastSimulationTab === itab.id;
                  return (
                    <button
                      key={itab.id}
                      onClick={() => setForecastSimulationTab(itab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isActive 
                          ? 'border-indigo-650 text-indigo-705 dark:text-indigo-400 font-extrabold' 
                          : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{itab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Simulation Content Render */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2.5xl border border-slate-200/70 dark:border-slate-850 shadow-xs min-h-[250px]">
                
                {/* Option 1: Cash flow predictions */}
                {forecastSimulationTab === 'cashflow' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-1">
                      <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-205 tracking-wider font-sans">Симуляция движения денежных средств (DS Cash Flow Prediction 2026-2027)</h4>
                      <span className="text-[10px] font-bold text-slate-450 font-mono">Доверительный интервал модели: 97.4%</span>
                    </div>

                    <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                      Математическая симуляция кассовых разрывов на основе исторических циклов поступлений и регулярных расходов. Позволяет превентивно оценивать пропускную способность долгов.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                      <div className="p-4 bg-emerald-50/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Чистый Поток Кэша (Predictive CF)</span>
                        <div className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-1 font-mono">+12.4 млн ₽</div>
                        <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">Внешние привлеченные ресурсы не требуются. Риск отсутствует.</span>
                      </div>

                      <div className="p-4 bg-amber-50/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Прогноз дебиторки</span>
                        <div className="text-base font-black text-amber-700 dark:text-amber-400 mt-1 font-mono">4.1 млн ₽</div>
                        <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">Вероятная задержка платежей лизингополучателями.</span>
                      </div>

                      <div className="p-4 bg-sky-50/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
                        <span className="text-[9.5px] uppercase font-bold text-slate-400 block font-mono">Коэффициент Устойчивости Монте-Карло</span>
                        <div className="text-base font-black text-indigo-700 dark:text-indigo-400 mt-1 font-mono">92.4 %</div>
                        <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">Сезонный тренд защищен от курсовых колебаний.</span>
                      </div>
                    </div>

                    {/* Step milestones */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] uppercase font-black text-slate-400 font-mono block">Маркеры критического периода (Квартальные кассовые аномалии):</span>
                      <ul className="space-y-2 mt-2 text-xs">
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><b>I Квартал 2026:</b> Временное сокращение ОДС за счет авансирования лизинговых контрактов (вероятность 11%).</span>
                        </li>
                        <li className="flex items-center gap-2.5 border-t border-slate-50 dark:border-slate-850 pt-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><b>III Квартал 2026:</b> Сезонный профицит кэш-флоу в размере +14.8 млн рублей за счет закрытия реестров (вероятность 74%).</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Option 2: AI Summarization using Gemini */}
                {forecastSimulationTab === 'aiReport' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-indigo-900 dark:text-indigo-400 tracking-wider font-sans">Автоматический Кредитный Аудит (ИИ Модель Gemini 2.5 Flash)</h4>
                      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-705 border border-indigo-150 rounded text-[9px] font-mono tracking-wider uppercase font-black">AI Консультант</span>
                    </div>

                    <blockquote className="border-l-3 border-indigo-600 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-r-2xl font-sans text-xs italic leading-relaxed text-slate-800 dark:text-slate-200">
                      «На основе парсинга судебных решений и анализа платежной дисциплины за III кв 2025 – I кв 2026 гг., ИИ оценивает финансовую устойчивость контрагента как стабильную в пределах среднесрочного горизонта. Сдерживающим фактором выступает высокая зависимость от заемного капитала коммерческих банков, что повышает чувствительность к удорожанию ставок рефинансирования ЦБ.»
                    </blockquote>

                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Сильные и слабые стороны (Нейро-СВОТ):</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="space-y-1.5 bg-emerald-50/15 border border-emerald-100/30 p-3 rounded-2xl">
                          <span className="text-[9.5px] uppercase font-black text-emerald-800 font-mono block">Сильные стороны (Strengths)</span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">• Высокий коэффициент покрытия ликвидности (2.4)</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">• Отсутствие претензий со стороны ИФНС и заблокированных счетов</p>
                        </div>
                        <div className="space-y-1.5 bg-rose-50/15 border border-rose-100/30 p-3 rounded-2xl">
                          <span className="text-[9.5px] uppercase font-black text-rose-800 font-mono block">Риски и Угрозы (Threats)</span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">• Повышенный уровень дебиторской задолженности (доля в балансе 38%)</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">• Потенциальное снижение индекса ликвидности в затяжных судебных спорах</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Option 3: Interactive Stress-Testing */}
                {forecastSimulationTab === 'stressTest' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-850 dark:text-slate-205 tracking-wider font-sans">Сценарий внешних шоков: Тестирование предела прочности</h4>
                      <p className="text-[11px] text-slate-405 mt-1 font-sans">Оцените вероятность дефолта в реальном времени, регулируя экономические шоковые показатели.</p>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
                        
                        {/* Sliders setup */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase font-mono text-[9.5px]">1. Налоговое бремя (Ставка, %):</span>
                            <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-extrabold">20%</strong>
                          </div>
                          <input 
                            type="range" 
                            min="13" 
                            max="45" 
                            disabled
                            value="20"
                            className="w-full h-1.5 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-not-allowed opacity-60 accent-indigo-650"
                          />
                          <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                            <span>13% (Базовый)</span>
                            <span>45% (Предельный)</span>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase font-mono text-[9.5px]">2. Ключевая Ставка Центробанка РФ:</span>
                            <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-extrabold">16 %</strong>
                          </div>
                          <input 
                            type="range" 
                            min="8" 
                            max="28" 
                            disabled
                            value="16"
                            className="w-full h-1.5 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-not-allowed opacity-60 accent-indigo-650"
                          />
                          <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                            <span>8% (Низкий спред)</span>
                            <span>28% (Экстремальный)</span>
                          </div>
                        </div>

                      </div>

                      {/* Output calculated risk */}
                      <div className="p-4.5 rounded-2.5xl border border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition duration-150 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                        <div className="space-y-1">
                          <span className="text-[9px] tracking-wider uppercase font-bold font-mono">Рассчитанная вероятность дефолта / банкротства:</span>
                          <strong className="text-sm tracking-tight block font-sans">Низкий риск дефолта (Стабильный скоринг)</strong>
                          <p className="text-[10px] opacity-75 font-sans leading-tight">При введении данных шоков прогноз снижения автономии ликвидности составляет всего 2.1%. Запас прочности превышает нормативы.</p>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <strong className="text-xl md:text-2xl font-mono font-black">1.8%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Modal Bottom Sticky Footer */}
            <div className="bg-slate-50 dark:bg-slate-900 p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
              <span className="text-[10px] text-slate-400 select-none">
                *Экспорт аналитики производится по стандарту Базель III для риск-менеджеров.
              </span>
              
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => {
                    alert('Запрос на скачивание полного отчета прогнозирования (PDF) отправлен на вашу почту!');
                  }}
                  className="px-4.5 py-2.5 border border-indigo-200 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-black uppercase rounded-xl transition cursor-pointer text-center flex-grow sm:flex-grow-0"
                >
                  Экспорт отчета (.PDF)
                </button>
                
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black uppercase rounded-xl shadow-md transition cursor-pointer text-center flex-grow sm:flex-grow-0"
                >
                  Закрыть прототип
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
