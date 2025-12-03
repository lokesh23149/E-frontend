import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Contact from './pages/Contact';


// Main App component
// Sets up routing, cart context, and theme context for the entire application
function App() {
  return (
    // ThemeProvider wraps the app to provide theme state
    <ThemeProvider>
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
              <Route path="/product/:id" element={<ProductDetails />} /> {/* Product details page */}
              <Route path="/cart" element={<CartPage />} /> {/* Shopping cart page */}
              <Route path="/contact" element={<Contact />} /> {/* Contact page */}
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;

