import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaEnvelope, FaBars } from "react-icons/fa";

const navItems = [
  { to: "/dashboard/property", label: "Property", icon: <FaHome /> },
  { to: "/dashboard/user", label: "User", icon: <FaUsers /> },
  { to: "/dashboard/contact", label: "Contact Request", icon: <FaEnvelope /> },
];

function DashboardNavSlider() {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open on desktop

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`h-screen shadow-lg transition-all duration-300 bg-white ${
        isOpen ? "w-1/5 md:w-1/5" : "w-[5%] md:w-[10%]"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-3">
        <FaBars className="cursor-pointer text-xl" onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "text-blue-500 hover:bg-blue-600 hover:text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default DashboardNavSlider;
