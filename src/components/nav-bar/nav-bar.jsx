"use client"

import React, { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import Image from "next/image";

const routes = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" }
];

const Navbar = ({ ...props }) => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const isRouteActive = (link) => pathname === link;

    return (
        <nav className={classNames(props.className, " w-full bg-white font-poppins")}>
            <div className="w-full px-5 md:px-10">
                <div className="flex items-center justify-between h-[80px]">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer" onClick={() => router.push('/')}>
                        <Image src="/home/logo.png" alt="Furniro Logo" width={50} height={42} className="object-contain" />
                        <span className="mt-2 text-2xl font-bold text-black font-montserrat">Furniro</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-12 gap-8 font-bold">
                            {routes.map((route) => (
                                <Link
                                    key={route.name}
                                    href={route.link}
                                    className={classNames(
                                        "text-base font-medium transition-colors",
                                        isRouteActive(route.link)
                                            ? "text-black"
                                            : "text-black hover:text-gray-600"
                                    )}
                                >
                                    {route.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-8">
                        <button className="text-black hover:text-gray-600 transition-colors">
                            <User size={24} />
                        </button>
                        <button className="text-black hover:text-gray-600 transition-colors">
                            <Search size={24} />
                        </button>
                        <button className="text-black hover:text-gray-600 transition-colors">
                            <Heart size={24} />
                        </button>
                        <button className="text-black hover:text-gray-600 transition-colors">
                            <ShoppingCart size={24} />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-600 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Side Drawer) */}
            {mobileMenuOpen && (
                <div className="relative z-50 md:hidden" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="relative ml-auto flex h-full w-[80%] max-w-xs flex-col overflow-y-auto bg-white py-6 shadow-2xl animate-in slide-in-from-right duration-300">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 mb-8">
                                <span className="text-xl font-bold font-montserrat">Menu</span>
                                <button
                                    type="button"
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex flex-col space-y-1 px-4">
                                {routes.map((route) => (
                                    <Link
                                        key={route.name}
                                        href={route.link}
                                        className={classNames(
                                            "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                                            isRouteActive(route.link)
                                                ? "bg-primary/10 text-primary"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {route.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Utility Icons (Mobile) */}
                            <div className="mt-auto border-t border-gray-100 px-6 py-6">
                                <div className="grid grid-cols-4 gap-4">
                                    <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-black">
                                        <User size={20} />
                                        <span className="text-[10px]">Profile</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-black">
                                        <Search size={20} />
                                        <span className="text-[10px]">Search</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-black">
                                        <Heart size={20} />
                                        <span className="text-[10px]">Wishlist</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-black">
                                        <ShoppingCart size={20} />
                                        <span className="text-[10px]">Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;