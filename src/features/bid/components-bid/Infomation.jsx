import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
function Information({
  gender,
  size,
  age,
  breeder,
  varietyName,
  fishId,
  registed,
  win,
  hasEnded, // New prop to check if the auction has ended
}) {
  const [checkRegisted, setCheckRegisted] = useState("");

  const handleCheckRegisted = () => {
    console.log("Checking registration: ", registed);
    console.log("Win?: ", win);

    // Check registration status and win/lose status based on auction end
    if (registed) {
      setCheckRegisted(hasEnded ? (win ? "Won" : "Lost") : "Deposited");
    } else {
      setCheckRegisted("Not yet deposit");
    }
  };

  const formatGender = (gender) => {
    switch (gender) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      case "UNKNOWN":
        return "Unknown";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    handleCheckRegisted();
  }, [registed, win, hasEnded]); // Track registration status, win, and auction end status

  return (
    <div className="mt-5 p-5 bg-gray-900 hover:bg-gray-800 rounded-2xl border-2 hover:border-4 border-[#bcab6f] outline outline-offset-2 outline-white w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl sm:text-3xl text-[#bcab6f]">
          {varietyName + " #" + fishId}
        </h1>
        <div
          className={
            win && hasEnded
              ? "bg-green-500 px-4 py-2 rounded-3xl flex justify-center items-center text-ellipsis overflow-hidden whitespace-nowrap"
              : !registed
              ? "bg-[#C0392B] px-4 py-2 rounded-3xl flex justify-center items-center text-ellipsis overflow-hidden whitespace-nowrap"
              : "bg-gray-700 px-4 py-2 rounded-3xl flex justify-center items-center text-ellipsis overflow-hidden whitespace-nowrap" // Show "Deposited" style
          }
        >
          <h1 className="font-bold text-white">{checkRegisted}</h1>
        </div>
      </div>

      {/* Gender and Size Section */}
      <div className="flex flex-col sm:flex-row  items-center justify-between gap-3 mt-5 ">
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full ">
          <div className="text-lg sm:text-xl font-bold">Gender:</div>
          <div className="text-lg sm:text-xl font-bold">
            {formatGender(gender)}
          </div>
        </div>
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full ">
          <h1 className="text-lg sm:text-xl font-bold">Size:</h1>
          <h1 className="text-lg sm:text-xl font-bold">{size} cm</h1>
        </div>
      </div>

      {/* Breeder and Age Section */}
      <div className="flex flex-col sm:flex-row  items-center gap-3 mt-5 justify-between">
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full ">
          <h1 className="text-lg sm:text-xl font-bold">Breeder:</h1>
          <h1 className="text-lg sm:text-xl font-bold">{breeder}</h1>
        </div>
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full ">
          <h1 className="text-lg sm:text-xl font-bold">Age:</h1>
          <h1 className="text-lg sm:text-xl font-bold">{age} year</h1>
        </div>
      </div>
    </div>
  );
}

export default Information;
