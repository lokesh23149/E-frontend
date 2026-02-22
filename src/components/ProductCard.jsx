import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiStar,
} from "react-icons/fi";
import { useState, useEffect, useCallback, memo } from "react";
import Card from "./Card";
import LazyImage from "./LazyImage";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../context/WishlistContext";

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

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Link to={`/products/${product.id}`} className="block">
          <div
            className={`relative aspect-[3/4] sm:aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-t-lg ${!isMobile ? "group-hover:[&_img]:scale-105" : ""}`}
          >
            <LazyImage
              src={product.image || "/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300"
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

          <div className="flex items-center gap-x-2 mb-3">
            <div className="flex items-center gap-x-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(product.ratings ?? 0)
                      ? "fill-amber-500"
                      : "fill-transparent"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviewCount ?? product.numofreviews ?? 0})
            </span>
          </div>

          <div className="flex items-baseline flex-wrap gap-x-2 mb-4">
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              INR{" "}
              {product.discount
                ? (product.price * (1 - product.discount / 100)).toFixed(0)
                : product.price}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  INR {product.price}
                </span>
                <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                  -{product.discount}%
                </span>
              </>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
             transition-all duration-200
             hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5
             active:scale-95"
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
