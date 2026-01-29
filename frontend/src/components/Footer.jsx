import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

// Footer Links Data
const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About", path: "/about" },
      { name: "Terms of Use", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Contact Us", path: "/contact" },
    ],
  },
  {
    title: "Get Help",
    links: [
      { name: "Support Career", path: "/support" },
      { name: "24h Service", path: "/services" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "FAQ", path: "/faq" },
      { name: "Policy", path: "/policy" },
      { name: "Business", path: "/business" },
    ],
  },
  {
    title: "Contact",
    links: [
      { name: "WhatsApp", path: "/whatsapp" },
      { name: "Support 24", path: "/support-24" },
    ],
  },
];

// Social Media Links
const socialLinks = [
  { icon: FaFacebookF, url: "#", color: "hover:bg-blue-600" },
  { icon: FaTwitter, url: "#", color: "hover:bg-blue-400" },
  { icon: FaLinkedinIn, url: "#", color: "hover:bg-blue-700" },
];

// Reusable Footer Section Component
const FooterSection = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.path}>
          <Link
            to={link.path}
            className="text-gray-600 hover:underline hover:text-gray-900"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-1 mb-6">
              <span className="text-xl font-medium ml-1">
                GO WITH FLOW & FOLLOW VSK Holding..
              </span>
            </div>
            <p className="text-gray-600 mb-6">
              The copy warned the Little Blind Text, that where it came from it
              would have been rewritten a thousand times.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, url, color }, index) => (
                <a
                  key={index}
                  href={url}
                  className={`w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 ${color} hover:text-white transition`}
                  aria-label="Social link"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map(({ title, links }) => (
                <FooterSection key={title} title={title} links={links} />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              Copyright ©2024 vslHolding.com
            </p>
            <p className="text-gray-600 text-sm">Created by VSL Holding</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
