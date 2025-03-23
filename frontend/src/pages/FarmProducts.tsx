import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShoppingBag, PlusCircle, Filter, Edit, Trash2, 
  X, ArrowLeft, Search, Image as ImageIcon
} from 'lucide-react';

// Types for our product data
interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  image?: string;
  farm: string; // Added farm ID
}

// Initial product categories
const productCategories = [
  'All',
  'Fruits',
  'Vegetables',
  'Eggs',
  'Dairy',
  'Meat',
  'Honey',
  'Herbs',
  'Other'
];

const FarmProducts: React.FC = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productForm, setProductForm] = useState<Omit<Product, 'id' | 'farm'>>({
    name: '',
    category: 'Vegetables',
    quantity: 0,
    unit: 'lb',
    price: 0,
  });
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [farmId, setFarmId] = useState<string | null>(null);

  // Fetch farm ID and products on component mount
  useEffect(() => {
    const fetchFarmAndProducts = async () => {
      try {
        // Fetch farm ID
        const farmResponse = await axios.get('/api/farms/my-farm/');
        setFarmId(farmResponse.data.id);

        // Fetch products for the farm
        const productsResponse = await axios.get(`/api/farms/${farmResponse.data.id}/products/`);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Failed to fetch farm or products:', error);
      }
    };

    fetchFarmAndProducts();
  }, []);

  // Filter products based on selected category and search query
  useEffect(() => {
    let result = products;
    
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, products, searchQuery]);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle product image change
  const handleProductImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setProductForm(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // Add a new product
  const handleAddProduct = async () => {
    if (!farmId) return;

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('category', productForm.category);
    formData.append('quantity', productForm.quantity.toString());
    formData.append('unit', productForm.unit);
    formData.append('price', productForm.price.toString());
    if (productImagePreview) {
      const blob = await fetch(productImagePreview).then(res => res.blob());
      formData.append('image', blob);
    }

    try {
      const response = await axios.post('/api/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts(prev => [...prev, response.data]);
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  // Edit existing product
  const handleEditProduct = async () => {
    if (!currentProduct || !farmId) return;

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('category', productForm.category);
    formData.append('quantity', productForm.quantity.toString());
    formData.append('unit', productForm.unit);
    formData.append('price', productForm.price.toString());
    if (productImagePreview) {
      const blob = await fetch(productImagePreview).then(res => res.blob());
      formData.append('image', blob);
    }

    try {
      const response = await axios.put(`/api/products/${currentProduct.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts(prev => prev.map(product => product.id === currentProduct.id ? response.data : product));
      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  // Delete a product
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;

    try {
      await axios.delete(`/api/products/${currentProduct.id}/`);
      setProducts(prev => prev.filter(product => product.id !== currentProduct.id));
      setCurrentProduct(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // Open edit modal with current product data
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      price: product.price
    });
    setProductImagePreview(product.image || null);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Reset form to default values
  const resetForm = () => {
    setProductForm({
      name: '',
      category: 'Vegetables',
      quantity: 0,
      unit: 'lb',
      price: 0
    });
    setProductImagePreview(null);
    setCurrentProduct(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <ShoppingBag className="w-6 h-6 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Farm Products</h1>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
            <div className="relative flex-grow md:max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {productCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table - Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {product.image ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity} {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}/{product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No products found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Products List - Mobile */}
        <div className="md:hidden space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="h-12 w-12 flex-shrink-0 mr-3">
                      {product.image ? (
                        <img className="h-12 w-12 rounded-full object-cover" src={product.image} alt={product.name} />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-900">{product.name}</div>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 mt-3">
                    <div className="text-sm text-gray-500">
                      <span className="block text-xs text-gray-400">Quantity</span>
                      {product.quantity} {product.unit}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="block text-xs text-gray-400">Price</span>
                      ${product.price.toFixed(2)}/{product.unit}
                    </div>
                  </div>
                  
                  <div className="border-t mt-3 pt-3 flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {isAddModalOpen ? 'Add New Product' : 'Edit Product'}
                </h2>
                <button 
                  onClick={() => {
                    resetForm();
                    isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productForm.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={productForm.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    {productCategories.filter(cat => cat !== 'All').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={productForm.quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={productForm.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="lb">lb</option>
                      <option value="kg">kg</option>
                      <option value="oz">oz</option>
                      <option value="g">g</option>
                      <option value="unit">unit</option>
                      <option value="bunch">bunch</option>
                      <option value="dozen">dozen</option>
                      <option value="jar">jar</option>
                      <option value="bottle">bottle</option>
                      <option value="gallon">gallon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price per {productForm.unit}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={productForm.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="w-16 h-16 mr-4 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {productImagePreview ? (
                        <img
                          src={productImagePreview}
                          alt="Product Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="productImage"
                      accept="image/*"
                      onChange={handleProductImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={isAddModalOpen ? handleAddProduct : handleEditProduct}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    {isAddModalOpen ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && currentProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">
                Are you sure you want to delete <span className="font-medium">{currentProduct.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentProduct(null);
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmProducts;