'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffect = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient orbs */}
            <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 bg-[#B88E2F]/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#B88E2F]/15 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            
            {/* Subtle grid pattern */}
            <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #B88E2F 1px, transparent 1px),
                        linear-gradient(to bottom, #B88E2F 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />
        </div>
    );
};

export default BackgroundEffect;
