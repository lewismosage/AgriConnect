import React, { useState } from 'react';
import { Filter } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filters: { organicOnly: boolean; inStock: boolean; localDelivery: boolean }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    organicOnly: false,
    inStock: false,
    localDelivery: false
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newFilters = { ...filters, [name]: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="organicOnly"
            checked={filters.organicOnly}
            onChange={handleFilterChange}
            className="mr-2"
          />
          <span>Organic Only</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={handleFilterChange}
            className="mr-2"
          />
          <span>In Stock</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="localDelivery"
            checked={filters.localDelivery}
            onChange={handleFilterChange}
            className="mr-2"
          />
          <span>Local Delivery</span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;