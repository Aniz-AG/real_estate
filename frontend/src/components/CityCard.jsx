import React from "react";
import { Link } from "react-router-dom";

const CityCard = ({ cityName, imageUrl }) => {
  return (
    <Link
      to={`/browse?city=${cityName.toLowerCase()}`}
      className="group block rounded-lg overflow-hidden shadow hover:shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={cityName}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
        {/* City name overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <span className="text-white text-xl font-semibold opacity-90 group-hover:opacity-50 transition-opacity duration-300">
            {cityName}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;
