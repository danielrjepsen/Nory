import Image from 'next/image';

interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className="mb-8 text-center">
            <div className="mb-4">
                <Image
                    src="/NORY-logo.svg"
                    alt="Nory"
                    width={120}
                    height={40}
                    priority
                    className="mx-auto"
                />
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-600 text-[0.95rem] leading-relaxed">{subtitle}</p>
        </div>
    );
}