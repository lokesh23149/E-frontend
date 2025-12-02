import { useParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import products from '../data/products';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-md" />
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
