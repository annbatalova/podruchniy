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
  Bookmark,
  Plus,
  Edit
} from 'lucide-react';
import { Company } from '../types';

const getCategoryName = (catId: string) => {
  switch (catId) {
    case 'company_news': return 'Новости компаний';
    case 'market_analytics': return 'Аналитика рынка';
    case 'taxes_and_regulations': return 'Регуляторика & Налоги';
    case 'cases_interviews': return 'Кейсы и интервью';
    case 'guides_tutorials': return 'Гайды & Обучение';
    default: return catId;
  }
};

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
  activeSubTab: 'settings' | 'history' | 'favorites' | 'my_articles';
  setActiveSubTab: (tab: 'settings' | 'history' | 'favorites' | 'my_articles') => void;
  highlightSection: 'password' | 'avatar' | 'none';
  setHighlightSection: (sec: 'password' | 'avatar' | 'none') => void;
  favorites: { companies: string[]; industries: string[] };
  onToggleFavoriteCompany: (id: string) => void;
  onToggleFavoriteIndustry: (id: string) => void;
  onSelectIndustry: (id: string) => void;
  onAuthClick?: () => void;
  onStartCreatePublication?: () => void;
  userRole: 'author' | 'moderator';
  setUserRole: (role: 'author' | 'moderator') => void;
  onStartEditPublication?: (pub: any) => void;
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
  onAuthClick,
  onStartCreatePublication,
  userRole,
  setUserRole,
  onStartEditPublication
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
  const [authorSignature, setAuthorSignature] = useState(() => localStorage.getItem('profile_signature') || 'Финансовый автор, эксперт по экономическому анализу');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSaveMsg, setProfileSaveMsg] = useState('');
  const [passwordSaveMsg, setPasswordSaveMsg] = useState('');

  // History state
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  // Author publications states
  const [localPubs, setLocalPubs] = useState<any[]>([]);
  const [requestingDeleteId, setRequestingDeleteId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load custom publications for author
  useEffect(() => {
    if (activeSubTab === 'my_articles') {
      const saved = localStorage.getItem('custom_publications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setLocalPubs(parsed);
        } catch (e) {
          setLocalPubs([]);
        }
      } else {
        setLocalPubs([]);
      }
    }
  }, [activeSubTab]);


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
        // Auto remove highlight state after 3 seconds
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
    localStorage.setItem('profile_signature', authorSignature.trim());
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

  const handleDraftDelete = (id: string) => {
    const saved = localStorage.getItem('custom_publications');
    const list = saved ? JSON.parse(saved) : [];
    const updated = list.filter((p: any) => p.id !== id);
    localStorage.setItem('custom_publications', JSON.stringify(updated));
    setLocalPubs(updated);
    setConfirmDeleteId(null);
  };

  const handleSendDeleteRequest = (articleId: string) => {
    if (!deleteReason.trim()) {
      alert('Пожалуйста, введите корректную причину удаления статьи.');
      return;
    }

    const updated = localPubs.map(pub => {
      if (pub.id === articleId) {
        return {
          ...pub,
          deleteRequested: true,
          deleteRequestReason: deleteReason.trim()
        };
      }
      return pub;
    });

    localStorage.setItem('custom_publications', JSON.stringify(updated));
    setLocalPubs(updated);
    setRequestingDeleteId(null);
    setDeleteReason('');
    alert('Заявка на удаление успешно отправлена модератору!');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm animate-in fade-in duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-[9.5px] font-black uppercase tracking-wider font-mono">
              👤 Аккаунт пользователя
            </span>
          </div>
          <h2 className="font-sans font-black text-lg text-slate-900 leading-tight">Личный кабинет</h2>
          <p className="text-xs text-slate-400 font-medium">
            Настройки профиля, избранные разделы и история компании.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl w-full sm:w-auto self-stretch sm:self-auto flex-wrap gap-0.5 border border-slate-200/30">
          <Button
            onClick={() => { setActiveSubTab('settings'); setHighlightSection('none'); }}
            variant="light"
            isActive={activeSubTab === 'settings'}
            className="flex-1 sm:flex-none px-4.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer leading-none transition-all duration-150"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Настройки</span>
          </Button>

          <Button
            onClick={() => { setActiveSubTab('history'); setHighlightSection('none'); }}
            variant="light"
            isActive={activeSubTab === 'history'}
            className="flex-1 sm:flex-none px-4.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer leading-none transition-all duration-150"
          >
            <History className="w-3.5 h-3.5" />
            <span>История</span>
          </Button>

          <Button
            onClick={() => { setActiveSubTab('favorites'); setHighlightSection('none'); }}
            variant="light"
            isActive={activeSubTab === 'favorites'}
            className="flex-1 sm:flex-none px-4.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer leading-none transition-all duration-150"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-550/10" />
            <span>Избранное</span>
          </Button>

          <Button
            onClick={() => { setActiveSubTab('my_articles'); setHighlightSection('none'); }}
            variant="light"
            isActive={activeSubTab === 'my_articles'}
            className="flex-1 sm:flex-none px-4.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer leading-none transition-all duration-150"
          >
            <FileBadge className="w-3.5 h-3.5 text-indigo-500" />
            <span>Мои статьи</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">

        {/* Left Side: Summary Widget (All student/academic metrics replaced with SaaS account details) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="flex flex-col items-center py-2 w-full">
              
              {/* Current Avatar display */}
              <div className="w-24 h-24 rounded-3xl overflow-hidden border border-slate-200 transition bg-slate-50 flex items-center justify-center shadow-md shadow-slate-100 mb-4 relative hover:scale-[1.03] duration-300">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={userLogin} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-550 to-sky-500 text-white flex items-center justify-center font-extrabold text-3xl">
                    {getInitials(userLogin)}
                  </div>
                )}
              </div>
              
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                @{userLogin}
              </h3>
              <p className="text-[10.5px] text-slate-400 mt-1 leading-none font-medium">Зарегистрированный эксперт</p>
              
              {/* Custom tagline/signature display for Author */}
              {userRole === 'author' && (
                <p className="text-[11px] text-slate-500 mt-2 px-1 text-center font-normal leading-relaxed italic max-w-[200px]">
                  «{authorSignature}»
                </p>
              )}

              {/* Account role toggle info helper */}
              <div className="mt-4 mb-2 text-center rounded-2xl bg-slate-50/80 border border-slate-200/60 p-4 space-y-1.5 w-full">
                <span className="block text-[9.5px] font-black uppercase text-indigo-600 tracking-wider">Роль профиля</span>
                <span className="block text-xs font-black text-slate-800 font-sans">
                  {userRole === 'moderator' ? '👑 Модератор контента' : '✍️ Финансовый автор'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = userRole === 'author' ? 'moderator' : 'author';
                    setUserRole(next);
                    localStorage.setItem('profile_userRole', next);
                  }}
                  className="mx-auto block text-[10px] text-indigo-650 hover:text-indigo-800 font-bold transition hover:underline cursor-pointer select-none"
                >
                  Изменить на {userRole === 'author' ? 'Модератора' : 'Автора'}
                </button>
              </div>
            </div>

            {/* Logout button */}
            <div className="pt-4 mt-2 border-t border-slate-100 w-full">
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2.5 border-rose-200 hover:border-rose-450 hover:bg-rose-50/30 text-rose-550 rounded-2xl font-bold cursor-pointer transition text-xs shadow-none"
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
                  <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2.5">
                    <Upload className="w-5 h-5 text-sky-500" />
                    Загрузка аватара пользователя
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    Загрузите собственное изображение для персонализации вашей учетной записи.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  
                  {/* Left Column: Current Custom avatar preview */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
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
                  <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2.5">
                    <User className="w-5 h-5 text-sky-500" />
                    Параметры профиля
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Логин пользователя</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-semibold"
                      value={editLoginField}
                      onChange={(e) => setEditLoginField(e.target.value)}
                    />
                  </div>

                  {userRole === 'author' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Ваша авторская подпись</label>
                      <input
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-semibold"
                        value={authorSignature}
                        onChange={(e) => setAuthorSignature(e.target.value)}
                        placeholder="Например: Эксперт по корпоративным финансам"
                      />
                    </div>
                  )}

                  {profileSaveMsg && (
                    <div className="text-xs text-emerald-600 font-bold bg-slate-50 p-3 rounded-xl flex items-center gap-1.5 py-2.5 border border-emerald-100/30">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{profileSaveMsg}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="solid"
                    className="flex items-center gap-2 px-4.5 py-2.5 text-xs font-black leading-none cursor-pointer hover:shadow-md transition-all active:scale-[0.98] duration-150"
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
                  <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2.5">
                    <KeyRound className="w-5 h-5 text-sky-500" />
                    Безопасность и смена пароля
                  </h3>

                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono">Текущий пароль доступа</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-semibold"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono">Новый пароль</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-semibold"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono">Подтвердите новый пароль</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-semibold"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {passwordSaveMsg && (
                    <div className={`text-xs font-bold bg-slate-50 p-3 rounded-xl flex items-center gap-1.5 py-2.5 ${
                      passwordSaveMsg.includes('неверно') || passwordSaveMsg.includes('совпадают') || passwordSaveMsg.includes('символа') 
                        ? 'text-rose-600 border border-rose-100/30' 
                        : 'text-emerald-600 border border-emerald-100/30'
                    }`}>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{passwordSaveMsg}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="solid"
                    className="flex items-center gap-2 px-4.5 py-2.5 text-xs font-black leading-none cursor-pointer hover:shadow-md transition-all active:scale-[0.98] duration-150"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Обновить пароль</span>
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
                  <div className="flex items-center gap-2.5">
                    <History className="w-5 h-5 text-sky-500" />
                    <h3 className="font-sans font-black text-base text-slate-900">Журнал скоринг-аудитов контрагентов</h3>
                  </div>
                  {searchHistory.length > 0 && (
                    <Button
                      onClick={clearHistory}
                      variant="outline"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] border border-rose-100 hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-all duration-150 cursor-pointer font-black leading-none"
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
                            <div>
                              <h5 className="font-sans font-black text-xs text-slate-800 leading-none">{item.shortName}</h5>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">ИНН: {item.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-start">
                            <Button
                              onClick={() => onSelectCompany(item.id)}
                              variant="light"
                              className="px-3 py-1.5 rounded-xl font-black text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 duration-150 transition-all active:scale-95"
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

              <div className="border-t border-slate-200/60 pt-3 text-[10px] mt-4 font-mono text-slate-400 text-center uppercase tracking-wider flex justify-center items-center gap-1.5">
                <FileBadge className="w-3.5 h-3.5 text-slate-400" />
                <span>Сертификаты безопасности связи авторизованы · ssl-shield</span>
              </div>
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeSubTab === 'favorites' && (
            <div className="space-y-6">
              {/* COMPANIES SECTION */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                  <h3 className="font-sans font-black text-base text-slate-900">Избранные компании</h3>
                </div>
                <p className="text-xs text-slate-550">
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
                              <h5 className="font-sans font-black text-xs text-slate-800 leading-none">{comp.shortName}</h5>
                              <p className="text-[10px] text-slate-400 font-mono mt-2">ИНН: {comp.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                            <Button
                              onClick={() => onSelectCompany(comp.id)}
                              variant="light"
                              className="px-3 py-1.5 rounded-xl font-black text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-all duration-150"
                            >
                              <span>Карточка контрагента</span>
                            </Button>

                            <button
                              onClick={() => onToggleFavoriteCompany(comp.id)}
                              type="button"
                              className="p-1.5 rounded-xl border border-rose-100/80 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer active:scale-90 duration-75"
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
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-5 h-5 text-indigo-500 fill-indigo-500/10" />
                  <h3 className="font-sans font-black text-base text-slate-900">Избранные подборки в сравнительной витрине</h3>
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  Сохраненные настройки фильтров и подборки компаний
                </p>

                {((!favorites.industries || favorites.industries.length === 0) && (!favorites.companies || favorites.companies.length === 0)) ? (
                  <div className="border border-dashed border-slate-200 p-8 text-center rounded-2xl flex flex-col items-center justify-center bg-slate-50/30">
                    <Bookmark className="w-8 h-8 text-slate-300 stroke-[1.5] mb-2" />
                    <p className="text-xs text-slate-500 font-bold">У вас нет избранных подборок</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-sm">
                      Вы можете добавлять отраслевые срезы и индивидуальные подборки в избранное.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {favorites.industries && favorites.industries.map((indId) => {
                      // Retrieve industry human readable labels
                      const info = indId === 'wholesale' 
                        ? { title: 'Оптовая торговля ОКВЭД 46', desc: 'Бенчмарки ROS, рентабельности собственного капитала и автономии для торговых предприятий.' }
                        : indId === 'software'
                          ? { title: 'Информационные технологии ОКВЭД 62', desc: 'Прогрессивные мультипликаторы стоимости, коэффициенты автономии и инвестиционных бенчмарков.' }
                          : indId === 'banking'
                            ? { title: 'Банковский сектор ОКВЭД 64', desc: 'Специальные банковские нормативы достаточности капитала ЦБ РФ, ликвидности и пассивов.' }
                            : { title: 'Пользовательская подборка', desc: 'Ваш сохраненный индивидуальный срез и подборка контрагентов в сравнительной витрине.' };

                      return (
                        <div key={indId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-all gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8.5 h-8.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                              <Bookmark className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="font-sans font-black text-xs text-slate-800 leading-none">{info.title}</h5>
                              <p className="text-[10px] text-slate-400 mt-1.5 leading-normal font-sans">{info.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                            <Button
                              onClick={() => onSelectIndustry(indId as any)}
                              variant="light"
                              className="px-3 py-1.5 rounded-xl font-black text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-150"
                            >
                              <span>Открыть {indId === 'custom' ? 'витрину' : 'коэффициенты'}</span>
                            </Button>

                            <button
                              onClick={() => onToggleFavoriteIndustry(indId)}
                              type="button"
                              className="p-1.5 rounded-xl border border-rose-100/80 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer active:scale-90 duration-75"
                              title="Убрать"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {favorites.companies && favorites.companies.length > 0 && (!favorites.industries || !favorites.industries.includes('custom')) && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-all gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Bookmark className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-sans font-black text-xs text-slate-800 leading-none">Пользовательская подборка</h5>
                            <p className="text-[10px] text-slate-400 mt-1.5 leading-normal font-sans">Индивидуальный срез по вашим избранным компаниям ({favorites.companies.length} шт.) в сравнительной витрине.</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                          <Button
                            onClick={() => onSelectIndustry('custom')}
                            variant="light"
                            className="px-3 py-1.5 rounded-xl font-black text-[10.5px] cursor-pointer inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-150"
                          >
                            <span>Открыть витрину</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MY ARTICLES */}
          {activeSubTab === 'my_articles' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 gap-4 flex-wrap">
                  <div className="space-y-1">
                    <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2.5">
                      <FileBadge className="w-5 h-5 text-indigo-500" />
                      Мои авторские статьи и публикации
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal font-sans">
                      Отслеживайте статус модерации ваших статей, редактируйте отвергнутые материалы и отправляйте заявки на удаление.
                    </p>
                  </div>
                  {onStartCreatePublication && (
                    <button
                      onClick={onStartCreatePublication}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] duration-150 shrink-0 select-none"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Новая статья</span>
                    </button>
                  )}
                </div>

                {localPubs.length === 0 ? (
                  <div className="border border-dashed border-slate-200 p-12 text-center rounded-2xl bg-slate-50/10 flex flex-col items-center justify-center">
                    <FileBadge className="w-8 h-8 text-slate-300 stroke-[1.5] mb-2" />
                    <p className="text-xs text-slate-500 font-bold">Вы еще не создали ни одной статьи</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-sm">
                      Воспользуйтесь удобным визуальным конструктором статей в СМИ, чтобы скомпоновать качественный экспертный материал.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {localPubs.map((pub) => {
                      const isPending = pub.status === 'pending';
                      const isRejected = pub.status === 'rejected';
                      const isPublished = pub.status === 'published';
                      const isDeleted = pub.status === 'deleted';
                      const isDraft = pub.status === 'draft';
                      const isDeleteRequested = pub.deleteRequested === true;

                      const canEdit = (isRejected || isDeleted || isDraft) && onStartEditPublication;

                      return (
                        <div key={pub.id} className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 rounded-2xl transition duration-150 space-y-3">
                          {/* Top Status headers */}
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              {isDraft && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-300 text-[9px] font-mono font-black uppercase rounded">
                                  Черновик
                                </span>
                              )}
                              {isPending && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-mono font-black uppercase rounded">
                                  На модерации
                                </span>
                              )}
                              {isRejected && (
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-250/30 text-[9px] font-mono font-black uppercase rounded">
                                  Отклонено
                                </span>
                              )}
                              {isPublished && !isDeleteRequested && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono font-black uppercase rounded">
                                  Опубликовано
                                </span>
                              )}
                              {isDeleted && (
                                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 border border-slate-300 text-[9px] font-mono font-black uppercase rounded">
                                  Удалено
                                </span>
                              )}
                              {isDeleteRequested && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[9px] font-mono font-black uppercase rounded animate-pulse">
                                  Ожидает удаления
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-mono font-medium">{pub.date}</span>
                            </div>
                            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100/60 text-indigo-600 text-[9px] font-mono font-black uppercase rounded">
                              {getCategoryName(pub.category)}
                            </span>
                          </div>

                          {/* Body details */}
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 leading-snug">{pub.title}</h4>
                            <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{pub.summary}</p>
                          </div>

                          {/* Rejection message details */}
                          {isRejected && pub.moderatorComment && (
                            <div className="bg-rose-50/50 border border-rose-150 rounded-xl p-3 text-[11px] text-rose-800 space-y-1">
                              <span className="font-bold uppercase tracking-wider text-[9px] text-rose-700 block">Замечания модератора по доработке:</span>
                              <p className="leading-snug">{pub.moderatorComment}</p>
                            </div>
                          )}

                          {/* Request deletion details */}
                          {isDeleteRequested && pub.deleteRequestReason && (
                            <div className="bg-amber-50/50 border border-amber-150 rounded-xl p-3 text-[11px] text-amber-800 space-y-1">
                              <span className="font-bold uppercase tracking-wider text-[9px] text-amber-700 block">Причина запроса на удаление:</span>
                              <p className="leading-snug">{pub.deleteRequestReason}</p>
                            </div>
                          )}

                          {/* Actions row */}
                          <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-200/60">
                            {/* Left part actions */}
                            <div>
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() => onStartEditPublication(pub)}
                                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black flex items-center gap-1.5 cursor-pointer leading-none transition-all duration-150 active:scale-95 border-0"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>{isDeleted ? 'Восстановить статью' : 'Редактировать статью'}</span>
                                </button>
                              )}
                            </div>

                            {/* Right part actions: deletion request flow */}
                            <div>
                              {isDraft ? (
                                <>
                                  {confirmDeleteId === pub.id ? (
                                    <div className="flex items-center gap-1.5 bg-rose-50/50 border border-rose-100 p-1.5 rounded-xl">
                                      <span className="text-[10px] text-red-650 font-bold">Вы уверены?</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDraftDelete(pub.id)}
                                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[9.5px] font-semibold rounded-lg cursor-pointer transition"
                                      >
                                        Да, удалить
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[9.5px] font-semibold rounded-lg cursor-pointer transition"
                                      >
                                        Отмена
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(pub.id)}
                                      className="px-3 py-1.5 text-[10px] font-bold text-red-650 hover:bg-rose-50 border border-transparent hover:border-red-100 rounded-xl transition cursor-pointer"
                                    >
                                      Удалить
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  {!isDeleted && !isDeleteRequested && (
                                    <>
                                      {requestingDeleteId === pub.id ? (
                                        <div className="space-y-2 max-w-sm text-right">
                                          <input
                                            type="text"
                                            placeholder="Опишите причину удаления статьи..."
                                            value={deleteReason}
                                            onChange={(e) => setDeleteReason(e.target.value)}
                                            className="w-full sm:w-64 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                                          />
                                          <div className="flex justify-end gap-1.5 mt-1.5">
                                            <button
                                              type="button"
                                              onClick={() => setRequestingDeleteId(null)}
                                              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9.5px] font-bold cursor-pointer"
                                            >
                                              Отмена
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleSendDeleteRequest(pub.id)}
                                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9.5px] font-bold cursor-pointer"
                                            >
                                              Отправить заявку
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => { setRequestingDeleteId(pub.id); setDeleteReason(''); }}
                                          className="px-3 py-1.5 text-[10px] font-bold text-red-650 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition cursor-pointer"
                                        >
                                          Отправить заявку на удаление
                                        </button>
                                      )}
                                    </>
                                  )}

                                  {isDeleteRequested && (
                                    <span className="text-[10px] font-sans text-amber-600 font-bold">Ожидает подтверждения модератора</span>
                                  )}
                                </>
                              )}
                            </div>
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
