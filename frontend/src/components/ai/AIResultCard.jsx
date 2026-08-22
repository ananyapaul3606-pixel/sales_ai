import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, Sparkles, MessageSquare, Calendar, RefreshCw, Building2, BarChart3 } from 'lucide-react';

const SECTION_META = {
  company: { icon: Building2, label: 'Company Analysis' },
  intelligence: { icon: Sparkles, label: 'Lead Intelligence' },
  score: { icon: BarChart3, label: 'Lead Score' },
  outreach: { icon: MessageSquare, label: 'Outreach Content' },
  followUp: { icon: Calendar, label: 'Follow-Up Plan' },
  crm: { icon: RefreshCw, label: 'CRM Update' },
};

export default function AIResultCard({ title = 'AI Results', icon: Icon, data = {}, loading = false, isEmpty = false }) {
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleSection = useCallback((key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleCopy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, []);

  const Section = ({ sectionKey, children, title: sectionTitle, icon: SectionIcon, copyable = false }) => {
    const meta = SECTION_META[sectionKey] || { icon: SectionIcon, label: sectionTitle };
    const isOpen = expanded[sectionKey];
    return (
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <meta.icon className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">{meta.label || sectionTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            {copyable && children && (
              <button
                onClick={(e) => { e.stopPropagation(); handleCopy(typeof children === 'string' ? children : ''); }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key={`${sectionKey}-content`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
                {children || <span className="text-gray-400 italic">No data available.</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="skeleton h-6 w-48" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No AI results yet. Run analysis to see insights.</p>
      </div>
    );
  }

  const entries = Object.entries(data).filter(([, val]) => val !== undefined && val !== null && val !== '');

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-primary-600" />}
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        {entries.map(([key, val]) => (
          <Section key={key} sectionKey={key} copyable={key === 'outreach'}>
            {typeof val === 'string' ? val : JSON.stringify(val, null, 2)}
          </Section>
        ))}
      </div>
    </div>
  );
}
