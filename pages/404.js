import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function Custom404() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4">
                    <Link href="/">
                        <Button className="gap-2">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/browse">
                        <Button variant="outline" className="gap-2">
                            <Search className="h-4 w-4" />
                            Browse Properties
                        </Button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
