import { motion } from "framer-motion";

function Card({ title, subtitle, actions, children, className = "", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white rounded-xl border border-gray-100 shadow-sm
        hover:shadow-md transition-shadow duration-200
        ${className}
      `}
      {...props}
    >
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-50 ${className}`}>
      {children}
    </div>
  );
}

function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-50 bg-gray-50/50 rounded-b-xl ${className}`}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter };
