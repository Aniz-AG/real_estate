import React  from "react";
import { Link } from "react-router-dom";


const AuthicatedModal = ({ onClose }) => {
  
  return (
    <div className="flex justify-center items-center bg-opacity-100 backdrop-blur-sm">
      <div className="rounded-lg  p-6 w-80 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
           You Login to System.
        </h2>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition disabled:opacity-50"
            onClick={onClose}
          >
            Cancel 
          </button>
          <Link
            to='/login'
            className="bg-gray-300 text-gray-700 cursor-pointer px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition"
          >
            Login
          </Link>
          <Link
            to='/register'
            className="bg-gray-300 text-gray-700 cursor-pointer px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthicatedModal;
