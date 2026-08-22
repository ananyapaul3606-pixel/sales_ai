import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, ChevronUp, ChevronDown, Building2, Briefcase } from 'lucide-react';

const statusColors = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  QUALIFIED: 'bg-primary-100 text-primary-700',
  PROPOSAL: 'bg-purple-100 text-purple-700',
  NEGOTIATION: 'bg-indigo-100 text-indigo-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
};

const scoreColors = {
  HOT: 'status-hot',
  WARM: 'status-warm',
  COLD: 'status-cold',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Search className="w-8 h-8" />
          <p className="text-sm font-medium">No leads found</p>
          <p className="text-xs">Try adjusting your filters or add a new lead.</p>
        </div>
      </td>
    </tr>
  );
}

function DeleteConfirmModal({ lead, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Lead</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">{lead?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(lead)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function LeadTable({ leads = [], loading = false, onLeadClick, onDelete, actions }) {
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sortedLeads = useMemo(() => {
    const arr = [...leads];
    arr.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return arr;
  }, [leads, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleDelete = (lead) => {
    setDeleteTarget(lead);
  };

  const confirmDelete = (lead) => {
    onDelete?.(lead);
    setDeleteTarget(null);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Name <SortIcon field="name" /></div>
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none hidden md:table-cell" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1">Company <SortIcon field="company" /></div>
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Job Title</th>
              <th className="px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none" onClick={() => handleSort('score')}>
                <div className="flex items-center gap-1">Score <SortIcon field="score" /></div>
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : sortedLeads.length === 0 ? (
                <EmptyState />
              ) : (
                sortedLeads.map((lead, idx) => (
                  <motion.tr
                    key={lead.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    onClick={() => onLeadClick?.(lead)}
                    className="group hover:bg-primary-50/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs shrink-0">
                          {lead.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{lead.name}</p>
                          <p className="text-xs text-gray-500 md:hidden truncate">{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {lead.company}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        {lead.jobTitle}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreColors[lead.score] || 'status-cold'}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100 text-gray-700'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {actions}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(lead); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile card layout for small screens */}
      <div className="md:hidden divide-y divide-gray-100 mt-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-20" />
            </div>
          ))
        ) : sortedLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Search className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">No leads found</p>
            <p className="text-xs">Try adjusting your filters or add a new lead.</p>
          </div>
        ) : (
          sortedLeads.map((lead, idx) => (
            <motion.div
              key={lead.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              onClick={() => onLeadClick?.(lead)}
              className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm active:bg-primary-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {lead.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.company}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(lead); }}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreColors[lead.score] || 'status-cold'}`}>
                  {lead.score}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100 text-gray-700'}`}>
                  {lead.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal lead={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
