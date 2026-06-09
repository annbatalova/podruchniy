import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Plus, 
  FileText, 
  AlertTriangle, 
  Users, 
  Settings, 
  FolderPlus, 
  Grid,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { NewsItem, MOCK_NEWS_DATA } from './NewsView';

// Default categories corresponding to NewsView.tsx constants
const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'Все материалы' },
  { id: 'company_news', name: 'Новости компаний' },
  { id: 'market_analytics', name: 'Аналитика рынка' },
  { id: 'taxes_and_regulations', name: 'Налоги и регуляторика' },
  { id: 'cases_interviews', name: 'Кейсы и интервью' },
  { id: 'guides_tutorials', name: 'Инструкции и гайды' }
];

interface ModeratorViewProps {
  onSelectCompany: (id: string) => void;
  onGoToNews: () => void;
  onEnterBentoEditMode: () => void;
}

export interface CarouselConfig {
  id: string;
  categoryId: string;
  articleIds: string[];
}

export default function ModeratorView({
  onSelectCompany,
  onGoToNews,
  onEnterBentoEditMode
}: ModeratorViewProps) {
  // Navigation tabs within Moderator Room
  const [activeTab, setActiveTab] = useState<'submissions' | 'deletions' | 'categories' | 'bento' | 'carousels'>('submissions');
  
  // State for loaded data
  const [publications, setPublications] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [customSpans, setCustomSpans] = useState<Record<string, number>>({});

  // Carousel setup states
  const [carousels, setCarousels] = useState<CarouselConfig[]>([
    { id: 'carousel_1', categoryId: 'company_news', articleIds: [] },
    { id: 'carousel_2', categoryId: 'market_analytics', articleIds: [] },
    { id: 'carousel_3', categoryId: 'taxes_and_regulations', articleIds: [] }
  ]);
  const [carouselError, setCarouselError] = useState('');
  const [carouselSuccess, setCarouselSuccess] = useState('');

  // Form states
  const [rejectingPubId, setRejectingPubId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewPub, setPreviewPub] = useState<any | null>(null);

  // Recommendations selection states
  const [selectedRecIds, setSelectedRecIds] = useState<string[]>(['', '', '']);

  // Recommendations search and filter states
  const [recSearchQuery, setRecSearchQuery] = useState('');
  const [recSelectedCategory, setRecSelectedCategory] = useState('all');

  useEffect(() => {
    if (previewPub) {
      setSelectedRecIds(previewPub.recommendedIds || ['', '', '']);
    } else {
      setSelectedRecIds(['', '', '']);
    }
    setRecSearchQuery('');
    setRecSelectedCategory('all');
  }, [previewPub]);

  // Categories form states
  const [newCatName, setNewCatName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  // Category deletion & replacement states
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [replacementCatId, setReplacementCatId] = useState<string>('all');

  // Combined list of all active articles for recommendations dropdown selection
  const allActiveArticles = React.useMemo(() => {
    const publishedCustom = publications.filter(p => !p.status || p.status === 'published');
    return [...publishedCustom, ...MOCK_NEWS_DATA];
  }, [publications]);

  const selectableArticles = React.useMemo(() => {
    if (!previewPub) return allActiveArticles;
    return allActiveArticles.filter((item: any) => item.id !== previewPub.id);
  }, [allActiveArticles, previewPub]);

  const filteredSelectableArticles = React.useMemo(() => {
    return selectableArticles.filter((art: any) => {
      // Filter by category
      if (recSelectedCategory !== 'all' && art.category !== recSelectedCategory) {
        return false;
      }
      // Filter by search query
      if (recSearchQuery.trim()) {
        const q = recSearchQuery.toLowerCase();
        const matchesTitle = art.title?.toLowerCase().includes(q);
        const matchesSummary = art.summary?.toLowerCase().includes(q);
        const matchesAuthor = `${art.author?.firstName || ''} ${art.author?.lastName || ''}`.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });
  }, [selectableArticles, recSearchQuery, recSelectedCategory]);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  const loadAllData = () => {
    // 1. Custom publications
    try {
      const pubsSaved = localStorage.getItem('custom_publications');
      setPublications(pubsSaved ? JSON.parse(pubsSaved) : []);
    } catch (e) {
      console.error(e);
    }

    // 2. Categories
    try {
      const catsSaved = localStorage.getItem('news_categories');
      setCategories(catsSaved ? JSON.parse(catsSaved) : DEFAULT_CATEGORIES);
    } catch (e) {
      console.error(e);
    }

    // 3. Bento spans
    try {
      const spansSaved = localStorage.getItem('custom_bento_spans');
      setCustomSpans(spansSaved ? JSON.parse(spansSaved) : {});
    } catch (e) {
      console.error(e);
    }

    // 4. Carousels config
    try {
      const carouselSaved = localStorage.getItem('home_carousels_config');
      if (carouselSaved) {
        setCarousels(JSON.parse(carouselSaved));
      } else {
        setCarousels([
          { id: 'carousel_1', categoryId: 'company_news', articleIds: [] },
          { id: 'carousel_2', categoryId: 'market_analytics', articleIds: [] },
          { id: 'carousel_3', categoryId: 'taxes_and_regulations', articleIds: [] }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCarouselCategoryChange = (id: string, nextCatId: string) => {
    setCarousels(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          categoryId: nextCatId,
          articleIds: [] // Clear selected articles when category changes, forcing 3-5 new ones
        };
      }
      return c;
    }));
  };

  const handleToggleArticleInCarousel = (carouselId: string, articleId: string) => {
    setCarousels(prev => prev.map(c => {
      if (c.id === carouselId) {
        const isSelected = c.articleIds.includes(articleId);
        let nextIds = [...c.articleIds];
        if (isSelected) {
          nextIds = nextIds.filter(id => id !== articleId);
        } else {
          if (nextIds.length >= 5) {
            return c; // already maximum 5 items
          }
          nextIds.push(articleId);
        }
        return {
          ...c,
          articleIds: nextIds
        };
      }
      return c;
    }));
  };

  const handleSaveCarousels = () => {
    for (let idx = 0; idx < carousels.length; idx++) {
      const carousel = carousels[idx];
      const categoryName = categories.find(cat => cat.id === carousel.categoryId)?.name || carousel.categoryId;
      if (!carousel.categoryId || carousel.categoryId === 'all') {
        setCarouselError(`Пожалуйста, выберите конкретную категорию для Карусели #${idx + 1}.`);
        setCarouselSuccess('');
        return;
      }
      if (carousel.articleIds.length < 3 || carousel.articleIds.length > 5) {
        setCarouselError(`Для Карусели #${idx + 1} («${categoryName}») должно быть выбрано от 3 до 5 новостей. Сейчас выбрано: ${carousel.articleIds.length}.`);
        setCarouselSuccess('');
        return;
      }
    }

    try {
      localStorage.setItem('home_carousels_config', JSON.stringify(carousels));
      setCarouselError('');
      setCarouselSuccess('Настройки каруселей успешно сохранены!');
      setTimeout(() => setCarouselSuccess(''), 3500);
    } catch (e) {
      setCarouselError('Не удалось сохранить настройки каруселей.');
      setCarouselSuccess('');
    }
  };

  // ----- MODERATION PROCEDURES -----
  
  // Approve and publish article
  const handleApproveArticle = (id: string) => {
    const updated = publications.map(pub => {
      if (pub.id === id) {
        return { 
          ...pub, 
          status: 'published', 
          moderatorComment: undefined,
          recommendedIds: selectedRecIds.filter(Boolean)
        };
      }
      return pub;
    });
    localStorage.setItem('custom_publications', JSON.stringify(updated));
    setPublications(updated);
    setPreviewPub(null);
    alert('Статья успешно опубликована со списком рекомендованных материалов!');
  };

  // Update recommendations for already approved/published article
  const handleUpdateRecommendations = (id: string) => {
    const updated = publications.map(pub => {
      if (pub.id === id) {
        return { 
          ...pub, 
          recommendedIds: selectedRecIds.filter(Boolean) 
        };
      }
      return pub;
    });
    localStorage.setItem('custom_publications', JSON.stringify(updated));
    setPublications(updated);
    const target = updated.find(p => p.id === id);
    setPreviewPub(target);
    alert('Рекомендованные публикации успешно обновлены!');
  };

  // Turn down article with explanation
  const handleRejectArticle = (id: string) => {
    if (!rejectReason.trim()) {
      alert('Пожалуйста, укажите причину отклонения публикации.');
      return;
    }

    const updated = publications.map(pub => {
      if (pub.id === id) {
        return { ...pub, status: 'rejected', moderatorComment: rejectReason.trim() };
      }
      return pub;
    });

    localStorage.setItem('custom_publications', JSON.stringify(updated));
    setPublications(updated);
    setRejectingPubId(null);
    setRejectReason('');
    setPreviewPub(null);
    alert('Статья возвращена автору на доработку с указанием причин.');
  };

  // ----- DELETION PROCEDURES -----
  const handleApproveDeletion = (id: string) => {
    // Set status to 'deleted' and clear deleteRequested attributes to move it to the archive instead of full erase
    const updated = publications.map(pub => {
      if (pub.id === id) {
        return {
          ...pub,
          status: 'deleted',
          deleteRequested: false,
          deleteRequestReason: undefined
        };
      }
      return pub;
    });
    localStorage.setItem('custom_publications', JSON.stringify(updated));
    setPublications(updated);
    alert('Статья успешно удалена из общей новостной ленты и перемещена в архив автора.');
  };

  const handleRejectDeletion = (id: string) => {
    // Keep target custom publication and reset delete request status
    const updated = publications.map(pub => {
      if (pub.id === id) {
        return { ...pub, deleteRequested: false, deleteRequestReason: undefined };
      }
      return pub;
    });
    localStorage.setItem('custom_publications', JSON.stringify(updated));
    setPublications(updated);
    alert('В запросе на удаление отказано. Статья сохранена в общей новостной ленте.');
  };

  // ----- CATEGORY PROCEDURES -----
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    setCategorySuccess('');

    const parsedName = newCatName.trim();

    if (!parsedName) {
      setCategoryError('Укажите название категории.');
      return;
    }

    const translit = (str: string) => {
      const ru: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return str.toLowerCase().split('').map(char => ru[char] ?? char).join('')
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .trim();
    };

    let generatedId = translit(parsedName);
    if (!generatedId || generatedId === '_') {
      generatedId = `cat_${Date.now()}`;
    } else {
      if (categories.some(c => c.id === generatedId)) {
        generatedId = `${generatedId}_${Date.now().toString().slice(-4)}`;
      }
    }

    const updated = [...categories, { id: generatedId, name: parsedName }];
    localStorage.setItem('news_categories', JSON.stringify(updated));
    setCategories(updated);
    setNewCatName('');
    setCategorySuccess(`Категория «${parsedName}» успешно создана!`);
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') {
      alert('Раздел «Все материалы» является служебным и не подлежит скрытию или удалению.');
      return;
    }
    
    setDeletingCatId(id);
    const fallback = categories.find(c => c.id !== id)?.id || 'all';
    setReplacementCatId(fallback);
  };

  const confirmDeleteCategory = () => {
    if (!deletingCatId) return;

    // Filter categories
    const updatedCategories = categories.filter(c => c.id !== deletingCatId);
    localStorage.setItem('news_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);

    // Re-assign articles linked to the deleted category
    const updatedPubs = publications.map(pub => {
      if (pub.category === deletingCatId) {
        return { ...pub, category: replacementCatId };
      }
      return pub;
    });
    localStorage.setItem('custom_publications', JSON.stringify(updatedPubs));
    setPublications(updatedPubs);

    const deletedName = categories.find(c => c.id === deletingCatId)?.name || deletingCatId;
    const replacementName = categories.find(c => c.id === replacementCatId)?.name || replacementCatId;
    alert(`Категория «${deletedName}» удалена. Связанные статьи перенесены в категорию «${replacementName}».`);

    setDeletingCatId(null);
  };

  const handleResetCategories = () => {
    if (confirm('Сбросить все категории на предустановленный системный шаблон?')) {
      localStorage.setItem('news_categories', JSON.stringify(DEFAULT_CATEGORIES));
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  // Sort custom publications by state
  const pendingSubmissions = publications.filter(p => p.status === 'pending');
  const finishedSubmissions = publications.filter(p => p.status === 'published' || p.status === 'rejected' || p.status === 'deleted');
  const deletionRequests = publications.filter(p => p.deleteRequested === true);

  return (
    <div className="space-y-6 font-sans">
      
      {/* 2. TAB TOGGLES */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-full flex-wrap gap-0.5 border border-slate-200/50">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer select-none border-0 ${
            activeTab === 'submissions'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-500" />
          <span>Статьи на премодерации ({pendingSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deletions')}
          className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer select-none border-0 ${
            activeTab === 'deletions'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Заявки на удаление ({deletionRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer select-none border-0 ${
            activeTab === 'categories'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <FolderPlus className="w-4 h-4 text-emerald-500" />
          <span>Категории портала ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bento')}
          className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer select-none border-0 ${
            activeTab === 'bento'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Grid className="w-4 h-4 text-sky-500" />
          <span>Бенто-сетка</span>
        </button>

        <button
          onClick={() => setActiveTab('carousels')}
          className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer select-none border-0 ${
            activeTab === 'carousels'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Настройка каруселей</span>
        </button>
      </div>

      {/* 3. TAB VIEWS */}
      
      {/* Tab A: PREMODERATION SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Очередь входящих публикаций {pendingSubmissions.length > 0 && `(${pendingSubmissions.length})`}
            </h3>

            {pendingSubmissions.length === 0 ? (
              <div className="bg-white border border-slate-200/60 border-dashed rounded-2xl p-16 text-center text-xs text-slate-400 font-medium font-sans">
                Заявок на публикацию в данный момент не зафиксировано.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((pub) => (
                  <div key={pub.id} className="bg-white p-5 rounded-2xl border border-slate-200/60 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/55 text-[9px] font-mono font-black uppercase rounded-lg">
                          На модерации
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">
                          {pub.date}
                        </span>
                        <span className="text-[10px] text-indigo-650 font-extrabold bg-indigo-50/65 px-2 py-0.5 rounded-lg font-sans">
                          {categories.find(c => c.id === pub.category)?.name || pub.category}
                        </span>
                      </div>
                      <h4 className="font-sans font-black text-sm text-slate-900 leading-snug line-clamp-2">
                        {pub.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans line-clamp-2 font-medium">
                        {pub.summary}
                      </p>
                      
                      {/* Author detail */}
                      <div className="flex items-center gap-2 pt-1.5">
                        <div className={`${pub.author?.avatarUrl || 'bg-indigo-600'} w-6 h-6 rounded-lg text-white font-black text-[9px] flex items-center justify-center`}>
                          {(pub.author?.firstName?.charAt(0) || '')}{(pub.author?.lastName?.charAt(0) || '') || '?'}
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold font-sans">
                          Автор: {pub.author?.firstName || 'Автор'} {pub.author?.lastName || ''} ({pub.author?.role || 'Пользователь'})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto self-stretch md:self-auto justify-end">
                      <button
                        onClick={() => {
                          setPreviewPub(pub);
                          setRejectingPubId(null);
                        }}
                        className="py-2.5 px-3.5 text-[10.5px] font-black bg-slate-100 hover:bg-slate-200 text-slate-705 transition rounded-xl flex items-center gap-1.5 cursor-pointer outline-none border-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Предпросмотр</span>
                      </button>
                      
                      <button
                        onClick={() => handleApproveArticle(pub.id)}
                        className="py-2.5 px-3.5 text-[10.5px] font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition rounded-xl flex items-center gap-1.5 cursor-pointer outline-none border-0"
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Одобрить</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Already Published list */}
            <div className="space-y-4 pt-6 mt-6 border-t border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                <span>Опубликованные новости контрагентов ({publications.filter(p => !p.status || p.status === 'published').length})</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed font-sans">
                Выберите из списка ниже любую опубликованную пользователями статью, чтобы отредактировать рекомендации для блока «Ещё интересное».
              </p>
              
              {publications.filter(p => !p.status || p.status === 'published').length === 0 ? (
                <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-2xl p-10 text-center text-xs text-slate-400 font-medium font-sans">
                  Нет опубликованных статей для детального редактирования.
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 style-scrollbar">
                  {publications.filter(p => !p.status || p.status === 'published').map((pub) => (
                    <div key={pub.id} className="bg-white p-4 rounded-xl border border-slate-200/60 hover:shadow-xs transition flex justify-between items-center gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9.5px] text-slate-400 font-mono font-bold">{pub.date}</span>
                          <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100/30 px-1.5 py-0.5 rounded-lg font-sans">
                            {categories.find(c => c.id === pub.category)?.name || pub.category}
                          </span>
                        </div>
                        <h4 className="font-sans font-black text-xs text-slate-800 truncate">
                          {pub.title}
                        </h4>
                        {pub.recommendedIds && pub.recommendedIds.length > 0 ? (
                          <div className="text-[10px] text-indigo-650 font-bold flex items-center gap-1">
                            <span>✓ Выбрано рекомендаций: {pub.recommendedIds.length}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <span>💡 Будут подобраны автоматически</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setPreviewPub(pub);
                          setRejectingPubId(null);
                        }}
                        className="py-1.5 px-2.5 text-[10px] font-black bg-indigo-50 hover:bg-indigo-150 text-indigo-650 transition rounded-lg border-0 cursor-pointer"
                      >
                        Рекомендации
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column: previewing pending submissions */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-sans font-black text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Окно детального просмотра</span>
            </h3>
            
            {previewPub ? (
              <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100/50 text-[9px] font-sans font-black uppercase rounded-lg tracking-wider">
                    {categories.find(c => c.id === previewPub.category)?.name || previewPub.category}
                  </span>
                  <h4 className="font-sans font-black text-sm text-slate-900 leading-snug mt-2">{previewPub.title}</h4>
                  <span className="block text-[10px] font-bold text-slate-400 mt-1">Дата создания: {previewPub.date}</span>
                </div>

                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 style-scrollbar">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="block text-[9px] font-black text-slate-450 uppercase mb-1 font-sans">Краткая аннотация:</span>
                    <p className="text-[11px] text-slate-600 leading-normal italic font-sans font-medium">{previewPub.summary}</p>
                  </div>

                  <div className="space-y-4">
                    <span className="block text-[9px] font-extrabold text-indigo-600 uppercase tracking-wider font-sans">Блоки конструктора статьи:</span>
                    {previewPub.blocks?.map((block: any, bIdx: number) => (
                      <div key={block.id || bIdx} className="bg-slate-50 p-3 rounded-xl space-y-1">
                        <span className="block text-[8.5px] font-mono uppercase text-slate-400 font-black">Блок #{bIdx + 1}: {block.type}</span>
                        {block.type.startsWith('heading_') ? (
                          <h5 className="font-black text-xs text-slate-800 font-sans">{block.content}</h5>
                        ) : block.type === 'company_card' ? (
                          <div className="bg-indigo-50 text-indigo-700 rounded-lg p-2 text-[9.5px] font-bold">Карточка ИНН: {block.companyId}</div>
                        ) : block.type === 'file_download' ? (
                          <div className="bg-emerald-50 text-emerald-800 rounded-lg p-2 text-[9.5px] font-bold">Скачивание файла: {block.fileName}</div>
                        ) : (
                          <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans font-medium">{block.content}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Select Recommended Articles Block */}
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-3.5 shadow-3xs">
                    <span className="block text-[10px] font-black uppercase text-indigo-650 tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                       Выбор «Ещё интересное» (3 публ.)
                    </span>
                    <p className="text-[10px] text-slate-500 leading-normal font-sans font-medium">
                      Выберите три публикации, которые появятся после статьи в разделе «Рекомендуем прочитать»:
                    </p>

                    {/* Search & Tag Filter controls */}
                    <div className="space-y-2 bg-white p-2.5 rounded-xl border border-slate-200/50">
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={recSearchQuery}
                            onChange={(e) => setRecSearchQuery(e.target.value)}
                            placeholder="Поиск по названию, тексту или автору..."
                            className="w-full bg-slate-50 border border-slate-200/85 focus:border-indigo-500 rounded-lg pl-7 pr-3 py-1 text-[10.5px] font-sans font-medium text-slate-800 focus:outline-none"
                          />
                          <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {recSearchQuery && (
                          <button
                            onClick={() => setRecSearchQuery('')}
                            className="text-[9.5px] text-slate-500 hover:text-slate-800 bg-slate-100 px-1.5 py-1 rounded border-0 cursor-pointer font-sans"
                          >
                            Сбросить
                          </button>
                        )}
                      </div>

                      {/* Filter tag pills */}
                      <div className="flex flex-wrap gap-1 pt-0.5 max-h-[85px] overflow-y-auto style-scrollbar">
                        {categories.map((cat) => {
                          const isSelected = recSelectedCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setRecSelectedCategory(cat.id)}
                              className={`px-2 py-0.5 rounded text-[9px] font-extrabold transition border-0 cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                              }`}
                            >
                              {cat.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      {[0, 1, 2].map((idx) => {
                        const currentSelectedId = selectedRecIds[idx] || '';
                        // Create options list for this select to preserve currently selected option even if filtered
                        let selectOptions = [...filteredSelectableArticles];
                        if (currentSelectedId && !selectOptions.some(art => art.id === currentSelectedId)) {
                          const original = selectableArticles.find(art => art.id === currentSelectedId);
                          if (original) {
                            selectOptions.push(original);
                          }
                        }

                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-[9px] font-bold text-slate-650">
                                Рекомендация #{idx + 1}
                              </label>
                              {currentSelectedId && (
                                <button
                                  onClick={() => {
                                    setSelectedRecIds(prev => {
                                      const copy = [...prev];
                                      copy[idx] = '';
                                      return copy;
                                    });
                                  }}
                                  className="text-[9px] text-rose-500 hover:underline hover:text-rose-600 bg-transparent border-0 cursor-pointer p-0 font-bold"
                                >
                                  Очистить
                                </button>
                              )}
                            </div>
                            <select
                              value={currentSelectedId}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSelectedRecIds(prev => {
                                  const copy = [...prev];
                                  copy[idx] = val;
                                  return copy;
                                });
                              }}
                              className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-[11px] font-sans font-medium text-slate-850 focus:ring-1 focus:ring-indigo-150 focus:outline-none cursor-pointer"
                            >
                              <option value="">-- Не выбрано (случайный подбор) --</option>
                              {selectOptions.map(art => (
                                <option key={art.id} value={art.id}>
                                  {art.title} ({categories.find(c => c.id === art.category)?.name || 'Общее'})
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {rejectingPubId === previewPub.id ? (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                    <span className="block text-[10px] font-black text-rose-700 uppercase tracking-wider">Причина отклонения публикации:</span>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Пример: Уточните формулы по расчету прибыльности или прикрепите подтверждающие документы."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-100 focus:outline-none min-h-[90px] font-sans font-medium text-slate-800"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectArticle(previewPub.id)}
                        className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition active:scale-95 border-0 cursor-pointer shadow-sm"
                      >
                        Вернуть на доработку
                      </button>
                      <button
                        onClick={() => setRejectingPubId(null)}
                        className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold rounded-xl transition border-0 cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : previewPub.status === 'published' ? (
                  <div className="pt-2">
                    <button
                      onClick={() => handleUpdateRecommendations(previewPub.id)}
                      className="w-full py-2.5 text-xs font-black bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl transition duration-150 cursor-pointer text-center active:scale-97 border-0 shadow-md"
                    >
                      Сохранить рекомендации
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleApproveArticle(previewPub.id)}
                      className="w-1/2 py-2.5 text-xs font-black bg-indigo-650 hover:bg-indigo-700 text-white border-0 rounded-xl transition duration-150 cursor-pointer text-center active:scale-95"
                    >
                      Опубликовать
                    </button>
                    <button
                      onClick={() => {
                        setRejectingPubId(previewPub.id);
                        setRejectReason('');
                      }}
                      className="w-1/2 py-2.5 text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl transition duration-150 cursor-pointer text-center active:scale-95"
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-3xl p-10 text-center text-xs text-slate-400 font-medium font-sans">
                Выберите входящую статью из левого списка, чтобы изучить конструктор блоков Notion перед вынесением вердикта.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab B: DELETION REQUESTS */}
      {activeTab === 'deletions' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Запросы авторов на удаление верифицированных статей ({deletionRequests.length})
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Ознакомьтесь с обоснованиями правообладателей о снятии материалов с публикации в новостной ленте.
            </p>
          </div>

          {deletionRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-16 text-center text-xs text-slate-400 font-sans">
              Активных требований на удаление контента от авторов сейчас нет.
            </div>
          ) : (
            <div className="space-y-3">
              {deletionRequests.map((req) => (
                <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in">
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-mono font-black uppercase rounded-lg">
                        Требуется удаление
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">ID: {req.id}</span>
                    </div>
                    <h4 className="font-sans font-black text-xs md:text-sm text-slate-900 leading-tight">
                      {req.title}
                    </h4>
                    
                    <div className="bg-rose-50/40 rounded-xl p-3 border border-rose-100/50">
                      <span className="block text-[9.5px] font-black text-rose-800 uppercase mb-1">Причина удаления от автора:</span>
                      <p className="text-[11px] text-rose-900 font-medium leading-snug">{req.deleteRequestReason || 'Причина не указана (заказное удаление)'}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <div className={`${req.author?.avatarUrl || 'bg-indigo-600'} w-5 h-5 rounded-md text-white font-black text-[8.5px] flex items-center justify-center`}>
                        {(req.author?.firstName?.charAt(0) || '')}{(req.author?.lastName?.charAt(0) || '') || '?'}
                      </div>
                      <span className="text-[10.5px] text-slate-500 font-bold font-sans">
                        Уполномоченный автор: {req.author?.firstName || 'Автор'} {req.author?.lastName || ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-end">
                    <button
                      onClick={() => handleApproveDeletion(req.id)}
                      className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold leading-none cursor-pointer transition shadow-sm border-0"
                    >
                      Подтвердить удаление
                    </button>
                    <button
                      onClick={() => handleRejectDeletion(req.id)}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold leading-none cursor-pointer transition border-0"
                    >
                      Отклонить запрос
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab C: CATEGORIES EDITING */}
      {activeTab === 'categories' && (
        <div className="relative">
          {/* Deletion & Replacement Modal */}
          {deletingCatId && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl border border-slate-200/80 max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Удаление категории</h4>
                    <p className="text-xs text-rose-600 font-semibold leading-relaxed">
                      Вы действительно хотите удалить категорию «{categories.find(c => c.id === deletingCatId)?.name}»?
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                  <span className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Выберите замену для связанных статей:
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium">
                    Все статьи, которые в данный момент привязаны к удаляемому разделу, будут незамедлительно перенесены в выбранную ниже категорию.
                  </p>
                  <select
                    value={replacementCatId}
                    onChange={(e) => setReplacementCatId(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-2.5 text-xs font-sans font-extrabold text-slate-800 focus:ring-2 focus:ring-indigo-150 focus:outline-none cursor-pointer"
                  >
                    {categories
                      .filter(c => c.id !== deletingCatId)
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={confirmDeleteCategory}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition cursor-pointer border-0 shadow-sm active:scale-95 duration-100"
                  >
                    Удалить и перенести статьи
                  </button>
                  <button
                    onClick={() => setDeletingCatId(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition cursor-pointer border-0 active:scale-95 duration-100"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New category creation form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 h-max">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 leading-none">
                <FolderPlus className="w-5 h-5 text-emerald-500" />
                <span>Создать категорию</span>
              </h3>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Название категории</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Пример: Мировые тренды"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-sans font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-150 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                {categoryError && (
                  <p className="text-[11px] text-rose-600 font-bold">{categoryError}</p>
                )}
                {categorySuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold">{categorySuccess}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Зарегистрировать категорию</span>
                </button>
              </form>
            </div>

            {/* Existing active categories */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Зарегистрированные категории СМИ
                </h3>
                <button
                  onClick={handleResetCategories}
                  className="text-[10px] hover:underline hover:text-indigo-605 text-slate-400 font-bold cursor-pointer bg-transparent border-0"
                >
                  Сбросить к заводским
                </button>
              </div>

              <p className="text-[11.5px] text-slate-400 font-medium leading-relaxed font-sans">
                Добавленные категории незамедлительно станут активными как фильтры в общей ленте новостей и будут доступны авторам при сборке статей в конструкторе.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {categories.map((cat) => {
                  const isSystem = cat.id === 'all';
                  return (
                    <div key={cat.id} className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/40 flex items-center justify-between gap-3 transition">
                      <div>
                        <span className="block text-[11.5px] font-black text-slate-800 font-sans">{cat.name}</span>
                      </div>
                      
                      {!isSystem ? (
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="py-1.5 px-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-lg text-[10px] font-semibold transition cursor-pointer font-sans"
                          title="Удалить категорию"
                        >
                          Удалить
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono uppercase bg-slate-200/60 text-slate-500 rounded px-1.5 py-0.5 font-bold">
                          Системный
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab D: BENTO GRID CONTROLLER */}
      {activeTab === 'bento' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Grid className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">Трансформируемый интерфейс бенто-сетки</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-3xl font-medium">
                Модератор может динамически задавать ширину любого новостного блока (1x, 2x, или 3x колонки) прямо в визуальной ленте публикаций. 
                Это обеспечивает безупречное сочетание макетов и адаптивного ритма по вашему выбору.
              </p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-xl space-y-4">
            <h4 className="font-extrabold text-xs text-indigo-950 uppercase">Редактор сетки публикаций</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-xs text-slate-650 leading-relaxed font-sans font-medium">
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  Шаг 1: Нажмите кнопку ниже для перехода в Новости.
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  Шаг 2: Система автоматически включит визуальные редакторы блоков.
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  Шаг 3: Используйте плавающие кнопки 1x/2x/3x над каждым блоком!
                </p>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={onEnterBentoEditMode}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/10 flex items-center gap-2 transition cursor-pointer active:scale-97 border-0"
                >
                  <Grid className="w-4 h-4 text-white" />
                  <span>Включить раскладку бенто-сетки в СМИ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab E: CAROUSELS CONFIGURATOR */}
      {activeTab === 'carousels' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Sparkles className="w-6 h-6 animate-pulse text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">Управление каруселями на главной странице</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-3xl font-medium">
                Выберите категорию для каждой из трех каруселей на главной странице СМИ и укажите от 3 до 5 новостей, которые будут сменяться в слайдере.
              </p>
            </div>
          </div>

          {carouselError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{carouselError}</span>
            </div>
          )}

          {carouselSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{carouselSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((idx) => {
              const carousel = carousels[idx];
              const availableCategories = categories.filter(c => c.id !== 'all');
              // Articles in allActiveArticles that match this category
              const matchingArticles = allActiveArticles.filter(art => art.category === carousel.categoryId);

              return (
                <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-xs font-black uppercase text-indigo-850 tracking-wider">
                        Карусель #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        carousel.articleIds.length >= 3 && carousel.articleIds.length <= 5
                          ? 'bg-emerald-150 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Выбрано: {carousel.articleIds.length} из 5
                      </span>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-550">
                        Категория карусели:
                      </label>
                      <select
                        value={carousel.categoryId}
                        onChange={(e) => handleCarouselCategoryChange(carousel.id, e.target.value)}
                        className="w-full bg-white border border-slate-250 focus:border-indigo-500 rounded-xl px-3 py-2 text-[11.5px] font-sans font-medium text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {availableCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Articles Checkboxes List */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-[11px] font-bold text-slate-550">
                          Выберите статьи для показа (3-5 шт.):
                        </label>
                        {carousel.articleIds.length > 0 && (
                          <button
                            onClick={() => {
                              setCarousels(prev => prev.map(c => c.id === carousel.id ? { ...c, articleIds: [] } : c));
                            }}
                            className="text-[9.5px] text-rose-500 hover:underline border-0 bg-transparent cursor-pointer p-0 font-bold"
                          >
                            Сбросить
                          </button>
                        )}
                      </div>

                      {matchingArticles.length === 0 ? (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-[10.5px] text-slate-400 font-sans">
                          Для этой категории пока нет опубликованных статей. Создайте или одобрите статьи.
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-200/80 max-h-[195px] overflow-y-auto p-2 space-y-1 scrollbar-thin">
                          {matchingArticles.map(art => {
                            const isSelected = carousel.articleIds.includes(art.id);
                            return (
                              <label
                                key={art.id}
                                className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition select-none ${
                                  isSelected 
                                    ? 'bg-slate-50 border border-slate-150' 
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={!isSelected && carousel.articleIds.length >= 5}
                                  onChange={() => handleToggleArticleInCarousel(carousel.id, art.id)}
                                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="block text-[11px] font-extrabold text-slate-800 leading-tight truncate">
                                    {art.title}
                                  </span>
                                  <span className="block text-[9.5px] text-slate-400 mt-0.5 truncate">
                                    {art.date} • {art.author?.firstName || 'Автор'} {art.author?.lastName || ''}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-400 font-sans border-t border-slate-200/50 mt-3 leading-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>Нужно выбрать {carousel.articleIds.length < 3 ? `еще ${3 - carousel.articleIds.length}` : carousel.articleIds.length > 5 ? 'меньше' : 'все верно!'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleSaveCarousels}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer active:scale-97 border-0"
            >
              Сохранить настройки каруселей
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
