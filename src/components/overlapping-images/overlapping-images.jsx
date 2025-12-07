"use client";
import Image from "next/image";
import React from "react";

const OverlappingImages = ({
    images,
    size = 40,
    borderWidth = 2,
    overlap = 12,
    className = "",
}) => {
    return (
        <div className={`flex items-center ${className}`}>
            {images.map((src, index) => (
                <div
                    key={index}
                    className="relative rounded-full border-white overflow-hidden"
                    style={{
                        width: size,
                        height: size,
                        borderWidth,
                        marginLeft: index === 0 ? 0 : -overlap,
                        zIndex: images.length - index, // keeps leftmost on top
                        borderStyle: "solid",
                    }}
                >
                    <Image
                        src={src}
                        alt={`avatar-${index}`}
                        width={size}
                        height={size}
                        className="rounded-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default OverlappingImages;
