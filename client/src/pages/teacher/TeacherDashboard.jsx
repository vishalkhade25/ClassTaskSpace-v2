import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import ClassCard from '../../components/ClassCard';

const TeacherDashboard = () => {
  const [classes,  setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [empty, setEmpty] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/class/teacher");
      setClasses(response.data.classes);
      if(response.data.classes.length === 0){
        setEmpty(true);
      }else{
        setEmpty(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    fetchClasses();
  },[]);
  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Teacher Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your classrooms, create assignments, and evaluate student work.
          </p>
        </div>
        <button
          onClick={() => navigate("/teacher/class/create")}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          <span>Create Class</span>
        </button>
      </div>

      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search classes by name or subject..."
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

        {!loading && !empty && (
          <div className="text-xs font-medium text-slate-500 self-end sm:self-auto">
            Showing <span className="font-bold text-slate-700">{filteredClasses.length}</span> of {classes.length} {classes.length === 1 ? "class" : "classes"}
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
          <p className="text-sm font-medium">Loading your classes...</p>
        </div>
      )}

      {/* Truly empty state */}
      {!loading && empty && (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fa-solid fa-chalkboard-user"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No classes created yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Get started by creating your first class. You'll receive a code to share with your students.
          </p>
          <button
            onClick={() => navigate("/teacher/class/create")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Create Your First Class</span>
          </button>
        </div>
      )}

      {/* Search empty state */}
      {!loading && !empty && filteredClasses.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mx-auto mb-3">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching classes</h3>
          <p className="text-sm text-slate-500 mt-1">
            No classes matched "<span className="font-medium text-slate-700">{searchTerm}</span>". Try another search term.
          </p>
        </div>
      )}

      {/* Classes Grid */}
      {!loading && !empty && filteredClasses.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls._id}
              classData={cls}
              onClick={() => navigate(`/teacher/class/${cls._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
