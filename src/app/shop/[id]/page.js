'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/nav-bar/nav-bar';
import Footer from '@/components/footer/footer';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import Card from '@/components/pages/common/card';
import ReviewsSection from '@/components/pages/shop/reviews-section';
import RecentlyViewed from '@/components/pages/shop/recently-viewed';
import RecommendedProducts from '@/components/pages/shop/recommended-products';
import { useProducts } from '@/context/ProductsContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Star, Facebook, Linkedin, Twitter, ChevronRight, Heart } from 'lucide-react';

export default function SingleProductPage() {
    const params = useParams();
    const router = useRouter();
    const { getProductById, products, loading } = useProducts();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const product = getProductById(params.id);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (product) {
            // Set default size and color from product data
            if (product.sizes && product.sizes.length > 0) {
                setSelectedSize(product.sizes[0]);
            } else {
                setSelectedSize('L');
            }

            if (product.colors && product.colors.length > 0) {
                setSelectedColor(product.colors[0]);
            } else {
                setSelectedColor('Purple');
            }

            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const newViewed = [product._id, ...viewed.filter(id => id !== product._id)].slice(0, 10);
            localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
        }
    }, [product]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B88E2F]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div>

                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
                    <Link href="/shop" className="text-[#B88E2F] hover:underline">
                        Back to Shop
                    </Link>
                </div>

            </div>
        );
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const colors = [
        { name: 'Purple', class: 'bg-[#816DFA]' },
        { name: 'Black', class: 'bg-black' },
        { name: 'Gold', class: 'bg-[#B88E2F]' }
    ];

    const thumbnails = product.images && product.images.length > 0
        ? product.images
        : [product.image, product.image, product.image, product.image].filter(Boolean);

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const isWishlisted = isInWishlist(product.id);

    return (
        <div className="bg-white transition-colors duration-300">


            {/* Breadcrumb */}
            <div className="bg-[#F9F1E7] py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-[#B88E2F]">
                            Home
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <Link href="/shop" className="text-gray-600 hover:text-[#B88E2F]">
                            Shop
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">{product.title}</span>
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                        {/* Thumbnails */}
                        <div className="flex sm:flex-col gap-2 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                            {thumbnails.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#F9F1E7] rounded-lg overflow-hidden cursor-pointer ${selectedImage === index ? 'ring-2 ring-[#B88E2F]' : ''
                                        }`}
                                >
                                    <Image src={img} alt={`Thumbnail ${index + 1}`} width={80} height={80} className="object-cover w-full h-full" />
                                </div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-[#F9F1E7] rounded-lg overflow-hidden">
                            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
                                <Image src={thumbnails[selectedImage]} alt={product.title} fill className="object-contain p-4 sm:p-6 lg:p-8" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-2">{product.title}</h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-[#9F9F9F] mb-3 sm:mb-4">Rs. {product.price.toLocaleString()}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={16} className="sm:w-5 sm:h-5 fill-[#FFC700] text-[#FFC700]" />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500">5 Customer Review</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                            {product.description || 'Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound.'}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Size</p>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                                {(product.sizes && product.sizes.length > 0 ? product.sizes : sizes).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${selectedSize === size
                                            ? 'bg-[#B88E2F] text-white'
                                            : 'bg-[#F9F1E7] text-gray-900 hover:bg-[#B88E2F] hover:text-white'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Color</p>
                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                                {(product.colors && product.colors.length > 0 ? product.colors : colors.map(c => c.name)).map((color, index) => {
                                    const colorClass = typeof color === 'string' ?
                                        (color.toLowerCase() === 'black' ? 'bg-black' :
                                            color.toLowerCase() === 'white' ? 'bg-white border border-gray-300' :
                                                color.toLowerCase() === 'red' ? 'bg-red-500' :
                                                    color.toLowerCase() === 'blue' ? 'bg-blue-500' :
                                                        color.toLowerCase() === 'green' ? 'bg-green-500' :
                                                            color.toLowerCase() === 'yellow' ? 'bg-yellow-500' :
                                                                color.toLowerCase() === 'purple' ? 'bg-purple-500' :
                                                                    color.toLowerCase() === 'pink' ? 'bg-pink-500' :
                                                                        color.toLowerCase() === 'gray' || color.toLowerCase() === 'grey' ? 'bg-gray-500' :
                                                                            color.toLowerCase() === 'brown' ? 'bg-amber-700' :
                                                                                'bg-gray-400') : colors[index]?.class || 'bg-gray-400';

                                    const colorName = typeof color === 'string' ? color : color.name;

                                    return (
                                        <button
                                            key={colorName}
                                            onClick={() => setSelectedColor(colorName)}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${colorClass} ${selectedColor === colorName ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                                                }`}
                                            title={colorName}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 hover:bg-gray-100 text-sm sm:text-base"
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-12 sm:w-16 text-center outline-none bg-transparent text-gray-900 text-sm sm:text-base"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 hover:bg-gray-100 text-sm sm:text-base"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex gap-2 sm:gap-4 flex-1">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 px-4 sm:px-8 py-2 sm:py-3 border border-gray-900 rounded-lg text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm sm:text-base"
                                >
                                    Add To Cart
                                </button>

                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`px-4 sm:px-6 py-2 sm:py-3 border rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${isWishlisted
                                        ? 'border-[#B88E2F] text-[#B88E2F] bg-[#B88E2F]/10'
                                        : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                                        }`}
                                >
                                    <Heart size={18} className={`sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Meta Information */}
                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                            <div className="flex gap-2 sm:gap-3">
                                <span className="text-gray-500 w-20 sm:w-24">SKU</span>
                                <span className="text-gray-900">: {product.sku || 'N/A'}</span>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                                <span className="text-gray-500 w-20 sm:w-24">Brand</span>
                                <span className="text-gray-900">: {product.brand || 'N/A'}</span>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                                <span className="text-gray-500 w-20 sm:w-24">Category</span>
                                <span className="text-gray-900">: {product.topCategory || product.category}</span>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                                <span className="text-gray-500 w-20 sm:w-24">Sub Category</span>
                                <span className="text-gray-900">: {product.subCategory || 'N/A'}</span>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                                <span className="text-gray-500 w-20 sm:w-24">Material</span>
                                <span className="text-gray-900">: {product.material || 'N/A'}</span>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                                <span className="text-gray-500 w-20 sm:w-24">Stock</span>
                                <span className="text-gray-900">: {product.stock || 0} pieces</span>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                                <span className="text-gray-500 w-20 sm:w-24">Tags</span>
                                <span className="text-gray-900">: {product.tags ? product.tags.join(', ') : (product.isNew ? 'New' : '') + (product.isFeatured ? ', Featured' : '')}</span>
                            </div>
                            {product.vendor && (
                                <div className="flex gap-2 sm:gap-3">
                                    <span className="text-gray-500 w-20 sm:w-24">Vendor</span>
                                    <span className="text-gray-900">: {product.vendor.businessName || product.vendor.shopName || 'StyleHub'}</span>
                                </div>
                            )}
                            <div className="flex gap-2 sm:gap-3 items-center">
                                <span className="text-gray-500 w-20 sm:w-24">Share</span>
                                <div className="flex gap-3 sm:gap-4">
                                    <Facebook size={18} className="sm:w-5 sm:h-5 text-gray-900 cursor-pointer hover:text-[#B88E2F]" />
                                    <Linkedin size={18} className="sm:w-5 sm:h-5 text-gray-900 cursor-pointer hover:text-[#B88E2F]" />
                                    <Twitter size={18} className="sm:w-5 sm:h-5 text-gray-900 cursor-pointer hover:text-[#B88E2F]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="border-t border-gray-200 pt-8 sm:pt-10 lg:pt-12 mb-8 sm:mb-12 lg:mb-16">
                    <div className="flex justify-center gap-4 sm:gap-8 lg:gap-12 mb-6 sm:mb-8 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`text-sm sm:text-base lg:text-lg pb-2 whitespace-nowrap ${activeTab === 'description'
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('additional')}
                            className={`text-sm sm:text-base lg:text-lg pb-2 whitespace-nowrap ${activeTab === 'additional'
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500'
                                }`}
                        >
                            Additional Info
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`text-sm sm:text-base lg:text-lg pb-2 whitespace-nowrap ${activeTab === 'reviews'
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500'
                                }`}
                        >
                            Reviews
                        </button>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'description' && (
                            <div className="text-gray-600 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
                                    <p className="mb-4">
                                        {product.description || 'High-quality clothing item crafted with attention to detail and comfort.'}
                                    </p>
                                    {product.subtitle && (
                                        <p className="text-sm text-gray-500 italic">
                                            {product.subtitle}
                                        </p>
                                    )}
                                </div>

                                {product.vendor && (
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Vendor</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-900">{product.vendor.businessName || product.vendor.shopName}</h4>
                                            {product.vendor.description && (
                                                <p className="text-sm text-gray-600 mt-2">{product.vendor.description}</p>
                                            )}
                                            {product.vendor.socialLinks && product.vendor.socialLinks.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Follow us:</p>
                                                    <div className="flex gap-2">
                                                        {product.vendor.socialLinks.map((link, index) => (
                                                            <a
                                                                key={index}
                                                                href={link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[#B88E2F] hover:text-[#d4a574] text-sm underline"
                                                            >
                                                                Social Link {index + 1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'additional' && (
                            <div className="text-gray-600">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">Brand</td>
                                            <td className="py-3">{product.brand || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">Material</td>
                                            <td className="py-3">{product.material || 'Premium Quality Fabric'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">Available Sizes</td>
                                            <td className="py-3">{product.sizes ? product.sizes.join(', ') : 'XS, S, M, L, XL'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">Available Colors</td>
                                            <td className="py-3">{product.colors ? product.colors.join(', ') : 'Multiple colors available'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">Stock Quantity</td>
                                            <td className="py-3">{product.stock || 0} pieces</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">SKU</td>
                                            <td className="py-3">{product.sku || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">Category</td>
                                            <td className="py-3">{product.topCategory || product.category} - {product.subCategory || 'General'}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-medium">Gender</td>
                                            <td className="py-3">{product.gender || 'Unisex'}</td>
                                        </tr>
                                        {product.vendor && (
                                            <tr className="border-b border-gray-200">
                                                <td className="py-3 font-medium">Sold By</td>
                                                <td className="py-3">{product.vendor.businessName || product.vendor.shopName}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td className="py-3 font-medium">Care Instructions</td>
                                            <td className="py-3">Machine wash cold, tumble dry low, do not bleach</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewsSection productId={product.id} />
                        )}
                    </div>
                </div>

                {/* Recommended Products (AI Powered) */}
                <RecommendedProducts currentProductId={product.id} />
            </div>

            <RecentlyViewed />


        </div>
    );
}
