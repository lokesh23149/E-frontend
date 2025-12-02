import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Contact from './pages/Contact';
import './App.css';

// Main App component
// Sets up routing and cart context for the entire application
function App() {
  return (
    // CartProvider wraps the app to provide cart state to all components
    <CartProvider>
      {/* Router enables client-side routing */}
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Header is always visible at the top */}
          <Header />
          {/* Routes define the different pages */}
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page */}
            <Route path="/product/:id" element={<ProductDetails />} /> {/* Product details page */}
            <Route path="/cart" element={<CartPage />} /> {/* Shopping cart page */}
            <Route path="/contact" element={<Contact />} /> {/* Contact page */}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

