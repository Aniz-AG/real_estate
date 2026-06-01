import React from "react";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 text-slate-900 mt-auto border-t border-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-slate-900" />
              <span className="text-2xl font-bold text-slate-900">
                EstateHub
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Your trusted partner in finding the perfect property. We make real
              estate simple and accessible for everyone.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-slate-500 hover:text-[#1D4ED8] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-[#1D4ED8] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-[#1D4ED8] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-[#1D4ED8] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-[#1D4ED8] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="text-slate-600 hover:text-[#1D4ED8] transition-colors"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-slate-600 hover:text-[#1D4ED8] transition-colors"
                >
                  Our Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-[#1D4ED8] transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-600 hover:text-[#1D4ED8] transition-colors cursor-pointer">
                Buy Property
              </li>
              <li className="text-slate-600 hover:text-[#1D4ED8] transition-colors cursor-pointer">
                Rent Property
              </li>
              <li className="text-slate-600 hover:text-[#1D4ED8] transition-colors cursor-pointer">
                Sell Property
              </li>
              <li className="text-slate-600 hover:text-[#1D4ED8] transition-colors cursor-pointer">
                Property Management
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">
                  123 Real Estate St, Property City, PC 12345
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#1D4ED8] flex-shrink-0" />
                <span className="text-slate-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#1D4ED8] flex-shrink-0" />
                <span className="text-slate-600">info@estatehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>&copy; {currentYear} EstateHub. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-[#1D4ED8] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#1D4ED8] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
