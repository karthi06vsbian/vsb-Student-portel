import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, role, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-blue-700">
          VSB Student Portal
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600">
                {role === 'teacher' ? user?.username : user?.register_no || user?.student_name}
              </span>
              <button
                onClick={logout}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/student/login" className="text-sm font-medium text-blue-600 hover:underline">
                Student Login
              </Link>
              <Link to="/teacher/login" className="text-sm font-medium text-blue-600 hover:underline">
                Teacher Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
