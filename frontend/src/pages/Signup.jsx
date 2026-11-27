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
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  const googleSignupUrl = `${apiBase}/api/auth/google`;

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

        <div className="my-4 flex items-center">
          <hr className="flex-1 border-t border-slate-300" />
          <span className="mx-2 text-slate-500 text-sm">or</span>
          <hr className="flex-1 border-t border-slate-300" />
        </div>

        <a
          href={googleSignupUrl}
          className="flex items-center justify-center w-full bg-white border border-slate-300 hover:bg-slate-100 text-sm rounded-lg py-2 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5 mr-2"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.4 0 6.5 1.2 8.9 3.2l6.6-6.6C36.5 2.9 30.7 0 24 0 14.6 0 6.4 5.1 2.2 12.5l7.8 6.1C12.4 13.7 17.7 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24c0-1.6-.2-3.2-.5-4.7H24v9h12.8c-.5 3-2.3 5.5-4.9 7.2l7.8 6.1c4.6-4.2 7.2-10.4 7.2-17.6z"
            />
            <path
              fill="#FBBC05"
              d="M10.9 28.6c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5L3.1 13.5C1.1 17.4 0 21.6 0 26c0 4.4 1.1 8.6 3.1 12.5l7.8-6.1z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.5 0 12-2.2 16-5.9l-7.8-6.1c-2.2 1.5-5 2.4-8.2 2.4-6.3 0-11.6-4.2-13.5-9.9l-7.8 6.1C6.4 42.9 14.6 48 24 48z"
            />
          </svg>
          Sign up with Google
        </a>

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
