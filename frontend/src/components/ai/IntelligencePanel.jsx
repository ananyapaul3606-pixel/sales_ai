import { motion } from 'framer-motion';
import { Target, Lightbulb } from 'lucide-react';

function GaugeCircle({ value = 0, size = 140, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value)) / 100;
  const offset = circumference - progress * circumference;
  const color = value >= 70 ? '#ef4444' : value >= 40 ? '#f59e0b' : '#6b7280';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-xs text-gray-500">Score</span>
      </div>
    </div>
  );
}

function ProgressBar({ value = 0, label }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-xs font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function IntelligencePanel({ data = {} }) {
  const score = data.score ?? 0;
  const conversion = data.conversionProbability ?? 0;
  const decisionMaker = data.decisionMakerProbability ?? 0;
  const reasoning = data.qualificationReasoning || '';
  const approach = data.recommendedApproach || '';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <GaugeCircle value={score} />
        <div className="flex-1 space-y-4 w-full">
          <ProgressBar value={conversion} label="Conversion Probability" />
          <ProgressBar value={decisionMaker} label="Decision Maker Probability" />
        </div>
      </div>

      <motion.div variants={item} className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-600" />
          Qualification Reasoning
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
          {reasoning || 'No reasoning available.'}
        </p>
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary-600" />
          Recommended Approach
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed bg-primary-50 rounded-lg p-3">
          {approach || 'No recommendation available.'}
        </p>
      </motion.div>
    </motion.div>
  );
}
