/** Semantic color backed by a CSS variable from src/global.css. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: token("background"),
        card: token("card"),
        foreground: token("foreground"),
        muted: token("muted"),
        subtle: token("subtle"),
        border: token("border"),
        input: token("input"),
        primary: {
          DEFAULT: token("primary"),
          soft: token("primary-soft"),
        },
        danger: {
          DEFAULT: token("danger"),
          soft: token("danger-soft"),
        },
      },
    },
  },
  plugins: [],
};
