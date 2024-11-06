/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
        "russo-one": ['"Russo One"', "sans-serif"],
      },
    },
  },
  plugins: [],
  prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
};
