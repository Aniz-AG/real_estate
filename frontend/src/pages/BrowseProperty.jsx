import React, { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import PropertyCard from '../components/PropertyCard';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getFilteredProperties } from '../redux/slices/propertySlice.js';
import Loader from '../components/Loader.jsx';

const cities = ["Delhi", "Mumbai", "Jaipur", "Bengaluru"];
const states = ["Rajasthan", "Maharashtra", "Karnataka", "Delhi"];
const propertyTypes = ["Flat", "Villa", "Plot"];
const budgetRange = { min: 5000, max: 2000000 };

const BrowseProperty = () => {
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    maxPrice: budgetRange.max,
    usageType: '',
    search: '',
    propertyType: '',
  });

  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const { loading, totalPage = 1, properties } = useSelector((state) => state.property.filteredProperty);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
    }));
  }, [searchParams]);

  const handleChange = (field, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage)
  };

  useEffect(() => {

    const id = setTimeout(() => {
      dispatch(getFilteredProperties({ ...filters, page }));
    }, 700);

    return () => {
      clearTimeout(id);
    };
  }, [filters, page, dispatch]);

  return (
    <div className="flex min-h-screen overflow-hidden relative">
      {/* Sidebar */}
      <div className={`fixed md:relative transition-all duration-300 bg-gray-100 p-4 overflow-y-auto hide-scrollbar-mobile 
        ${isSidebarOpen ? 'w-64' : 'w-0 md:w-1/4'} 
        ${isSidebarOpen ? 'block' : 'hidden md:block'}`}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
          Filters
          <button className="md:hidden block text-gray-600 text-xl" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </h2>
        <select
          value={filters.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select
          value={filters.state}
          onChange={(e) => handleChange("state", e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <div className="mb-4">
          <label className="block mb-2">Budget: Up to ₹{filters.maxPrice}</label>
          <input
            type="range"
            min={budgetRange.min}
            max={budgetRange.max}
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
        <select
          value={filters.usageType}
          onChange={(e) => handleChange("usageType", e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Usage Type</option>
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>
        <select
          value={filters.propertyType}
          onChange={(e) => handleChange("propertyType", e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Property Type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="text-2xl text-gray-600 md:hidden self-start" title="Toggle Filters">
            <FiFilter />
          </button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      
          <div className="flex justify-center mb-5 w-full">
            <input
              type="text"
              placeholder="Search by addrss..."
              className="border p-3 w-2/3 md:w-1/2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>

        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Search Results</h2>
        {loading ? <Loader /> : properties.length === 0 ? (
          <p className="text-gray-600 text-center">No results found. Try different filters.</p>
        ) : (
          <div className={`grid gap-4 ${isSidebarOpen ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {properties.map(({ address, _id, property_type, price, photos, nums_bedrooms, nums_bathrooms, square_feet, status, usage_type, description }) => {
              const { property_address, city, state, pincode } = address;
              const photoUrl = photos?.[0]?.url || "https://via.placeholder.com/300";
              return (
                <PropertyCard
                  key={_id}
                  _id={_id}
                  property_address={property_address}
                  city={city}
                  state={state}
                  pincode={pincode}
                  property_type={property_type}
                  usage_type={usage_type}
                  nums_bedrooms={nums_bedrooms}
                  nums_bathrooms={nums_bathrooms}
                  square_feet={square_feet}
                  status={status}
                  description={description}
                  price={price}
                  photoUrl={photoUrl}
                />
              );
            })}
          </div>
        )}


        {/* Pagination Code... */}
        <div className="flex justify-center mt-6">
          {/* Previous Button («), disabled on first page */}
          {page > 1 && (
            <button
              className="px-4 py-2 mx-1 cursor-pointer rounded bg-gray-300"
              onClick={() => handlePageChange(page - 1)}
            >
              «
            </button>
          )}

          {/* Page Numbers (Show current + next page, stop at totalPage) */}
          {Array.from({ length: totalPage }, (_, i) => i + 1)
            .slice(page - 1, page + 5) // Show only current and next few pages
            .map((num) => (
              <button
                key={num}
                className={`px-4 py-2 mx-1 cursor-pointer rounded ${page === num ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}

          {/* Next Button (»), disabled on last page */}
          {page < totalPage && (
            <button
              className="px-4 py-2 mx-1 cursor-pointer rounded bg-gray-300"
              onClick={() => handlePageChange(page + 1)}
            >
              »
            </button>
          )}
        </div>
        {/* Pagination Code End... */}


      </div>
    </div>
  );
};

export default BrowseProperty;


