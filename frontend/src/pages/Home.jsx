import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaHome, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getLatestProperty } from "../redux/slices/propertySlice";
import PropertyCard from "../components/PropertyCard";
import CityCard from "../components/CityCard";

import heroCoverImage from '../assets/images/heroCover.jpg'

const topCities = [
  { cityName: "Jaipur", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtWRFXuyp6px4f4qi4NLYT8FqE0HHeZatgHA&s" },
  { cityName: "Mumbai", imageUrl: "https://media.timeout.com/images/105241451/image.jpg" },
  { cityName: "Delhi", imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92" },
  { cityName: "Pune", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB-JYB7Tfb2t4rco4zAJow4v9VzkzgjuhR3Q&s" },
  { cityName: "Agra", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPMgacSwikn8g6-nlY_EW8aUxQVj5ad7uqNQ&s" },
];

const Home = () => {
  const [formData, setFormData] = useState({ city: "", state: "", search: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { latestProperty } = useSelector((state) => state.property) || [];

  useEffect(() => {
    dispatch(getLatestProperty());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(formData).filter(([_, value]) => value))
    );
    navigate(`/browse?${queryParams.toString()}`);
  };

  return (
    <div className="">
      {/* Hero Section */}
      <section
        className="w-full h-[80vh] bg-cover bg-center flex items-center justify-center relative"
        // style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')` }}
        style={{ backgroundImage: `url(${heroCoverImage})` }}
      >
        <div className="relative z-10 text-center px-4 max-w-2xl w-full text-white">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Property</h1>
          <p className="mb-6">Search apartments, villas, and commercial spaces anywhere in India.</p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-2 items-center">
            <select name="city" value={formData.city} onChange={handleChange} className="w-full sm:w-1/4 p-2 border rounded text-gray-700">
              <option value="">Select City</option>
              <option value="jaipur">Jaipur</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
            </select>

            <select name="state" value={formData.state} onChange={handleChange} className="w-full sm:w-1/4 p-2 border rounded text-gray-700">
              <option value="">Select State</option>
              <option value="rajasthan">Rajasthan</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="karnataka">Karnataka</option>
              <option value="delhi">Delhi</option>
            </select>

            <input type="text" name="search" value={formData.search} onChange={handleChange} placeholder="Search Property..." className="w-full sm:flex-1 p-2 border rounded text-gray-700" />

            <button type="submit" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <FaSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl text-center font-bold mb-6">Latest Listing Properties</h2>
          {latestProperty?.length === 0 ? (
            <div className="w-full text-center text-gray-500 bg-gray-100 py-12 rounded-xl shadow-md">
              <p className="text-lg font-medium">🛑 No Properties Found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {latestProperty?.map(({ address, _id, property_type, price, photos, nums_bedrooms, nums_bathrooms, square_feet, status, usage_type, description }) => {
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
        </div>
      </section>

      {/* Top Cities */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl text-center font-bold mb-6">Top Cities Listing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCities.map(({ cityName, imageUrl }, key) => (
              <CityCard key={key} cityName={cityName} imageUrl={imageUrl} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6 pb-8">Why Choose VSL Holding</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-700">
            {[{ icon: FaHome, title: "Verified Listings", text: "Every property is verified for legal and quality checks." },
              { icon: FaMapMarkerAlt, title: "Pan India Reach", text: "We serve buyers and renters across all major cities and states." },
              { icon: FaUsers, title: "Expert Support", text: "Our agents help you find the best property suited to your needs." }
            ].map(({ icon: Icon, title, text }, index) => (
              <div key={index} className="flex flex-col items-center">
                <Icon className="text-4xl text-blue-600 mb-2" />
                <h4 className="font-semibold mb-1">{title}</h4>
                <p className="text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
