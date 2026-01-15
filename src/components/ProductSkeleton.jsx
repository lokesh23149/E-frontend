import { motion } from 'framer-motion';
import Card from './Card';

const ProductSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800 h-full flex flex-col">
        {/* Image Skeleton */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 animate-pulse">
          <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-t-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-6 space-y-4">
          {/* Category Skeleton */}
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse" />

          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse" />
          </div>

          {/* Rating Skeleton */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-8 animate-pulse" />
          </div>

          {/* Price Skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse" />
        </div>

        {/* Action Skeleton */}
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between gap-3">
            {/* Quantity Selector Skeleton */}
            <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            </div>

            {/* Button Skeleton */}
            <div className="flex-1 ml-3 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductSkeleton;
