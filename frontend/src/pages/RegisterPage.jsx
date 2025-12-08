import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api.js";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-white">Create account</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          className="w-full p-2 rounded bg-slate-700 text-white"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-slate-700 text-white"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className="w-full py-2 rounded bg-emerald-500 text-white font-semibold">
          Sign up
        </button>
        <p className="text-slate-300 text-sm">
          Already have an account?{" "}
          <Link className="text-emerald-400" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
