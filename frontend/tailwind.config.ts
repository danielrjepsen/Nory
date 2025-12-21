import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/(auth)/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                nory: {
                    bg: 'var(--nory-bg)',
                    card: 'var(--nory-card)',
                    border: 'var(--nory-border)',
                    text: 'var(--nory-text)',
                    black: '#1a1a1a',
                    white: '#fffef9',
                    yellow: '#ffe951',
                    gray: '#eeeee9',
                    muted: 'var(--nory-muted)',
                }
            },
            fontFamily: {
                grotesk: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
                mono: ['var(--font-space-mono)', 'Space Mono', 'monospace'],
                bricolage: ['Bricolage Grotesque', 'sans-serif'],
            },
            fontSize: {
                'heading': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
                'heading-xl': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
                'heading-2xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
                'card-title': ['1.15rem', { lineHeight: '1.3', fontWeight: '700' }],
                'card-title-xl': ['1.25rem', { lineHeight: '1.3', fontWeight: '700' }],
                'card-title-2xl': ['1.4rem', { lineHeight: '1.3', fontWeight: '700' }],
                'body': ['0.8rem', { lineHeight: '1.5' }],
                'body-xl': ['0.85rem', { lineHeight: '1.5' }],
                'body-2xl': ['0.9rem', { lineHeight: '1.5' }],
                'nav': ['0.85rem', { lineHeight: '1.4', fontWeight: '500' }],
                'nav-xl': ['0.9rem', { lineHeight: '1.4', fontWeight: '500' }],
                'nav-2xl': ['0.95rem', { lineHeight: '1.4', fontWeight: '500' }],
                'stat': ['1.75rem', { lineHeight: '1', fontWeight: '700' }],
                'stat-xl': ['2rem', { lineHeight: '1', fontWeight: '700' }],
                'btn': ['0.9rem', { lineHeight: '1', fontWeight: '700' }],
                'btn-xl': ['1rem', { lineHeight: '1', fontWeight: '700' }],
                'badge': ['0.6rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '0.05em' }],
            },
            borderWidth: {
                '3': '3px',
            },
            borderRadius: {
                'card': '20px',
                'btn': '12px',
                'nav': '14px',
                'badge': '6px',
                'img': '10px',
            },
            boxShadow: {
                'brutal-sm': '2px 2px 0 var(--nory-border)',
                'brutal': '3px 3px 0 var(--nory-border)',
                'brutal-md': '4px 4px 0 var(--nory-border)',
                'brutal-lg': '6px 6px 0 var(--nory-border)',
                'card-hover': '0 16px 32px rgba(0,0,0,0.08)',
            },
            keyframes: {
                ambientGlow: {
                    '0%, 85%': {
                        opacity: '0',
                        transform: 'scale(0.8)',
                    },
                    '15%, 40%': {
                        opacity: '1',
                        transform: 'scale(1.2)',
                    },
                    '55%, 70%': {
                        opacity: '0.3',
                        transform: 'scale(1)',
                    },
                },
            },
            animation: {
                ambientGlow: 'ambientGlow 8s infinite ease-in-out',
            },
        },
    },
    plugins: [],
}

export default config
