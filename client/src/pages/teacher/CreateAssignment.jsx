import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom"
import { toDownloadUrl } from "../../utils/cloudinary";

const CreateAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const { classId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("deadline", deadline);
      formData.append("pdf", pdfFile);
      const response = await axiosInstance.post(`/assignment/${classId}/upload`,formData);
      navigate(`/teacher/class/${classId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 mb-3">
            <i className="fa-solid fa-file-circle-plus"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Assignment</h1>
          <p className="text-sm text-slate-500 mt-1">Post a new task, instructions, and deadline for your students</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl mb-6 animate-fade-in">
            <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
            <div className="flex-1">{error}</div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Assignment Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                <i className="fa-solid fa-heading"></i>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="e.g. Chapter 3: Mechanics & Motion Problem Set"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Description & Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="Provide instructions or additional context for students..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Submission Deadline
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Assignment PDF Document
            </label>
            <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-5 text-center transition-colors bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mx-auto mb-2">
                <i className="fa-solid fa-file-pdf"></i>
              </div>
              <div className="text-xs font-semibold text-slate-700 mb-1">
                {pdfFile ? pdfFile.name : "Select PDF Document (Optional)"}
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 cursor-pointer
                  file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0
                  file:text-xs file:font-semibold file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700 transition"
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
                <span>Uploading Assignment...</span>
              </>
            ) : (
              <>
                <span>Post Assignment</span>
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate(`/teacher/class/${classId}`)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;