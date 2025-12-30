/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0f172a',
                    card: '#1e293b',
                    accent: '#6366f1',
                    success: '#10b981',
                    warning: '#f59e0b',
                }
            }
        },
    },
    plugins: [],
}
