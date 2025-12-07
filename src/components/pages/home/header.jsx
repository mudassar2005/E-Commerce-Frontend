import React from 'react'
import Image from 'next/image'

export default function Header() {
    return (
        <header className="relative w-full h-screen flex items-center justify-center lg:justify-end lg:px-[100px]">
            <Image
                src="/home/home1.png"
                alt="Header Background"
                fill
                className="object-cover -z-10"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={100}
                loading="eager"
                unoptimized
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
            <div className="flex flex-col justify-center rounded-lg gap-5 bg-background-primary p-6 md:p-[50px] w-[90%] md:w-[70%] lg:w-[50%] h-auto md:min-h-[50%] text-white">
                <p className="text-lg md:text-2xl text-secondary font-poppins">New Arrivals</p>
                <div>
                    <h1 className="text-4xl md:text-6xl text-primary font-poppins font-bold leading-tight">
                        Discover Our <br /> New Collection
                    </h1>
                </div>
                <p className="text-sm md:text-lg text-secondary font-poppins">
                    Niche organic beauty products, skincare items, essential oils, or supplement capsules are small and have high potential for repeat purchases.
                </p>
                <button className="flex items-center justify-center gap-2 bg-primary text-white text-[14px] md:text-[16px] font-bold uppercase tracking-wide h-[45px] md:h-[50px] w-full md:w-[200px] px-5 py-2 hover:bg-opacity-90 transition-all">
                    Shop Now
                </button>

            </div>
        </header>
    )
}
