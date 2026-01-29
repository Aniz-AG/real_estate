import React from "react";

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center min-h-[200px]">
      <div className="w-12 h-12 border-4 text-center border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
