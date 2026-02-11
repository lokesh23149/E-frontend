import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const NavBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-gray-900 p-4 border-b-4 border-b-yellow-500 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-yellow-300 transition-colors">FITKART</Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-yellow-300 transition-colors">Home</Link>
          <Link to="/offers" className="hover:text-yellow-300 transition-colors">Offers & Deals</Link>
          <Link to="/cart" className="hover:text-yellow-300 transition-colors">Cart</Link>
          {isAuthenticated && (
            <>
              {user?.role === 'ROLE_ADMIN' && (
                <Link to="/dashboard" className="hover:text-yellow-300 transition-colors">Dashboard</Link>
              )}
              <Link to="/account" className="hover:text-yellow-300 transition-colors">Account</Link>
            </>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="hover:text-yellow-300 transition-colors bg-transparent border-none">Logout</button>
          ) : (
            <Link to="/login" className="hover:text-yellow-300 transition-colors">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button - Hidden on desktop */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-blue-300 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg z-50">
          <div className="container mx-auto py-4 px-4 space-y-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-lg hover:text-yellow-300 transition-colors hover:bg-gray-800 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/offers"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-lg hover:text-yellow-300 transition-colors hover:bg-gray-800 rounded-lg"
            >
              Offers & Deals
            </Link>
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-lg hover:text-yellow-300 transition-colors hover:bg-gray-800 rounded-lg"
            >
              Cart
            </Link>
            {isAuthenticated && (
              <>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-lg hover:text-yellow-300 transition-colors hover:bg-gray-800 rounded-lg"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/account"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 text-lg hover:text-yellow-300 transition-colors hover:bg-gray-800 rounded-lg"
                >
                  Account
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left py-3 px-4 text-lg hover:text-yellow-300 transition-colors hover:bg-gray-800 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block py-3 px-4 text-lg hover:text-yellow-300 transition-colors hover:bg-gray-800 rounded-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
