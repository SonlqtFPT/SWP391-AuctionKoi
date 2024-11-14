/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/picture/1341850.png?raw=true')",
        'section-pattern': "url('https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/picture/pxfuel.jpg?raw=true')",
        'login-pattern': "url('https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/picture/508772.jpg?raw=true')",
      }
    },
  },
  plugins: [],
};
