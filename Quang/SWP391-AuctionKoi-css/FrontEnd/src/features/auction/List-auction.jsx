/* eslint-disable no-unused-vars */
import { useState } from "react";

import viteLogo from "/vite.svg";
import "./index.css";
import { Link } from "react-router-dom";

function Auction() {
  return (
    <div className="bg-black">
      <div className="flex flex-col justify-center items-center h-screen ">
        <button className="bg-yellow-400 rounded-full h-[400px] w-[400px] text-2xl animation-pulse">
          <h1 className="text-white font-bold">Auction#63</h1>
          <Link to="/lot">
            <h1 className="text-white font-bold mt-7">Bidding Now</h1>
          </Link>
        </button>
        <div className="mt-[60px]">
          <button className="bg-yellow-200 rounded-3xl h-[50px] w-[200px]">
            <h1>View Past Auction</h1>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auction;
