import React from 'react';
import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-200 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Building2 className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold text-white">EstateHub</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Your trusted partner in finding the perfect property. We make real estate simple and accessible for everyone.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/browse" className="hover:text-primary transition-colors">Browse Properties</Link>
                            </li>
                            <li>
                                <Link href="/agents" className="hover:text-primary transition-colors">Our Agents</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-primary transition-colors cursor-pointer">Buy Property</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Rent Property</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Sell Property</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Property Management</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>123 Real Estate St, Property City, PC 12345</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>info@estatehub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-slate-700" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
                    <p>&copy; {currentYear} EstateHub. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
