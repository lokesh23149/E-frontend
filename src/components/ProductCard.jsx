import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { useState, useEffect, useCallback, memo } from "react";
import Card from "./Card";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = memo(({ product }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  /* ✅ Safe mobile detection */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile(); // initial check
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAddToCart = useCallback(() => {
    addToCart(product, quantity);
  }, [addToCart, product, quantity]);

  const handleWishlistToggle = useCallback(() => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist, product.id]);

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative aspect-[3/4] sm:aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
            <img
              src={
                product.image
                  ? product.image.startsWith("http")
                    ? product.image
                    : `http://localhost:8080${product.image}`
                  : "/placeholder-product.jpg"
              }
              alt={product.name}
              className={`w-full h-full object-cover ${
                isMobile ? "" : "group-hover:scale-105"
              } transition-transform duration-300`}
              loading="lazy"
            />

            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                -{product.discount}%
              </div>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistToggle();
              }}
              className={`absolute top-2 right-2 p-2 rounded-md shadow-sm transition-all duration-200 ${
                isInWishlist(product.id)
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-400 hover:text-red-500"
              }`}
            >
              <FiHeart
                className={isInWishlist(product.id) ? "fill-current" : ""}
              />
            </button>
          </div>
        </Link>

        <div className="flex-1 p-3 flex flex-col">
          <div className="text-xs text-gray-500 uppercase mb-2">
            {product.category}
          </div>

          <Link to={`/products/${product.id}`} className="mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mb-4">
            <span className="font-bold text-xl">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-1">
              <button onClick={decrementQuantity}>
                <FiMinus />
              </button>

              <span className="px-3">{quantity}</span>

              <button onClick={incrementQuantity}>
                <FiPlus />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

export default ProductCard;
