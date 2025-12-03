import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Products from './pages/Products';
import NotFound from './pages/NotFound';


// Main App component
// Sets up routing, cart context, and theme context for the entire application
function App() {
  return (
    // ThemeProvider wraps the app to provide theme state
    <ThemeProvider>
      {/* AuthProvider wraps the app to provide auth state */}
      <AuthProvider>
        {/* CartProvider wraps the app to provide cart state to all components */}
        <CartProvider>
          {/* Router enables client-side routing */}
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              {/* Header is always visible at the top */}
              <Header />
              {/* Routes define the different pages */}
              <Routes>
                <Route path="/" element={<Home />} /> {/* Home page */}
                <Route path="/products" element={<Products />} /> {/* Products page */}
                <Route path="/cart" element={<CartPage />} /> {/* Shopping cart page */}
                <Route path="/contact" element={<Contact />} /> {/* Contact page */}
                <Route path="/login" element={<Login />} /> {/* Login page */}
                <Route path="/register" element={<Register />} /> {/* Register page */}
                <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard page */}
                <Route path="/profile" element={<Profile />} /> {/* Profile page */}
                <Route path="/orders" element={<Orders />} /> {/* Orders page */}
                <Route path="*" element={<NotFound />} /> {/* 404 page */}
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

