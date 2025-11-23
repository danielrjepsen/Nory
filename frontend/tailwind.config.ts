import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/(auth)/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
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