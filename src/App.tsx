import { useState, useEffect, useRef } from 'react';
import Button from './components/Button';
import { mockCompanies } from './data';
import { Company } from './types';
import Sidebar from './components/Sidebar';
import CompanySearch from './components/CompanySearch';
import ExecutiveSummary from './components/ExecutiveSummary';
import CompanyConnections from './components/CompanyConnections';
import RatiosSelector from './components/RatiosSelector';
import FinancialsBlock from './components/FinancialsBlock';
import BankruptcyCard from './components/BankruptcyCard';
import ArbitrationDashboard from './components/ArbitrationDashboard';
import BusinessValuation from './components/BusinessValuation';
import { Info, HelpCircle, Loader2, Lock } from 'lucide-react';

// Specialized Service imports
import Header from './components/Header';
import CompareShowcase from './components/CompareShowcase';
import StandardsView from './components/StandardsView';
import GenericCalculators from './components/GenericCalculators';
import CabinetView from './components/CabinetView';
import PublicationEditor from './components/PublicationEditor';
import FinancialStatements from './components/FinancialStatements';
import AuthModal from './components/AuthModal';
import EmptyState from './components/EmptyState';
import NewsView from './components/NewsView';
import ModeratorView from './components/ModeratorView';

export default function App() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(''); // Default to empty (no company selected)
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [loading, setLoading] = useState<boolean>(true);
  const [showConnections, setShowConnections] = useState<boolean>(false);
  const [activeReportTab, setActiveReportTab] = useState<'balance' | 'ofr' | 'ratios'>('balance');
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  useEffect(() => {
    if (currentCompany) {
      const companyYears = currentCompany.financials.map(f => f.year).sort((a, b) => b - a);
      setSelectedYears(companyYears.slice(0, 3).length > 0 ? companyYears.slice(0, 3) : [2025]);
    }
  }, [currentCompany?.id]);

  // Theme & Navigation State - Locked to light mode per user requirements
  const darkMode = false;
  const [activeTab, setActiveTab] = useState<'dashboard' | 'compare' | 'standards' | 'calculators' | 'cabinet' | 'news' | 'moderator'>('dashboard');
  const [isEditingPublication, setIsEditingPublication] = useState<boolean>(false);
  const [editingNewsArticle, setEditingNewsArticle] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<'author' | 'moderator'>(() => {
    return (localStorage.getItem('profile_userRole') as any) || 'author';
  });
  const [isBentoEditActive, setIsBentoEditActive] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const isProgrammaticScrollRef = useRef<boolean>(false);

  // Scroll spy effect: highlights active segment on scroll
  useEffect(() => {
    if (activeTab !== 'dashboard' || showConnections || loading || !currentCompany) return;

    const sections = ['profile', 'reports', 'charts', 'bankruptcy', 'arbitration', 'sandbox'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isProgrammaticScrollRef.current) return;

      const visibleSections = entries.filter(entry => entry.isIntersecting);
      if (visibleSections.length > 0) {
        const sorted = visibleSections.sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        setActiveSection(sorted[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [activeTab, showConnections, loading, currentCompany?.id]);

  // Standard Personal Profile & Authorization States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('profile_isLoggedIn') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('profile_userName') || 'Анастасия Баталова';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('profile_userEmail') || 'aabatalova2@gmail.com';
  });
  const [userLogin, setUserLogin] = useState<string>(() => {
    return localStorage.getItem('profile_userLogin') || 'anastasia_b';
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('profile_avatarUrl') || '';
  });
  const [cabinetSubTab, setCabinetSubTab] = useState<'settings' | 'history' | 'favorites'>('settings');
  const [highlightSection, setHighlightSection] = useState<'password' | 'avatar' | 'none'>('none');

  const [favorites, setFavorites] = useState<{ companies: string[]; industries: string[] }>(() => {
    const saved = localStorage.getItem('profile_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return { companies: [], industries: [] };
  });

  const [initialIndustry, setInitialIndustry] = useState<'banking' | 'wholesale' | 'software' | undefined>(undefined);

  const [simulatorTask, setSimulatorTask] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('active_simulator_task');
    if (saved) {
      try {
        setSimulatorTask(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, [selectedCompanyId, activeTab]);

  useEffect(() => {
    localStorage.setItem('profile_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavoriteCompany = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.companies.includes(id);
      const updatedCompanies = isFav 
        ? prev.companies.filter(cid => cid !== id) 
        : [...prev.companies, id];
      return { ...prev, companies: updatedCompanies };
    });
  };

  const handleToggleFavoriteIndustry = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.industries.includes(id);
      const updatedIndustries = isFav 
        ? prev.industries.filter(iid => iid !== id) 
        : [...prev.industries, id];
      return { ...prev, industries: updatedIndustries };
    });
  };

  const handleSelectIndustryFromFavorites = (id: string) => {
    if (id === 'custom') {
      setActiveTab('compare');
    } else {
      setInitialIndustry(id as any);
      setActiveTab('standards');
    }
  };

  const handleCabinetAction = (action: 'password' | 'history' | 'avatar' | 'profile' | 'favorites' | 'my_articles') => {
    setActiveTab('cabinet');
    if (action === 'history') {
      setCabinetSubTab('history');
      setHighlightSection('none');
    } else if (action === 'favorites') {
      setCabinetSubTab('favorites');
      setHighlightSection('none');
    } else if (action === 'my_articles') {
      setCabinetSubTab('my_articles');
      setHighlightSection('none');
    } else {
      setCabinetSubTab('settings');
      if (action === 'password') {
        setHighlightSection('password');
      } else if (action === 'avatar') {
        setHighlightSection('avatar');
      } else {
        setHighlightSection('none');
      }
    }
  };

  // Track and write to search history
  const addToHistory = (co: Company) => {
    try {
      const saved = localStorage.getItem('search_history');
      let history: any[] = saved ? JSON.parse(saved) : [];
      history = history.filter((item: any) => item.id !== co.id);
      history.unshift({
        id: co.id,
        shortName: co.shortName,
        scoreMark: co.scoreMark,
        scorePercent: co.scorePercent,
        status: co.status,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('ru-RU')
      });
      history = history.slice(0, 15);
      localStorage.setItem('search_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Fetch all companies summarized
  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        } else {
          // Fallback to offline mock summary
          setCompanies(mockCompanies);
        }
      } catch (err) {
        setCompanies(mockCompanies);
      }
    }
    loadSummary();
  }, []);

  // 2. Fetch full company detail
  useEffect(() => {
    if (!selectedCompanyId) {
      setCurrentCompany(null);
      setLoading(false);
      return;
    }
    async function loadCompanyDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/companies/${selectedCompanyId}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentCompany(data);
          addToHistory(data);
        } else {
          const offlineMatch = mockCompanies.find(c => c.id === selectedCompanyId);
          if (offlineMatch) {
            setCurrentCompany(offlineMatch);
            addToHistory(offlineMatch);
          } else {
            setCurrentCompany(null);
          }
        }
      } catch (err) {
        const offlineMatch = mockCompanies.find(c => c.id === selectedCompanyId);
        if (offlineMatch) {
          setCurrentCompany(offlineMatch);
          addToHistory(offlineMatch);
        } else {
          setCurrentCompany(null);
        }
      } finally {
        setLoading(false);
      }
    }
    loadCompanyDetail();
  }, [selectedCompanyId]);

  // Section scroll handler from Sidebar
  const handleSectionNavigation = (id: string) => {
    setActiveTab('dashboard'); // Always return to dashboard tab to select section
    setShowConnections(false); // Automatically close connection view on vertical scroll click
    
    if (id === 'ratios') {
      setActiveReportTab('ratios');
    } else if (id === 'reports') {
      setActiveReportTab('balance');
    }

    const scrollTargetId = id === 'ratios' ? 'reports' : id;
    setActiveSection(id);
    isProgrammaticScrollRef.current = true;
    setTimeout(() => {
      const element = document.getElementById(scrollTargetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 800);
    }, 100);
  };



  if (!currentCompany && selectedCompanyId !== '') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-3 font-sans">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Инициализация скоринговых баз...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-slate-50 text-slate-800">
      
      {/* Top Header spanning across full page width */}
      <Header 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsEditingPublication(false);
          // reset visual sections focus if changing tabs
          if (tab !== 'dashboard') {
            setActiveSection('');
          } else {
            setActiveSection('profile');
          }
        }}
        userName={userName}
        userLogin={userLogin}
        avatarUrl={avatarUrl}
        onCabinetAction={handleCabinetAction}
        onLogout={() => {
          setIsLoggedIn(false);
          localStorage.setItem('profile_isLoggedIn', 'false');
        }}
        isLoggedIn={isLoggedIn}
        onAuthClick={() => setIsAuthModalOpen(true)}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main split layout container (Sidebar + Content Workspace) */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        
        {/* Dynamic Left Sidebar quick info */}
        {selectedCompanyId ? (
          <Sidebar 
            activeSection={activeSection}
            onSectionClick={handleSectionNavigation}
            status={currentCompany ? currentCompany.status : 'active'}
            scoreMark={currentCompany ? currentCompany.scoreMark : '-'}
            scorePercent={currentCompany ? currentCompany.scorePercent : 0}
          />
        ) : null}

        {/* Main Workspace Frame with beautiful diagonal gradient background */}
        <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#e0f1fe] via-[#f1f5f9] to-[#fae8ff]/70 relative">
          
          {/* Dynamic Service Router Section */}
          <div className={`flex-1 space-y-12 w-full mx-auto overflow-y-auto max-h-[calc(100vh-64px)] style-scrollbar transition-all duration-300 ${
            activeTab === 'news' 
              ? 'p-6 md:p-8 lg:p-10 max-w-[1450px]' 
              : 'p-6 lg:p-8 max-w-6xl'
          }`}>
          
          {activeTab === 'dashboard' && (
            <>
              {/* Search header container - Only render when a company is active */}
              {selectedCompanyId ? (
                <CompanySearch 
                  companiesSummary={companies.length ? companies : mockCompanies}
                  selectedCompanyId={selectedCompanyId}
                  onSelectCompany={(id) => { setSelectedCompanyId(id); setActiveSection('profile'); setShowConnections(false); }}
                />
              ) : null}

              {loading ? (
                <div className="py-20 text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
                  <p className="text-slate-400 text-xs">Загрузка карточки рисков контрагента...</p>
                </div>
              ) : showConnections ? (
                <div className="animate-in fade-in slide-in-from-bottom duration-300">
                  <CompanyConnections 
                    company={currentCompany!} 
                    onBack={() => setShowConnections(false)} 
                  />
                </div>
              ) : !selectedCompanyId ? (
                <EmptyState 
                  onSelectSampleCompany={(id) => {
                    setSelectedCompanyId(id);
                    setActiveSection('profile');
                    setShowConnections(false);
                  }}
                  companies={companies.length ? companies : mockCompanies}
                />
              ) : currentCompany ? (
                <>
                  {/* Profile Card Section */}
                  <section id="profile" className="scroll-mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest font-mono">Раздел 01</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    </div>
                    <ExecutiveSummary 
                      company={currentCompany} 
                      onViewConnections={() => setShowConnections(true)} 
                      isFavorite={favorites.companies.includes(currentCompany.id)}
                      onToggleFavorite={() => handleToggleFavoriteCompany(currentCompany.id)}
                    />
                  </section>

                  {/* Financial Statements (Form 1 and Form 2, now with Financial Coefficients) Section */}
                  <section id="reports" className="scroll-mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest font-mono">Раздел 02</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    </div>
                    <div className="relative group">
                      <div className={!isLoggedIn ? "filter blur-[6px] select-none pointer-events-none transition-all duration-300" : ""}>
                        <FinancialStatements 
                          company={currentCompany} 
                          initialType={activeReportTab} 
                          selectedYears={selectedYears}
                          setSelectedYears={setSelectedYears}
                        />
                      </div>
                      {!isLoggedIn && (
                        <div className="absolute inset-0 bg-slate-50/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-300">
                          <div className="bg-white/95 border border-slate-200/80 p-6 rounded-[24px] shadow-lg max-w-sm space-y-3 transform transition duration-300 hover:scale-[1.01]">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Раздел заблокирован</h4>
                              <p className="text-[11px] text-slate-500 leading-normal">
                                Чтобы просмотреть официальные формы отчетности (Баланс и Отчет о прибылях), пожалуйста, авторизуйтесь в системе.
                              </p>
                            </div>
                            <Button
                              onClick={() => setIsAuthModalOpen(true)}
                              variant="solid"
                              className="px-4 py-2 rounded-xl text-[10.5px] font-black cursor-pointer leading-none"
                            >
                              Авторизоваться
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Historical trends chart section */}
                  <section id="charts" className="scroll-mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest font-mono">Раздел 03</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    </div>
                    <div className="relative group">
                      <div className={!isLoggedIn ? "filter blur-[6px] select-none pointer-events-none transition-all duration-300" : ""}>
                        <FinancialsBlock company={currentCompany} selectedYears={selectedYears} />
                      </div>
                      {!isLoggedIn && (
                        <div className="absolute inset-0 bg-slate-50/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-300">
                          <div className="bg-white/95 border border-slate-200/80 p-6 rounded-[24px] shadow-lg max-w-sm space-y-3 transform transition duration-300 hover:scale-[1.01]">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Раздел заблокирован</h4>
                              <p className="text-[11px] text-slate-500 leading-normal">
                                Чтобы увидеть интерактивные тренды выручки, прибыли и динамики долга, авторизуйтесь в системе.
                              </p>
                            </div>
                            <Button
                              onClick={() => setIsAuthModalOpen(true)}
                              variant="solid"
                              className="px-4 py-2 rounded-xl text-[10.5px] font-black cursor-pointer leading-none"
                            >
                              Авторизоваться
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Corporate insolvency risk section */}
                  <section id="bankruptcy" className="scroll-mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest font-mono">Раздел 04</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    </div>
                    <div className="relative group">
                      <div className={!isLoggedIn ? "filter blur-[6px] select-none pointer-events-none transition-all duration-300" : ""}>
                        <BankruptcyCard company={currentCompany} />
                      </div>
                      {!isLoggedIn && (
                        <div className="absolute inset-0 bg-slate-50/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-300">
                          <div className="bg-white/95 border border-slate-200/80 p-6 rounded-[24px] shadow-lg max-w-sm space-y-3 transform transition duration-300 hover:scale-[1.01]">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Раздел заблокирован</h4>
                              <p className="text-[11px] text-slate-500 leading-normal">
                                Чтобы изучить детальные риски банкротства и скоринг по формулам Альтмана/Таффлера, авторизуйтесь.
                              </p>
                            </div>
                            <Button
                              onClick={() => setIsAuthModalOpen(true)}
                              variant="solid"
                              className="px-4 py-2 rounded-xl text-[10.5px] font-black cursor-pointer leading-none"
                            >
                              Авторизоваться
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Court claims metrics section */}
                  <section id="arbitration" className="scroll-mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest font-mono">Раздел 05</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    </div>
                    <div className="relative group">
                      <div className={!isLoggedIn ? "filter blur-[6px] select-none pointer-events-none transition-all duration-300" : ""}>
                        <ArbitrationDashboard company={currentCompany} />
                      </div>
                      {!isLoggedIn && (
                        <div className="absolute inset-0 bg-slate-50/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-300">
                          <div className="bg-white/95 border border-slate-200/80 p-6 rounded-[24px] shadow-lg max-w-sm space-y-3 transform transition duration-300 hover:scale-[1.01]">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Раздел заблокирован</h4>
                              <p className="text-[11px] text-slate-500 leading-normal">
                                Чтобы проанализировать судебные иски, претензии и историю арбитражных споров, авторизуйтесь в системе.
                              </p>
                            </div>
                            <Button
                              onClick={() => setIsAuthModalOpen(true)}
                              variant="solid"
                              className="px-4 py-2 rounded-xl text-[10.5px] font-black cursor-pointer leading-none"
                            >
                              Авторизоваться
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Interactive Business Valuation calculator block */}
                  <section id="sandbox" className="scroll-mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 tracking-widest font-mono">Раздел 06</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    </div>
                    <div className="relative group">
                      <div className={!isLoggedIn ? "filter blur-[6px] select-none pointer-events-none transition-all duration-300" : ""}>
                        <BusinessValuation company={currentCompany} />
                      </div>
                      {!isLoggedIn && (
                        <div className="absolute inset-0 bg-slate-50/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in duration-300">
                          <div className="bg-white/95 border border-slate-200/80 p-6 rounded-[24px] shadow-lg max-w-sm space-y-3 transform transition duration-300 hover:scale-[1.01]">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Раздел заблокирован</h4>
                              <p className="text-[11px] text-slate-500 leading-normal">
                                Интерактивная оценка стоимости бизнеса по методам DCF и мультипликаторам заблокирована. Авторизуйтесь.
                              </p>
                            </div>
                            <Button
                              onClick={() => setIsAuthModalOpen(true)}
                              variant="solid"
                              className="px-4 py-2 rounded-xl text-[10.5px] font-black cursor-pointer leading-none"
                            >
                              Авторизоваться
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              ) : null}
            </>
          )}

          {activeTab === 'compare' && (
            <CompareShowcase 
              companies={companies.length ? companies : mockCompanies}
              selectedCompanyId={selectedCompanyId}
              onSelectCompany={(id) => { setSelectedCompanyId(id); setActiveTab('dashboard'); }}
            />
          )}

          {activeTab === 'standards' && (
            <StandardsView 
              favoriteIndustries={favorites.industries}
              onToggleFavoriteIndustry={handleToggleFavoriteIndustry}
              initialIndustry={initialIndustry}
            />
          )}

          {activeTab === 'calculators' && (
            <GenericCalculators />
          )}

          {activeTab === 'cabinet' && (
            isEditingPublication ? (
              <PublicationEditor 
                companies={companies.length ? companies : mockCompanies}
                userName={userName}
                userLogin={userLogin}
                avatarUrl={avatarUrl}
                onBack={() => {
                  setEditingNewsArticle(null);
                  setIsEditingPublication(false);
                }}
                editingArticle={editingNewsArticle}
                onSaveSuccess={() => {
                  setEditingNewsArticle(null);
                  setIsEditingPublication(false);
                  setCabinetSubTab('my_articles');
                }}
              />
            ) : (
              <CabinetView 
                companies={companies.length ? companies : mockCompanies}
                userName={userName}
                setUserName={(val) => { setUserName(val); localStorage.setItem('profile_userName', val); }}
                userEmail={userEmail}
                setUserEmail={(val) => { setUserEmail(val); localStorage.setItem('profile_userEmail', val); }}
                userLogin={userLogin}
                setUserLogin={(val) => { setUserLogin(val); localStorage.setItem('profile_userLogin', val); }}
                avatarUrl={avatarUrl}
                setAvatarUrl={(val) => { setAvatarUrl(val); localStorage.setItem('profile_avatarUrl', val); }}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={(val) => { setIsLoggedIn(val); localStorage.setItem('profile_isLoggedIn', val ? 'true' : 'false'); }}
                onSelectCompany={(id) => { setSelectedCompanyId(id); setActiveTab('dashboard'); }}
                activeSubTab={cabinetSubTab}
                setActiveSubTab={setCabinetSubTab}
                highlightSection={highlightSection}
                setHighlightSection={setHighlightSection}
                favorites={favorites}
                onToggleFavoriteCompany={handleToggleFavoriteCompany}
                onToggleFavoriteIndustry={handleToggleFavoriteIndustry}
                onSelectIndustry={handleSelectIndustryFromFavorites}
                onAuthClick={() => setIsAuthModalOpen(true)}
                onStartCreatePublication={() => {
                  setEditingNewsArticle(null);
                  setIsEditingPublication(true);
                }}
                onStartEditPublication={(pub) => {
                  setEditingNewsArticle(pub);
                  setIsEditingPublication(true);
                }}
                userRole={userRole}
                setUserRole={setUserRole}
              />
            )
          )}

          {activeTab === 'news' && (
            <NewsView 
              companies={companies.length ? companies : mockCompanies}
              onSelectCompany={(id) => { setSelectedCompanyId(id); setActiveTab('dashboard'); }}
              setActiveTab={setActiveTab}
              isBentoEditActive={isBentoEditActive}
            />
          )}

          {activeTab === 'moderator' && (
            <ModeratorView 
              onSelectCompany={(id) => { setSelectedCompanyId(id); setActiveTab('dashboard'); }}
              onGoToNews={() => {
                setIsBentoEditActive(false);
                setActiveTab('news');
              }}
              onEnterBentoEditMode={() => {
                setIsBentoEditActive(true);
                setActiveTab('news');
              }}
            />
          )}

        </div>
      </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(name, email, login) => {
          setUserName(name);
          setUserEmail(email);
          setUserLogin(login);
          setIsLoggedIn(true);
          localStorage.setItem('profile_userName', name);
          localStorage.setItem('profile_userEmail', email);
          localStorage.setItem('profile_userLogin', login);
          localStorage.setItem('profile_isLoggedIn', 'true');
          setIsAuthModalOpen(false);
          // Auto add company to history if active
          if (currentCompany) {
            addToHistory(currentCompany);
          }
        }}
      />

      {/* Dynamic Floating Simulator Widget */}
      {simulatorTask && (
        <div id="simulator-banner" className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/30 text-white rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-6 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-400 font-mono tracking-wider">🎓 Тренажер «Подручный»</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('active_simulator_task');
                setSimulatorTask(null);
              }}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-white/70 rounded px-1.5 py-0.5 font-bold cursor-pointer"
            >
              Сброс
            </button>
          </div>

          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-extrabold leading-snug">
              Задача: {simulatorTask.instructions}
            </h4>
            
            <p className="text-[10px] text-slate-300 font-mono">
              Цель: ИНН {simulatorTask.companyId} ({simulatorTask.companyName})
            </p>

            {selectedCompanyId === simulatorTask.companyId ? (
              <div className="space-y-3 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
                <p className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                  <span>✅</span> Вы вошли в нужную карточку!
                </p>
                
                <p className="text-[10.5px] text-slate-300 leading-normal font-sans">
                  {simulatorTask.criteria} Коэффициент равен: <span className="font-mono font-black text-emerald-400">
                    {mockCompanies.find(c => c.id === simulatorTask.companyId)?.ratios?.find(r => r.id === simulatorTask.ratioId)?.value || '0.67'}
                  </span> — это превосходный здоровый показатель!
                </p>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('active_simulator_task');
                    setSimulatorTask(null);
                    setActiveTab('news');
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-[11px] font-black rounded-lg transition-all text-center cursor-pointer"
                >
                  Завершить урок и вернуться в Новости
                </button>
              </div>
            ) : (
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl">
                <p className="text-[10px] text-indigo-300 font-medium leading-relaxed font-sans">
                  Пожалуйста, переключитесь на карточку контрагента <strong>{simulatorTask.companyName}</strong>. 
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompanyId(simulatorTask.companyId);
                    setActiveTab('dashboard');
                  }}
                  className="mt-2 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold rounded-lg transition cursor-pointer text-center"
                >
                  Открыть {simulatorTask.companyName} в один клик
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

