import { useState } from 'react';
import Button from './Button';
import { 
  Building2, 
  TrendingUp, 
  Scale, 
  Activity, 
  HelpCircle, 
  Calculator,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import FinWolfLogo from './FinWolfLogo';

interface SidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
  status: 'active' | 'bankruptcy';
  scoreMark: string;
  scorePercent: number;
}

export default function Sidebar({ 
  activeSection, 
  onSectionClick, 
  status, 
  scoreMark, 
  scorePercent 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    { id: 'profile', name: 'Профиль компании', icon: Building2 },
    { id: 'reports', name: 'Финансовая отчетность', icon: FileSpreadsheet },
    { id: 'charts', name: 'Динамика показателей', icon: TrendingUp },
    { id: 'bankruptcy', name: 'Риски и Банкротство', icon: HelpCircle, badge: status === 'bankruptcy' ? 'Процедура' : undefined },
    { id: 'arbitration', name: 'Арбитражные дела', icon: Scale },
    { id: 'sandbox', name: 'Оценка бизнеса', icon: Calculator, highlight: true }
  ];

  return (
    <aside 
      id="dashboard_sidebar"
      className={`bg-white text-slate-800 lg:min-h-[calc(100vh-64px)] lg:sticky lg:top-16 p-4 flex flex-col justify-between border-r border-slate-200/80 shrink-0 select-none transition-all duration-300 ${
        isCollapsed ? 'w-full lg:w-20' : 'w-full lg:w-72'
      }`}
    >
      <div>
        {/* Menu items */}
        <nav className="space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                onClick={() => onSectionClick(item.id)}
                title={item.name}
                variant="ghost"
                isActive={isActive}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center py-3' : '!justify-start px-3 py-2.5'} rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left ${
                  isActive 
                    ? 'bg-[#d8f2fe] text-[#0ea5e9] font-black shadow-sm' 
                    : item.highlight
                    ? 'text-sky-500 hover:bg-slate-50 hover:text-sky-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 p-0.5 ${isActive ? 'text-[#0ea5e9]' : item.highlight ? 'text-sky-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <>
                    <div className="flex-1" />
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-rose-50 text-right">
                      {item.badge}
                    </span>
                  </>
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Collapse action */}
      <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-6">
        {!isCollapsed ? (
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            <div>Версия 2026.1</div>
            <div className="mt-1">Для экономических вузов и юристов</div>
          </div>
        ) : (
          <div className="text-[10px] font-mono text-slate-400 text-center">v26</div>
        )}

        {/* Toggle Button */}
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="light"
          className="w-full py-2 border border-slate-200/50 dark:border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-bold gap-2 cursor-pointer transition"
          title={isCollapsed ? "Развернуть панель" : "Свернуть панель"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-sky-500" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-sky-500" />
              <span>Свернуть панель</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
