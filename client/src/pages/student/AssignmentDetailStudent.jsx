import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toDownloadUrl } from "../../utils/cloudinary";

const AssignmentDetailStudent = () => {
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [submissionDetail, setSubmissionDetails] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const { assignmentId } = useParams();

  const fetchDetails = async () => {
    setError("");
    setLoading(true);
    try {
      const assgResponse = await axiosInstance.get(`/assignment/${assignmentId}/detail`);
      const submissionResponse = await axiosInstance.get(`/submission/${assignmentId}/my-submission`)
      setAssignmentDetails(assgResponse.data.assignment);
      setSubmissionDetails(submissionResponse.data.mySubmissions);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setPdfFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError("");
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      await axiosInstance.post(`/submission/${assignmentId}/submit`, formData);
      await fetchDetails();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setSubmissionError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [assignmentId]);

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-3xl w-full mx-auto">
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

      {assignmentDetails && (
        <div className="space-y-6">
          {/* Assignment Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                <i className="fa-regular fa-file-lines text-blue-500"></i>
                Assignment
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full">
                <i className="fa-regular fa-clock text-slate-400"></i>
                <span>Due: {new Date(assignmentDetails.deadline).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
              {assignmentDetails.title}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
              {assignmentDetails.description}
            </p>

            {assignmentDetails.pdfUrl && (
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={toDownloadUrl(assignmentDetails.pdfUrl)}
                  download="assignment.pdf"
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  <i className="fa-solid fa-file-pdf text-rose-500 text-base"></i>
                  <span>Download Assignment PDF</span>
                  <i className="fa-solid fa-download text-xs ml-1 text-slate-400"></i>
                </a>
              </div>
            )}
          </div>

          {/* Submission Section Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-upload text-blue-600 text-sm"></i>
                <span>Your Submission</span>
              </h2>

              {submissionDetail && (
                <div className="flex items-center gap-2">
                  {submissionDetail.isLate && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      <i className="fa-solid fa-triangle-exclamation text-[10px]"></i>
                      Late
                    </span>
                  )}
                  {submissionDetail.marks !== undefined && submissionDetail.marks !== null ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <i className="fa-solid fa-circle-check text-[10px]"></i>
                      Graded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <i className="fa-regular fa-clock text-[10px]"></i>
                      Submitted (Awaiting Grade)
                    </span>
                  )}
                </div>
              )}
            </div>

            {submissionDetail && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Submitted on:</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">
                      {new Date(submissionDetail.submittedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </div>
                  </div>

                  <a
                    href={toDownloadUrl(submissionDetail.pdfUrl)}
                    download="my-submission.pdf"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs hover:border-blue-300 transition-all self-start sm:self-auto"
                  >
                    <i className="fa-solid fa-file-pdf text-rose-500"></i>
                    <span>View Submitted File</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
                  </a>
                </div>

                {submissionDetail.marks !== undefined && submissionDetail.marks !== null ? (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      <i className="fa-solid fa-award"></i>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500">Teacher's Grade</div>
                      <div className="text-base font-bold text-emerald-700">
                        {submissionDetail.marks} / 10
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-slate-500 italic">
                    The teacher has not graded this submission yet.
                  </div>
                )}
              </div>
            )}

            {submissionError && (
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl mb-6 animate-fade-in">
                <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
                <div className="flex-1">{submissionError}</div>
              </div>
            )}

            {submissionDetail && (
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Need to submit a revised file? Upload below:
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mx-auto mb-3">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-1">
                  {pdfFile ? pdfFile.name : "Select PDF Document"}
                </div>
                <p className="text-xs text-slate-400 mb-3">Only PDF files are accepted</p>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={handleChange}
                  className="w-full text-xs text-slate-500 cursor-pointer
                    file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0
                    file:text-xs file:font-semibold file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !pdfFile}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                    <span>Submitting Work...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                    <span>{submissionDetail ? "Resubmit Assignment" : "Submit Assignment"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailStudent;