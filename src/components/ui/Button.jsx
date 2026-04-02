export function Button({ children, variant = "primary", size = "md", className = "", disabled = false, loading = false, onClick, type = "button", ...rest }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
