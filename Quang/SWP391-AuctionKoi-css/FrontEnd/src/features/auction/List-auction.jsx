/* eslint-disable no-unused-vars */
import { useState } from "react";

import viteLogo from "/vite.svg";
import "./index.css";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Auction() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col justify-center items-center h-screen bg-hero-pattern bg-cover relative">
        <div className="absolute bg-black bg-opacity-70 inset-0"></div>
        <button className="bg-yellow-400 rounded-full h-[400px] w-[400px] text-2xl animation-pulse absolute">
          <Link to="/lot">
            <h1 className="text-black font-bold">Auction#63</h1>
            <h1 className="text-black font-bold mt-7">Bidding Now</h1>
          </Link>
        </button>
        <div className="mt-96 absolute">
          <button className="mt-56 bg-yellow-200 rounded-3xl h-[50px] w-[200px] flex justify-center items-center hover:bg-yellow-300 transition-colors duration-300">
            <h1>View Past Auctions</h1>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Auction;
