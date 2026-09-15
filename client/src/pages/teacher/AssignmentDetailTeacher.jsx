import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toDownloadUrl } from "../../utils/cloudinary";
import SubmissionRow from "../../components/SubmissionRow";

const AssignmentDetailTeacher = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [notSubmitted, setNotSubmitted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/submission/${assignmentId}/list`);
      setAssignment(response.data.assignment);
      setSubmissions(response.data.submissions);
      setNotSubmitted(response.data.notSubmitted);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId, marks) => {
    setSubmitting(true);
    setError("");
    try {
      await axiosInstance.patch(`/submission/${submissionId}/grade`, { marks });
      await fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save grade";
      alert(errorMessage);
    } finally {
      setSubmitting(false); 
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await axiosInstance.get(`/submission/${assignmentId}/export-csv`,{
        responseType : "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "submissions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to export CSV");
    }
  }
  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl w-full mx-auto">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>Back</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600 mb-3"></i>
          <p className="text-sm font-medium">Loading assignment details...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl mb-6 animate-fade-in">
          <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {assignment && (
        <div className="space-y-6">
          {/* Assignment Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <i className="fa-solid fa-chalkboard-user text-indigo-500"></i>
                Teacher View
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full">
                <i className="fa-regular fa-clock text-slate-400"></i>
                <span>Due: {new Date(assignment.deadline).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
              {assignment.title}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
              {assignment.description}
            </p>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              {assignment.pdfUrl && (
                <a
                  href={toDownloadUrl(assignment.pdfUrl)}
                  download="assignment.pdf"
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  <i className="fa-solid fa-file-pdf text-rose-500 text-sm"></i>
                  <span>Assignment PDF</span>
                  <i className="fa-solid fa-download text-[11px] text-slate-400"></i>
                </a>
              )}

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <i className="fa-solid fa-file-csv text-emerald-600 text-sm"></i>
                <span>Export Submissions (CSV)</span>
                <i className="fa-solid fa-arrow-down text-[11px] text-emerald-500"></i>
              </button>
            </div>
          </div>

          {/* Submissions Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-clipboard-check"></i>
                </div>
                <h2 className="text-lg font-bold text-slate-900">Student Submissions</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <i className="fa-regular fa-folder-open text-3xl text-slate-300 mb-2"></i>
                <p className="text-sm font-medium text-slate-600">No submissions received yet</p>
                <p className="text-xs text-slate-400 mt-1">Student submissions will appear here once submitted.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <SubmissionRow key={sub._id} submission={sub} onGrade={handleGrade} />
                ))}
              </div>
            )}
          </div>

          {/* Not Submitted Roster Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-user-clock"></i>
                </div>
                <h2 className="text-lg font-bold text-slate-900">Pending Submissions</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                {notSubmitted.length} pending
              </span>
            </div>

            {notSubmitted.length === 0 ? (
              <div className="text-center py-6 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-700 flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span className="text-sm font-semibold">Great! All enrolled students have submitted their work.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notSubmitted.map((student) => (
                  <div key={student._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs">
                        {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                      Not Submitted
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailTeacher;