'use client';

import React, { useState } from 'react';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonId: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CTAButton({ buttonId, onClick, children, className, ...props }: CTAButtonProps) {
    const [isTracking, setIsTracking] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isTracking) {
            setIsTracking(true);
            try {
                await fetch('/api/cta/click', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ buttonId }),
                });
            } catch (error) {
                console.error('Failed to track CTA click:', error);
            } finally {
                setIsTracking(false);
            }
        }

        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
