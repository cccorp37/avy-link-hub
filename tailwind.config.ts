import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        rose: {
          primary: "#FF6B9D",
          light: "#FFB3D9",
          dark: "#E5498D",
          soft: "#FFF5F9",
          100: "#FFE4F0",
          200: "#FFB3D9",
          300: "#FF80BA",
          400: "#FF6B9D",
          500: "#E5498D",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "var(--radius-xl)",
        "2xl": "1.75rem",
        "3xl": "2rem",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(338, 100%, 71%) 0%, hsl(330, 100%, 84%) 100%)',
        'gradient-cta': 'linear-gradient(135deg, hsl(338, 100%, 71%) 0%, hsl(330, 59%, 59%) 100%)',
        'gradient-hero': 'linear-gradient(135deg, hsl(340, 100%, 97%) 0%, hsl(0, 0%, 100%) 50%, hsl(330, 100%, 95%) 100%)',
        'gradient-soft': 'linear-gradient(135deg, hsl(340, 100%, 97%) 0%, hsl(0, 0%, 100%) 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(255,245,249,0.5) 100%)',
      },
      boxShadow: {
        'rose': '0 4px 20px rgba(255, 107, 157, 0.30)',
        'rose-lg': '0 8px 40px rgba(255, 107, 157, 0.25)',
        'card': '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'btn': '0 4px 14px 0 rgba(255, 107, 157, 0.39)',
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-rose": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 107, 157, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255, 107, 157, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 2s",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "slide-in": "slide-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "pulse-rose": "pulse-rose 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
