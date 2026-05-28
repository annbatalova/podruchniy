import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart as ReBarChart, 
  Bar as ReBar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  Scale, 
  TrendingUp, 
  Compass, 
  Briefcase, 
  Undo2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Company, ArbitrationCase } from '../types';

interface ArbitrationDashboardProps {
  company: Company;
}

export default function ArbitrationDashboard({ company }: ArbitrationDashboardProps) {
  const [period, setPeriod] = useState<'all' | '5y' | '3y' | '1y'>('5y');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [sumFrom, setSumFrom] = useState('');
  const [sumTo, setSumTo] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'large' | 'small'>('large');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Filter cases based on choices
  const filteredCases = useMemo(() => {
    let result = [...company.arbitration.cases];

    // Period filter
    const currentYear = 2026;
    if (period !== 'all') {
      const boundaryYear = currentYear - (period === '1y' ? 1 : period === '3y' ? 3 : 5);
      result = result.filter(c => {
        const year = parseInt(c.date.split('-')[0]);
        return year >= boundaryYear;
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.number.toLowerCase().includes(q) ||
        c.court.toLowerCase().includes(q) ||
        c.plaintiff.toLowerCase().includes(q) ||
        c.defendant.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(c => c.role === roleFilter);
    }

    // Court filter
    if (courtFilter !== 'all') {
      result = result.filter(c => c.court === courtFilter);
    }

    // Sum boundary filters
    if (sumFrom) {
      result = result.filter(c => c.amount >= parseFloat(sumFrom));
    }
    if (sumTo) {
      result = result.filter(c => c.amount <= parseFloat(sumTo));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') return b.date.localeCompare(a.date);
      if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
      if (sortOrder === 'large') return b.amount - a.amount;
      if (sortOrder === 'small') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [company, period, searchQuery, roleFilter, courtFilter, sumFrom, sumTo, sortOrder]);

  // Pagination details
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / itemsPerPage));
  const displayedCases = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredCases.slice(start, start + itemsPerPage);
  }, [filteredCases, page]);

  // Unique list of courts for select drop down
  const uniqueCourts = useMemo(() => {
    const courts = company.arbitration.cases.map(c => c.court);
    return Array.from(new Set(courts)).sort();
  }, [company]);

  // Aggregate metrics summary reflecting filtered cases
  const metrics = useMemo(() => {
    let plist = 0, dlist = 0, ulist = 0;
    let pSum = 0, dSum = 0, uSum = 0;

    filteredCases.forEach((c) => {
      if (c.role === 'Истец') {
        plist++;
        pSum += c.amount;
      } else if (c.role === 'Ответчик') {
        dlist++;
        dSum += c.amount;
      } else {
        ulist++;
        uSum += c.amount;
      }
    });

    const totalCount = filteredCases.length;

    return {
      pCount: plist,
      pVal: pSum,
      pPct: totalCount ? Math.round((plist / totalCount) * 100) : 0,
      
      dCount: dlist,
      dVal: dSum,
      dPct: totalCount ? Math.round((dlist / totalCount) * 100) : 0,
      
      uCount: ulist,
      uVal: uSum,
      uPct: totalCount ? Math.round((ulist / totalCount) * 100) : 0,

      totalSum: pSum + dSum + uSum,
      totalCount
    };
  }, [filteredCases]);

  // Charts prep data
  const donutData = [
    { name: 'Истец', value: metrics.pCount, color: '#0ea5e9' },
    { name: 'Ответчик', value: metrics.dCount, color: '#ef4444' },
    { name: 'Роль не определена', value: metrics.uCount, color: '#3b82f6' }
  ].filter(d => d.value > 0);

  // Dyn by Year data prep
  const dynamicsData = useMemo(() => {
    const yearsMap: Record<string, number> = {};
    filteredCases.forEach(c => {
      const yr = c.date.split('-')[0];
      yearsMap[yr] = (yearsMap[yr] || 0) + 1;
    });
    return Object.entries(yearsMap)
      .sort((a,b) => a[0].localeCompare(b[0]))
      .map(([year, count]) => ({ year, 'Кол-во дел': count }));
  }, [filteredCases]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setCourtFilter('all');
    setSumFrom('');
    setSumTo('');
    setSortOrder('large');
    setPeriod('5y');
    setPage(1);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* 1. Dashboard Filters Head */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-500" />
            Арбитражный баланс судебных дел
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Юридический анализ, распределение ответственности и финансовые претензии контрагентов
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">Период:</span>
          <select 
            value={period}
            onChange={(e) => { setPeriod(e.target.value as any); setPage(1); }}
            className="p-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="5y">Последние 5 лет</option>
            <option value="3y">Последние 3 года</option>
            <option value="1y">Последний год</option>
            <option value="all">Все время</option>
          </select>
        </div>
      </div>

      {/* 2. Metrics & Pie representation Dashboard Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scaleUp">
        
        {/* Core role metrics counters (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between font-sans">
          <div className="space-y-4">
            
            {/* Plaintiff item */}
            <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 bg-sky-50/10 dark:bg-sky-950/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-sky-100 dark:bg-sky-955 text-sky-750 text-sky-700 dark:text-sky-455 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-sky-705 text-sky-700 dark:text-sky-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Иски компании как истца</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">Требования о взыскании долгов</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-sky-700 dark:text-sky-400 font-mono">
                  {metrics.pVal.toFixed(1)} млн ₽
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{metrics.pCount} дел ({metrics.pPct}%)</div>
              </div>
            </div>

            {/* Defendant item */}
            <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800/60 bg-rose-50/15 dark:bg-rose-950/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-100 dark:bg-rose-955 text-rose-700 dark:text-rose-450 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-705 text-rose-700 dark:text-rose-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Требования к компании как ответчику</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">Внешние претензии и иски кредиторов</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-rose-700 dark:text-rose-405 font-mono">
                  {metrics.dVal.toFixed(1)} млн ₽
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{metrics.dCount} дел ({metrics.dPct}%)</div>
              </div>
            </div>

            {/* Unknown role */}
            <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800/60 bg-blue-50/10 dark:bg-blue-950/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-955 text-blue-700 dark:text-blue-450 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-705 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Роль не определена</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">Слушания в качестве третьих лиц / ассоциаций</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-blue-700 dark:text-blue-405 font-mono">
                  {metrics.uVal.toFixed(1)} млн ₽
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{metrics.uCount} дел ({metrics.uPct}%)</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/85 pt-4 mt-2 font-sans">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide block font-mono">Общая сумма споров</span>
              <strong className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                {metrics.totalSum.toFixed(1)} млн ₽
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide block font-mono">Активных дел</span>
              <strong className="text-lg font-black text-slate-950 dark:text-slate-100 font-mono">
                {metrics.totalCount} дел
              </strong>
            </div>
          </div>
        </div>

        {/* Donut representation of roles (1/3 width) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between align-middle text-center font-sans">
          <div>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-mono">
              Распределение ролей в судах
            </h4>
            <div className="h-44 w-full flex items-center justify-center relative">
              {donutData.length > 0 ? (
                <PieChart width={140} height={140}>
                  <Pie
                     data={donutData}
                     cx="50%"
                     cy="50%"
                     innerRadius={45}
                     outerRadius={60}
                     paddingAngle={3}
                     dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <div className="text-xs text-slate-400 dark:text-slate-500">Нет данных судебных дел за период</div>
              )}
              {/* Abs center values overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{metrics.totalCount}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">судебных дел</span>
              </div>
            </div>
          </div>

          {/* Legend list */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100/80 dark:border-slate-800/80">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Истец</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Ответчик</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Не опр.</span>
          </div>
        </div>
      </div>

      {/* 4. Filterable, Paginated Cases Table Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row items-baseline justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scale className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
            Все арбитражные дела компании в хронологии
          </h4>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono select-none">
            Найдено: {filteredCases.length} судебных процессов
          </span>
        </div>

        {/* Input Filter Dashboard Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pb-3">
          
          {/* Text search */}
          <div className="relative">
            <input 
              type="text"
              placeholder="Поиск по номеру / суду..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full text-xs p-2 pl-7 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 placeholder-slate-400 dark:placeholder-slate-550"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-3" />
          </div>

          {/* Role selector */}
          <select 
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="text-xs p-2 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-300"
          >
            <option value="all">Все роли</option>
            <option value="Истец">Роль: Истец</option>
            <option value="Ответчик">Роль: Ответчик</option>
            <option value="Не определена">Роль: Не определена</option>
          </select>

          {/* Court Selector */}
          <select 
            value={courtFilter}
            onChange={(e) => { setCourtFilter(e.target.value); setPage(1); }}
            className="text-xs p-2 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-300"
          >
            <option value="all">Все арбитражные суды</option>
            {uniqueCourts.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Sum boundaries */}
          <input 
            type="number"
            placeholder="Сумма от, млн ₽"
            value={sumFrom}
            onChange={(e) => { setSumFrom(e.target.value); setPage(1); }}
            className="w-full text-xs p-2 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-350 font-sans"
          />

          {/* Sum to */}
          <input 
            type="number"
            placeholder="Сумма до, млн ₽"
            value={sumTo}
            onChange={(e) => { setSumTo(e.target.value); setPage(1); }}
            className="w-full text-xs p-2 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-350 font-sans"
          />

          {/* Sorting Order */}
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs p-2 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-300"
          >
            <option value="large">Сначала крупные иски</option>
            <option value="small">Сначала мелкие иски</option>
            <option value="newest">Сначала новые дела</option>
            <option value="oldest">Сначала старые дела</option>
          </select>
        </div>

        {/* Clean Reset Filter Button */}
        {(searchQuery || roleFilter !== 'all' || courtFilter !== 'all' || sumFrom || sumTo || period !== '5y') && (
          <div className="flex items-center gap-2 self-start py-1">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-500 dark:hover:border-sky-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-[10px] font-black cursor-pointer uppercase tracking-wider"
            >
              <Undo2 className="w-3 h-3" /> Очистить фильтры
            </button>
          </div>
        )}

        {/* Real Courts Table list */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold font-sans">
                <th className="p-4" style={{ width: '150px' }}>Номер дела</th>
                <th className="p-4" style={{ width: '120px' }}>Дата старта</th>
                <th className="p-4" style={{ width: '220px' }}>Арбитражный суд</th>
                <th className="p-4" style={{ width: '120px' }}>Роль компании</th>
                <th className="p-4">Истец контрагент</th>
                <th className="p-4">Ответчик</th>
                <th className="p-4 text-right" style={{ width: '130px' }}>Сумма требований</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-sans">
              {displayedCases.length > 0 ? (
                displayedCases.map((c, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition duration-150">
                      <td className="p-4 font-black text-slate-900 dark:text-slate-100 font-mono">
                        <span className="hover:underline cursor-pointer text-sky-600 dark:text-sky-455">{c.number}</span>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">
                        {c.date.split('-').reverse().join('.')}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 flex items-center gap-1 max-w-[14rem] truncate" title={c.court}>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span className="truncate">{c.court}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                          c.role === 'Истец' 
                            ? 'bg-sky-100 dark:bg-sky-955 text-sky-800 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50' 
                            : c.role === 'Ответчик'
                            ? 'bg-rose-100 dark:bg-rose-955 text-rose-800 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50'
                            : 'bg-blue-100 dark:bg-blue-955 text-blue-800 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50'
                        }`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 truncate max-w-[11rem]" title={c.plaintiff}>
                        {c.plaintiff}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 truncate max-w-[11rem]" title={c.defendant}>
                        {c.defendant}
                      </td>
                      <td className="p-4 text-right font-black text-slate-900 dark:text-slate-100 font-mono bg-slate-50/20 dark:bg-slate-950/20">
                        {c.amount.toFixed(1)} млн ₽
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 dark:text-slate-500 font-sans">
                    С назначенными претензиями или фильтрами дела не обнаружены.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs select-none">
            <span className="text-slate-400 dark:text-slate-500">
              Показано {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredCases.length)} из {filteredCases.length}
            </span>

            <div className="flex items-center gap-1 font-sans">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const step = i + 1;
                return (
                  <button
                    key={step}
                    onClick={() => setPage(step)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition ${
                      page === step
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {step}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
              >
                Вперед <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
