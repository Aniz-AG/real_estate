import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUserCircle,
} from "react-icons/fa";

// Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import { useDispatch } from 'react-redux'
import { getSingleProperty } from '../redux/slices/propertySlice.js'




const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState({
    _id: '',
    address: {
      property_address: "",
      city: "",
      state: "",
      pincode: "",
    },
    property_type: "apartment",
    price: 1000,
    photos: [],
    nums_bedrooms: 1,
    nums_bathrooms: 1,
    square_feet: 1,
    status: "available",
    usage_type: "rent",
    description: "",
    uploaded_by: {
      _id: '',
      username: '',
      email: '',
      phone: '',
      photo: ''
    }
  });

  const {
    _id: agentId = '',
    username: agentUserName = '',
    email: agentEmail = '',
    photo: agentPhoto = '',
    phone: agentPhone = ''

  } = property.uploaded_by || {};



  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSingleProperty(id))
      .then(data => {
        if (data.payload?.success) {
          setProperty(data.payload.property);
        }
      })

  }, [dispatch]);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const {
    address,
    property_type,
    price,
    photos,
    nums_bedrooms,
    nums_bathrooms,
    square_feet,
    status,
    usage_type,
    description,
  } = property;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Image Slider */}
      {/* Image Section */}
      <div className="relative">
        {photos.length === 1 ? (
          <img
            src={photos[0].url}
            alt="Property"
            className="w-full h-[420px] object-cover rounded-xl shadow-md"
          />
        ) : (
          <Slider {...sliderSettings}>
            {photos.map((photo) => (
              <div key={photo.public_id}>
                <img
                  src={photo.url}
                  alt="Property"
                  className="w-full h-[420px] object-cover rounded-xl shadow-md"
                />
              </div>
            ))}
          </Slider>
        )}
      </div>


      {/* Property Info */}
      <div>
        <h1 className="text-3xl font-bold capitalize mb-2">
          {property_type} for {usage_type}
        </h1>
        <p className="text-gray-600 flex items-center gap-2 mb-2">
          <FaMapMarkerAlt />
          {address.property_address}, {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <FaRupeeSign />
          {price.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-lg text-gray-700 font-medium">
        <div className="flex items-center gap-2">
          <FaBed className="text-indigo-600" /> {nums_bedrooms} Bedrooms
        </div>
        <div className="flex items-center gap-2">
          <FaBath className="text-indigo-600" /> {nums_bathrooms} Bathrooms
        </div>
        <div className="flex items-center gap-2">
          <FaRulerCombined className="text-indigo-600" /> {square_feet} sqft
        </div>
        <div>
          Status:{" "}
          <span className="capitalize font-semibold text-blue-600">{status}</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Agent Card */}
      {property.uploaded_by && (
        <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 shadow-lg rounded-2xl flex flex-col sm:flex-row items-center gap-6 mt-10">
          {/* Agent Image */}
          {agentPhoto.url ?
            (<img
              src={agentPhoto.url}
              alt="Agent"
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
            />)
            :
            (
              <FaUserCircle className="w-20 h-20 rounded" />

            )}


          {/* Agent Details */}
          <div className="flex-1 cursor-pointer">
            <h3 className="text-2xl font-bold text-indigo-700">{agentUserName || "Unknown Agent"}</h3>
            <p className="flex items-center gap-2 mt-2 text-gray-700">
              <FaPhoneAlt className="text-indigo-500" /> {agentPhone || "N/A"}
            </p>
            <p className="flex items-center gap-2 text-gray-700 hover:underline">
              <FaEnvelope className="text-indigo-500" />
              <a
                href={`mailto:${agentEmail}`}
                className="hover:text-indigo-600"
              >
                {agentEmail || "N/A"}
              </a>
            </p>

          </div>

          {/* View Agent Properties Button */}
          <div className="mt-4 sm:mt-0">
            <a
              href={`/agent/${agentId || "#"}`}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              View All Properties by Agent
            </a>
          </div>
        </div>
      )}


    </div>
  );
};

// Custom Arrows for Slider
function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:scale-110 cursor-pointer"
    >
      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:scale-110 cursor-pointer"
    >
      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
}

export default PropertyDetails;
