import React, { useEffect, useState } from "react";
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
  Youtube,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DEFAULT_SETTINGS = {
  address_line: "123 Real Estate St, Property City, PC 12345",
  phone: "+1 (555) 123-4567",
  email: "info@estatehub.com",
  social: {},
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const nonEmpty = Object.fromEntries(
            Object.entries(data.settings).filter(([, v]) => v),
          );
          setSettings((prev) => ({ ...prev, ...nonEmpty }));
        }
      })
      .catch(() => {});
  }, []);

  const address =
    [settings.address_line, settings.city, settings.state, settings.pincode]
      .filter(Boolean)
      .join(", ") || DEFAULT_SETTINGS.address_line;
  const phone = settings.phone || DEFAULT_SETTINGS.phone;
  const email = settings.email || DEFAULT_SETTINGS.email;
  const social = settings.social || {};

  const socialLinks = [
    { key: "facebook", href: social.facebook, Icon: Facebook },
    { key: "twitter", href: social.twitter, Icon: Twitter },
    { key: "instagram", href: social.instagram, Icon: Instagram },
    { key: "linkedin", href: social.linkedin, Icon: Linkedin },
    { key: "youtube", href: social.youtube, Icon: Youtube },
  ].filter((s) => s.href);

  return (
    <footer className="bg-slate-100 text-slate-900 mt-auto border-t border-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <Building2 className="h-8 w-8 text-slate-900" /> */}
              <img
                  src="/logo.png"
                  alt="VSK Estates Logo"
                  className="h-16 w-auto object-contain"
                />
            </div>
            <p className="text-sm text-slate-600">
              Your trusted partner in finding the perfect property. We make real
              estate simple and accessible for everyone.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-3">
                {socialLinks.map(({ key, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-[#1D4ED8] transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
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
              {/* <li>
                <Link
                  href="/agents"
                  className="text-slate-600 hover:text-[#1D4ED8] transition-colors"
                >
                  Our Agents
                </Link>
              </li> */}
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
                <span className="text-slate-600">{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#1D4ED8] flex-shrink-0" />
                <span className="text-slate-600">{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#1D4ED8] flex-shrink-0" />
                <span className="text-slate-600">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>&copy; {currentYear} VSK Estates A Real Estate Hub. All rights reserved.</p>
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
