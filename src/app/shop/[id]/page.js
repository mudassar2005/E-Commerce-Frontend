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

    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setProductLoading(true);
                const productData = await getProductById(params.id);
                setProduct(productData);
                
                if (productData) {
                    // Set default size and color from product data
                    if (productData.sizes && productData.sizes.length > 0) {
                        setSelectedSize(productData.sizes[0]);
                    } else {
                        setSelectedSize('L');
                    }

                    if (productData.colors && productData.colors.length > 0) {
                        setSelectedColor(productData.colors[0]);
                    } else {
                        setSelectedColor('Purple');
                    }

                    if (typeof window !== 'undefined') {
                        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                        const newViewed = [productData._id, ...viewed.filter(id => id !== productData._id)].slice(0, 10);
                        localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
                    }
                }
            } catch (error) {
                console.error('Error loading product:', error);
                setProduct(null);
            } finally {
                setProductLoading(false);
            }
        };

        if (params.id) {
            loadProduct();
        }
    }, [params.id, getProductById]);

    // Show loading state
    if (productLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B88E2F]"></div>
            </div>
        );
    }

    // Show not found state
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
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
            <Navbar />

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
                                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#F9F1E7] rounded-lg overflow-hidden cursor-pointer ${
                                        selectedImage === index ? 'ring-2 ring-[#B88E2F]' : ''
                                    }`}
                                >
                                    <Image 
                                        src={img} 
                                        alt={`Thumbnail ${index + 1}`} 
                                        width={80} 
                                        height={80} 
                                        className="object-cover w-full h-full" 
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-[#F9F1E7] rounded-lg overflow-hidden">
                            <Image
                                src={thumbnails[selectedImage] || product.image}
                                alt={product.title}
                                width={500}
                                height={500}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-2">{product.title}</h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-[#9F9F9F] mb-3 sm:mb-4">
                            Rs. {product.price ? product.price.toLocaleString() : '0'}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={`${
                                            star <= (product.averageRating || 4)
                                                ? 'text-[#FFC700] fill-current'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600">
                                ({product.totalReviews || 0} Customer Reviews)
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-4 sm:mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3">Size</h3>
                            <div className="flex gap-2 sm:gap-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium rounded ${
                                            selectedSize === size
                                                ? 'bg-[#B88E2F] text-white'
                                                : 'bg-[#F9F1E7] text-gray-900 hover:bg-[#B88E2F] hover:text-white'
                                        } transition-colors`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-4 sm:mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3">Color</h3>
                            <div className="flex gap-2 sm:gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${color.class} ${
                                            selectedColor === color.name
                                                ? 'ring-2 ring-offset-2 ring-[#B88E2F]'
                                                : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                                        } transition-all`}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 sm:flex-none px-6 py-2 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors font-medium"
                            >
                                Add To Cart
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`px-4 py-2 border rounded transition-colors ${
                                    isWishlisted
                                        ? 'border-red-500 text-red-500 hover:bg-red-50'
                                        : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                                }`}
                            >
                                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                            <div className="flex">
                                <span className="w-16 font-medium">SKU:</span>
                                <span>{product.sku || 'N/A'}</span>
                            </div>
                            <div className="flex">
                                <span className="w-16 font-medium">Category:</span>
                                <span>{product.topCategory}</span>
                            </div>
                            <div className="flex">
                                <span className="w-16 font-medium">Tags:</span>
                                <span>{product.tags?.join(', ') || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                            <span className="text-sm font-medium text-gray-900">Share:</span>
                            <div className="flex gap-3">
                                <Facebook size={20} className="text-gray-600 hover:text-[#B88E2F] cursor-pointer" />
                                <Linkedin size={20} className="text-gray-600 hover:text-[#B88E2F] cursor-pointer" />
                                <Twitter size={20} className="text-gray-600 hover:text-[#B88E2F] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mb-8 sm:mb-12 lg:mb-16">
                    <div className="flex border-b border-gray-200 mb-6 sm:mb-8">
                        {['description', 'additional', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium capitalize ${
                                    activeTab === tab
                                        ? 'text-black border-b-2 border-black'
                                        : 'text-gray-600 hover:text-black'
                                }`}
                            >
                                {tab === 'additional' ? 'Additional Information' : tab}
                            </button>
                        ))}
                    </div>

                    <div className="text-gray-700">
                        {activeTab === 'description' && (
                            <div className="space-y-4">
                                <p>{product.description}</p>
                                <p>
                                    Embodying the raw, wayward spirit of rock 'n' roll, the Kilburn portable active stereo speaker takes the unmistakable look and sound of Marshall, unplugs the chords, and takes the show on the road.
                                </p>
                                <p>
                                    Weighing in under 7 pounds, the Kilburn is a lightweight piece of vintage styled engineering. Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound that is both articulate and pronounced.
                                </p>
                            </div>
                        )}
                        {activeTab === 'additional' && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="font-medium">Weight</span>
                                    <span>{product.weight || '1kg'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="font-medium">Dimensions</span>
                                    <span>90 x 60 x 15 cm</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="font-medium">Material</span>
                                    <span>{product.material || 'Cotton'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <span className="font-medium">Color</span>
                                    <span>{selectedColor}</span>
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <ReviewsSection productId={product.id} />
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <RecommendedProducts currentProductId={product.id} />
            </div>

            <Footer />
        </div>
    );
}