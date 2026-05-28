import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import FinWolfLogo from './FinWolfLogo';
import { 
  User, 
  ChevronDown,
  KeyRound,
  History as HistoryIcon,
  Image as ImageIcon,
  LogOut,
  Star
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'compare' | 'standards' | 'calculators' | 'cabinet';
  setActiveTab: (tab: 'dashboard' | 'compare' | 'standards' | 'calculators' | 'cabinet') => void;
  userName: string;
  userLogin: string;
  avatarUrl: string;
  onCabinetAction: (action: 'password' | 'history' | 'avatar' | 'profile' | 'favorites') => void;
  onLogout: () => void;
  isLoggedIn?: boolean;
  onAuthClick?: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  userName,
  userLogin,
  avatarUrl,
  onCabinetAction,
  onLogout,
  isLoggedIn = true,
  onAuthClick
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tabs = [
    { id: 'dashboard', name: 'Карточка контрагента', hasDropdown: false },
    { id: 'compare', name: 'Сравнительная витрина', hasDropdown: false },
    { id: 'standards', name: 'Отраслевые коэффициенты', hasDropdown: false },
    { id: 'calculators', name: 'Калькуляторы', hasDropdown: true },
  ] as const;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleActionClick = (action: 'password' | 'history' | 'avatar' | 'profile' | 'favorites') => {
    setDropdownOpen(false);
    onCabinetAction(action);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-6 lg:px-8 h-16 flex items-center transition-all duration-200">
      <div className="w-full flex items-center justify-between h-full">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <FinWolfLogo showText={true} width={130} height={36} />
        </div>

        {/* Center: Navigation Tabs (Aligns with user image exactly) */}
        <div className="hidden md:flex items-center h-full gap-6 lg:gap-8 xl:gap-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`h-full px-1 text-xs lg:text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-150 flex items-center gap-1.5 focus:outline-none relative border-b-2 ${
                  isActive 
                    ? 'text-sky-500 border-sky-500' 
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                <span>{tab.name}</span>
                {tab.hasDropdown && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-180' : 'text-slate-400'}`} />}
              </button>
            );
          })}
        </div>

        {/* Mobile menu trigger helper/placeholder fallback if screen too small */}
        <div className="flex md:hidden items-center">
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-bold text-slate-700"
          >
            {tabs.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Right side controls: Profile trigger with beautiful custom Dropdown */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onAuthClick}
                type="button"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Регистрация
              </button>
              <Button
                onClick={onAuthClick}
                variant="solid"
                className="px-5 py-2.5 rounded-full text-xs font-black shadow-md bg-sky-500 hover:bg-sky-600 border-none transition-all active:scale-[0.98]"
              >
                Войти в систему
              </Button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                type="button"
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition cursor-pointer text-left focus:outline-none ${
                  activeTab === 'cabinet' || dropdownOpen
                    ? 'bg-sky-500/10 border-sky-500/30 ring-2 ring-sky-500/10'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Avatar display (uploaded custom image or fallback monogram) */}
                {avatarUrl ? (
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200/80 bg-slate-100 flex-shrink-0">
                    <img 
                      src={avatarUrl} 
                      alt={userLogin} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0">
                    <span>{getInitials(userLogin)}</span>
                  </div>
                )}

                <div className="hidden sm:block pr-1 select-none">
                  <div className="text-[11px] font-extrabold text-slate-800 leading-tight">
                    @{userLogin}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Interactive Dropdown List */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100 mb-1.5 sm:hidden">
                    <div className="text-xs font-black text-slate-800 truncate">@{userLogin}</div>
                  </div>

                  <button
                    onClick={() => handleActionClick('password')}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 transition flex items-center gap-2.5 font-semibold cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-sky-500" />
                    <span>Сменить пароль</span>
                  </button>

                  <button
                    onClick={() => handleActionClick('history')}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 transition flex items-center gap-2.5 font-semibold cursor-pointer"
                  >
                    <HistoryIcon className="w-4 h-4 text-sky-500" />
                    <span>История запросов</span>
                  </button>

                  <button
                    onClick={() => handleActionClick('favorites')}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 transition flex items-center gap-2.5 font-semibold cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                    <span>Избранное</span>
                  </button>

                  <button
                    onClick={() => handleActionClick('avatar')}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 transition flex items-center gap-2.5 font-semibold cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-sky-500" />
                    <span>Сменить аватар</span>
                  </button>

                  <div className="h-px bg-slate-100 my-1.5" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-rose-600 hover:bg-rose-50/50 transition flex items-center gap-2.5 font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Выйти из аккаунта</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </header>
  );
}
