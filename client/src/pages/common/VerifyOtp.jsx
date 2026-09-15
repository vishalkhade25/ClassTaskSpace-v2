import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    setError("");
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-email", { email, otp });
      sessionStorage.removeItem("email");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      setSuccess("A new OTP has been sent to your email.");
      setCooldown(60);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 sm:p-10">
        {/* Security Badge Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 mb-3">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verify Your Email</h1>
          <p className="text-sm text-slate-500 mt-1">
            We sent a 6-digit code to <span className="font-semibold text-slate-800">{email}</span>
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl mb-6 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3.5 rounded-xl mb-6 animate-fade-in">
            <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 shrink-0"></i>
            <div className="flex-1">{success}</div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Enter 6-Digit Verification Code
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleChange}
              maxLength={6}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono tracking-[0.5em] text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Email</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={handleResend}
            disabled={resendLoading || cooldown > 0}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:no-underline transition-colors"
          >
            <i className={`fa-solid fa-arrow-rotate-right text-xs ${resendLoading ? "fa-spin" : ""}`}></i>
            <span>
              {cooldown > 0
                ? `Resend code in ${cooldown}s`
                : resendLoading
                ? "Sending code..."
                : "Resend verification code"}
            </span>
          </button>
        </div>

        <p className="text-sm text-slate-500 mt-8 text-center">
          Entered the wrong email?{" "}
          <Link to="/register" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Change email</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;