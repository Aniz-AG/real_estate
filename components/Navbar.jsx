import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Building2, Users, Phone, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/browse', label: 'Browse Properties', icon: Building2 },
        { href: '/agents', label: 'Agents', icon: Users },
        { href: '/contact', label: 'Contact', icon: Phone },
    ];

    const isActive = (path) => router.pathname === path;

    const handleNavLinkClick = () => {
        setIsSidebarOpen(false);
        setIsMenuExpanded(false);
    };

    return (
        <>
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

                        {/* Navigation Links - Desktop */}
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

                        {/* User Actions - Desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated && user ? (
                                <>
                                    <Link href="/profile">
                                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.photo?.url} alt={user.username} />
                                                <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.username}</span>
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden p-2 hover:bg-accent rounded-lg transition"
                        >
                            {isSidebarOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-40 bg-background border-b">
                    <div className="flex flex-col h-full overflow-y-auto">
                        {/* Navigation Links - Mobile */}
                        <div className="flex flex-col border-b">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link key={link.href} href={link.href} onClick={handleNavLinkClick}>
                                        <div
                                            className={`flex items-center gap-3 px-4 py-3 transition ${isActive(link.href)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-accent'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{link.label}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Section */}
                        {isAuthenticated && user ? (
                            <>
                                {/* User Profile Card */}
                                <Link href="/profile" onClick={handleNavLinkClick}>
                                    <div className="flex items-center gap-3 px-4 py-4 border-b hover:bg-accent transition cursor-pointer">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.photo?.url} alt={user.username} />
                                            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{user.username}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Admin Dashboard - Accordion Style */}
                                {user.role === 'admin' && (
                                    <div className="border-b">
                                        <button
                                            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition"
                                        >
                                            <span className="font-medium flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Admin Panel
                                            </span>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${isMenuExpanded ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {isMenuExpanded && (
                                            <Link href="/admin" onClick={handleNavLinkClick}>
                                                <div className="px-4 py-3 bg-muted text-sm hover:bg-accent transition">
                                                    → Go to Dashboard
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Login / Register Buttons */}
                                <div className="flex flex-col gap-2 px-4 py-4 border-b">
                                    <Link href="/login" onClick={handleNavLinkClick}>
                                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                            <User className="h-4 w-4" />
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={handleNavLinkClick}>
                                        <Button className="w-full">Sign Up</Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
