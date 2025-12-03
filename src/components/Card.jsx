import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  glass = false,
  ...props
}) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  const glassClasses = glass
    ? 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 shadow-xl'
    : 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700';
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
