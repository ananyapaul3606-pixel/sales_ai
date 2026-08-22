import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
const SCORE_OPTIONS = ['HOT', 'WARM', 'COLD'];

export default function LeadFilters({ onFilterChange, defaultValues = {} }) {
  const [search, setSearch] = useState(defaultValues.search || '');
  const [status, setStatus] = useState(defaultValues.status || '');
  const [score, setScore] = useState(defaultValues.score || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange?.({ search, status, score });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status, score]);

  const handleReset = useCallback(() => {
    setSearch('');
    setStatus('');
    setScore('');
  }, []);

  const hasFilters = search || status || score;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, company, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field pl-9 pr-8 appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <select
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="input-field px-3 pr-8 appearance-none cursor-pointer"
        >
          <option value="">All Scores</option>
          {SCORE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {hasFilters && (
          <button onClick={handleReset} className="btn-ghost" title="Reset filters">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
