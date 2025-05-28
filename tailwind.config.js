/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // Vibrant Blue: Evokes trust, sky, openness, and a modern tech feel.
          light: "#60A5FA", // Lighter blue for hover states, backgrounds.
          dark: "#2563EB", // Deeper blue for primary actions, ensuring good contrast with white text.
        },
        secondary: {
          DEFAULT: "#F97316", // Energetic Orange: Radiates energy, motivation, and enthusiasm.
          light: "#FB923C", // Softer orange for secondary elements or highlights.
          dark: "#EA580C", // Stronger orange for impactful secondary actions.
        },
        accent: {
          DEFAULT: "#FACC15", // Sunny Yellow: Optimistic, grabs attention for important highlights or CTAs.
          light: "#FEF08A", // Paler yellow for subtle accents.
          dark: "#EAB308", // Richer yellow for more emphasis.
        },
        neutral: {
          extralight: "#F9FAFB", // Very light gray for subtle backgrounds.
          light: "#F3F4F6", // Light gray for cards, page backgrounds.
          DEFAULT: "#6B7280", // Medium gray for secondary text, icons.
          dark: "#374151", // Dark gray for primary text, darker UI elements.
          extradark: "#111827", // Very dark gray/off-black for deep contrast.
        },
        success: {
          DEFAULT: "#10B981", // Emerald Green: Clear indication of success, fresh and vibrant.
          light: "#6EE7B7",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber: Standard warning, easily recognizable.
          light: "#FCD34D",
          dark: "#B45309",
        },
        error: {
          DEFAULT: "#EF4444", // Red: Clear and universal for errors.
          light: "#FCA5A5",
          dark: "#DC2626",
        },
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"], // Keeping your specified font.
      },
      animation: {
        // Existing refined
        "slide-right": "slideRight 15s linear infinite", // Good for continuous marquees
        "fade-in": "fadeIn 0.3s ease-out", // Slightly smoother easing
        "fade-out": "fadeOut 0.3s ease-in", // Standard fade out
        "slide-up": "slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)", // More dynamic slide
        "slide-down": "slideDown 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)", // More dynamic slide
        "pulse-subtle":
          "pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Refined pulse

        // New additions
        "scale-in": "scaleIn 0.25s ease-out", // For modal pop-ups or card appearances
        shimmer: "shimmer 1.5s linear infinite", // For loading skeletons
        "bounce-subtle": "bounceSubtle 1s infinite", // For notification icons or attention seekers
      },
      keyframes: {
        // Existing refined
        slideRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" }, // Assuming it's for a duplicated content scroll
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
          // Renamed from pulse-slow for clarity and refined effect
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".6" },
        },

        // New additions
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          // Apply a gradient background to the element for this to work
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
        // Preserving your existing custom spacing
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
