import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email.trim(), formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] flex flex-col justify-center items-center px-4 py-12">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e6f9f7] text-[#00bfae] mb-3 shadow-sm">
            <i className="fa-solid fa-chart-line text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold font-['Outfit'] text-[#334155]">
            Expense Tracker
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-7 sm:p-9">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-3 animate-fadeIn">
              <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
              <span className="flex-1 text-left leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                  <i className="fa-regular fa-envelope text-sm"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#e2e8f0] rounded-xl text-[#334155] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#00bfae] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                  <i className="fa-solid fa-lock text-sm"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#e2e8f0] rounded-xl text-[#334155] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#00bfae] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94a3b8] hover:text-[#64748b] transition cursor-pointer"
                  tabIndex={-1}
                >
                  <i
                    className={`fa-regular ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    } text-sm`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 mt-2 bg-[#00bfae] hover:bg-[#00a89a] active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>

          {/* Card Footer */}
          <div className="mt-6 pt-6 border-t border-[#f1f5f9] text-center">
            <p className="text-sm text-[#64748b]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#00bfae] hover:text-[#00a89a] transition underline-offset-2 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
