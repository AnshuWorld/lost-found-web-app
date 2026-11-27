import { useEffect, useState } from "react";
import api from "../api";

function ItemForm({ setPage, editItem }) {
  const [form, setForm] = useState({
    type: editItem?.type || "Lost",
    title: editItem?.title || "",
    description: editItem?.description || "",
    location: editItem?.location || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(editItem?.imageUrl || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      setPage("login");
      return;
    }

    const payload = new FormData();
    payload.append("type", form.type);
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("location", form.location);
    if (imageFile) {
      payload.append("image", imageFile);
    }

    setSubmitting(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editItem) {
        await api.put(`/api/items/${editItem._id}`, payload, config);
        alert("Item updated");
      } else {
        await api.post("/api/items", payload, config);
        alert("Item added");
      }

      setPage("home");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex justify-center items-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {editItem ? "Update Item" : "Report Lost or Found Item"}
        </h2>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Category
        </label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 mb-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title
        </label>
        <input
          name="title"
          placeholder="e.g. Black Leather Wallet"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Add helpful details..."
          value={form.description}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Location
        </label>
        <input
          name="location"
          placeholder="e.g. Main Library, 2nd Floor"
          value={form.location}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Item Image (optional)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="w-full border border-slate-300 rounded-lg p-2 mb-4 text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-44 object-cover rounded-lg mb-4 border border-slate-200"
          />
        )}

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => setPage("home")}
            className="w-1/3 border border-slate-300 text-slate-700 hover:bg-slate-100 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60 cursor-pointer"
          >
            {submitting
              ? "Uploading..."
              : editItem
                ? "Update Item"
                : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemForm;
