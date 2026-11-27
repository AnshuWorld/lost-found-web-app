function ItemCard({ item, onEdit, onDelete, onMarkFound }) {
  const isLost = item.type?.toLowerCase() === "lost";
  const isFound = item.type?.toLowerCase() === "found";
  const isMarkedFound = item.status === "found";

  const badgeClass = isMarkedFound
    ? "bg-emerald-100 text-emerald-700"
    : isLost
      ? "bg-red-100 text-red-700"
      : isFound
        ? "bg-emerald-100 text-emerald-700"
        : "bg-blue-100 text-blue-700";

  const statusLabel = isMarkedFound
    ? "✅ Found"
    : item.type;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {item.imageUrl ? (
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover bg-slate-100"
          />
          {isMarkedFound && (
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">
              FOUND
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
          No image uploaded
          {isMarkedFound && (
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">
              FOUND
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${badgeClass}`}
          >
            {statusLabel}
          </span>

          <h2 className="text-lg font-bold text-slate-900 mt-3">
            {item.title}
          </h2>

          <p className="text-slate-600 text-sm mt-2 line-clamp-3">
            {item.description}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <p className="text-slate-500 text-sm">📍 {item.location}</p>

          {isMarkedFound && item.foundBy?.name && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-emerald-800 mb-1">
                Found by:
              </p>
              <p className="text-sm text-emerald-900 font-medium">
                {item.foundBy.name}
              </p>
              {item.foundBy.phone && (
                <p className="text-xs text-emerald-700">
                  📞 {item.foundBy.phone}
                </p>
              )}
              {item.foundBy.email && (
                <p className="text-xs text-emerald-700">
                  ✉️ {item.foundBy.email}
                </p>
              )}
              {item.foundBy.message && (
                <p className="text-xs text-slate-600 mt-1 italic">
                  &quot;{item.foundBy.message}&quot;
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            {!isMarkedFound && isLost && (
              <button
                type="button"
                onClick={() => onMarkFound(item)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition cursor-pointer"
              >
                I Found This
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(item)}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition cursor-pointer"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(item._id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
