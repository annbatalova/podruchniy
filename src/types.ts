export interface FinancialYear {
  year: number;
  revenue: number; // in thousands of rubles
  netProfit: number; // in thousands of rubles
  equity: number; // in thousands of rubles
  assets: number; // in thousands of rubles
}

export interface RatioItem {
  id: string;
  name: string;
  value: number;
  description: string;
  norm: string;
  status: 'healthy' | 'caution' | 'critical';
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  stage: string;
  critical: boolean;
}

export interface BankruptcyInfo {
  status: string;
  caseNumber: string;
  managerName: string;
  managerOrg: string;
  lastEventDate: string;
  lastEventDescription: string;
  timeline: TimelineEvent[];
}

export interface ArbitrationCase {
  number: string;
  date: string;
  court: string;
  role: 'Истец' | 'Ответчик' | 'Не определена';
  plaintiff: string;
  defendant: string;
  amount: number; // in millions of rubles
  url: string;
}

export interface Company {
  id: string; // INN
  shortName: string;
  fullName: string;
  location: string;
  inn: string;
  kpp: string;
  ogrn: string;
  okved: string;
  okvedDesc: string;
  address: string;
  director: string;
  status: 'active' | 'bankruptcy';
  scoreMark: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'C' | 'D';
  scorePercent: number; // 0..100
  scoringDetails: string;
  financials: FinancialYear[];
  ratios: RatioItem[];
  bankruptcy: BankruptcyInfo | null;
  arbitration: {
    cases: ArbitrationCase[];
    plaintiffCount: number;
    plaintiffAmount: number; // millions
    defendantCount: number;
    defendantAmount: number; // millions
    unknownCount: number;
    unknownAmount: number; // millions
  };
}
