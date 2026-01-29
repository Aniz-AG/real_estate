import React from "react";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHome,
  FaTag,
} from "react-icons/fa";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const PropertyCard = ({
  _id,
  property_address,
  city,
  state,
  pincode,
  property_type,
  usage_type,
  nums_bedrooms,
  nums_bathrooms,
  square_feet,
  status,
  price = 0,
  photoUrl = "/images/no-image.jpg",
}) => {
  const navigate = useNavigate();
  const redirectPropertyInDetail = () => navigate(`/property/${_id}`)
  return (
    <div
      onClick={redirectPropertyInDetail}
      className="bg-white rounded-lg shadow-md cursor-pointer overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
      {/* Image with zoom effect */}
      <div className="overflow-hidden h-48">
        <img
          src={photoUrl}
          alt="Property"
          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        {/* Location */}
        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-blue-600" />
          <span className="break-words whitespace-normal block">
            {property_address}, {city}, {state} - {pincode}
          </span>

        </div>

        {/* Property Type & Usage */}
        <div className="flex justify-between text-xs uppercase tracking-wide font-semibold text-gray-500">
          <span className="flex items-center gap-1">
            <FaHome className="text-blue-600" />
            {property_type}
          </span>
          <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            {usage_type}
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <div className="flex items-center gap-1">
            <FaBed className="text-blue-600" />
            {nums_bedrooms} Beds
          </div>
          <div className="flex items-center gap-1">
            <FaBath className="text-blue-600" />
            {nums_bathrooms} Baths
          </div>
          <div className="flex items-center gap-1">
            <FaRulerCombined className="text-blue-600" />
            {square_feet} sqft
          </div>
        </div>

        {/* Price & Status */}
        <div className="flex justify-between items-center mt-2">
          <span className="flex items-center text-lg font-semibold text-blue-600">
            <FaTag className="mr-1" /> ₹{price.toLocaleString()}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ${status === "available"
              ? "bg-green-100 text-green-700"
              : status === "sold"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {status}
          </span>
        </div>



        {/* View Details Button */}
        <div className="mt-4 text-right">
          <Link
            to={`/property/${_id}`}
            className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
