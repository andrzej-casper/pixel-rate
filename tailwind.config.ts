import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': {  DEFAULT: '#5FDD67',  50: '#F6FDF7',  100: '#E6FAE7',  200: '#C4F2C7',  300: '#A7ECAB',  400: '#8DE793',  500: '#70E177',  600: '#31D33C',  700: '#24A82D',  800: '#1A7A20',  900: '#104C14',  950: '#0B340E'},
      }
    },
  },
  plugins: [],
} satisfies Config;
