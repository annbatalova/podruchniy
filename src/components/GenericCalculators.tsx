import { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  TrendingUp, 
  Scale, 
  ShieldAlert,
  ShieldCheck,
  Undo2
} from 'lucide-react';

export default function GenericCalculators() {
  const [calcType, setCalcType] = useState<'altman' | 'liquidity' | 'autonomy'>('altman');

  // --- 1. ALTMAN Z-SCORE STATE ---
  const [altmanInps, setAltmanInps] = useState({
    x1: 0.15, // NWC / Total Assets
    x2: 0.22, // Retained Earnings / Total Assets
    x3: 0.12, // EBIT / Total Assets
    x4: 0.45, // Market Value Equity / Total Liabilities
    x5: 1.05  // Sales / Total Assets
  });

  const rawZ = (1.2 * altmanInps.x1) + (1.4 * altmanInps.x2) + (3.3 * altmanInps.x3) + (0.6 * altmanInps.x4) + (0.999 * altmanInps.x5);
  const zScore = parseFloat(rawZ.toFixed(3));

  let zGrade = 'Зона банкротства (Высокий Риск)';
  let zColor = 'text-rose-500 border-rose-500 bg-rose-500/10';
  let zAdvice = 'Индекс ниже 1.1 указывает на критический риск неплатежеспособности.';

  if (zScore > 2.6) {
    zGrade = 'Безопасная зона (Устойчивая)';
    zColor = 'text-sky-400 border-sky-500 bg-sky-500/10';
    zAdvice = 'Финансовое положение компании устойчивое. Вероятность банкротства пренебрежимо мала.';
  } else if (zScore >= 1.1) {
    zGrade = 'Серая зона (Требует мониторинга)';
    zColor = 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
    zAdvice = 'Граница неопределенности. Риск умеренный, рекомендуется жесткий контроль дебиторской задолженности.';
  }

  // --- 2. LIQUIDITY STATE ---
  const [liqInps, setLiqInps] = useState({
    currentAssets: 50000,
    currentLiabilities: 35000
  });
  const currentLiqRatio = liqInps.currentLiabilities > 0 
    ? parseFloat((liqInps.currentAssets / liqInps.currentLiabilities).toFixed(2)) 
    : 0;

  // --- 3. AUTONOMY STATE ---
  const [autInps, setAutInps] = useState({
    equity: 45000,
    totalAssets: 90000
  });
  const autonomyRatio = autInps.totalAssets > 0 
    ? parseFloat((autInps.equity / autInps.totalAssets).toFixed(2)) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none animate-fadeIn transition-colors duration-200">
      
      {/* Selector and inputs column (2/3 width) */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-500" />
            Учебные финансовые мини-калькуляторы
          </h3>
          <span className="text-xs text-slate-400">Введите свои значения для расчета</span>
        </div>

        {/* Calculator switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setCalcType('altman')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              calcType === 'altman'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Индекс Альтмана (Z-Score)
          </button>
          <button
            onClick={() => setCalcType('liquidity')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              calcType === 'liquidity'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Текущая ликвидность
          </button>
          <button
            onClick={() => setCalcType('autonomy')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              calcType === 'autonomy'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Коэффициент автономии
          </button>
        </div>

        {/* ALTMAN FORM SCREEN */}
        {calcType === 'altman' && (
          <div className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  X1: ЧОК / Активы (NWC / Assets)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={altmanInps.x1}
                  onChange={(e) => setAltmanInps({ ...altmanInps, x1: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  X2: Накопленная прибыль / Активы
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={altmanInps.x2}
                  onChange={(e) => setAltmanInps({ ...altmanInps, x2: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  X3: EBIT / Общие Активы
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={altmanInps.x3}
                  onChange={(e) => setAltmanInps({ ...altmanInps, x3: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  X4: Собственный капитал / Обязательства
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={altmanInps.x4}
                  onChange={(e) => setAltmanInps({ ...altmanInps, x4: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  X5: Выручка / Общие Активы
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={altmanInps.x5}
                  onChange={(e) => setAltmanInps({ ...altmanInps, x5: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <button
              onClick={() => setAltmanInps({ x1: 0.15, x2: 0.22, x3: 0.12, x4: 0.45, x5: 1.05 })}
              className="text-[10px] font-black underline uppercase text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-1.5 mt-2"
            >
              <Undo2 className="w-3.5 h-3.5" /> Сбросить К дефолтным
            </button>
          </div>
        )}

        {/* LIQUIDITY FORM SCREEN */}
        {calcType === 'liquidity' && (
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Сумма оборотных активов (тыс. ₽)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={liqInps.currentAssets}
                  onChange={(e) => setLiqInps({ ...liqInps, currentAssets: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Краткосрочные обязательства (тыс. ₽)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={liqInps.currentLiabilities}
                  onChange={(e) => setLiqInps({ ...liqInps, currentLiabilities: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Формула: КТЛ = Оборотные активы / Краткосрочные обязательства. Оптимальное эталонное значение лежит в пределах от 1.5 до 2.0.
            </p>
          </div>
        )}

        {/* AUTONOMY FORM SCREEN */}
        {calcType === 'autonomy' && (
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Собственный капитал (тыс. ₽)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={autInps.equity}
                  onChange={(e) => setAutInps({ ...autInps, equity: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Сумма совокупных активов (тыс. ₽)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  value={autInps.totalAssets}
                  onChange={(e) => setAutInps({ ...autInps, totalAssets: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Формула: Кавтономии = Собственный Капитал / Итог баланса (Активы). Показывает долю личной собственности в имуществе фирмы. Рекомендуемая критическая отметка &gt; 0.5.
            </p>
          </div>
        )}
      </div>

      {/* Dynamic calculation result sidebar card (1/3 width) */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400 animate-pulse" />
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Результат калькулятора
            </h4>
          </div>

          {calcType === 'altman' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Индекс Z-Score</span>
                <span className="text-4xl font-black font-mono text-slate-100 my-1">{zScore}</span>
                <span className={`px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase text-center border ${zColor}`}>
                  {zGrade}
                </span>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-normal">
                {zAdvice}
              </div>
            </div>
          )}

          {calcType === 'liquidity' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Коэффициент ликвидности</span>
                <span className="text-4xl font-black font-mono text-slate-100 my-1">{currentLiqRatio}</span>
                <span className={`px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase border ${
                  currentLiqRatio >= 1.5 
                    ? 'text-sky-400 border-sky-500/20 bg-sky-500/10' 
                    : currentLiqRatio >= 1.0 
                    ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' 
                    : 'text-rose-400 border-rose-500/20 bg-rose-500/10'
                }`}>
                  {currentLiqRatio >= 1.5 ? 'Норма достигнута' : currentLiqRatio >= 1.0 ? 'Граница предупреждения' : 'Критический зазор'}
                </span>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-normal">
                При коэффициенте ниже 1.0 обязательства превосходят способность их покрытия, что влечет неминуемые технические задержки при банковских расчетах.
              </div>
            </div>
          )}

          {calcType === 'autonomy' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Доля финансирования</span>
                <span className="text-4xl font-black font-mono text-slate-100 my-1">{autonomyRatio}</span>
                <span className={`px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase border ${
                  autonomyRatio >= 0.5 
                    ? 'text-sky-400 border-sky-500/20 bg-sky-500/10' 
                    : autonomyRatio >= 0.3 
                    ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' 
                    : 'text-rose-400 border-rose-500/20 bg-rose-500/10'
                }`}>
                  {autonomyRatio >= 0.5 ? 'Полная финансовая независимость' : autonomyRatio >= 0.3 ? 'Заемный паритет' : 'Опасная зависимость'}
                </span>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-normal">
                При значении менее 0.3 более 70% средств компании являются долгом. Незначительные судебные претензии способны мгновенно сломать структуру баланса.
              </div>
            </div>
          )}
        </div>

        {/* Education note at bottom */}
        <div className="pt-4 border-t border-slate-800/80 mt-6 text-[10px] leading-relaxed text-slate-400 flex items-start gap-2">
          <Scale className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>Для глубокого понимания взаимосвязей финансовых коэффициентов рекомендуется менять параметры поочередно.</span>
        </div>
      </div>
    </div>
  );
}
