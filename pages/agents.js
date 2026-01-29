import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

export default function Agents() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const { data } = await axios.get('/api/property/agents');
            setAgents(data.agents);
        } catch (error) {
            toast.error('Failed to load agents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="bg-gradient-to-br from-blue-600 to-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Agents</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
                        Professional real estate experts ready to help you find your dream property
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <Loader />
                ) : agents && agents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {agents.map((agent) => (
                            <AgentCard key={agent._id} agent={agent} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-lg text-muted-foreground">No agents found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}

function AgentCard({ agent }) {
    return (
        <Card className="hover:shadow-2xl transition-shadow">
            <CardContent className="p-6">
                <div className="text-center mb-6">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={agent.photo?.url} alt={agent.username} />
                        <AvatarFallback className="text-2xl">
                            {agent.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-bold mb-1">{agent.username}</h3>
                    <p className="text-primary font-semibold">Real Estate Agent</p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{agent.city}, {agent.state}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Link href={`/agents/${agent._id}`}>
                        <Button className="w-full" size="lg">
                            <Building2 className="h-4 w-4 mr-2" />
                            View Properties
                        </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="lg">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Agent
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
