const AssignmentCard = ({ assignment, onClick, onDelete }) => {
  const formattedDate = assignment?.deadline
    ? new Date(assignment.deadline).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No deadline";

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl p-4 sm:p-5 cursor-pointer border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <i className="fa-regular fa-file-lines"></i>
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
            {assignment.title}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <i className="fa-regular fa-clock text-slate-400"></i>
            <span>Due: {formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onDelete && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            title="Delete assignment"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
          >
            <i className="fa-regular fa-trash-can text-xs"></i>
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all">
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;