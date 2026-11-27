import { useState } from "react";
import api from "../api";

function Signup({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/signup", form);
      alert(response.data.message);
      setPage("login");
    } catch (error) {
      console.log(error);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Create Account
        </h2>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg p-2.5 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition cursor-pointer"
        >
          Signup
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setPage("login")}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;
