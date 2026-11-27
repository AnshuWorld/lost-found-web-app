import { useState } from "react";
import api from "../api";

function MarkFoundModal({ item, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/api/items/${item._id}/mark-found`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item marked as found! Thank you for helping.");
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark as found");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          I Found This Item
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          Share your contact details so the owner can reach you.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full border border-slate-300 rounded-lg p-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number *
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            className="w-full border border-slate-300 rounded-lg p-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email (optional)
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-slate-300 rounded-lg p-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Message (optional)
          </label>
          <textarea
            name="message"
            rows={2}
            value={form.message}
            onChange={handleChange}
            placeholder="e.g. Found it near the cafeteria at 3pm"
            className="w-full border border-slate-300 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 border border-slate-300 text-slate-700 hover:bg-slate-100 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Submitting..." : "Mark as Found"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MarkFoundModal;
