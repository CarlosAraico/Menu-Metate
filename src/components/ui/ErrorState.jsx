export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="text-5xl">⚠️</div>
      <h3 className="font-semibold text-red-700">Error al cargar datos</h3>
      <p className="text-sm text-gray-500 max-w-xs">{message || "Ocurrió un error inesperado."}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600">
          Reintentar
        </button>
      )}
    </div>
  );
}
