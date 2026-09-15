import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentCard from "../../components/AssignmentCard";

const ClassDetailStudent = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { classId } = useParams();
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/assignment/${classId}/list`);
      setAssignments(response.data.assignments);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const filterAssignments = assignments.filter((assg)=>
    assg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    fetchAssignments();
  },[]);

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl w-full mx-auto">
      {/* Back button & Breadcrumbs */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>Back to Classes</span>
        </button>
      </div>

      {/* Header section */}
      <div className="pb-6 border-b border-slate-200/80 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Class Assignments
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review posted assignments, due dates, and your submission status.
        </p>
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {!loading && assignments.length > 0 && (
          <div className="text-xs font-medium text-slate-500 self-end sm:self-auto">
            Showing <span className="font-bold text-slate-700">{filterAssignments.length}</span> of {assignments.length} {assignments.length === 1 ? "assignment" : "assignments"}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl mb-6 animate-fade-in">
          <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0"></i>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600 mb-3"></i>
          <p className="text-sm font-medium">Loading assignments...</p>
        </div>
      )}

      {/* Truly empty state */}
      {!loading && assignments.length === 0 && !searchTerm && (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fa-regular fa-clipboard"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No assignments posted yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Your teacher has not uploaded any assignments for this class yet. Check back soon!
          </p>
        </div>
      )}

      {/* Search empty state */}
      {!loading && filterAssignments.length === 0 && searchTerm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mx-auto mb-3">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 className="text-base font-bold text-slate-800">No assignments found</h3>
          <p className="text-sm text-slate-500 mt-1">
            No assignments matched "<span className="font-medium text-slate-700">{searchTerm}</span>".
          </p>
        </div>
      )}

      {/* Assignment list */}
      {!loading && filterAssignments.length > 0 && (
        <div className="space-y-3.5">
          {filterAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onClick={() => navigate(`/student/assignment/${assignment._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassDetailStudent;