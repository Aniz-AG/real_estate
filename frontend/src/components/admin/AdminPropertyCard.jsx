import React from "react";
import { FaBed, FaBath, FaRupeeSign, FaMapMarkerAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";

function AdminPropertyCard({ property, onDelete, onManage, onView }) {
  return (
    <div className="border p-4 h-4/5 rounded-2xl shadow-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.03] transform">
      
      {/* Property Image */}
      <div className="w-full h-45 overflow-hidden rounded-xl">
        <img 
          src={property.photos[0]?.url} 
          alt="Property" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Details */}
      <div className="mt-4 space-y-1">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-1">
          <FaMapMarkerAlt className="text-blue-600" />
          {property.address.property_address}, {property.address.city}
        </h3>

        <p className="text-gray-600 flex items-center gap-1 text-sm">
          <FaRupeeSign className="text-green-700" />
          <span className="font-semibold text-base">₹{property.price.toLocaleString()}</span>
        </p>

        <div className="flex items-center gap-4 text-gray-700 text-sm">
          <span className="flex items-center gap-1">
            <FaBed className="text-indigo-500" />
            {property.nums_bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <FaBath className="text-pink-500" />
            {property.nums_bathrooms} Baths
          </span>
        </div>

        <p className={`text-xs font-semibold mt-2 ${
          property.status === "available" ? "text-green-600" : "text-red-600"
        }`}>
          {property.status.toUpperCase()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-5">
        <button 
          onClick={() => onView(property._id)} 
          className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all text-sm"
        >
          View
        </button>

        <button 
          onClick={() => onManage(property._id)} 
          className="flex items-center px-4 py-2 cursor-pointer bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all text-sm"
        >
           Manage
        </button>

        <button 
          onClick={() => onDelete(property._id)} 
          className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-red-500 text-white rounded-md hover:bg-red-600 transition-all text-sm"
        >
           Delete
        </button>
      </div>
    </div>
  );
}

export default AdminPropertyCard;
