import { useEffect, useState } from "react";
import axios from "axios";

function ItemForm({ setPage, editItem }) {

  const [form, setForm] = useState({
    type: "",
    title: "",
    description: "",
    location: ""
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        type: editItem.type || "",
        title: editItem.title || "",
        description: editItem.description || "",
        location: editItem.location || ""
      });
    }
  }, [editItem]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      setPage("login");
      return;
    }

    try {
      if (editItem) {
        await axios.put(
          `http://localhost:5000/api/items/${editItem._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Item updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/items",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Item added");
      }

      setPage("home");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="min-h-[90vh] flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          {editItem ? "Update Item" : "Add Item"}
        </h2>

        <input
          name="type"
          placeholder="Type (Lost / Found)"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-5"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          {editItem ? "Update Item" : "Add Item"}
        </button>

      </form>

    </div>
  );
}

export default ItemForm;