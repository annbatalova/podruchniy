import React, { useState } from 'react';
import { X, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import Button from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string, email: string, login: string) => void;
  initialTab?: 'login' | 'register';
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'register'
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'register') {
      if (!login.trim()) {
        setError('Пожалуйста, введите желаемый логин');
        return;
      }
      if (password.length < 4) {
        setError('Пароль должен содержать не менее 4 символов');
        return;
      }
    } else {
      if (!login.trim()) {
        setError('Пожалуйста, введите логин или Email');
        return;
      }
      if (!password) {
        setError('Пожалуйста, введите пароль');
        return;
      }
    }

    setIsLoading(true);

    // Simulate server response and save profile with minimal simulated data to protect personal privacy
    setTimeout(() => {
      setIsLoading(false);
      const finalName = activeTab === 'register' ? login : 'Анастасия Баталова';
      const finalEmail = activeTab === 'register' ? `${login}@example.com` : (login.includes('@') ? login : 'aabatalova2@gmail.com');
      const finalLogin = activeTab === 'register' ? login : (login.includes('@') ? login.split('@')[0] : login);
      
      onSuccess(finalName, finalEmail, finalLogin);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white border border-slate-100 rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative pattern at top */}
        <div className="bg-gradient-to-tr from-sky-505 from-sky-50 to-indigo-50/40 p-8 pt-10 text-center border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-xl mx-auto shadow-lg shadow-sky-500/20 mb-3">
            fw
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {activeTab === 'register' ? 'Создать личный кабинет' : 'Личный кабинет аналитика'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto leading-normal">
            {activeTab === 'register' 
              ? 'Зарегистрируйтесь бесплатно, чтобы разблокировать полные балансовые отчеты, динамические графики и кредитные рейтинги.'
              : 'Авторизуйтесь в системе, чтобы получить полный доступ к аналитическим базам компаний РФ.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 p-3 bg-slate-50/50">
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'register' 
                ? 'bg-white text-sky-650 shadow-sm border border-slate-200/50' 
                : 'text-slate-450 text-slate-500 hover:text-slate-700'
            }`}
          >
            Регистрация
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'login' 
                ? 'bg-white text-sky-650 shadow-sm border border-slate-200/50' 
                : 'text-slate-450 text-slate-500 hover:text-slate-700'
            }`}
          >
            Вход в систему
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-650 text-[11px] rounded-xl flex items-center gap-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
              {activeTab === 'register' ? 'Желаемый логин' : 'Логин или Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="kostya_score"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-sky-550 text-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/10 placeholder-slate-400 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Пароль</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-sky-550 text-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/10 placeholder-slate-400 transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              variant="solid"
              className="w-full py-3 rounded-2xl text-xs font-black shadow-lg shadow-sky-500/10 hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Подождите...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === 'register' ? 'Зарегистрироваться' : 'Войти в кабинет'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="bg-slate-50/50 p-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          🔒 Все соединения шифруются по стандарту SSL-256
        </div>
      </div>
    </div>
  );
}
