import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isTeacher = user?.role === "teacher";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-graduation-cap text-base"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                ClassTaskSpace
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={isTeacher ? "/teacher/dashboard" : "/student/dashboard"}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-100/70 transition-colors"
                >
                  <i className="fa-solid fa-table-columns text-slate-400"></i>
                  <span>Dashboard</span>
                </Link>

                {/* Role Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                    isTeacher
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                  }`}
                >
                  <i className={`fa-solid ${isTeacher ? "fa-chalkboard-user" : "fa-user-graduate"} text-[10px]`}></i>
                  {user.role}
                </span>

                {/* User Name / Avatar */}
                <div className="hidden md:flex items-center gap-2 pl-1 text-sm font-medium text-slate-700">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[140px] truncate">{user.name}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors border border-red-100"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:shadow-md"
              >
                <i className="fa-solid fa-right-to-bracket text-xs"></i>
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;