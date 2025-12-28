'use client';

import React from 'react';
import Image from 'next/image';

export default function ImageGrid() {
    return (
        <section className="py-10 lg:py-20 overflow-hidden bg-white">
            <div className="text-center mb-8 lg:mb-12">
                <p className="text-gray-600 text-lg">Share your look with</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">#StyleHubFashion</h2>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">

                    {/* Column 1 */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        <div className="relative h-[200px] md:h-[280px] lg:h-[382px] w-full">
                            <Image src="/images/home/photo6.jpg" alt="Fashion Style 1" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="relative h-[150px] md:h-[200px] lg:h-[323px] w-full">
                            <Image src="/images/home/photo11.jpg" alt="Fashion Style 2" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        <div className="relative h-[180px] md:h-[240px] lg:h-[312px] w-full">
                            <Image src="/images/home/photo3.jpg" alt="Fashion Style 3" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="relative h-[150px] md:h-[180px] lg:h-[242px] w-full">
                            <Image src="/images/home/photo4.jpg" alt="Fashion Style 4" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        <div className="relative h-[200px] md:h-[260px] lg:h-[348px] w-full">
                            <Image src="/images/home/photo5.jpg" alt="Fashion Style 5" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="relative h-[150px] md:h-[180px] lg:h-[242px] w-full">
                            <Image src="/images/home/photo1.jpg" alt="Fashion Style 6" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        <div className="relative h-[220px] md:h-[300px] lg:h-[433px] w-full">
                            <Image src="/images/home/photo7.jpg" alt="Fashion Style 7" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="relative h-[120px] md:h-[160px] lg:h-[196px] w-full">
                            <Image src="/images/home/photo8.jpg" alt="Fashion Style 8" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>

                    {/* Column 5 */}
                    <div className="flex flex-col gap-4 lg:gap-6">
                        <div className="relative h-[200px] md:h-[260px] lg:h-[360px] w-full">
                            <Image src="/images/home/photo10.jpg" alt="Fashion Style 9" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="relative h-[160px] md:h-[200px] lg:h-[260px] w-full">
                            <Image src="/images/home/photo9.jpg" alt="Fashion Style 10" fill className="object-cover rounded-md hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
}
