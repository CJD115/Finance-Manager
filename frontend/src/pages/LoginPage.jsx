import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      setToken(res.data.token);
      
      setUser({ 
        email: form.email,
        name: form.email.split('@')[0]
      });
      
      navigate("/");
    } catch (err) {
      setError("Invalid login. Please try again.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-semibold text-neutral-900">FinSet</span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Sign in</h1>
            <p className="text-neutral-400 text-sm">Welcome there! Sign in to continue with FinSet</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-danger-200 text-danger-500 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  👁
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-2 focus:ring-primary-600"
                />
                <span className="text-sm text-neutral-700">Keep me logged in</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition"
            >
              Sign in
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-400">or continue with</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 py-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-neutral-700 font-medium">Google</span>
              </button>

              <button
                type="button"
                className="flex-1 py-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-neutral-700 font-medium">Apple</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-neutral-50 to-white items-center justify-center p-12 relative overflow-hidden">
        {/* Floating Feature Badges */}
        <div className="absolute top-20 right-20 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-700">Manage your finances</span>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg ml-8">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-700">Track transactions</span>
          </div>
        </div>

        <div className="absolute top-40 left-20 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-700">View analytics</span>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg ml-8">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-700">Create budgets</span>
          </div>
        </div>

        <div className="absolute bottom-20 right-32">
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-700">Achieve saving goals</span>
          </div>
        </div>

        {/* Central Illustration */}
        <div className="relative z-10">
          <div className="relative">
            {/* Character sitting on chart */}
            <div className="text-center">
              <div className="inline-block bg-primary-600 rounded-t-full px-16 pt-16 pb-8 relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary-700 rounded-full"></div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-primary-500 rounded-2xl"></div>
              </div>
              
              {/* Chart bars */}
              <div className="flex items-end justify-center gap-6 mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-32 bg-neutral-200 rounded-t-2xl"></div>
                  <div className="w-12 h-12 bg-primary-200 rounded-full mt-2 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xs">$</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-48 bg-primary-600 rounded-t-2xl"></div>
                  <div className="w-12 h-12 bg-primary-200 rounded-full mt-2 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xs">$</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-40 bg-neutral-200 rounded-t-2xl"></div>
                  <div className="w-12 h-12 bg-primary-200 rounded-full mt-2 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xs">$</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-neutral-200 rounded-full opacity-50"></div>
            <div className="absolute top-20 -right-10 text-6xl text-neutral-200 font-bold opacity-50">%</div>
            <div className="absolute -bottom-10 -left-20 text-7xl text-neutral-200 font-bold opacity-50">$</div>
            <div className="absolute bottom-32 -right-20 w-32 h-4 bg-neutral-200 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-300 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary-400 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-primary-200 rounded-full"></div>
      </div>
    </div>
  );
}
