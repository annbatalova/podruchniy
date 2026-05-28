import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { 
  User, 
  Mail, 
  Settings, 
  LogOut, 
  KeyRound, 
  CheckCircle2, 
  Save, 
  History, 
  Trash2,
  Lock,
  Upload,
  AlertCircle,
  X,
  FileBadge,
  Star,
  Bookmark
} from 'lucide-react';
import { Company } from '../types';

interface CabinetProps {
  companies: Company[];
  userName: string;
  setUserName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  userLogin: string;
  setUserLogin: (val: string) => void;
  avatarUrl: string;
  setAvatarUrl: (val: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  onSelectCompany: (id: string) => void;
  activeSubTab: 'settings' | 'history' | 'favorites';
  setActiveSubTab: (tab: 'settings' | 'history' | 'favorites') => void;
  highlightSection: 'password' | 'avatar' | 'none';
  setHighlightSection: (sec: 'password' | 'avatar' | 'none') => void;
  favorites: { companies: string[]; industries: string[] };
  onToggleFavoriteCompany: (id: string) => void;
  onToggleFavoriteIndustry: (id: string) => void;
  onSelectIndustry: (id: 'banking' | 'wholesale' | 'software') => void;
  onAuthClick?: () => void;
}

export default function CabinetView({
  companies,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userLogin,
  setUserLogin,
  avatarUrl,
  setAvatarUrl,
  isLoggedIn,
  setIsLoggedIn,
  onSelectCompany,
  activeSubTab,
  setActiveSubTab,
  highlightSection,
  setHighlightSection,
  favorites,
  onToggleFavoriteCompany,
  onToggleFavoriteIndustry,
  onSelectIndustry,
  onAuthClick
}: CabinetProps) {
  // References for focus / scroll highlights
  const avatarCardRef = useRef<HTMLDivElement>(null);
  const passwordCardRef = useRef<HTMLDivElement>(null);

  // Drag and drop / file input state
  const [dragActive, setDragActive] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');

  // Profile forms state
  const [editNameField, setEditNameField] = useState(userName);
  const [editEmailField, setEditEmailField] = useState(userEmail);
  const [editLoginField, setEditLoginField] = useState(userLogin);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSaveMsg, setProfileSaveMsg] = useState('');
  const [passwordSaveMsg, setPasswordSaveMsg] = useState('');

  // History state
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  // Local effect to trigger smooth scroll + temporary highlight border when navigating from header dropdown
  useEffect(() => {
    if (activeSubTab === 'settings') {
      if (highlightSection === 'avatar' && avatarCardRef.current) {
        avatarCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Auto remove highlight state after 3 seconds
        const timer = setTimeout(() => setHighlightSection('none'), 3000);
        return () => clearTimeout(timer);
      } else if (highlightSection === 'password' && passwordCardRef.current) {
        passwordCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const timer = setTimeout(() => setHighlightSection('none'), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightSection, activeSubTab]);

  // Sync edit fields when username/email/login change in parent
  useEffect(() => {
    setEditNameField(userName);
    setEditEmailField(userEmail);
    setEditLoginField(userLogin);
  }, [userName, userEmail, userLogin]);

  // Load search history list
  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        setSearchHistory([]);
      }
    }
  }, [activeSubTab]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLoginField.trim()) {
      setProfileSaveMsg('Логин не может быть пустым!');
      return;
    }
    setUserName(editLoginField.trim());
    setUserEmail(`${editLoginField.trim()}@example.com`);
    setUserLogin(editLoginField.trim());
    setProfileSaveMsg('Профиль успешно обновлен!');
    setTimeout(() => setProfileSaveMsg(''), 2500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPw = localStorage.getItem('profile_password') || 'password';
    if (currentPassword !== storedPw) {
      setPasswordSaveMsg('Текущий пароль введен неверно!');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordSaveMsg('Новый пароль должен содержать минимум 4 символа!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordSaveMsg('Пароли не совпадают!');
      return;
    }
    localStorage.setItem('profile_password', newPassword);
    setPasswordSaveMsg('Пароль успешно изменен!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaveMsg(''), 2500);
  };

  const clearHistory = () => {
    localStorage.removeItem('search_history');
    setSearchHistory([]);
  };

  const deleteHistoryItem = (id: string) => {
    const updated = searchHistory.filter((item: any) => item.id !== id);
    setSearchHistory(updated);
    localStorage.setItem('search_history', JSON.stringify(updated));
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
  };

  // Helper to convert initials
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
  };

  // Process PNG upload and convert to base64
  const processFile = (file: File) => {
    setAvatarError('');
    setAvatarSuccess('');

    if (file.type !== 'image/png') {
      setAvatarError('Извините, система принимает только файлы формата PNG.');
      return;
    }

    // Limit to 2.5MB to preserve localstorage threshold
    if (file.size > 2.5 * 1024 * 1024) {
      setAvatarError('Файл слишком велик! Пожалуйста, выберите PNG файл размером менее 2.5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        setAvatarUrl(base64);
        localStorage.setItem('profile_avatarUrl', base64);
        setAvatarSuccess('Ваш PNG аватар успешно загружен и сохранен!');
        setTimeout(() => setAvatarSuccess(''), 3000);
      }
    };
    reader.onerror = () => {
      setAvatarError('Произошла ошибка при чтении файла.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    localStorage.removeItem('profile_avatarUrl');
    setAvatarSuccess('Аватар сброшен к инициалам!');
    setTimeout(() => setAvatarSuccess(''), 2500);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 p-8 rounded-[32px] shadow-lg text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-black text-slate-900">Кабинет заблокирован</h3>
          <p className="text-xs text-slate-500 leading-normal">
            Вы вошли в систему как гость. Пожалуйста, авторизуйтесь или зарегистрируйтесь, чтобы сохранять избранные компании, отслеживать историю своих запросов и настраивать свой профиль.
          </p>
        </div>
        <Button
          onClick={onAuthClick}
          variant="solid"
          className="w-full py-3 rounded-2xl text-xs font-black shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          Войти или зарегистрироваться
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header controls in personal account (No student tags, sleek title) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-600 rounded-2xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 leading-tight">Мультирежимный Личный кабинет</h2>
            <p className="text-xs text-slate-500">Управление профилем, безопасностью и мониторинг аудита контрагентов</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto self-stretch sm:self-auto flex-wrap gap-0.5">
          <Button
            onClick={() => { setActiveSubTab('settings'); setHighlightSection('none'); }}
            variant="light"
            isActive={activeSubTab === 'settings'}
            className="flex-1 sm:flex-none px-4.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer leading-none"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Настройки аккаунта</span>
          </Button>

          <Button
            onClick={() => { setActiveSubTab('history'); setHighlightSection('none'); }}
            variant="light"
            isActive={activeSubTab === 'history'}
            className="flex-1 sm:flex-none px-4.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer leading-none"
          >
            <History className="w-3.5 h-3.5" />
            <span>История запросов</span>
          </Button>

          <Button
            onClick={() => { setActiveSubTab('favorites'); setHighlightSection('none'); }}
            variant="light"
            isActive={activeSubTab === 'favorites'}
            className="flex-1 sm:flex-none px-4.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer leading-none"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
            <span>Избранное</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Summary Widget (All student/academic metrics replaced with SaaS account details) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
            <div className="flex flex-col items-center py-2">
              
              {/* Current Avatar display */}
              <div className="w-20 h-20 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-md shadow-slate-100 mb-3.5 relative group transition duration-300">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={userLogin} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center font-extrabold text-2xl">
                    {getInitials(userLogin)}
                  </div>
                )}
              </div>
              
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                @{userLogin}
              </h3>
            </div>

            {/* Account Metadata Stats removed as requested */}

            {/* Logout button */}
            <div className="pt-4 mt-2 border-t border-slate-50">
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2.5 border-rose-200 hover:border-rose-450 text-rose-500 hover:bg-rose-50/50 rounded-2xl font-bold cursor-pointer transition text-xs shadow-none"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти из аккаунта</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2">
          
          {/* TAB 1: SETTINGS (PROFILE, CUSTOM PNG AVATAR UPLOAD, AND CHANGE PASSWORD) */}
          {activeSubTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Dynamic PNG Image Uploader section */}
              <div 
                ref={avatarCardRef}
                className={`bg-white p-6 rounded-3xl border transition-all duration-300 shadow-sm space-y-4 ${
                  highlightSection === 'avatar' 
                    ? 'border-sky-500 ring-4 ring-sky-500/10' 
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Upload className="w-4.5 h-4.5 text-sky-500" />
                    Загрузка PNG-аватара пользователя
                  </h3>
                  <p className="text-xs text-slate-450 text-slate-500 mt-1">
                    Сгенерированные сайтом смайлики удалены. Вы можете загрузить свой собственный файл в формате **PNG** для персонализации вашей учетной записи.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  
                  {/* Left Column: Current Custom avatar preview */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Предпросмотр</span>
                    
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 bg-white flex items-center justify-center mb-3">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Аватар" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="font-extrabold text-xl text-slate-400">
                          {getInitials(userLogin)}
                        </div>
                      )}
                    </div>

                    {avatarUrl ? (
                      <button
                        onClick={handleRemoveAvatar}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold text-rose-500 border border-rose-100 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        Сбросить аватар
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Используется монограмма</span>
                    )}
                  </div>

                  {/* Right Column: Upload drag-and-drop zone */}
                  <div className="md:col-span-2">
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center transition cursor-pointer ${
                        dragActive 
                          ? 'border-sky-500 bg-sky-500/5' 
                          : 'border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="file"
                        id="avatar-file-input"
                        accept="image/png"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <Upload className="w-7 h-7 text-slate-400 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-bold text-slate-700">Перетащите PNG сюда</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">или нажмите для выбора файла на ПК</p>
                      <span className="text-[9px] font-mono font-bold text-slate-400 mt-2.5 bg-slate-200/50 px-2 py-0.5 rounded-md">
                        Только PNG, до 2.5 MB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro Feedback alerts */}
                {avatarError && (
                  <div className="text-xs text-rose-500 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-100/50 flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{avatarError}</span>
                  </div>
                )}

                {avatarSuccess && (
                  <div className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100/50 flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{avatarSuccess}</span>
                  </div>
                )}
              </div>

              {/* Account base parameters */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-500" />
                    Параметры профиля
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">Логин пользователя</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                      value={editLoginField}
                      onChange={(e) => setEditLoginField(e.target.value)}
                    />
                  </div>

                  {profileSaveMsg && (
                    <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 py-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{profileSaveMsg}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="solid"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold leading-none cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Сохранить изменения</span>
                  </Button>
                </form>
              </div>

              {/* Password change form block */}
              <div 
                ref={passwordCardRef}
                className={`bg-white p-6 rounded-3xl border transition-all duration-300 shadow-sm space-y-4 ${
                  highlightSection === 'password' 
                    ? 'border-sky-500 ring-4 ring-sky-500/10' 
                    : 'border-slate-200/80'
                }`}
              >
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-sky-500" />
                    Безопасность и смена пароля
                  </h4>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Текущий пароль доступа</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Новый пароль</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Подтвердите новый пароль</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {passwordSaveMsg && (
                    <div className={`text-xs font-bold flex items-center gap-1.5 py-1 ${
                      passwordSaveMsg.includes('неверно') || passwordSaveMsg.includes('совпадают') || passwordSaveMsg.includes('символа') 
                        ? 'text-rose-500' 
                        : 'text-emerald-600'
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{passwordSaveMsg}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="solid"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold leading-none cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Обновить пароль безопасности</span>
                  </Button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: SEARCH HISTORY / AUDIT LOGS */}
          {activeSubTab === 'history' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 animate-in fade-in duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-sky-500" />
                    <h3 className="font-extrabold text-base text-slate-900">Журнал скоринг-аудитов контрагентов</h3>
                  </div>
                  {searchHistory.length > 0 && (
                    <Button
                      onClick={clearHistory}
                      variant="outline"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] text-rose-500 border-rose-100 hover:bg-rose-50 hover:border-rose-200 text-rose-600 transition cursor-pointer font-bold leading-none shadow-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Очистить историю</span>
                    </Button>
                  )}
                </div>
                
                {searchHistory.length === 0 ? (
                  <div className="border border-dashed border-slate-200 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                    <History className="w-10 h-10 text-slate-300 stroke-[1.5] mb-2" />
                    <p className="text-xs text-slate-500 font-bold">История запросов пока пуста</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-sm">
                      Вы можете перейти на вкладку «Скоринг контрагента» и выбрать из поисковой панели или каталога любую компанию, чтобы начать её аудит.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-120 overflow-y-auto style-scrollbar">
                    {searchHistory.map((item, idx) => {
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-all gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8.5 h-8.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100/50 flex items-center justify-center font-black text-xs">
                              {item.scoreMark}
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-slate-800 leading-none">{item.shortName}</h5>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">ИНН: {item.id} · Зафиксировано: {item.timestamp}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-start">
                            <div className="text-right">
                              <span className="text-[10px] font-black font-mono text-slate-500">Скоринг: {item.scorePercent}%</span>
                            </div>

                            <Button
                              onClick={() => onSelectCompany(item.id)}
                              variant="light"
                              className="px-3 py-1.5 rounded-xl font-bold text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-sky-600"
                            >
                              <span>Открыть экспресс-инспекцию</span>
                            </Button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteHistoryItem(item.id);
                              }}
                              className="p-2 bg-transparent hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl hover:border-rose-100 border border-transparent transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-90 duration-75"
                              title="Удалить из истории"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-150 pt-3 text-[10px] mt-4 font-mono text-slate-400 text-center uppercase tracking-wider flex justify-center items-center gap-1.5">
                <FileBadge className="w-3.5 h-3.5 text-slate-350" />
                <span>Сертификаты безопасности связи авторизованы · ssl-shield</span>
              </div>
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeSubTab === 'favorites' && (
            <div className="space-y-6">
              {/* COMPANIES SECTION */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                  <h3 className="font-extrabold text-base text-slate-900">Избранные компании</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Список контрагентов и компаний, которые вы добавили в закладки для быстрого финансового мониторинга и экспресс-анализа.
                </p>

                {(!favorites.companies || favorites.companies.length === 0) ? (
                  <div className="border border-dashed border-slate-200 p-8 text-center rounded-2xl flex flex-col items-center justify-center bg-slate-50/30">
                    <Star className="w-8 h-8 text-slate-300 stroke-[1.5] mb-2" />
                    <p className="text-xs text-slate-500 font-bold">У вас нет избранных компаний</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-sm">
                      Вы можете добавить любую компанию в избранное, нажав кнопку «В избранное» в карточке основного скоринг-анализа.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {favorites.companies.map((id) => {
                      const comp = companies.find((c) => c.id === id);
                      if (!comp) return null;
                      return (
                        <div key={id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-all gap-3">
                          <div className="flex items-center gap-3">
                            <div className="pl-1">
                              <h5 className="font-bold text-xs text-slate-800 leading-none font-sans">{comp.shortName}</h5>
                              <p className="text-[10px] text-slate-400 font-mono mt-2">ИНН: {comp.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                            <Button
                              onClick={() => onSelectCompany(comp.id)}
                              variant="light"
                              className="px-3 py-1.5 rounded-xl font-bold text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-sky-600"
                            >
                              <span>Карточка контрагента</span>
                            </Button>

                            <button
                              onClick={() => onToggleFavoriteCompany(comp.id)}
                              type="button"
                              className="p-1.5 rounded-xl border border-rose-155 border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                              title="Убрать из избранного"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* INDUSTRIES SECTION */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-500 fill-indigo-500/10" />
                  <h3 className="font-extrabold text-base text-slate-900 font-sans">Избранные подборки в сравнительной витрине</h3>
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  Сохраненные настройки фильтров и подборки компаний
                </p>

                {(!favorites.industries || favorites.industries.length === 0) ? (
                  <div className="space-y-2.5">
                    {/* Stub Selection List Item */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-all gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8.5 h-8.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-slate-800 leading-none font-sans">Подборка пользователя</h5>
                          <p className="text-[10px] text-slate-500 mt-1.5 leading-normal max-w-md font-sans">
                            Настройки поисковых фильтров по рейтингу стабильности, ОКВЭД и финансовой ликвидности для быстрого сравнения.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                        <Button
                          variant="light"
                          className="px-3 py-1.5 rounded-xl font-bold text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-indigo-600 font-sans"
                        >
                          <span>Открыть витрину</span>
                        </Button>

                        <button
                          type="button"
                          className="p-1.5 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                          title="Убрать"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {favorites.industries.map((indId) => {
                      // Retrieve industry human readable labels
                      const info = indId === 'wholesale' 
                        ? { title: 'Оптовая торговля ОКВЭД 46', desc: 'Бенчмарки ROS, рентабельности собственного капитала и автономии для торговых предприятий.' }
                        : indId === 'software'
                          ? { title: 'Информационные технологии ОКВЭД 62', desc: 'Прогрессивные мультипликаторы стоимости, коэффициенты автономии и инвестиционных бенчмарков.' }
                          : { title: 'Банковский сектор ОКВЭД 64', desc: 'Специальные банковские нормативы достаточности капитала ЦБ РФ, ликвидности и пассивов.' };

                      return (
                        <div key={indId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-all gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8.5 h-8.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                              <Bookmark className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-slate-800 leading-none font-sans">{info.title}</h5>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal max-w-md font-sans">{info.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                            <Button
                              onClick={() => onSelectIndustry(indId as any)}
                              variant="light"
                              className="px-3 py-1.5 rounded-xl font-bold text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-indigo-600 font-sans"
                            >
                              <span>Открыть коэффициенты</span>
                            </Button>

                            <button
                              onClick={() => onToggleFavoriteIndustry(indId)}
                              type="button"
                              className="p-1.5 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                              title="Убрать"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
