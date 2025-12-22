'use client';

import Image from 'next/image';

const IMAGES = [
    '/frontpage/thumbs/pexels-efrem-efre-2786187-26692352.jpg',
    '/frontpage/thumbs/pexels-efrem-efre-2786187-27125187.jpg',
    '/frontpage/thumbs/pexels-filipgrobgaard-31957113.jpg',
    '/frontpage/thumbs/pexels-henri-mathieu-8348741.jpg',
    '/frontpage/thumbs/pexels-inga-sv-3394225.jpg',
    '/frontpage/thumbs/pexels-lorentzworks-668137.jpg',
    '/frontpage/thumbs/pexels-pavel-danilyuk-6405768.jpg',
    '/frontpage/thumbs/pexels-pixabay-265940.jpg',
    '/frontpage/thumbs/pexels-samaraagenstvo-feeria-1261201-2399097.jpg',
    '/frontpage/thumbs/pexels-wendywei-1387174.jpg',
];

const ROWS = [
    { images: [0, 1, 2, 3, 4, 5], direction: 'left', duration: 50 },
    { images: [6, 7, 8, 9, 0, 1], direction: 'right', duration: 55 },
    { images: [2, 3, 4, 5, 6, 7], direction: 'left', duration: 60 },
];

function Polaroid({ src }: { src: string }) {
    return (
        <div className="flex-shrink-0 w-[200px] bg-nory-white rounded-md p-2.5 pb-10 shadow-[0_6px_20px_rgba(0,0,0,0.12),4px_4px_0_#1a1a1a] relative">
            <div className="relative aspect-square overflow-hidden rounded-sm">
                <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                    loading="eager"
                />
            </div>
            <div className="absolute bottom-2.5 left-3 right-3 space-y-1.5">
                <div className="h-2.5 w-4/5 bg-nory-black/25 rounded-[2px]" />
                <div className="h-2.5 w-1/2 bg-nory-black/25 rounded-[2px]" />
            </div>
        </div>
    );
}

function ScrollingRow({
    imageIndices,
    direction,
    duration,
}: {
    imageIndices: number[];
    direction: 'left' | 'right';
    duration: number;
}) {
    const allImages = [...imageIndices, ...imageIndices];
    const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

    return (
        <div
            className={`flex gap-6 w-max ${animationClass}`}
            style={{ '--scroll-duration': `${duration}s` } as React.CSSProperties}
        >
            {allImages.map((imgIndex, i) => (
                <Polaroid
                    key={`${imgIndex}-${i}`}
                    src={IMAGES[imgIndex]}
                />
            ))}
        </div>
    );
}

export function LoginImageWall() {
    return (
        <div className="relative w-full h-full overflow-hidden bg-nory-gray border-l-[3px] border-nory-black">
            <div className="absolute top-10 left-10 bg-nory-yellow border-2 border-nory-black px-4 py-2.5 font-mono text-[0.8rem] font-bold uppercase tracking-wide rounded-btn shadow-brutal-sm z-20">
                847+ events
            </div>

            <div
                className="absolute inset-0 flex flex-col justify-center gap-6 py-8"
                style={{ transform: 'rotate(-5deg) scale(1.15)', transformOrigin: 'center center' }}
            >
                {ROWS.map((row, i) => (
                    <ScrollingRow
                        key={i}
                        imageIndices={row.images}
                        direction={row.direction as 'left' | 'right'}
                        duration={row.duration}
                    />
                ))}
            </div>

            <div
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{
                    background: 'linear-gradient(to right, #eeeee9 0%, transparent 8%, transparent 92%, #eeeee9 100%)'
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none z-[6]"
                style={{
                    background: 'linear-gradient(to bottom, #eeeee9 0%, transparent 10%, transparent 90%, #eeeee9 100%)'
                }}
            />

            <div className="absolute bottom-10 right-10 bg-nory-white border-2 border-nory-black py-5 px-7 rounded-[14px] shadow-brutal z-20 flex gap-8">
                <div className="text-center">
                    <div className="font-mono text-[1.75rem] font-bold text-nory-black leading-none">847</div>
                    <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-nory-muted mt-1">Events</div>
                </div>
                <div className="w-0.5 bg-nory-gray" />
                <div className="text-center">
                    <div className="font-mono text-[1.75rem] font-bold text-nory-black leading-none">12K</div>
                    <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-nory-muted mt-1">Fotos</div>
                </div>
                <div className="w-0.5 bg-nory-gray" />
                <div className="text-center">
                    <div className="font-mono text-[1.75rem] font-bold text-nory-black leading-none">2.4K</div>
                    <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-nory-muted mt-1">Brugere</div>
                </div>
            </div>
        </div>
    );
}
