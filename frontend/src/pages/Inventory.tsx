import React from 'react';

const Inventory: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Product Inventory</h2>
        <div className="space-y-4">
          {[
            { name: 'Organic Tomatoes', stock: 45, status: 'In Stock' },
            { name: 'Fresh Eggs', stock: 12, status: 'Low Stock' },
            { name: 'Honey', stock: 0, status: 'Out of Stock' }
          ].map(product => (
            <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">{product.stock} units</p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  product.status === 'In Stock'
                    ? 'bg-green-100 text-green-800'
                    : product.status === 'Low Stock'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;