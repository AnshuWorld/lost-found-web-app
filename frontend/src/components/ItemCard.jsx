function ItemCard({ item, onEdit, onDelete }) {

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
        {item.type}
      </span>

      <h2 className="text-xl font-bold mt-4">
        {item.title}
      </h2>

      <p className="text-gray-600 mt-2">
        {item.description}
      </p>

      <p className="text-gray-500 mt-4">
        📍 {item.location}
      </p>

      <div className="flex gap-3 mt-5">

        <button
          onClick={() => onEdit(item)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item._id)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default ItemCard;