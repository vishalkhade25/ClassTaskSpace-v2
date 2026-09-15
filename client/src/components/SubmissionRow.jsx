import { useState } from "react";
import { toDownloadUrl } from "../utils/cloudinary";

const SubmissionRow = ({ submission, onGrade }) => {
  const [marks, setMarks] = useState(submission.marks ?? "");

  const isGraded = submission.marks !== undefined && submission.marks !== null;
  const initial = submission.student?.name ? submission.student.name.charAt(0).toUpperCase() : "S";

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0">
            {initial}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
              {submission.student?.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{submission.student?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {submission.isLate && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
              <i className="fa-solid fa-triangle-exclamation text-[10px]"></i>
              Late
            </span>
          )}

          {isGraded ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <i className="fa-solid fa-circle-check text-[10px]"></i>
              Graded ({submission.marks}/10)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              <i className="fa-regular fa-clock text-[10px]"></i>
              Not Graded
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-500">
            <i className="fa-regular fa-calendar text-slate-400 mr-1.5"></i>
            {new Date(submission.submittedAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <a
            href={toDownloadUrl(submission.pdfUrl)}
            download={`${submission.student?.name || "student"}-submission.pdf`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50/70 hover:bg-blue-100 hover:text-blue-700 px-3 py-1 rounded-lg border border-blue-200/50 transition-colors"
          >
            <i className="fa-solid fa-file-pdf text-rose-500"></i>
            <span>View Submission</span>
          </a>
        </div>

        {/* Grading Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative">
            <input
              type="number"
              min={0}
              max={10}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="0 - 10"
              className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
          <button
            onClick={() => onGrade(submission._id, marks)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            <i className="fa-solid fa-check text-xs"></i>
            <span>Save Grade</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionRow;