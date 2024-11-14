import React from "react";
import { FaMars, FaVenus, FaGenderless } from "react-icons/fa";
import { GiHouse } from "react-icons/gi";
import { MdOutlineCake } from "react-icons/md";
import { BiRuler } from "react-icons/bi";

function Information({
  varietyName,
  currentPrice,
  breederName,
  gender,
  size,
  age,
  auctionTypeName,
}) {
  // Format gender value
  const formattedGender =
    gender === "MALE"
      ? "Male"
      : gender === "FEMALE"
      ? "Female"
      : gender === "UNKNOWN"
      ? "Unknown"
      : gender;

  // Map gender to corresponding icon
  const genderIcon =
    gender === "MALE" ? (
      <FaMars className="m-3" />
    ) : gender === "FEMALE" ? (
      <FaVenus className="m-3" />
    ) : (
      <FaGenderless className="m-3" />
    );

  function formatPrice(price) {
    if (price === null || price === undefined) {
      return;
    }
    return price
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\sđ/, "đ");
  }
  const formatStatus = (status) => {
    switch (status) {
      case "ASCENDING_BID":
        return "Ascending Bid";
      case "SEALED_BID":
        return "Sealed Bid";
      case "FIXED_PRICE_SALE":
        return "Fixed Price Sale";
      case "DESCENDING_BID":
        return "Descending Bid";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  return (
    <div className="text-white">
      {/* Row 1: Variety Name */}
      <h1 className="font-bold text-xl mt-3">{varietyName}</h1>

      {/* Row 2: Auction Type Name and Current Price */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <h1 className="font-bold text-md overflow-hidden whitespace-nowrap text-ellipsis">
          {formatStatus(auctionTypeName)}
        </h1>
        <h1 className="font-bold text-md text-right overflow-hidden whitespace-nowrap text-ellipsis">
          {formatPrice(currentPrice)}
        </h1>
      </div>

      <div className="bg-black h-[3px] w-full mt-4" />

      {/* Row 3: Breeder Name and Gender */}
      <div className="grid grid-cols-2 gap-4 mt-1">
        <div className="flex items-center">
          <GiHouse className="m-3" size={16} />
          <h1 className="overflow-hidden whitespace-nowrap text-ellipsis">
            {breederName}
          </h1>
        </div>
        <div className="flex items-center">
          {genderIcon}
          <h1 className="ml-3">{formattedGender}</h1>
        </div>
      </div>

      {/* Row 4: Size and Age */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex items-center">
          <BiRuler className="m-3" size={16} />
          <h1 className="overflow-hidden whitespace-nowrap text-ellipsis">
            {size} cm
          </h1>
        </div>
        <div className="flex items-center">
          <MdOutlineCake className="m-3" size={16} />
          <h1 className="m-3 overflow-hidden whitespace-nowrap text-ellipsis">
            {age} year
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Information;
