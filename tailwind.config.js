/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // Vibrant Blue
          light: "#60A5FA",
          dark: "#2563EB",
        },
        secondary: {
          DEFAULT: "#F97316", // Energetic Orange
          light: "#FB923C",
          dark: "#EA580C",
        },
        accent: {
          DEFAULT: "#FACC15", // Sunny Yellow
          light: "#FEF08A",
          dark: "#EAB308",
        },
        neutral: {
          extralight: "#F9FAFB",
          light: "#F3F4F6",
          DEFAULT: "#6B7280",
          dark: "#374151",
          extradark: "#111827",
        },
        success: {
          DEFAULT: "#10B981", // Emerald Green
          light: "#6EE7B7",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber
          light: "#FCD34D",
          dark: "#B45309",
        },
        error: {
          DEFAULT: "#EF4444", // Red
          light: "#FCA5A5",
          dark: "#DC2626",
        },
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"], // Defines font-vazir utility
      },
      animation: {
        // Existing refined
        "slide-right": "slideRight 15s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-out": "fadeOut 0.3s ease-in",
        "slide-up": "slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "pulse-subtle":
          "pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",

        // New additions
        "scale-in": "scaleIn 0.25s ease-out",
        shimmer: "shimmer 1.5s linear infinite",
        "bounce-subtle": "bounceSubtle 1s infinite",
      },
      keyframes: {
        // Existing refined
        slideRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".6" },
        },

        // New additions
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        bounceSubtle: {
          "0%, 100%": {
            transform: "translateY(-3%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        68: "17rem",
        76: "19rem",
        84: "21rem",
        88: "22rem",
        92: "23rem",
        100: "25rem",
        104: "26rem",
        108: "27rem",
        112: "28rem",
      },
    },
  },
  plugins: [],
};
