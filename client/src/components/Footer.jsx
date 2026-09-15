import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center text-xs">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <Link to="/" className="font-bold tracking-tight text-slate-800 hover:text-blue-600 transition-colors">
            ClassTaskSpace
          </Link>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Classroom & Task Management Platform
          </span>
        </div>

        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ClassTaskSpace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

