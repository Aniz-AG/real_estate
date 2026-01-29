import React from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Loader.jsx";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaCity,
  FaMapMarkedAlt,
  FaUserShield,
} from "react-icons/fa";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10 border border-blue-100">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        <FaUserCircle className="text-blue-700" />
        My Profile
      </h2>

      {/* User Info Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <img
          src={user.photo.url}
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-blue-300 shadow-md"
        />

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserCircle className="text-gray-600" />
            {user.username}
          </h3>
          <p className="text-gray-600 flex items-center gap-2">
            <FaEnvelope className="text-gray-500" />
            {user.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaPhoneAlt className="text-gray-500" />
            {user.phone}
          </p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <p className="text-gray-700 flex items-center gap-2">
          <FaCity className="text-blue-500" />
          <strong>City:</strong> {user.city}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <FaMapMarkedAlt className="text-green-500" />
          <strong>State:</strong> {user.state}
        </p>
        <p className="text-gray-700 flex items-center gap-2 col-span-2">
          <FaUserShield className="text-purple-600" />
          <strong>Role:</strong>
          <span
            className={`ml-2 px-3 py-1 rounded-full text-sm font-medium text-white ${
              user.role === "admin" ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {user.role}
          </span>
        </p>
      </div>

      {/* Manage Profile Button */}
      <div className="mt-8 text-center">
        <button className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
          Manage Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
