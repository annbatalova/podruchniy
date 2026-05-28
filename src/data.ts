import { Company } from './types';

export const mockCompanies: Company[] = [
  {
    id: '7707083893',
    shortName: 'ПАО СБЕРБАНК',
    fullName: 'ПУБЛИЧНОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО "СБЕРБАНК РОССИИ"',
    location: 'Москва',
    inn: '7707083893',
    kpp: '773601001',
    ogrn: '1027700132195',
    okved: '64.19',
    okvedDesc: 'Деятельность других финансовых институтов, за исключением учреждений страхования и пенсионного обеспечения',
    address: '117312, г Москва, Академический р-н, ул Вавилова, д 19',
    director: 'Греф Герман Оскарович',
    status: 'active',
    scoreMark: 'AAA',
    scorePercent: 98,
    scoringDetails: 'Максимальный кредитный и операционный рейтинг надежности. Финансовая устойчивость подтверждена высокими показателями рентабельности капитала и низким уровнем долговой нагрузки. Риски неплатежеспособности или банкротства практически отсутствуют.',
    financials: [
      { year: 2016, revenue: 810000000, netProfit: 180000000, equity: 620000000, assets: 1050000000 },
      { year: 2017, revenue: 890000000, netProfit: 200000000, equity: 680000000, assets: 1150000000 },
      { year: 2018, revenue: 980000000, netProfit: 220000000, equity: 740000000, assets: 1250000000 },
      { year: 2019, revenue: 1080000000, netProfit: 250000000, equity: 810000000, assets: 1350000000 },
      { year: 2020, revenue: 1150000000, netProfit: 270000000, equity: 880000000, assets: 1450000000 },
      { year: 2021, revenue: 1250000000, netProfit: 290000000, equity: 950000000, assets: 1550000000 },
      { year: 2022, revenue: 1420000000, netProfit: 305000000, equity: 1020000000, assets: 1680000000 },
      { year: 2023, revenue: 1680000000, netProfit: 320000000, equity: 1110000000, assets: 1790000000 },
      { year: 2024, revenue: 1910000000, netProfit: 355000000, equity: 1250000000, assets: 1920000000 },
      { year: 2025, revenue: 2150000000, netProfit: 395000000, equity: 1410000000, assets: 2110000000 }
    ],
    ratios: [
      {
        id: 'cur_liq',
        name: 'Коэффициент текущей ликвидности',
        value: 1.78,
        description: 'Характеризует обеспеченность компании оборотными средствами для ведения хозяйственной деятельности и своевременного погашения обязательств.',
        norm: '> 1.5 - 2.0',
        status: 'healthy'
      },
      {
        id: 'autonomy',
        name: 'Коэффициент автономии',
        value: 0.67,
        description: 'Показывает степень финансовой независимости компании от внешних заемных источников.',
        norm: '> 0.5',
        status: 'healthy'
      },
      {
        id: 'roa',
        name: 'Рентабельность активов (ROA)',
        value: 18.7, // %
        description: 'Демонстрирует эффективность использования активов компании для извлечения прибыли.',
        norm: '> 5%',
        status: 'healthy'
      },
      {
        id: 'ros',
        name: 'Рентабельность продаж (ROS)',
        value: 18.4, // %
        description: 'Отражает долю чистой прибыли в каждом рубле выручки от продаж.',
        norm: '> 10%',
        status: 'healthy'
      },
      {
        id: 'abs_liq',
        name: 'Абсолютная ликвидность',
        value: 1.25,
        description: 'Показывает, какую часть краткосрочной задолженности организация может погасить в ближайшее время за счет денежных средств.',
        norm: '> 0.2',
        status: 'healthy'
      },
      {
        id: 'net_margin',
        name: 'Соотношение заемных средств',
        value: 0.49,
        description: 'Коэффициент капитализации. Отражает степень финансовой зависимости компании от внешних кредиторов.',
        norm: '< 0.7',
        status: 'healthy'
      }
    ],
    bankruptcy: null,
    arbitration: {
      plaintiffCount: 22,
      plaintiffAmount: 145.5, // millions rubles
      defendantCount: 8,
      defendantAmount: 31.6,
      unknownCount: 4,
      unknownAmount: 5.4,
      cases: [
        { number: 'А40-45127/2026', date: '2026-03-12', court: 'АС Московской области', role: 'Ответчик', plaintiff: 'ООО «Ромашка»', defendant: 'ПАО СБЕРБАНК', amount: 31.6, url: '#' },
        { number: 'А40-77513/2026', date: '2026-03-04', court: 'АС Московской области', role: 'Истец', plaintiff: 'ПАО СБЕРБАНК', defendant: 'ООО «Вектор»', amount: 48.9, url: '#' },
        { number: 'А40-67098/2026', date: '2026-02-28', court: 'АС г. Москвы', role: 'Ответчик', plaintiff: 'АО «Север»', defendant: 'ПАО СБЕРБАНК', amount: 12.0, url: '#' },
        { number: 'А40-67493/2026', date: '2026-02-18', court: 'АС Свердловской области', role: 'Истец', plaintiff: 'ПАО СБЕРБАНК', defendant: 'ООО «Прайм»', amount: 32.2, url: '#' },
        { number: 'А40-13060/2026', date: '2026-02-10', court: 'АС г. Санкт-Петербурга', role: 'Не определена', plaintiff: 'ООО «Альфа»', defendant: 'ООО «Бета»', amount: 2.9, url: '#' },
        { number: 'А40-92114/2025', date: '2025-12-20', court: 'АС г. Москвы', role: 'Истец', plaintiff: 'ПАО СБЕРБАНК', defendant: 'ООО «Логика»', amount: 7.4, url: '#' },
        { number: 'А56-31580/2025', date: '2025-11-26', court: 'АС г. Санкт-Петербурга', role: 'Ответчик', plaintiff: 'ООО «Норд»', defendant: 'ПАО СБЕРБАНК', amount: 5.8, url: '#' },
        { number: 'А40-81209/2025', date: '2025-10-19', court: 'АС г. Москвы', role: 'Истец', plaintiff: 'ПАО СБЕРБАНК', defendant: 'ООО «Стройресурс»', amount: 16.1, url: '#' },
        { number: 'А41-77821/2025', date: '2025-09-30', court: 'АС Московской области', role: 'Ответчик', plaintiff: 'АО «Техноимпорт»', defendant: 'ПАО СБЕРБАНК', amount: 9.2, url: '#' },
        { number: 'А40-73442/2025', date: '2025-09-03', court: 'АС г. Москвы', role: 'Не определена', plaintiff: 'ООО «Гарант»', defendant: 'ООО «Меридиан»', amount: 1.7, url: '#' },
        { number: 'А60-24831/2025', date: '2025-08-16', court: 'АС Свердловской области', role: 'Истец', plaintiff: 'ПАО СБЕРБАНК', defendant: 'ИП Иванов И.И.', amount: 3.5, url: '#' },
        { number: 'А40-61773/2025', date: '2025-07-29', court: 'АС г. Москвы', role: 'Ответчик', plaintiff: 'ООО «Капитал»', defendant: 'ПАО СБЕРБАНК', amount: 20.0, url: '#' }
      ]
    }
  },
  {
    id: '6234160787',
    shortName: 'ООО СЕРВИС',
    fullName: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "СЕРВИС"',
    location: 'Рязань',
    inn: '6234160787',
    kpp: '623401001',
    ogrn: '1166234070012',
    okved: '46.90',
    okvedDesc: 'Торговля оптовая неспециализированная',
    address: '390000, Рязанская область, г. Рязань, ул. Право-Лыбедская, д. 2',
    director: 'Иванов Иван Иванович',
    status: 'bankruptcy',
    scoreMark: 'D',
    scorePercent: 12,
    scoringDetails: 'Критическое финансовое состояние. Практически полная потеря платежеспособности. Инициирована процедура банкротства (конкурсное производство) судебным решением. Высочайшие риски неисполнения обязательств.',
    financials: [
      { year: 2016, revenue: 210000, netProfit: 28000, equity: 32000, assets: 71000 },
      { year: 2017, revenue: 205000, netProfit: 26000, equity: 35000, assets: 78000 },
      { year: 2018, revenue: 190000, netProfit: 24000, equity: 36000, assets: 80000 },
      { year: 2019, revenue: 175000, netProfit: 20000, equity: 33000, assets: 82000 },
      { year: 2020, revenue: 145000, netProfit: 18000, equity: 28000, assets: 84000 },
      { year: 2021, revenue: 120000, netProfit: 15400, equity: 22000, assets: 85000 },
      { year: 2022, revenue: 95000, netProfit: 2100, equity: 18000, assets: 88000 },
      { year: 2023, revenue: 64000, netProfit: -12000, equity: 6000, assets: 94000 },
      { year: 2024, revenue: 15000, netProfit: -34000, equity: -28000, assets: 72000 },
      { year: 2025, revenue: 2000, netProfit: -46000, equity: -74000, assets: 48000 }
    ],
    ratios: [
      {
        id: 'cur_liq',
        name: 'Коэффициент текущей ликвидности',
        value: 0.35,
        description: 'Характеризует обеспеченность компании оборотными средствами для ведения хозяйственной деятельности.',
        norm: '> 1.5 - 2.0',
        status: 'critical'
      },
      {
        id: 'autonomy',
        name: 'Коэффициент автономии',
        value: 0.08,
        description: 'Показывает степень финансовой независимости компании от внешних источников.',
        norm: '> 0.5',
        status: 'critical'
      },
      {
        id: 'roa',
        name: 'Рентабельность активов (ROA)',
        value: -12.4, // %
        description: 'Эффективность использования имущества для генерации чистой прибыли.',
        norm: '> 5%',
        status: 'critical'
      },
      {
        id: 'ros',
        name: 'Рентабельность продаж (ROS)',
        value: -25.0, // %
        description: 'Маржинальность бизнеса по чистой прибыли.',
        norm: '> 10%',
        status: 'critical'
      },
      {
        id: 'abs_liq',
        name: 'Абсолютная ликвидность',
        value: 0.02,
        description: 'Способность срочно погасить краткосрочную задолженность.',
        norm: '> 0.2',
        status: 'critical'
      },
      {
        id: 'net_margin',
        name: 'Соотношение заемных средств',
        value: 12.5,
        description: 'Коэффициент зависимости от долга. Серьезная финансовая нагрузка.',
        norm: '< 0.7',
        status: 'critical'
      }
    ],
    bankruptcy: {
      status: 'Конкурсное производство',
      caseNumber: 'А54-3098/2023',
      managerName: 'Артемьева Марина Валерьевна',
      managerOrg: 'Ассоциация СРО "Меркурий" (Рязань)',
      lastEventDate: '2024-01-31',
      lastEventDescription: 'Решением Арбитражного суда Рязанской области должник признан банкротом, открыто конкурсное производство.',
      timeline: [
        {
          date: '2024-01-31',
          title: 'Должник признан банкротом, открыто конкурсное производство',
          description: 'Назначен арбитражный управляющий: Артемьева Марина Валерьевна.',
          stage: 'Конкурсное производство',
          critical: true
        },
        {
          date: '2023-12-15',
          title: 'Зарегистрировано сообщение по делу у кредиторов',
          description: 'Начало отображаемой хронологии по выбранному банкротному делу.',
          stage: 'Регистрация',
          critical: false
        },
        {
          date: '2023-09-28',
          title: 'Прекращено производство по связанному делу',
          description: 'Дело А54-8591/2022. Иски других кредиторов объединены с текущим процессом.',
          stage: 'Производство прекращено',
          critical: false
        },
        {
          date: '2022-11-14',
          title: 'Введена процедура наблюдения в отношении должника',
          description: 'Указан временный арбитражный управляющий: Семыкин Владимир Вячеславович.',
          stage: 'Наблюдение',
          critical: true
        },
        {
          date: '2022-06-03',
          title: 'Завершено конкурсное производство по связанному дочернему предприятию',
          description: 'Дело А20-4459/2018.',
          stage: 'Завершено',
          critical: false
        }
      ]
    },
    arbitration: {
      plaintiffCount: 1,
      plaintiffAmount: 0.8,
      defendantCount: 9,
      defendantAmount: 18.2,
      unknownCount: 2,
      unknownAmount: 1.1,
      cases: [
        { number: 'А54-3098/2023', date: '2023-08-14', court: 'АС Рязанской области', role: 'Ответчик', plaintiff: 'ООО «РязЭнергоСбыт»', defendant: 'ООО СЕРВИС', amount: 12.4, url: '#' },
        { number: 'А54-8591/2022', date: '2022-09-12', court: 'АС Рязанской области', role: 'Ответчик', plaintiff: 'АО «Региональные поставки»', defendant: 'ООО СЕРВИС', amount: 5.8, url: '#' },
        { number: 'А54-4112/2023', date: '2023-10-10', court: 'АС Рязанской области', role: 'Ответчик', plaintiff: 'ООО «Логистическая Служба»', defendant: 'ООО СЕРВИС', amount: 4.8, url: '#' },
        { number: 'А54-33117/2023', date: '2023-03-05', court: 'АС Рязанской области', role: 'Не определена', plaintiff: 'ООО «Формат»', defendant: 'ООО «Линия»', amount: 1.1, url: '#' },
        { number: 'А54-12458/2024', date: '2024-01-30', court: 'АС Владимирской области', role: 'Истец', plaintiff: 'ООО СЕРВИС', defendant: 'ООО «Партнер»', amount: 0.8, url: '#' },
        { number: 'А56-11870/2021', date: '2021-04-26', court: 'АС г. Санкт-Петербурга', role: 'Не определена', plaintiff: 'АО «Сфера»', defendant: 'ООО «Лидер»', amount: 0.8, url: '#' }
      ]
    }
  },
  {
    id: '7701358912',
    shortName: 'ООО МЕРИДИАН',
    fullName: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "МЕРИДИАН"',
    location: 'Новосибирск',
    inn: '7701358912',
    kpp: '540601001',
    ogrn: '1185476023314',
    okved: '46.73',
    okvedDesc: 'Торговля оптовая лесоматериалами, строительными материалами и санитарно-техническим оборудованием',
    address: '630005, Новосибирская область, г. Новосибирск, ул. Гоголя, д. 44',
    director: 'Кузнецова Елена Ивановна',
    status: 'active',
    scoreMark: 'BBB',
    scorePercent: 64,
    scoringDetails: 'Средний уровень кредитоспособности. В целом стабильное хозяйственное положение, однако наблюдаются некоторые кассовые задержки и повышенная доля заемного капитала. Риски дефолта умеренные, требующие периодического мониторинга финансовой отчетности контрагента.',
    financials: [
      { year: 2016, revenue: 310000, netProfit: 8000, equity: 32000, assets: 160000 },
      { year: 2017, revenue: 340000, netProfit: 9500, equity: 36000, assets: 180000 },
      { year: 2018, revenue: 370000, netProfit: 10500, equity: 40000, assets: 200000 },
      { year: 2019, revenue: 410000, netProfit: 11200, equity: 43000, assets: 220000 },
      { year: 2020, revenue: 430000, netProfit: 11800, equity: 45000, assets: 240000 },
      { year: 2021, revenue: 450000, netProfit: 12000, equity: 48000, assets: 250000 },
      { year: 2022, revenue: 512000, netProfit: 16800, equity: 52000, assets: 280000 },
      { year: 2023, revenue: 490000, netProfit: -4500, equity: 41000, assets: 320000 },
      { year: 2024, revenue: 535000, netProfit: 8900, equity: 46000, assets: 340000 },
      { year: 2025, revenue: 580000, netProfit: 14200, equity: 54000, assets: 360000 }
    ],
    ratios: [
      {
        id: 'cur_liq',
        name: 'Коэффициент текущей ликвидности',
        value: 1.15,
        description: 'Характеризует способность покрывать краткосрочные пассивы текущими активами.',
        norm: '> 1.5 - 2.0',
        status: 'caution'
      },
      {
        id: 'autonomy',
        name: 'Коэффициент автономии',
        value: 0.15,
        description: 'Отражает степень зависимости компании от заемных денег.',
        norm: '> 0.5',
        status: 'critical'
      },
      {
        id: 'roa',
        name: 'Рентабельность активов (ROA)',
        value: 3.94, // %
        description: 'Показывает рентабельность совокупных ресурсов.',
        norm: '> 5%',
        status: 'caution'
      },
      {
        id: 'ros',
        name: 'Рентабельность продаж (ROS)',
        value: 2.45, // %
        description: 'Доля прибыли в продажах.',
        norm: '> 10%',
        status: 'caution'
      },
      {
        id: 'abs_liq',
        name: 'Абсолютная ликвидность',
        value: 0.11,
        description: 'Резерв свободных финансовых средств под немедленное погашение кредитов.',
        norm: '> 0.2',
        status: 'caution'
      },
      {
        id: 'net_margin',
        name: 'Соотношение заемных средств',
        value: 0.85,
        description: 'Уровень привлеченного долга относительно своего.',
        norm: '< 0.7',
        status: 'caution'
      }
    ],
    bankruptcy: null,
    arbitration: {
      plaintiffCount: 4,
      plaintiffAmount: 11.2,
      defendantCount: 5,
      defendantAmount: 14.5,
      unknownCount: 0,
      unknownAmount: 0,
      cases: [
        { number: 'А45-12001/2025', date: '2025-08-11', court: 'АС Новосибирской области', role: 'Ответчик', plaintiff: 'АО «НовосибЭнерго»', defendant: 'ООО МЕРИДИАН', amount: 8.4, url: '#' },
        { number: 'А45-19515/2025', date: '2025-10-04', court: 'АС Новосибирской области', role: 'Истец', plaintiff: 'ООО МЕРИДИАН', defendant: 'ООО «СтройАльянс»', amount: 5.6, url: '#' },
        { number: 'А45-22019/2025', date: '2025-11-20', court: 'АС Новосибирской области', role: 'Истец', plaintiff: 'ООО МЕРИДИАН', defendant: 'АО «Новокузнецкий Поставщик»', amount: 3.2, url: '#' },
        { number: 'А45-6701/2026', date: '2026-02-15', court: 'АС Новосибирской области', role: 'Ответчик', plaintiff: 'ООО «БетонТрейд»', defendant: 'ООО МЕРИДИАН', amount: 5.1, url: '#' },
        { number: 'А45-8120/2024', date: '2024-05-18', court: 'АС Новосибирской области', role: 'Ответчик', plaintiff: 'АО «МеталлТорг»', defendant: 'ООО МЕРИДИАН', amount: 1.0, url: '#' }
      ]
    }
  },
  {
    id: '7725492104',
    shortName: 'АО АЛЬФА-ТЕХНОЛОГИИ',
    fullName: 'АКЦИОНЕРНОЕ ОБЩЕСТВО "АЛЬФА-ТЕХНОЛОГИИ"',
    location: 'Казань',
    inn: '7725492104',
    kpp: '165501001',
    ogrn: '1211600045230',
    okved: '62.01',
    okvedDesc: 'Разработка компьютерного программного обеспечения',
    address: '420107, Республика Татарстан, г. Казань, ул. Спартаковская, д. 6',
    director: 'Сабиров Тимур Наилевич',
    status: 'active',
    scoreMark: 'A',
    scorePercent: 88,
    scoringDetails: 'Высокий уровень надежности и хорошая рентабельность операционной деятельности. Компания демонстрирует высокие темпы органического роста выручки (IT-сектор) и крепкие показатели эффективности. Кредитный риск низкий.',
    financials: [
      { year: 2016, revenue: 32000, netProfit: 3500, equity: 11000, assets: 22000 },
      { year: 2017, revenue: 45000, netProfit: 5200, equity: 16000, assets: 32000 },
      { year: 2018, revenue: 62000, netProfit: 7800, equity: 22000, assets: 45000 },
      { year: 2019, revenue: 81000, netProfit: 10205, equity: 30000, assets: 60000 },
      { year: 2020, revenue: 98000, netProfit: 12500, equity: 36000, assets: 70000 },
      { year: 2021, revenue: 110000, netProfit: 14000, equity: 42000, assets: 78000 },
      { year: 2022, revenue: 180000, netProfit: 32000, equity: 68000, assets: 112000 },
      { year: 2023, revenue: 290000, netProfit: 54000, equity: 95000, assets: 164000 },
      { year: 2024, revenue: 420000, netProfit: 86000, equity: 135000, assets: 220000 },
      { year: 2025, revenue: 610000, netProfit: 134000, equity: 210000, assets: 310000 }
    ],
    ratios: [
      {
        id: 'cur_liq',
        name: 'Коэффициент текущей ликвидности',
        value: 2.10,
        description: 'Характеризует обеспеченность краткосрочных обязательств оборотными средствами.',
        norm: '> 1.5 - 2.0',
        status: 'healthy'
      },
      {
        id: 'autonomy',
        name: 'Коэффициент автономии',
        value: 0.68,
        description: 'Показывает высокую долю собственных средств в общей структуре баланса.',
        norm: '> 0.5',
        status: 'healthy'
      },
      {
        id: 'roa',
        name: 'Рентабельность активов (ROA)',
        value: 43.20, // %
        description: 'Сверхвысокая рентабельность, характерная для зрелого программного бизнеса без долгов.',
        norm: '> 5%',
        status: 'healthy'
      },
      {
        id: 'ros',
        name: 'Рентабельность продаж (ROS)',
        value: 21.90, // %
        description: 'Высокая операционная эффективность и чистая рентабельность продаж IT-продуктов.',
        norm: '> 10%',
        status: 'healthy'
      },
      {
        id: 'abs_liq',
        name: 'Абсолютная ликвидность',
        value: 1.45,
        description: 'Организация обладает достаточным объемом свободной ликвидности (денег на счетах) для закрытия немедленных требований.',
        norm: '> 0.2',
        status: 'healthy'
      },
      {
        id: 'net_margin',
        name: 'Соотношение заемных средств',
        value: 0.32,
        description: 'Низкая зависимость от долговых заимствований и заемного капитала.',
        norm: '< 0.7',
        status: 'healthy'
      }
    ],
    bankruptcy: null,
    arbitration: {
      plaintiffCount: 3,
      plaintiffAmount: 4.5,
      defendantCount: 1,
      defendantAmount: 0.4,
      unknownCount: 0,
      unknownAmount: 0,
      cases: [
        { number: 'А65-18115/2025', date: '2025-06-14', court: 'АС Республики Татарстан', role: 'Истец', plaintiff: 'АО АЛЬФА-ТЕХНОЛОГИИ', defendant: 'ООО «Интеграция»', amount: 2.5, url: '#' },
        { number: 'А65-24117/2025', date: '2025-09-22', court: 'АС Республики Татарстан', role: 'Ответчик', plaintiff: 'ИП Хамидуллин Р.Р.', defendant: 'АО АЛЬФА-ТЕХНОЛОГИИ', amount: 0.4, url: '#' },
        { number: 'А65-30911/2025', date: '2025-11-28', court: 'АС Республики Татарстан', role: 'Истец', plaintiff: 'АО АЛЬФА-ТЕХНОЛОГИИ', defendant: 'ООО «Сигма-Клиент»', amount: 2.0, url: '#' }
      ]
    }
  }
];
