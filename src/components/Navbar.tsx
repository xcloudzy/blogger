import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PenSquare, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Blog
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <PenSquare className="w-5 h-5" />
                  Create
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
