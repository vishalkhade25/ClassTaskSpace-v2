import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email : "",
    password : ""
  });
  const [isUnverified, setIsUnverified] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      const decoded = jwtDecode(response.data.token);
      login(response.data.token);
      if(decoded.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if(decoded.role === "student") {
        navigate("/student/dashboard");
      } else {
        setError("Role is not defined");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
      setIsUnverified(error.response?.status === 403);
    }finally{
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) =>{
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/google",{
        idToken : credentialResponse.credential
      });
      if(response.data.needsRole) {
        sessionStorage.setItem("googleTempToken",response.data.tempToken);
        navigate("/complete-profile")
      }else{
        login(response.data.token);
        const decoded = jwtDecode(response.data.token);
        navigate(decoded.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ||"Google login failed";
      setError(errorMessage);
    }finally {
      setLoading(false);
    }
  }

  const handleResendClick = () => {
    sessionStorage.setItem("email", formData.email);
    navigate("/verify-otp");
  };
  
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 sm:p-10">
        {/* Brand Icon Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 mb-3">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your ClassTaskSpace account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl mb-6 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {isUnverified && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <p className="text-xs text-amber-800 mb-2">Your email hasn't been verified yet.</p>
            <button
              onClick={handleResendClick}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              <i className="fa-solid fa-arrow-rotate-right text-[10px]"></i>
              Resend verification code
            </button>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                <i className="fa-solid fa-lock"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
          />
        </div>

        <p className="text-sm text-slate-500 mt-8 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;