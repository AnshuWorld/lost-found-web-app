import { useEffect, useState } from "react";
import api from "../api";
import ItemCard from "../components/ItemCard";
// No longer using MarkFoundModal – the "I Found This" action now auto‑marks via JWT

function Home({ setPage, setEditItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  // ------------------------------------------------
  // Fetch all items from the backend
  // ------------------------------------------------
  const fetchItems = async () => {
    try {
      const response = await api.get("/api/items");
      setItems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load items once on component mount
  useEffect(() => {
    let active = true;
    api
      .get("/api/items")
      .then((res) => {
        if (active) setItems(res.data);
      })
      .catch(console.log)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => (active = false);
  }, []);

  // ------------------------------------------------
  // Handlers for CRUD actions
  // ------------------------------------------------
  const deleteItem = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      setPage("login");
      return;
    }
    try {
      const response = await api.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.message) alert(response.data.message);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not delete item");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setPage("create");
  };

  // ------------------------------------------------
  // "I Found This" – automatically mark as found using JWT payload
  // ------------------------------------------------
  const handleMarkFound = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      setPage("login");
      return;
    }
    try {
      await api.patch(`/api/items/${item._id}/mark-found`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not mark as found");
    }
  };

  // ------------------------------------------------
  // Filtering / counting logic
  // ------------------------------------------------
  const filteredItems = items.filter((item) => {
    let matchesType = true;
    if (filterType === "Lost") {
      matchesType = item.type?.toLowerCase() === "lost" && item.status !== "found";
    } else if (filterType === "Found") {
      matchesType = item.type?.toLowerCase() === "found" || item.status === "found";
    }
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  const lostActiveCount = items.filter(
    (i) => i.type?.toLowerCase() === "lost" && i.status !== "found"
  ).length;
  const foundCount = items.filter(
    (i) => i.type?.toLowerCase() === "found" || i.status === "found"
  ).length;

  // ------------------------------------------------
  // Render UI
  // ------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lost &amp; Found Items</h1>
          <p className="text-slate-500 text-sm mt-1">
            Report lost belongings or help return found items.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditItem(null);
            setPage("create");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          + Add Item
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, description, or location..."
          className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          {[{ label: "All", count: items.length }, { label: "Lost", count: lostActiveCount }, { label: "Found", count: foundCount }].map(({ label, count }) => (
            <button
              key={label}
              type="button"
              onClick={() => setFilterType(label)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer ${
                filterType === label ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 text-center py-12">Loading items...</p>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
          No items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onEdit={handleEdit}
              onDelete={deleteItem}
              onMarkFound={handleMarkFound}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
