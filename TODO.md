# TODO: Fix Syntax Issues in App

## Overview
Fix 55 ESLint errors and 4 warnings across multiple files. Main issues: unused imports, undefined variables, React hooks violations, missing imports, unused variables.

## Steps

### 1. Remove unused 'motion' imports
- src/components/Card.jsx
- src/components/Footer.jsx
- src/components/Loader.jsx
- src/components/ProductCard.jsx
- src/components/ProductList.jsx
- src/components/ProductSkeleton.jsx
- src/components/Sidebar.jsx
- src/components/ThemeToggle.jsx
- src/pages/CartPage.jsx
- src/pages/Contact.jsx
- src/pages/Dashboard.jsx
- src/pages/Home.jsx
- src/pages/Login.jsx
- src/pages/NotFound.jsx
- src/pages/Offers.jsx
- src/pages/OrderConfirmation.jsx
- src/pages/OrderTracking.jsx
- src/pages/Orders.jsx
- src/pages/ProductDetails.jsx
- src/pages/Products.jsx
- src/pages/Profile.jsx
- src/pages/Register.jsx
- src/pages/Settings.jsx
- src/pages/chatBot.jsx

### 2. Fix undefined variables and missing imports
- src/components/Header.jsx: Define setCategories, setCategoriesLoading, setIsCategoriesOpen
- src/pages/ProductDetails.jsx: Import FiPercent, FiClock from react-icons/fi
- src/pages/Profile.jsx: Import authService from src/api/authService.js

### 3. Remove unused variables
- src/components/ProductCard.jsx: Remove 'user'
- src/context/CartProvider.jsx: Remove 'decrementQuantity'
- src/pages/Login.jsx: Remove 'prefersReducedMotion'
- src/pages/OrderConfirmation.jsx: Remove 'useAuth'
- src/pages/OrderTracking.jsx: Remove 'user', 'index'
- src/pages/Orders.jsx: Remove 'index' (multiple)
- src/pages/Products.jsx: Remove 'isOffersFilter', 'setIsOffersFilter', 'setViewMode'
- src/pages/Profile.jsx: Remove 'selectedOrder', 'setSelectedOrder'
- src/pages/chatBot.jsx: Remove 'error'

### 4. Fix React hooks violations
- src/pages/Products.jsx: Move useMemo inside component, fix conditional useMemo
- src/pages/OrderConfirmation.jsx: Add missing deps to useEffect
- src/pages/OrderTracking.jsx: Add missing deps to useEffect
- src/pages/Products.jsx: Add missing deps to useEffect and useMemo

### 5. Fix unnecessary try/catch and catch clauses
- src/context/AuthContext.jsx: Remove unnecessary try/catch
- src/context/WishlistContext.jsx: Remove unnecessary catch

### 6. Fix fast refresh issues
- src/context/AuthContext.jsx: Move non-component exports to separate file
- src/context/ThemeContext.jsx: Move non-component exports to separate file
- src/context/WishlistContext.jsx: Move non-component exports to separate file

### 7. Fix constant condition
- src/pages/Profile.jsx: Fix the constant condition at line 766

## Followup
- Run npm run lint again to verify all issues are fixed
- Test the app to ensure functionality is not broken
