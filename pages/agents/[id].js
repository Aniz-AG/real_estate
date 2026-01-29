import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building2, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

export default function AgentDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAgentData = async () => {
            try {
                setLoading(true);
                const [agentRes, propertiesRes] = await Promise.all([
                    axios.get(`/api/property/agent/${id}`),
                    axios.get(`/api/property/agent/properties/${id}`)
                ]);

                if (agentRes.data.success) {
                    setAgent(agentRes.data.agent);
                }
                if (propertiesRes.data.success) {
                    setProperties(propertiesRes.data.properties);
                }
            } catch (error) {
                toast.error('Failed to fetch agent details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentData();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader />
                </div>
            </Layout>
        );
    }

    if (!agent) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-xl text-muted-foreground">Agent not found</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SeoHead
                title={`${agent.username} - Real Estate Agent`}
                description={`View properties by ${agent.username}`}
            />
            <div className="container mx-auto px-4 py-12">
                {/* Agent Info Card */}
                <Card className="mb-12 shadow-xl">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <Avatar className="w-32 h-32">
                                <AvatarImage src={agent.photo?.url} alt={agent.username} />
                                <AvatarFallback className="text-4xl">
                                    {agent.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-3xl font-bold mb-2">{agent.username}</h1>
                                <p className="text-muted-foreground mb-4">Real Estate Agent</p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary" />
                                        <span>{agent.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" />
                                        <span>{agent.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>{agent.city}, {agent.state}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary">{properties.length}</div>
                                <div className="text-muted-foreground">Properties Listed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Agent's Properties */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Properties by {agent.username}</h2>
                    {properties.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">
                            No properties listed by this agent yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <Link key={property._id} href={`/property/${property._id}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                        <div className="aspect-video relative">
                                            <img
                                                src={property.photos?.[0]?.url || '/placeholder.jpg'}
                                                alt={property.title || 'Property'}
                                                className="object-cover w-full h-full"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${property.status === 'available'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-red-500 text-white'
                                                    }`}>
                                                    {property.status}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="text-2xl font-bold text-primary mb-2">
                                                ₹{property.price?.toLocaleString()}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                <MapPin className="inline h-4 w-4 mr-1" />
                                                {property.address?.city}, {property.address?.state}
                                            </p>
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Bed className="h-4 w-4" />
                                                    {property.nums_bedrooms} Beds
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Bath className="h-4 w-4" />
                                                    {property.nums_bathrooms} Baths
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Maximize className="h-4 w-4" />
                                                    {property.square_feet} sqft
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
