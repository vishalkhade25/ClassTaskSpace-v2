import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const CompleteProfile = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const tempToken = sessionStorage.getItem("googleTempToken");

    const handleChange = (e) => {
        setRole(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!role){
            setError("Please select a role");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.post("/auth/google/complete",{
                tempToken,
                role
            });
            sessionStorage.removeItem("googleTempToken");
            login(response.data.token);
            const decoded = jwtDecode(response.data.token);
            navigate(decoded.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Something went wrong";
            setError(errorMessage);
        } finally{
            setLoading(false);
        }
    }
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 mb-3">
            <i className="fa-solid fa-user-check"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Almost There</h1>
          <p className="text-sm text-slate-500 mt-1">Select your role to complete setting up your account</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl mb-6 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
            <div className="flex-1">{error}</div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Select Your Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                <i className="fa-solid fa-user-tag"></i>
              </div>
              <select
                value={role}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition appearance-none cursor-pointer"
              >
                <option value="">Choose role...</option>
                <option value="student">Student (join classes, submit tasks)</option>
                <option value="teacher">Teacher (create classes, grade work)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                <span>Setting up...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;