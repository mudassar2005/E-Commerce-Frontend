'use client';

import React from 'react';
import Image from 'next/image';

const companies = [
    { name: 'ZARA', logo: '/companies/zara.png' },
    { name: 'H&M', logo: '/companies/hm.png' },
    { name: 'GUCCI', logo: '/companies/gucci.png' },
    { name: 'NIKE', logo: '/companies/nike.png' },
    { name: 'ADIDAS', logo: '/companies/adidas.png' },
    { name: 'UNIQLO', logo: '/companies/uniqlo.png' }
];

const CompaniesSection = () => {
    return (
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Top Fashion Brands</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
                        We collaborate with world-renowned fashion houses to bring you the latest styles and trends.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 items-center">
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center p-3 sm:p-4 lg:p-6 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                        >
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 hover:text-[#B88E2F] transition-colors text-center">
                                {company.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CompaniesSection;
