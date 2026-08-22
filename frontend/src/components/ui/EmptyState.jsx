import { motion } from "framer-motion";

function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        flex flex-col items-center justify-center text-center py-12 px-4
        ${className}
      `}
    >
      {icon && (
        <div className="mb-4 p-3 bg-gray-50 rounded-full text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}

export default EmptyState;
