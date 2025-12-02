import { useCart } from '../hooks/useCart';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                  <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">${item.price}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</h2>
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-4"
              >
                Clear Cart
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
