/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: 'var(--bg-app)',
        sidebar: 'var(--bg-sidebar)',
        card: {
          DEFAULT: 'var(--bg-card)',
          hover: 'var(--bg-card-hover)',
        },
        themeBorder: 'var(--border-color)',
        mainText: 'var(--text-main)',
        mutedText: 'var(--text-muted)',
        sidebarText: 'var(--text-sidebar)',
        sidebarMuted: 'var(--text-sidebar-muted)',
        inputBg: 'var(--input-bg)',
      },
    },
  },
  plugins: [],
}
