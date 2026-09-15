import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name : "",
    subject : ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [classCode, setClassCode] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/class/create",formData);
      setClassCode(response.data.classCode);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  }

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (classCode) {
      navigator.clipboard.writeText(classCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 mb-3">
            <i className={`fa-solid ${classCode ? "fa-circle-check text-white" : "fa-chalkboard"}`}></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {classCode ? "Class Created!" : "Create a Class"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {classCode
              ? "Share this class code with your students to let them join."
              : "Set up a new classroom to post assignments and track progress."}
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl mb-6 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {classCode ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Your Class Code
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-[0.3em] text-blue-600 mb-4">
                {classCode}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <i className={`fa-solid ${copied ? "fa-check text-emerald-600" : "fa-copy text-slate-500"}`}></i>
                <span>{copied ? "Code Copied!" : "Copy Class Code"}</span>
              </button>
            </div>

            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Class Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  placeholder="e.g. Physics 101 - Section A"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Subject
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  placeholder="e.g. Physics"
                />
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
                  <span>Creating Class...</span>
                </>
              ) : (
                <>
                  <span>Create Class</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/teacher/dashboard")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <i className="fa-solid fa-arrow-left text-xs"></i>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateClass;
