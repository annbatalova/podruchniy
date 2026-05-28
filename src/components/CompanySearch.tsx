import { useState, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { Company } from '../types';
import Button from './Button';

interface CompanySearchProps {
  companiesSummary: {
    id: string;
    shortName: string;
    fullName: string;
    location: string;
    inn: string;
    scoreMark: string;
    scorePercent: number;
    status: 'active' | 'bankruptcy';
    director: string;
    okvedDesc: string;
  }[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
}

export default function CompanySearch({
  companiesSummary,
  selectedCompanyId,
  onSelectCompany,
}: CompanySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [, startTransition ] = useTransition();

  // Search filter
  const filtered = companiesSummary.filter(
    (c) =>
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.inn.includes(searchQuery) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="p-0 bg-transparent select-none">
      <div className="space-y-6">
        
        {/* Title and Search Control stacked vertically, search below title and desc, larger input */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              Поиск и скоринг контрагентов
            </h2>
            <p className="text-sm text-slate-500 font-semibold font-sans mt-1">
              Введите название, ИНН, ОГРН или выберите один из подготовленных учебных кейсов ниже
            </p>
          </div>

          {/* Large Search Box */}
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-13 pr-11 py-3.5 bg-white border border-slate-200 shadow-md focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-500/15 focus:border-sky-500 rounded-2xl text-base placeholder-slate-400/90 font-sans text-slate-800 transition duration-150"
              placeholder="Поиск контрагентов по ИНН, ОГРН, адресу или названию компании..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery('')}
                variant="ghost"
                className="absolute inset-y-0 right-0 pr-4.5 flex items-center hover:text-slate-600 text-slate-400 bg-transparent hover:bg-transparent shadow-none border-0"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Suggesions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-3xl border border-slate-200/50 shadow-sm">
          {(searchQuery ? filtered.slice(0, 4) : companiesSummary).map((co) => {
            const isSel = co.id === selectedCompanyId;
            return (
              <Button
                key={co.id}
                onClick={() => startTransition(() => onSelectCompany(co.id))}
                variant={isSel ? "solid" : "outline"}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group cursor-pointer ${
                  isSel
                    ? 'border-sky-600 text-white shadow-md shadow-sky-600/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isSel ? 'text-sky-100' : 'text-slate-400'}`}>
                    ИНН {co.inn}
                  </span>
                  <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                    isSel 
                      ? 'bg-white/20 text-white' 
                      : co.scoreMark === 'AAA' || co.scoreMark === 'AA'
                      ? 'bg-sky-100 text-sky-800'
                      : co.scoreMark === 'A' || co.scoreMark === 'BBB'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {co.scoreMark}
                  </span>
                </div>
                <div className="font-sans font-bold text-sm truncate w-full group-hover:underline">
                  {co.shortName}
                </div>
                <div className={`text-[11px] truncate w-full ${isSel ? 'text-sky-100' : 'text-slate-400'}`}>
                  {co.location} · {co.status === 'bankruptcy' ? 'Ликвидация' : 'Активна'}
                </div>
              </Button>
            );
          })}
          {searchQuery && filtered.length === 0 && (
            <div className="col-span-4 text-center py-2 text-xs text-slate-400 font-sans">
              Результатов не найдено. Выберите один из четырех базовых кейсов.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
