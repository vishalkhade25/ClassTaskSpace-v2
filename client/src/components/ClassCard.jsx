import { useState } from "react";

const ClassCard = ({ classData, onClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (classData?.classCode) {
      navigator.clipboard.writeText(classData.classCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-6 cursor-pointer border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle top decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
            <i className="fa-solid fa-book-open text-[10px] text-blue-500"></i>
            {classData.subject}
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {classData.name}
        </h2>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Code:</span>
          <button
            type="button"
            onClick={handleCopyCode}
            title="Click to copy class code"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-blue-50/80 text-blue-700 hover:bg-blue-100 border border-blue-200/60 transition-colors"
          >
            <span>{classData.classCode}</span>
            <i className={`fa-solid ${copied ? "fa-check text-emerald-600" : "fa-copy text-blue-400"} text-[11px]`}></i>
          </button>
        </div>

        {copied && (
          <span className="text-[11px] font-medium text-emerald-600 animate-fade-in">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
};

export default ClassCard;
