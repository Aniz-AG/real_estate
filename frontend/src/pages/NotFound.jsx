import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="text-center max-w-xl mx-auto">
        {/* Ghost/404 Circle */}
        <div className="relative inline-block mb-8">
          <div className="w-40 h-40 bg-white rounded-full shadow-2xl border-4 border-blue-200 flex items-center justify-center text-blue-600 text-6xl font-extrabold animate-pulse">
            404
          </div>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-blue-600 text-sm italic">
            Uh oh... Page not found!
          </div>
        </div>

        <h1 className="text-4xl font-bold text-blue-800 mb-4 py-4">
          This page doesn’t exist 🏚️
        </h1>

        <p className="text-gray-600 mb-6 text-lg">
          It looks like you've reached a place that doesn't exist. Maybe it's been sold? 😅
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition-all duration-300"
        >
          🏠 Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
