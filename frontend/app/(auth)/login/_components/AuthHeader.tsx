import { NoryLogo } from '@/components/icons/NoryLogo';

interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 bg-nory-yellow border-brutal rounded-btn flex items-center justify-center shadow-brutal-sm">
                    <NoryLogo width={28} height={28} className="text-nory-black" />
                </div>
                <span className="font-grotesk text-[1.6rem] font-bold tracking-tight text-nory-black">
                    NORY
                </span>
            </div>

            <h1 className="text-heading xl:text-heading-xl font-grotesk text-nory-black mb-2">
                {title}
            </h1>
            <p className="text-body text-nory-muted leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
}
