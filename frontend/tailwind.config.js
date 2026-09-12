/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1220",
          surface: "#131B2E",
          light: "#1B2540",
          border: "#243252"
        },
        amber: {
          DEFAULT: "#F5A623",
          dim: "#B87C1B"
        },
        teal: {
          DEFAULT: "#2DD4BF",
          dim: "#1F9C8C"
        },
        ink: "#E8ECF4",
        muted: "#8B95A8",
        danger: "#F0605C"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      }
    }
  },
  plugins: []
};
