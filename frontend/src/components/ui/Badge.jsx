const variants = {
  hot: "bg-red-50 text-red-700 border-red-200",
  warm: "bg-amber-50 text-amber-700 border-amber-200",
  cold: "bg-gray-50 text-gray-600 border-gray-200",
  default: "bg-primary-50 text-primary-700 border-primary-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
};

function Badge({ label, variant = "default", size = "md", className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {label}
    </span>
  );
}

export default Badge;
