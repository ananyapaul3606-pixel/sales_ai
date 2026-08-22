import { motion } from "framer-motion";

const iconColors = {
  default: "bg-primary-50 text-primary-600",
  hot: "bg-red-50 text-red-600",
  warm: "bg-amber-50 text-amber-600",
  cold: "bg-gray-50 text-gray-600",
};

function StatCard({ title, value, icon: Icon, trend, trendUp, color = "default", className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white rounded-xl border border-gray-100 shadow-sm
        p-6 hover:shadow-md transition-all duration-200
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColors[color] || iconColors.default}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
