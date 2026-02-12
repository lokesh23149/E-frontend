import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-gray-900 border-b-4 border-yellow-500 shadow-lg sticky top-0 z-40">
      <div className="flex items-center justify-between py-3 px-4  mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white px-14 hover:text-yellow-300 transition-colors">
          FITKART
        </Link>

        {/* Desktop Links and Mobile Button */}
        <div className="flex items-center">
          <div className="hidden lg:flex items-center space-x-6 text-lg">
            <Link to="/" className="text-white hover:text-yellow-300 px-3 py-1 rounded-lg transition-colors">Home</Link>
            <Link to="/offers" className="text-white hover:text-yellow-300 px-3 py-1 rounded-lg transition-colors">Offers & Deals</Link>
            <Link to="/cart" className="text-white hover:text-yellow-300 px-3 py-1 rounded-lg transition-colors">Cart</Link>
            {isAuthenticated && (
              <>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link to="/dashboard" className="text-white hover:text-yellow-300 px-3 py-1 rounded-lg transition-colors">Dashboard</Link>
                )}
                <Link to="/account" className="text-white hover:text-yellow-300 px-3 py-1 rounded-lg transition-colors">Account</Link>
              </>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-white hover:text-red-400 px-3 py-1 rounded-lg transition-colors bg-transparent border-none">Logout</button>
            ) : (
              <Link to="/login" className="text-white hover:text-yellow-300 px-3 py-1 rounded-lg transition-colors">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:text-yellow-300 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-700 shadow-lg">
          <div className="flex flex-col space-y-2 px-4 py-4">
            <Link to="/" onClick={closeMobileMenu} className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg transition-colors">Home</Link>
            <Link to="/offers" onClick={closeMobileMenu} className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg transition-colors">Offers & Deals</Link>
            <Link to="/cart" onClick={closeMobileMenu} className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg transition-colors">Cart</Link>
            {isAuthenticated && (
              <>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link to="/dashboard" onClick={closeMobileMenu} className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg transition-colors">Dashboard</Link>
                )}
                <Link to="/account" onClick={closeMobileMenu} className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg transition-colors">Account</Link>
              </>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg transition-colors bg-transparent border-none text-left w-full">Logout</button>
            ) : (
              <Link to="/login" onClick={closeMobileMenu} className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg transition-colors">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
