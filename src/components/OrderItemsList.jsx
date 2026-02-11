import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';

const OrderItemsList = ({ items, showTotal = false }) => {
  return (
    <div className="space-y-3">
      {items.map((item, itemIndex) => (
        <div key={itemIndex} className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <Link to={`/products/${item.productId}`} className="block">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <FiPackage className="w-6 h-6 text-gray-400" style={{ display: item.image ? 'none' : 'block' }} />
              </div>
            </Link>
            <div>
              <Link to={`/products/${item.productId}`} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </p>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quantity: {item.quantity}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            INR {(showTotal ? (item.price * item.quantity) : item.price)?.toFixed(2) || '0.00'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;
