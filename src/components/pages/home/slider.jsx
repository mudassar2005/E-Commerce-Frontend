'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';
import ImageVideoModal from '../../../modal/image-video-modal/image-video-modal';

const slides = [
    {
        id: 1,
        image: '/images/home/photo1.jpg',
        category: 'Summer Collection',
        title: 'Breezy & Bold',
        description: 'Stay cool and stylish with our new summer arrivals.',
    },
    {
        id: 2,
        image: '/images/home/photo6.jpg',
        category: 'Casual Wear',
        title: 'Everyday Comfort',
        description: 'Upgrade your daily look with our comfortable casuals.',
    },
    {
        id: 3,
        image: '/images/home/photo5.jpg',
        category: 'Formal Trends',
        title: 'Elegant Style',
        description: 'Sophisticated outfits for your special occasions.',
    },
];

export default function Slider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [modalConfig, setModalConfig] = useState({
        isVisible: false,
        type: 'image',
        src: '',
        title: '',
        description: '',
    });

    const nextSlide = React.useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const openModal = (slide) => {
        setModalConfig({
            isVisible: true,
            type: 'image',
            src: slide.image,
            title: slide.title,
            description: slide.description,
        });
    };

    const closeModal = () => {
        setModalConfig((prev) => ({ ...prev, isVisible: false }));
    };

    React.useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="bg-[#FCF8F3] py-8 sm:py-10 lg:py-20 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
                {/* Left Content */}
                <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 z-10 relative">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        50+ Trendy Fashion Ideas
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-md">
                        Our stylists have curated beautiful looks to inspire your next outfit.
                    </p>
                    <button className="bg-[#B88E2F] text-white px-6 sm:px-8 py-2.5 sm:py-3 font-semibold hover:bg-[#9e7a28] transition-colors duration-300 text-sm sm:text-base">
                        Explore More
                    </button>
                </div>

                {/* Right Slider */}
                <div className="w-full lg:w-2/3 relative">
                    {/* Mobile/Tablet: Simple Slider */}
                    <div className="lg:hidden">
                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-lg overflow-hidden">
                            <Image
                                src={slides[currentSlide].image}
                                alt={slides[currentSlide].title}
                                fill
                                className="object-cover"
                            />
                            {/* Overlay Content */}
                            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg max-w-[250px] z-20">
                                <div className="flex items-center gap-2 text-gray-600 mb-2 text-xs sm:text-sm">
                                    <span>0{slides[currentSlide].id}</span>
                                    <span className="w-4 sm:w-6 h-[1px] bg-gray-600"></span>
                                    <span className="font-medium">{slides[currentSlide].category}</span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{slides[currentSlide].title}</h3>
                            </div>
                        </div>
                        {/* Mobile Navigation Dots */}
                        <div className="flex justify-center gap-3 mt-4">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 
                                        ${currentSlide === idx
                                            ? 'bg-[#B88E2F] ring-1 ring-[#B88E2F] ring-offset-2'
                                            : 'bg-gray-300 hover:bg-[#B88E2F]/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Desktop: Original Slider */}
                    <div className="hidden lg:block">
                        <div className="flex gap-6 overflow-hidden p-4">
                            <div
                                className="flex gap-6 transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * (372 + 24)}px)` }}
                            >
                                {slides.map((slide, index) => {
                                    const isActive = index === currentSlide;
                                    return (
                                        <div
                                            key={slide.id}
                                            className={`relative transition-all duration-500 ease-in-out flex-shrink-0 cursor-pointer
                                                ${isActive ? 'w-[404px] h-[582px]' : 'w-[372px] h-[486px]'}
                                            `}
                                            onClick={() => openModal(slide)}
                                        >
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                fill
                                                className="object-cover"
                                            />

                                            {/* Overlay Content - Only for active slide */}
                                            <div className={`absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-8 max-w-[217px] z-20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                    <span>0{slide.id}</span>
                                                    <span className="w-6 h-[1px] bg-gray-600"></span>
                                                    <span className="text-sm font-medium">{slide.category}</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900">{slide.title}</h3>
                                                <button className="absolute bottom-0 right-0 translate-y-0 translate-x-full bg-[#B88E2F] p-3 text-white hover:bg-[#9e7a28] transition-colors">
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Custom Navigation Dots */}
                            <div className="absolute bottom-8 left-[450px] flex gap-4 z-30">
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => goToSlide(idx)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 
                                            ${currentSlide === idx
                                                ? 'bg-[#B88E2F] ring-1 ring-[#B88E2F] ring-offset-4'
                                                : 'bg-gray-300 hover:bg-[#B88E2F]/50'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-[#B88E2F] hover:bg-gray-50 transition-colors z-30"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ImageVideoModal
                config={modalConfig}
                onClose={closeModal}
                isVisible={modalConfig.isVisible}
            />
        </section>
    );
}
