/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "app-surface": "var(--color-surface)",
        "app-background": "var(--color-background)",
        "app-muted-background": "var(--color-muted-background)",
        "app-primary": "var(--color-primary)",
        "app-primary-dark": "var(--color-primary-dark)",
        "app-primary-soft": "var(--color-primary-soft)",
        "app-heading": "var(--color-heading)",
        "app-body": "var(--color-body)",
        "app-text-muted": "var(--color-text-muted)",
        "app-placeholder": "var(--color-placeholder)",
        "app-warning": "var(--color-warning)",
        "app-black": "var(--color-black)",
      },
    },
  },
  plugins: [],
};
