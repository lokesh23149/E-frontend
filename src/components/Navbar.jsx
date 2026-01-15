import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

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
  };

  return (
    <nav className=" bg-gray-900  p-4 border-b-4  border-b-blue-400 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold  hover:text-blue-300 transition-colors">FITKART</Link>
        <div className="space-x-6 text-lg">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/offers" className="hover:text-blue-400 transition-colors">Offers & Deals</Link>
          <Link to="/cart" className="hover:text-blue-400 transition-colors">Cart</Link>
          {isAuthenticated && (
            <>
              {user?.role === 'ROLE_ADMIN' && (
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
              )}
              <Link to="/account" className="hover:text-blue-400 transition-colors">Account</Link>
            </>
          )}
          {isAuthenticated ? ( <button onClick={handleLogout} className="hover:text-blue-400 transition-colors bg-transparent border-none">Logout</button> ): (
            <Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
