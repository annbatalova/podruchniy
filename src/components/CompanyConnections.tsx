import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Company } from '../types';
import { 
  Network, 
  User, 
  Building2, 
  LineChart, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  FileText,
  AlertCircle
} from 'lucide-react';

interface CompanyConnectionsProps {
  company: Company;
  onBack: () => void;
}

interface ConnectedNode {
  id: string; // INN or Person ID
  name: string;
  type: 'founder' | 'subsidiary' | 'director' | 'affiliated';
  share?: number; // Share % in capital
  status: 'active' | 'warning' | 'critical' | 'dead';
  statusText: string;
  scoreMark: string;
  scorePercent: number;
  inn?: string;
  addressRelation?: boolean;
  legalRelation?: string;
  riskDescription: string;
}

export default function CompanyConnections({ company, onBack }: CompanyConnectionsProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'founder' | 'subsidiary' | 'risk'>('all');

  // Generate connection tree data based on current company ID
  const getNodes = (companyId: string): ConnectedNode[] => {
    switch (companyId) {
      case '7707083893': // ПАО СБЕРБАНК
        return [
          {
            id: 'node_f1',
            name: 'Центральный банк РФ (Банк России)',
            type: 'founder',
            share: 50.01,
            status: 'active',
            statusText: 'Действующий государственный регулятор',
            scoreMark: 'AAA',
            scorePercent: 100,
            inn: '7702235133',
            legalRelation: 'Мажоритарный акционер, контролирующий пакет акций',
            riskDescription: 'Кредитный риск полностью отсутствует. Абсолютный уровень государственной поддержки.'
          },
          {
            id: 'node_f2',
            name: 'Миноритарные акционеры (Public Float)',
            type: 'founder',
            share: 49.99,
            status: 'active',
            statusText: 'Свободное обращение на бирже',
            scoreMark: 'AAA',
            scorePercent: 95,
            legalRelation: 'Портфельные инвестиции физических и юридических лиц',
            riskDescription: 'Множественный диверсифицированный капитал. Низкий риск консолидированного давления бенефициаров.'
          },
          {
            id: 'node_d1',
            name: 'Греф Герман Оскарович',
            type: 'director',
            status: 'active',
            statusText: 'Президент, Председатель Правления',
            scoreMark: 'AAA',
            scorePercent: 98,
            legalRelation: 'Единоличный исполнительный орган управления',
            riskDescription: 'Ключевая фигура менеджмента. Риск потери ключевого лидера компенсируется сильной системной преемственностью.'
          },
          {
            id: 'node_s1',
            name: 'ООО "Сбербанк Лизинг"',
            type: 'subsidiary',
            share: 100,
            status: 'active',
            statusText: 'Крупная специализированная лизинговая компания',
            scoreMark: 'AAA',
            scorePercent: 97,
            inn: '7707009586',
            legalRelation: '100% дочернее зависимое общество (ДЗО)',
            riskDescription: 'Показатели ликвидности и рентабельности превосходят среднеотраслевые маркеры. Минимальный операционный риск.'
          },
          {
            id: 'node_s2',
            name: 'ООО "Сбербанк Страхование"',
            type: 'subsidiary',
            share: 100,
            status: 'active',
            statusText: 'Действующий страховщик общероссийского масштаба',
            scoreMark: 'AA',
            scorePercent: 92,
            inn: '7706810774',
            legalRelation: 'Дочернее общество по страхованию жизни и имущества',
            riskDescription: 'Высокие темпы роста объема полученных страховых премий. Стабильные инвестиционные резервы.'
          },
          {
            id: 'node_s3',
            name: 'АО "Сбербанк Технологии" (Сбертех)',
            type: 'subsidiary',
            share: 100,
            status: 'active',
            statusText: 'Аккредитованная российская IT-компания',
            scoreMark: 'AA',
            scorePercent: 94,
            inn: '7736631671',
            legalRelation: 'Ключевой внутренний разработчик программного обеспечения группы',
            riskDescription: 'Существенная нематериальная ценность (патенты, ядро ПО платформы). Синергетическая зависимость от банка России.'
          },
          {
            id: 'node_a1',
            name: 'АНО "Цифровая экономика"',
            type: 'affiliated',
            status: 'active',
            statusText: 'Некоммерческая организация развития рынков',
            scoreMark: 'A',
            scorePercent: 85,
            inn: '7704443997',
            legalRelation: 'Совпадение руководителя (Греф Г.О. является членом совета директоров)',
            riskDescription: 'Политически значимая связь. Отсутствие прямого вывода активов на некоммерческую основу.'
          }
        ];

      case '6234160787': // ООО СЕРВИС (Bankruptcy, D-grade)
        return [
          {
            id: 'node_f1',
            name: 'Иванов Иван Иванович',
            type: 'founder',
            share: 60,
            status: 'critical',
            statusText: 'Критическое состояние, риск банкротства физлица',
            scoreMark: 'D',
            scorePercent: 10,
            legalRelation: 'Мажоритарный владелец контролирующей доли',
            riskDescription: 'Высок риск привлечения к субсидиарной ответственности в рамках судебного дела ООО Сервис. Собственное имущество под угрозой изъятия.'
          },
          {
            id: 'node_f2',
            name: 'Смирнов Петр Сергеевич',
            type: 'founder',
            share: 40,
            status: 'warning',
            statusText: 'Действующий предприниматель с ограничениями',
            scoreMark: 'B',
            scorePercent: 52,
            legalRelation: 'Миноритарный соучредитель бизнеса',
            riskDescription: 'Умеренное финансовое давление, арест долей компании затрудняет операционную реструктуризацию долгов.'
          },
          {
            id: 'node_s1',
            name: 'ООО "РязаньПоставка"',
            type: 'subsidiary',
            share: 90,
            status: 'critical',
            statusText: 'Инициирована параллельная процедура банкротства',
            scoreMark: 'D',
            scorePercent: 8,
            inn: '6234001222',
            legalRelation: 'Контролируемое дочернее общество',
            riskDescription: 'Параллельное банкротство дочерней структуры означает полное обесценение финансовых вложений ООО Сервис (строка 1170 баланса полностью списана в убыток).'
          },
          {
            id: 'node_s2',
            name: 'ООО "Вектор Ритейл"',
            type: 'subsidiary',
            share: 100,
            status: 'dead',
            statusText: 'Ликвидировано ФНС по решению суда в 2025 г.',
            scoreMark: 'F',
            scorePercent: 0,
            inn: '6234998811',
            legalRelation: 'Бывшая дочерняя организация',
            riskDescription: 'Компания исключена из ЕГРЮЛ. Выявлены признаки вывода оставшихся ликвидных запасов перед ликвидацией. Ущерб признан безвозвратным.'
          },
          {
            id: 'node_a1',
            name: 'ООО "Партнер"',
            type: 'affiliated',
            status: 'critical',
            statusText: 'Выявлены признаки фирмы-однодневки',
            scoreMark: 'C',
            scorePercent: 18,
            inn: '6234771122',
            addressRelation: true,
            legalRelation: 'Аффилированность по общему руководителю Иванову И.И. и адресу массовой регистрации',
            riskDescription: 'Зарегистрировано более 15 компаний на аналогичном адресе без реальных сотрудников в штате. Высокий риск схемного налогового сокрытия выручки.'
          }
        ];

      case '7701358912': // ООО МЕРИДИАН (Active, BBB)
        return [
          {
            id: 'node_f1',
            name: 'Кузнецова Елена Ивановна',
            type: 'founder',
            share: 100,
            status: 'active',
            statusText: 'Стабильный индивидуальный бенефициар',
            scoreMark: 'A',
            scorePercent: 84,
            legalRelation: 'Единственный учредитель (100% уставного капитала)',
            riskDescription: 'Абсолютный контроль над холдингом. Риски разногласий между партнерами отсутствуют. Однако присутствует риск концентрации управления.'
          },
          {
            id: 'node_s1',
            name: 'ООО "Меридиан Транс"',
            type: 'subsidiary',
            share: 75,
            status: 'active',
            statusText: 'Действующий транспортно-логистический оператор',
            scoreMark: 'B',
            scorePercent: 58,
            inn: '7701889911',
            legalRelation: 'Дочерняя транспортная компания',
            riskDescription: 'Обеспечивает логистику основного бизнеса. Имеет небольшой кассовый разрыв, но закрывает его за счет кредитов от материнской компании.'
          },
          {
            id: 'node_s2',
            name: 'ООО "ЛесЭкспорт"',
            type: 'subsidiary',
            share: 100,
            status: 'warning',
            statusText: 'Умеренный риск, падение рентабельности',
            scoreMark: 'BB',
            scorePercent: 42,
            inn: '7701552233',
            legalRelation: 'Дочерняя торговая фирма по сырью',
            riskDescription: 'Подвержена экспортным санкционным ограничениям. Наблюдается рост долга перед поставщиками и риск судебных претензий.'
          },
          {
            id: 'node_a1',
            name: 'ООО "АвтоТранс"',
            type: 'affiliated',
            status: 'warning',
            statusText: 'Подозрение на взаимозависимость продаж',
            scoreMark: 'C',
            scorePercent: 36,
            inn: '7701994411',
            addressRelation: true,
            legalRelation: 'Совпадение юридического адреса массовой регистрации',
            riskDescription: 'Адрес фигурирует в списках массовой регистрации налоговой инспекции. Риски налоговых придирок при трансфертном ценообразовании.'
          }
        ];

      case '7725492104': // АО АЛЬФА-ТЕХНОЛОГИИ (Active, A)
        return [
          {
            id: 'node_f1',
            name: 'Сабиров Тимур Наилевич',
            type: 'founder',
            share: 45,
            status: 'active',
            statusText: 'Генеральный директор и соучредитель',
            scoreMark: 'AA',
            scorePercent: 90,
            legalRelation: 'Учредитель и ключевой технический директор',
            riskDescription: 'Имеет высокую деловую репутацию в IT-сфере. Патенты оформлены на компанию, что защищает бизнес.'
          },
          {
            id: 'node_f2',
            name: 'АО "Инвест-Холдинг"',
            type: 'founder',
            share: 55,
            status: 'active',
            statusText: 'Российский венчурный фонд закрытого типа',
            scoreMark: 'AAA',
            scorePercent: 96,
            inn: '7725112233',
            legalRelation: 'Владелец мажоритарного инвест-пакета',
            riskDescription: 'Крупная финансовая группа с диверсифицированными вложениями. Высокая финансовая глубина и ликвидность.'
          },
          {
            id: 'node_s1',
            name: 'ООО "Альфа Лабс"',
            type: 'subsidiary',
            share: 100,
            status: 'active',
            statusText: 'Действующий резидент инновационного центра Сколково',
            scoreMark: 'AA',
            scorePercent: 92,
            inn: '7725556677',
            legalRelation: 'Разработчик экспериментального софта',
            riskDescription: 'Пользуется льготами по страховым взносам. Высокая норма чистой прибыли и отсутствие какого-либо долга.'
          },
          {
            id: 'node_a1',
            name: 'ООО "Интеграция"',
            type: 'affiliated',
            status: 'active',
            statusText: 'Аффилированный системный дистрибьютор',
            scoreMark: 'A',
            scorePercent: 82,
            inn: '7725881100',
            legalRelation: 'Общие бенефициары через АО Инвест-Холдинг',
            riskDescription: 'Взаимная координация продаж. Цены контрактов соответствуют стандартным рыночным границам.'
          }
        ];

      default:
        return [];
    }
  };

  const nodes = getNodes(company.id);
  
  // Set default selection to first node on mount
  useEffect(() => {
    if (nodes.length > 0 && !selectedNodeId) {
      setSelectedNodeId(nodes[0].id);
    }
  }, [company.id, nodes]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Perform filtration logic
  const filteredNodes = nodes.filter(n => {
    if (activeFilter === 'founder') return n.type === 'founder' || n.type === 'director';
    if (activeFilter === 'subsidiary') return n.type === 'subsidiary';
    if (activeFilter === 'risk') return n.scorePercent < 50;
    return true; // "all"
  });

  // Calculate composite group risks logic
  const getAssetStrippingRisk = () => {
    if (company.scorePercent >= 80) return { percent: 4, text: 'Низкий', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (company.scorePercent >= 40) return { percent: 35, text: 'Умеренный', color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' };
    return { percent: 91, text: 'Критический', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const strippingRisk = getAssetStrippingRisk();

  return (
    <div id="company_connections_root" className="space-y-6 font-sans">
      
      {/* 1. Integrated Header with return trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/10 text-sky-500 p-2.5 rounded-xl">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Граф связей и аффилированности холдинга
              <span className="text-[9px] bg-sky-500/10 text-sky-500 px-1.5 py-0.5 rounded font-black tracking-widest font-mono uppercase">
                ЕГРЮЛ & Росстат
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Интерактивный разбор учредителей, дочерних корпораций, генерального директора и рисков взаимозависимости для {company.shortName}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="self-start sm:self-auto px-4 py-2 text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50"
        >
          ← Назад в профиль
        </button>
      </div>

      {/* 2. Educational & Analytical dashboard tiles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Graph Stage (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 min-h-[580px] flex flex-col justify-between">
          
          {/* Controls toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/60 self-start">
              {[
                { id: 'all', n: 'Все звенья' },
                { id: 'founder', n: 'Капитал и Лидеры' },
                { id: 'subsidiary', n: 'Дочерние' },
                { id: 'risk', n: 'Красная зона' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-white dark:bg-slate-850 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/50 dark:border-slate-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {filter.n}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">
              найдено {filteredNodes.length} связей
            </span>
          </div>

          {/* Interactive Vis Nodes Canvas */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
            
            {/* Visual network matrix canvas background (subtle decor lines) */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* UP LEVEL: Founders (displayed in a beautiful flex row above root) */}
            <div className="w-full flex justify-around gap-4 mb-16 relative z-10">
              {filteredNodes
                .filter(n => n.type === 'founder' || n.type === 'director')
                .map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <motion.button
                      layout
                      onClick={() => setSelectedNodeId(node.id)}
                      key={node.id}
                      className={`px-3 py-2.5 rounded-xl border transition-all text-center relative group max-w-[170px] flex-1 cursor-pointer ${
                        isSelected 
                          ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20 dark:bg-sky-550/10' 
                          : node.status === 'critical'
                          ? 'border-rose-300 dark:border-rose-900/60 bg-rose-500/5 hover:bg-rose-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80 shadow-sm'
                      }`}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white bg-slate-500">
                        {node.type === 'founder' ? 'Родитель' : 'Директор'}
                      </div>
                      
                      {node.share && (
                        <span className="absolute -top-2 -right-1 bg-sky-500 text-white font-mono text-[9px] font-black px-1 rounded-md shadow-sm flex items-center gap-0.5">
                          {node.share}%
                        </span>
                      )}

                      <div className="flex flex-col items-center mt-1">
                        <User className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-sky-500' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate w-full block">
                          {node.name}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`text-[8px] px-1 py-0.2 rounded font-black ${
                            node.status === 'active' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                          }`}>
                            {node.scoreMark}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
            </div>

            {/* CONNECTIVE LINES IN GRAPH USING PATH AND SVG (highly responsive) */}
            <div className="absolute inset-x-0 top-1/4 h-[120px] pointer-events-none z-0">
              <svg className="w-full h-full" overflow="visible">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#e2e8f0" className="dark:fill-slate-800" />
                  </marker>
                </defs>
                {/* Visual lines representing flow structure */}
                <line x1="25%" y1="0" x2="50%" y2="50" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-slate-800" />
                <line x1="75%" y1="0" x2="50%" y2="50" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-slate-800" />
                <line x1="50%" y1="50" x2="20%" y2="100" stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-slate-800" />
                <line x1="50%" y1="50" x2="50%" y2="100" stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-slate-800" />
                <line x1="50%" y1="50" x2="80%" y2="100" stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-slate-800" />
              </svg>
            </div>

            {/* ROOT NODE: The main queried company in middle with glowing pulsing effect */}
            <div className="relative z-25 mb-14 mt-2">
              <div className="absolute -inset-2.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-2xl blur-md opacity-35 animate-pulse" />
              <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-sky-400/50 p-4 rounded-xl text-center shadow-lg max-w-[210px]">
                <span className="text-[8px] font-black uppercase tracking-widest text-sky-400 block mb-1 font-mono">
                  Анализируемый корень
                </span>
                <span className="text-xs font-black block truncate leading-snug">
                  {company.shortName}
                </span>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <span className="text-[9px] font-bold text-slate-300">ИНН {company.inn}</span>
                  <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1 py-0.2 rounded">
                    {company.scoreMark}
                  </span>
                </div>
              </div>
            </div>

            {/* DOWN LEVEL: Subsidiaries & Affiliated Units */}
            <div className="w-full flex justify-around gap-4 mt-2 relative z-10">
              {filteredNodes
                .filter(n => n.type === 'subsidiary' || n.type === 'affiliated')
                .map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <motion.button
                      layout
                      onClick={() => setSelectedNodeId(node.id)}
                      key={node.id}
                      className={`px-3 py-2.5 rounded-xl border transition-all text-center relative group max-w-[170px] flex-1 cursor-pointer ${
                        isSelected 
                          ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20 dark:bg-sky-550/10' 
                          : node.status === 'dead'
                          ? 'border-slate-300 dark:border-slate-800 line-through opacity-50 bg-slate-100 hover:opacity-80 dark:bg-slate-950'
                          : node.status === 'critical'
                          ? 'border-rose-300 dark:border-rose-900/60 bg-rose-500/5 hover:bg-rose-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80 shadow-sm'
                      }`}
                    >
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white bg-slate-500 whitespace-nowrap">
                        {node.type === 'subsidiary' ? 'Дочка' : 'Связанный'}
                      </div>

                      {node.share && (
                        <span className="absolute -top-2 -right-1 bg-sky-500 text-white font-mono text-[9px] font-black px-1 rounded-md shadow-sm">
                          {node.share}%
                        </span>
                      )}

                      <div className="flex flex-col items-center mt-1">
                        <Building2 className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-sky-500' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate w-full block">
                          {node.name}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`text-[8px] px-1 py-0.2 rounded font-black ${
                            node.status === 'active' 
                              ? 'bg-emerald-500/15 text-emerald-500' 
                              : node.status === 'dead' 
                                ? 'bg-slate-500/10 text-slate-400'
                                : 'bg-amber-500/15 text-amber-500'
                          }`}>
                            {node.scoreMark}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
            </div>

          </div>

          {/* Asset Stripping Alert Indicator footer */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                Сводный маркер безопасности холдинга
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                <AlertCircle className={`w-4 h-4 ${company.scorePercent >= 80 ? 'text-emerald-500' : 'text-rose-500'}`} />
                Риск трансфертного ценообразования & вывода активов: 
                <span className={`px-2 py-0.2 text-[10px] uppercase font-black rounded-md ${strippingRisk.color}`}>
                  {strippingRisk.text} ({strippingRisk.percent}%)
                </span>
              </h4>
            </div>

            <div className="w-full sm:w-36 flex flex-col gap-1 shrink-0">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                <span>Уровень риска</span>
                <span className="font-bold">{strippingRisk.percent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    strippingRisk.percent > 70 ? 'bg-rose-500' : strippingRisk.percent > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${strippingRisk.percent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Inspection & Details Panel (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Node detailed passport */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-sky-500" />
                Паспорт связи контрагента
              </h3>
              <span className="text-[10px] font-bold text-sky-500 font-mono">
                экспертиза ЕГРЮЛ
              </span>
            </div>

            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 text-xs"
                >
                  {/* Entity identifier layout */}
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
                      Связанное юридическое / физическое лицо
                    </span>
                    <h4 className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug">
                      {selectedNode.name}
                    </h4>
                  </div>

                  {/* Ground of connection */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 space-y-1">
                    <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 block">
                      Юридическое основание связи
                    </span>
                    <p className="font-bold text-slate-700 dark:text-slate-305 text-slate-700 dark:text-slate-300">
                      {selectedNode.legalRelation}
                    </p>
                    {selectedNode.share && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-sky-600 dark:text-sky-400 mt-1">
                        <Percent className="w-3.5 h-3.5" /> Вклад в уставный капитал: {selectedNode.share}%
                      </span>
                    )}
                  </div>

                  {/* Code indicators */}
                  <div className="grid grid-cols-2 gap-3.5 pt-1">
                    {selectedNode.inn && (
                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block mb-0.5">ИНН Аффилиата</span>
                        <span className="font-mono text-xs font-black tracking-wider text-slate-750 dark:text-slate-250 block">
                          {selectedNode.inn}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block mb-0.5">Статус налогоплательщика</span>
                      <span className={`text-[11px] font-black block ${
                        selectedNode.status === 'active' 
                          ? 'text-emerald-500' 
                          : selectedNode.status === 'dead'
                            ? 'text-slate-400 line-through'
                            : 'text-amber-500'
                      }`}>
                        {selectedNode.statusText}
                      </span>
                    </div>
                  </div>

                  {/* Financial score metric */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block">Кредитный рейтинг связи</span>
                      <p className="text-slate-655 dark:text-slate-355 text-[11px] mt-0.5">
                        Маркер безопасности: <strong className="font-bold text-slate-700 dark:text-slate-200">{selectedNode.scoreMark} ({selectedNode.scorePercent}%)</strong>
                      </p>
                    </div>
                    <span className={`h-6 px-2 py-0.5 text-xs font-black rounded flex items-center justify-center ${
                      selectedNode.scorePercent >= 80 
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : selectedNode.scorePercent >= 40
                          ? 'bg-amber-500/10 text-amber-550 dark:text-amber-400 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {selectedNode.scorePercent >= 80 ? 'Низкий риск' : selectedNode.scorePercent >= 40 ? 'Повышенный' : 'Опасность'}
                    </span>
                  </div>

                  {/* Audit Risks commentary */}
                  <div className="p-3 rounded-xl bg-orange-50/20 dark:bg-rose-500/5 border border-orange-200/40 dark:border-rose-900/40 space-y-1">
                    <span className="text-[8px] uppercase font-bold text-orange-600 dark:text-rose-450 flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Заключение аудитора рисков
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {selectedNode.riskDescription}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Выберите узел на интерактивной карте слева для детального изучения связи
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Academic/Theory Panel */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/40 dark:from-slate-900 dark:to-slate-950 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-sky-500" />
              Теория скоринга: Зачем искать связи?
            </h4>
            
            <div className="space-y-3.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">1. Выявление скрытых банкротств</span>
                <p>
                  Если дочернее ООО объявляет дефолт, материнскому холдингу грозит обесценение своих инвестиций, а учредителям — **субсидиарная ответственность** по долгам (ст. 61.11 Закона о банкротстве).
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">2. Риск "трансфертных цен" и ФНС</span>
                <p>
                  Сделки между взаимозависимыми лицами (ст. 105.1 НК РФ) тщательно проверяются налоговой инспекцией на предмет занижения цен и вывода активов в фирмы-пустышки.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">3. Адрес массовой регистрации</span>
                <p>
                  Совпадение адреса с десятками сторонних фирм указывает на то, что это юридический "почтовый ящик". Работа с такими контрагентами грозит отказом в вычете НДС.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
