'use client';

import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
    children: React.ReactNode;
    showContentPanel?: boolean;
}

export function AuthLayout({ children, showContentPanel = true }: AuthLayoutProps) {
    const { t } = useTranslation('auth');

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* Ambient lights around edges */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                {/* Top edge */}
                <div
                    className="absolute w-[120px] h-[120px] -top-[60px] left-[10%] rounded-full opacity-0 animate-ambient-glow-1"
                    style={{
                        background: 'radial-gradient(circle, rgba(253, 121, 168, 0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />
                <div
                    className="absolute w-[80px] h-[80px] -top-[40px] right-[20%] rounded-full opacity-0 animate-ambient-glow-2"
                    style={{
                        background: 'radial-gradient(circle, rgba(116, 185, 255, 0.5) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Right edge */}
                <div
                    className="absolute w-[100px] h-[100px] -right-[50px] top-[25%] rounded-full opacity-0 animate-ambient-glow-3"
                    style={{
                        background: 'radial-gradient(circle, rgba(162, 155, 254, 0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />
                <div
                    className="absolute w-[90px] h-[90px] -right-[45px] bottom-[30%] rounded-full opacity-0 animate-ambient-glow-4"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 107, 107, 0.5) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Bottom edge */}
                <div
                    className="absolute w-[110px] h-[110px] -bottom-[55px] left-[25%] rounded-full opacity-0 animate-ambient-glow-5"
                    style={{
                        background: 'radial-gradient(circle, rgba(167, 196, 160, 0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />
                <div
                    className="absolute w-[85px] h-[85px] -bottom-[42px] right-[15%] rounded-full opacity-0 animate-ambient-glow-6"
                    style={{
                        background: 'radial-gradient(circle, rgba(201, 182, 228, 0.5) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Left edge */}
                <div
                    className="absolute w-[95px] h-[95px] -left-[47px] top-[40%] rounded-full opacity-0 animate-ambient-glow-7"
                    style={{
                        background: 'radial-gradient(circle, rgba(253, 121, 168, 0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />
                <div
                    className="absolute w-[75px] h-[75px] -left-[37px] bottom-[20%] rounded-full opacity-0 animate-ambient-glow-8"
                    style={{
                        background: 'radial-gradient(circle, rgba(116, 185, 255, 0.5) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                />
            </div>

            {/* Main container */}
            <div className="relative z-10 min-h-screen flex flex-col md:flex-row">
                {/* Form panel */}
                <div className="flex-1 flex items-center justify-center p-8 md:p-8 bg-white/95 backdrop-blur-[10px]">
                    <div className="w-full max-w-[400px]">
                        {children}
                    </div>
                </div>

                {/* Content panel - hidden on mobile */}
                {showContentPanel && (
                    <div className="hidden md:flex md:flex-[0.8] flex-col justify-center items-center p-8 bg-[#f8f9fa]/95 backdrop-blur-[10px]">
                        <div className="text-center max-w-[450px]">
                            <h1 className="text-[2.8rem] font-bold mb-6 text-[#2d3436]">
                                {t('layout.brandName')}
                            </h1>

                            <h2 className="text-[1.8rem] font-semibold leading-tight mb-4 text-[#2d3436]">
                                {t('layout.headline')}
                            </h2>

                            <p className="text-base mb-8 text-[#636e72] leading-relaxed">
                                {t('layout.description')}
                            </p>

                            {/* Feature grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/80 border border-[#e9ecef]/60 p-5 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
                                    <span className="text-[1.8rem] block mb-2">📸</span>
                                    <div className="text-sm font-semibold mb-1 text-[#2d3436]">{t('layout.features.liveGallery.title')}</div>
                                    <div className="text-xs text-[#636e72]">{t('layout.features.liveGallery.description')}</div>
                                </div>

                                <div className="bg-white/80 border border-[#e9ecef]/60 p-5 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
                                    <span className="text-[1.8rem] block mb-2">🎨</span>
                                    <div className="text-sm font-semibold mb-1 text-[#2d3436]">{t('layout.features.customThemes.title')}</div>
                                    <div className="text-xs text-[#636e72]">{t('layout.features.customThemes.description')}</div>
                                </div>

                                <div className="bg-white/80 border border-[#e9ecef]/60 p-5 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
                                    <span className="text-[1.8rem] block mb-2">⚡</span>
                                    <div className="text-sm font-semibold mb-1 text-[#2d3436]">{t('layout.features.instantSetup.title')}</div>
                                    <div className="text-xs text-[#636e72]">{t('layout.features.instantSetup.description')}</div>
                                </div>

                                <div className="bg-white/80 border border-[#e9ecef]/60 p-5 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
                                    <span className="text-[1.8rem] block mb-2">📊</span>
                                    <div className="text-sm font-semibold mb-1 text-[#2d3436]">{t('layout.features.analytics.title')}</div>
                                    <div className="text-xs text-[#636e72]">{t('layout.features.analytics.description')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
