import React, { useState, useRef, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, Links, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

import  PropertiesDropDown from './PropertiesDropDown.jsx'
import { useSelector, useDispatch } from 'react-redux'
import  { userNotExist } from '../redux/slices/userSlice.js'

import toast from 'react-hot-toast'








const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const activeLink = location.pathname;

  const navigate = useNavigate();
 

  // select the user info 
  const dispatch = useDispatch();
  const userData = useSelector(state=>state.user);
  const { user, isAuthenticated } = userData;


  const logoutUser = ()=>{
    localStorage.setItem('token', '');
    dispatch(userNotExist())
 }
  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderAuthLinks = () => (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          {user?.role == "admin" && (
            <Link
              to="/dashboard/property"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            >
              <FaTachometerAlt />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          )}
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              {user.photo.url ? <img className='w-8 h-8 rounded-4xl' src={user.photo.url} /> : <FaUserCircle className="text-2xl" />}
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </Link>
                {/* <Link
                  to="/liked-properties"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Properties
                </Link> */}
                <button
                  onClick={() => {
                    logoutUser()
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout <FaSignOutAlt className="inline ml-1" />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link to={'/login'} className="text-sm cursor-pointer bg-violet-600 rounded-lg text-white font-medium p-3 hover:text-blue-800 transition">
            Login
          </Link>
          <Link to={'/register'} className="text-sm  p-3 rounded-lg cursor-pointer font-medium text-white bg-green-500  hover:text-green-800 transition">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="w-full flex justify-between items-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 md:h-20 h-16">
      
        {/* Logo */}
        <div className="flex items-center gap-1 cursor-pointer">
          <p className="text-red-500">
            VSL<span className="text-xl text-black font-bold px-1">Holding</span>
          </p>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className={`text-sm font-medium ${activeLink === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium ${activeLink === '/about' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            About Us
          </Link>

          {/* Properties with Dropdown */}
          <div className="relative group">
            <Link
              to="/browse"
              className={`text-sm font-medium flex items-center gap-1 ${activeLink === '/browse' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Properties
              <MdKeyboardArrowRight className="text-lg mt-0.5" />
            </Link>

          <PropertiesDropDown />

          </div>

          <Link
            to="/agents"
            className={`text-sm font-medium ${activeLink === '/agents' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Agents
          </Link>

          <Link
            to="/contact-us"
            className={`text-sm font-medium ${activeLink === '/contact-us' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Contact Us
          </Link>
        </div>

        {/* Auth - Desktop */}
        <div className="hidden md:flex items-center gap-6">{renderAuthLinks()}</div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="max-w-screen-xl mx-auto px-4 space-y-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium py-2">
              Home
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium py-2">
              About Us
            </Link>
            <Link to="/browse" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium py-2">
              Properties
            </Link>
            <Link to="/agents" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium py-2">
              Agents
            </Link>
            <Link to="/agents" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium py-2">
              Contact Us
            </Link>
            <div>{renderAuthLinks()}</div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
