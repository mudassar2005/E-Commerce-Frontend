import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, product }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('L');
    const [selectedColor, setSelectedColor] = useState('purple');

    if (!isOpen || !product) return null;

    const {
        image,
        title,
        price,
        description = "Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound.",
        rating = 5,
        reviewCount = 5
    } = product;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg w-full max-w-[1200px] max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row p-6 lg:p-10 gap-8 lg:gap-12 animate-fade-in-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left: Gallery */}
                <div className="flex-1 flex gap-4">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative w-[76px] h-[80px] bg-[#F9F1E7] rounded-lg overflow-hidden cursor-pointer hover:ring-1 ring-[#B88E2F]">
                                <Image src={image} alt="Thumbnail" fill className="object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="relative flex-1 bg-[#F9F1E7] rounded-lg h-[500px] w-full">
                        <Image src={image} alt={title} fill className="object-contain p-4" />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-[42px] font-normal text-black">{title}</h2>
                    <p className="text-2xl font-medium text-[#9F9F9F]">Rs. {price ? price.toLocaleString() : '0'}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-4">
                        <div className="flex text-[#FFC700]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill={i < rating ? "#FFC700" : "none"} />
                            ))}
                        </div>
                        <div className="w-[1px] h-[30px] bg-[#9F9F9F]"></div>
                        <span className="text-[#9F9F9F] text-sm">{reviewCount} Customer Review</span>
                    </div>

                    <p className="text-[13px] text-black leading-relaxed max-w-[424px]">
                        {description}
                    </p>

                    {/* Size */}
                    <div className="mt-4">
                        <span className="text-[#9F9F9F] text-sm block mb-3">Size</span>
                        <div className="flex gap-4">
                            {['L', 'XL', 'XS'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-[30px] h-[30px] rounded-[5px] text-[13px] flex items-center justify-center transition-colors ${selectedSize === size
                                            ? 'bg-[#B88E2F] text-white'
                                            : 'bg-[#F9F1E7] text-black hover:bg-[#B88E2F]/50'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div className="mt-2">
                        <span className="text-[#9F9F9F] text-sm block mb-3">Color</span>
                        <div className="flex gap-4">
                            {[
                                { name: 'purple', class: 'bg-[#816DFA]' },
                                { name: 'black', class: 'bg-black' },
                                { name: 'gold', class: 'bg-[#B88E2F]' }
                            ].map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`w-[30px] h-[30px] rounded-full ${color.class} ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-gray-300' : ''
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-6 pb-8 border-b border-[#D9D9D9]">
                        <div className="flex items-center border border-[#9F9F9F] rounded-[10px] h-[64px] w-[123px]">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 text-base"
                            >-</button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-full text-center outline-none font-medium"
                            />
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 text-base"
                            >+</button>
                        </div>

                        <button className="h-[64px] px-10 border border-black rounded-[15px] text-[20px] font-normal hover:bg-black hover:text-white transition-colors">
                            Add To Cart
                        </button>

                        <button className="h-[64px] px-10 border border-black rounded-[15px] text-[20px] font-normal hover:bg-black hover:text-white transition-colors">
                            + Compare
                        </button>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-3 text-[#9F9F9F] pt-4">
                        <div className="flex gap-4">
                            <span className="w-[75px]">SKU</span>
                            <span>: SS001</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-[75px]">Category</span>
                            <span>: Sofas</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="w-[75px]">Tags</span>
                            <span>: Sofa, Chair, Home, Shop</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="w-[75px]">Share</span>
                            <div className="flex gap-4 text-black">
                                <Facebook size={20} fill="black" />
                                <Linkedin size={20} fill="black" />
                                <Twitter size={20} fill="black" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
