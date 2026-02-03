import React from 'react';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewProjects() {
    // Placeholder projects - you can replace with actual data from API
    const projects = [
        {
            id: 1,
            name: 'Prestige Lakeside Habitat',
            location: 'Whitefield, Bangalore',
            price: '₹1.2 Cr onwards',
            type: '2, 3, 4 BHK Apartments',
            status: 'Under Construction',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
            developer: 'Prestige Group'
        },
        {
            id: 2,
            name: 'Godrej Palm Retreat',
            location: 'Sector 150, Noida',
            price: '₹85 Lac onwards',
            type: '2, 3 BHK Apartments',
            status: 'Ready to Move',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
            developer: 'Godrej Properties'
        },
        {
            id: 3,
            name: 'Sobha Dream Gardens',
            location: 'Thanisandra, Bangalore',
            price: '₹65 Lac onwards',
            type: '1, 2, 3 BHK Apartments',
            status: 'Under Construction',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60',
            developer: 'Sobha Ltd'
        },
        {
            id: 4,
            name: 'DLF The Camellias',
            location: 'Golf Course Road, Gurgaon',
            price: '₹15 Cr onwards',
            type: '4, 5 BHK Apartments',
            status: 'Ready to Move',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60',
            developer: 'DLF'
        },
        {
            id: 5,
            name: 'Lodha World Towers',
            location: 'Lower Parel, Mumbai',
            price: '₹8 Cr onwards',
            type: '3, 4, 5 BHK Apartments',
            status: 'Ready to Move',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60',
            developer: 'Lodha Group'
        },
        {
            id: 6,
            name: 'Brigade Utopia',
            location: 'Varthur Road, Bangalore',
            price: '₹1.5 Cr onwards',
            type: '3, 4 BHK Apartments',
            status: 'Under Construction',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
            developer: 'Brigade Group'
        },
    ];

    return (
        <Layout>
            <SeoHead
                title="New Projects | EstateHub"
                description="Explore the latest residential and commercial projects from top builders across India."
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#C4302B] to-[#A52521] py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        New Projects
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Explore the latest residential and commercial projects from top builders
                    </p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-white border-0">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'Ready to Move'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-orange-500 text-white'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <p className="text-sm text-[#C4302B] font-medium mb-1">{project.developer}</p>
                                    <h3 className="font-bold text-lg mb-2 text-gray-800">{project.name}</h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                                        <MapPin className="h-4 w-4" />
                                        {project.location}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-3">{project.type}</p>
                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <span className="text-lg font-bold text-[#C4302B]">{project.price}</span>
                                        <Button size="sm" className="bg-[#C4302B] hover:bg-[#A52521] text-white rounded-lg">
                                            View Details
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <Building2 className="h-12 w-12 text-[#C4302B] mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Are you a Builder?
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-xl mx-auto">
                        List your project on EstateHub and reach thousands of potential buyers
                    </p>
                    <Link href="/contact">
                        <Button className="bg-[#C4302B] hover:bg-[#A52521] text-white px-8">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
