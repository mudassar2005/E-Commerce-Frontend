"use client";
import Image from "next/image";
import React from "react";

const Icon = ({
    name,
    alt,
    width = 24,
    height = 24,
    className,
}) => {
    const src = `/icons/${name}`;

    return (
        <Image
            src={src}
            alt={alt || name.replace(/\.[^/.]+$/, "")}
            width={width}
            height={height}
            className={className}
        />
    );
};

export default Icon;
