import React from 'react';
import Breadcrumb from '@/components/pages/common/breadcrumb';
import { Award, Users, Heart, TrendingUp, ShoppingBag, Globe, LucideLeaf } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    const stats = [
        { label: "Years of Trust", value: "5+", icon: <Award size={24} /> },
        { label: "Happy Customers", value: "10k+", icon: <Users size={24} /> },
        { label: "Countries Served", value: "15+", icon: <Globe size={24} /> },
        { label: "Premium Products", value: "2000+", icon: <ShoppingBag size={24} /> },
    ];

    const values = [
        {
            icon: <Award size={36} className="text-[#B88E2F]" />,
            title: 'Uncompromised Quality',
            description: 'We source the finest fabrics to ensure every piece is comfortable, durable, and stylish.'
        },
        {
            icon: <LucideLeaf size={36} className="text-[#B88E2F]" />,
            title: 'Sustainable Fashion',
            description: 'Committed to eco-friendly practices, we strive to minimize our environmental footprint.'
        },
        {
            icon: <Heart size={36} className="text-[#B88E2F]" />,
            title: 'Customer Satisfaction',
            description: 'Your style journey is our priority. We are dedicated to providing exceptional service.'
        },
        {
            icon: <TrendingUp size={36} className="text-[#B88E2F]" />,
            title: 'Trendsetting Design',
            description: 'Our designers are always ahead of the curve, bringing you the latest in fashion trends.'
        }
    ];

    return (
        <div className="bg-white font-poppins">
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center bg-[#F9F1E7] overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#B88E2F] rounded-full filter blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#B88E2F] rounded-full filter blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Breadcrumb items={[{ label: 'About' }]} className="justify-center mb-4" />
                    <h1 className="text-4xl md:text-6xl font-bold font-montserrat text-[#3A3A3A] mb-4">
                        Redefining Style
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        StyleHub is more than just a clothing brand. It's a movement towards expressing your unique identity through fashion.
                    </p>
                </div>
            </div>

            {/* Stats Banner */}
            <div className="bg-[#B88E2F] py-12 -mt-8 relative z-20 mx-4 md:mx-auto md:max-w-6xl rounded-xl shadow-xl text-white">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center space-y-2 group">
                            <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold font-montserrat">{stat.value}</h3>
                            <p className="text-sm uppercase tracking-wider opacity-80">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#B88E2F] rounded-2xl"></div>
                        <div className="relative aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                            {/* Placeholder for a brand image if available, using a solid color for now to look professional */}
                            <div className="w-full h-full bg-cover bg-center bg-[#F9F1E7] flex items-center justify-center text-[#B88E2F]/20">
                                <ShoppingBag size={120} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <span className="text-[#B88E2F] font-semibold tracking-wider uppercase">Our Story</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#3A3A3A]">
                            Crafting Fashion with Passion & Purpose
                        </h2>
                        <div className="space-y-4 text-gray-500 leading-relaxed text-justify">
                            <p>
                                Founded in Islamabad, <strong>StyleHub</strong> emerged from a desire to bridge the gap between high-end fashion and everyday accessibility.
                                We realized that looking good shouldn't come with a compromise on quality or comfort.
                            </p>
                            <p>
                                What started as a small university project at Air University has now blossomed into a beloved brand across Pakistan.
                                Our journey is defined by our commitment to our roots while embracing modern trends.
                            </p>
                            <p>
                                Today, we are proud to support local artisans and use ethical manufacturing processes to bring you clothing that feels as good as it looks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-[#B88E2F] font-semibold tracking-wider uppercase">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#3A3A3A] mt-2">
                            The StyleHub Promise
                        </h2>
                        <p className="text-gray-500 mt-4">
                            We don't just sell clothes; we provide an experience tailored to your lifestyle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group">
                                <div className="mb-6 p-4 bg-[#F9F1E7] inline-block rounded-full group-hover:bg-[#B88E2F] group-hover:text-white transition-colors duration-300">
                                    {React.cloneElement(value.icon, { className: "w-8 h-8 group-hover:text-white transition-colors duration-300" })}
                                </div>
                                <h3 className="text-xl font-bold text-[#3A3A3A] mb-3 font-montserrat">{value.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter/CTA Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="bg-[#B88E2F] rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat">Join the StyleHub Community</h2>
                        <p className="opacity-90 text-lg">
                            Be the first to know about our latest collections, exclusive offers, and style tips.
                        </p>
                        {/* Simple imitation button, actual functionality is in Footer */}
                        <button className="bg-white text-[#B88E2F] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                            Shop Now
                        </button>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 transform rotate-12"><ShoppingBag size={120} /></div>
                        <div className="absolute bottom-10 right-10 transform -rotate-12"><Award size={120} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
