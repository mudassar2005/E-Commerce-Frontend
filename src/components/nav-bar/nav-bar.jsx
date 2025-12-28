"use client"

import React, { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Heart, ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const routes = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" }
];

const getVisibleRoutes = (user) => {
    return [...routes];
};

const clothingCategories = [
    {
        name: "Men",
        link: "/shop?category=Men",
        subcategories: [
            { name: "Unstitched", link: "/shop?category=Men&subcategory=Unstitched" },
            { name: "Stitched", link: "/shop?category=Men&subcategory=Stitched" },
            { name: "Jeans", link: "/shop?category=Men&subcategory=Jeans" },
            { name: "Shirts", link: "/shop?category=Men&subcategory=Shirts" },
            { name: "Dress Shirts", link: "/shop?category=Men&subcategory=Dress Shirts" },
            { name: "T-Shirts", link: "/shop?category=Men&subcategory=T-Shirts" },
            { name: "Pants", link: "/shop?category=Men&subcategory=Pants" }
        ]
    },
    {
        name: "Women",
        link: "/shop?category=Women",
        subcategories: [
            { name: "Unstitched", link: "/shop?category=Women&subcategory=Unstitched" },
            { name: "Stitched", link: "/shop?category=Women&subcategory=Stitched" },
            { name: "Jeans", link: "/shop?category=Women&subcategory=Jeans" },
            { name: "Shirts", link: "/shop?category=Women&subcategory=Shirts" },
            { name: "Dresses", link: "/shop?category=Women&subcategory=Dresses" },
            { name: "Tops", link: "/shop?category=Women&subcategory=Tops" },
            { name: "Pants", link: "/shop?category=Women&subcategory=Pants" },
            { name: "Skirts", link: "/shop?category=Women&subcategory=Skirts" }
        ]
    },
    {
        name: "Kids",
        link: "/shop?category=Kids",
        subcategories: [
            { name: "Boys Clothing", link: "/shop?category=Kids&subcategory=Boys" },
            { name: "Girls Clothing", link: "/shop?category=Kids&subcategory=Girls" },
            { name: "Baby Clothing", link: "/shop?category=Kids&subcategory=Baby" },
            { name: "School Uniforms", link: "/shop?category=Kids&subcategory=Uniforms" }
        ]
    },
    {
        name: "Footwear",
        link: "/shop?category=Footwear",
        subcategories: [
            { name: "Men's Shoes", link: "/shop?category=Footwear&subcategory=Men" },
            { name: "Women's Shoes", link: "/shop?category=Footwear&subcategory=Women" },
            { name: "Kids Shoes", link: "/shop?category=Footwear&subcategory=Kids" },
            { name: "Sports Shoes", link: "/shop?category=Footwear&subcategory=Sports" },
            { name: "Formal Shoes", link: "/shop?category=Footwear&subcategory=Formal" },
            { name: "Sandals", link: "/shop?category=Footwear&subcategory=Sandals" }
        ]
    }
];

const Navbar = ({ ...props }) => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
    const router = useRouter();
    const { getCartCount, setIsCartOpen } = useCart();
    const { user, logout } = useAuth();
    const cartCount = getCartCount();

    const isRouteActive = (link) => pathname === link;

    return (
        <nav className={classNames(props.className, "w-full bg-white font-poppins sticky top-0 z-50 border-b border-gray-100")}>
            <div className="w-full px-6 lg:px-12 xl:px-20">
                <div className="relative flex items-center justify-between h-16">
                    {/* Left Section: Categories & Logo */}
                    <div className="flex items-center gap-8">
                        {/* Categories Button */}
                        <button
                            onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
                            className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                        >
                            <Menu size={20} strokeWidth={1.5} />

                        </button>

                        {/* Logo */}
                        <div
                            className="cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            <span className="text-2xl font-light tracking-[0.2em] text-gray-900 font-serif">
                                STYLEHUB
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-10">
                            {getVisibleRoutes(user).map((route) => (
                                <Link
                                    key={route.name}
                                    href={route.link}
                                    className={classNames(
                                        "text-sm font-medium tracking-wider transition-colors relative my-[1]",
                                        isRouteActive(route.link)
                                            ? "text-gray-900"
                                            : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    {route.name.toUpperCase()}
                                    {isRouteActive(route.link) && (
                                        <span className="absolute -bottom-6 left-0 right-0 h-px bg-gray-900"></span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-6">

                        {/* User */}
                        {user ? (
                            <div className="hidden lg:block relative group">
                                <button className="text-gray-900 hover:text-gray-600 transition-colors">
                                    <User size={20} strokeWidth={1.5} />
                                </button>
                                <div className="absolute right-0 mt-8 w-56 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-6 transition-all duration-200 z-50 border border-gray-100">
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                                    </div>
                                    <Link href="/profile" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        My Profile
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'vendor' && (
                                        <Link href="/vendor/dashboard" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            Vendor Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-5 py-3 text-sm text-gray-900 hover:bg-gray-50 border-t border-gray-100 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden lg:block text-gray-900 hover:text-gray-600 transition-colors">
                                <User size={20} strokeWidth={1.5} />
                            </Link>
                        )}

                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden lg:block text-gray-900 hover:text-gray-600 transition-colors">
                            <Heart size={20} strokeWidth={1.5} />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-gray-900 hover:text-gray-600 transition-colors relative"
                        >
                            <ShoppingCart size={20} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-gray-900"
                        >
                            {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories Dropdown */}
            {categoriesMenuOpen && (
                <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-sm z-40">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 py-12">
                        <div className="grid grid-cols-4 gap-16">
                            {clothingCategories.map((category) => (
                                <div key={category.name} className="space-y-6">
                                    <Link
                                        href={category.link}
                                        className="text-sm font-medium tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
                                        onClick={() => setCategoriesMenuOpen(false)}
                                    >
                                        {category.name.toUpperCase()}
                                    </Link>
                                    <div className="space-y-3">
                                        {category.subcategories.map((subcategory) => (
                                            <Link
                                                key={subcategory.name}
                                                href={subcategory.link}
                                                className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                                                onClick={() => setCategoriesMenuOpen(false)}
                                            >
                                                {subcategory.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-xl font-light tracking-wider text-gray-900 font-serif">MENU</span>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="mb-8 pb-8 border-b border-gray-100">
                                <h3 className="text-xs font-medium tracking-wider text-gray-500 mb-6">CATEGORIES</h3>
                                <div className="space-y-6">
                                    {clothingCategories.map((category) => (
                                        <div key={category.name}>
                                            <Link
                                                href={category.link}
                                                className="block text-sm font-medium text-gray-900 hover:text-gray-600 mb-3"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {category.name}
                                            </Link>
                                            <div className="space-y-2 pl-4">
                                                {category.subcategories.slice(0, 4).map((subcategory) => (
                                                    <Link
                                                        key={subcategory.name}
                                                        href={subcategory.link}
                                                        className="block text-sm text-gray-500 hover:text-gray-900"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subcategory.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="space-y-1 mb-8 pb-8 border-b border-gray-100">
                                {getVisibleRoutes(user).map((route) => (
                                    <Link
                                        key={route.name}
                                        href={route.link}
                                        className={classNames(
                                            "block px-4 py-3 text-sm font-medium transition-colors",
                                            isRouteActive(route.link)
                                                ? "text-gray-900 bg-gray-50"
                                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {route.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Bottom Actions */}
                            <div className="space-y-3">
                                {user ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-gray-900"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <User size={18} strokeWidth={1.5} />
                                            {user.name}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:text-gray-600"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-gray-900"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User size={18} strokeWidth={1.5} />
                                        Login
                                    </Link>
                                )}
                                <Link
                                    href="/wishlist"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-gray-900"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Heart size={18} strokeWidth={1.5} />
                                    Wishlist
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop for categories */}
            {categoriesMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/10 z-30"
                    onClick={() => setCategoriesMenuOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;