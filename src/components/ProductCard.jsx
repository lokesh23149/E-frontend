import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { useState } from "react";
import Card from "./Card";
import { useCart } from "../hooks/useCart";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Ensure product has an ID before rendering
  if (!product || !product.id) {
    return null;
  }

  return (
    <div className="group">
      {/* 🔗 PRODUCT LINK - Entire card is clickable */}
      <Link to={`/products/${product.id}`}>
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <img
              src={product.images?.[0]?.url || "/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />

            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Implement wishlist functionality
                }}
                className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <FiHeart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{product.discount}%
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  INR ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    INR ${product.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.ratings || 4.5}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Stock: {product.stock || 0}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>

      {/* 🛒 ADD TO CART (NOT A LINK) */}
      <div className="px-4 pb-4">
        {/* Quantity Controls */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={quantity <= 1}
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            if (quantity > 0) {
              addToCart(product, quantity);
              setQuantity(1); // Reset quantity after adding
            }
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          disabled={product.stock === 0 || quantity <= 0}
        >
          <FiShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
