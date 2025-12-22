'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const SLIDESHOW_IMAGES = [
    '/frontpage/pexels-efrem-efre-2786187-26692352.jpg',
    '/frontpage/pexels-efrem-efre-2786187-27125187.jpg',
    '/frontpage/pexels-filipgrobgaard-31957113.jpg',
    '/frontpage/pexels-henri-mathieu-8348741.jpg',
    '/frontpage/pexels-inga-sv-3394225.jpg',
    '/frontpage/pexels-lorentzworks-668137.jpg',
    '/frontpage/pexels-pavel-danilyuk-6405768.jpg',
    '/frontpage/pexels-pixabay-265940.jpg',
    '/frontpage/pexels-samaraagenstvo-feeria-1261201-2399097.jpg',
    '/frontpage/pexels-wendywei-1387174.jpg',
];

const SLIDE_DURATION = 6000;
const FADE_DURATION = 1500;

export function LoginSlideshow() {
    const [topIndex, setTopIndex] = useState(0);
    const [bottomIndex, setBottomIndex] = useState(1);
    const [showTop, setShowTop] = useState(true);

    const nextSlide = useCallback(() => {
        if (showTop) {
            const nextIdx = (topIndex + 1) % SLIDESHOW_IMAGES.length;
            setBottomIndex(nextIdx);
            requestAnimationFrame(() => {
                setShowTop(false);
            });
        } else {
            const nextIdx = (bottomIndex + 1) % SLIDESHOW_IMAGES.length;
            setTopIndex(nextIdx);
            requestAnimationFrame(() => {
                setShowTop(true);
            });
        }
    }, [showTop, topIndex, bottomIndex]);

    useEffect(() => {
        const interval = setInterval(nextSlide, SLIDE_DURATION);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-900">
            <div className="absolute inset-0">
                <Image
                    src={SLIDESHOW_IMAGES[bottomIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority={bottomIndex < 2}
                />
            </div>

            <div
                className="absolute inset-0"
                style={{
                    opacity: showTop ? 1 : 0,
                    transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
            >
                <Image
                    src={SLIDESHOW_IMAGES[topIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority={topIndex < 2}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10 pointer-events-none" />
        </div>
    );
}
