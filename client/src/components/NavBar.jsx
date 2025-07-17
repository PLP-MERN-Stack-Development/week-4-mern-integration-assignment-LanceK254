import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return null;

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">MERN Blog</Link>
        <div className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-white font-semibold' : 'text-gray-200 hover:text-white'
            }
          >
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive ? 'text-white font-semibold' : 'text-gray-200 hover:text-white'
                }
              >
                Create Post
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  isActive ? 'text-white font-semibold' : 'text-gray-200 hover:text-white'
                }
              >
                Categories
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-gray-200 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'text-white font-semibold' : 'text-gray-200 hover:text-white'
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;