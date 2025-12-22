'use client';

import { LoginImageWall } from './LoginImageWall';

interface AuthLayoutProps {
    children: React.ReactNode;
    showContentPanel?: boolean;
}

export function AuthLayout({ children, showContentPanel = true }: AuthLayoutProps) {
    return (
        <div className="min-h-screen overflow-hidden bg-nory-white font-grotesk">
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] xl:grid-cols-[1fr_0.7fr] 2xl:grid-cols-[1fr_0.6fr]">
                <div className="flex flex-col justify-center items-center p-8 bg-nory-white z-10">
                    <div className="w-full max-w-[400px]">
                        {children}
                    </div>
                </div>

                {showContentPanel && (
                    <div className="hidden lg:block relative">
                        <LoginImageWall />
                    </div>
                )}
            </div>
        </div>
    );
}
