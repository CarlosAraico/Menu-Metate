export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {icon && <div className="text-5xl text-gray-300">{icon}</div>}
      <h3 className="font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
