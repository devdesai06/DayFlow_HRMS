/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F172A",
        indigo: "#6366F1",
        emerald: "#10B981",
        rose: "#F43F5E",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.08)",
      },
      keyframes: {
        "fade-slide": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-slide": "fade-slide 200ms ease-out",
        "slide-up": "slide-up 180ms ease-out",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

