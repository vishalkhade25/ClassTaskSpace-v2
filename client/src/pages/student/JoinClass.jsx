import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const JoinClass = () => {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setClassCode(e.target.value.toUpperCase());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/class/join",{classCode});
      console.log(response);
      navigate("/student/dashboard")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 mb-3">
            <i className="fa-solid fa-key"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Join a Class</h1>
          <p className="text-sm text-slate-500 mt-1">Enter the 6-character code provided by your teacher</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl mb-6 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
            <div className="flex-1">{error}</div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Class Code
            </label>
            <input
              type="text"
              name="classCode"
              required
              value={classCode}
              onChange={handleChange}
              maxLength={6}
              className="w-full py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono tracking-[0.4em] text-2xl font-bold uppercase text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="A3F9K2"
            />
            <p className="text-xs text-center text-slate-400 mt-2">
              Codes are 6 characters long (e.g. A3F9K2)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                <span>Joining Class...</span>
              </>
            ) : (
              <>
                <span>Join Class</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/student/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;