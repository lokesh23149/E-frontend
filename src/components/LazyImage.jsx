import { useState, useEffect, useRef, memo } from 'react';

/**
 * LazyImage - Loads images only when they enter the viewport for better performance.
 * Uses Intersection Observer + native loading="lazy" + decoding="async"
 */
const LazyImage = memo(({ src, alt, className = '', placeholderClassName = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { rootMargin: '100px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!isInView) {
    return (
      <div
        ref={containerRef}
        className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${placeholderClassName} ${className}`}
        style={{ aspectRatio: props.style?.aspectRatio || '1' }}
        aria-label={alt}
      />
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${placeholderClassName}`} />
      )}
      <img
        src={hasError ? '/placeholder-product.jpg' : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} ${!isLoaded && !hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
