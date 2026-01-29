import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Building2, Users, Phone, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state) => state.user);

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/browse', label: 'Browse Properties', icon: Building2 },
        { href: '/agents', label: 'Agents', icon: Users },
        { href: '/contact', label: 'Contact', icon: Phone },
    ];

    const isActive = (path) => router.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Building2 className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            EstateHub
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link key={link.href} href={link.href}>
                                    <Button
                                        variant={isActive(link.href) ? 'default' : 'ghost'}
                                        className="flex items-center gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {link.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <>
                                <Link href="/profile">
                                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.photo?.url} alt={user.username} />
                                            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:block font-medium">{user.username}</span>
                                    </div>
                                </Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin">
                                        <Button variant="outline" size="sm">
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
