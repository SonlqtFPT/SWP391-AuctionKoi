/* eslint-disable react/prop-types */
import { Input, Button } from "antd";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EnterPrice({
  currentPrice,
  startingPrice,
  increment,
  currentMemberId,
  lotId,
  fetchLot,
  fetchBidList,
}) {
  const [bidPrice, setBidPrice] = useState("");
  const [registrationLink, setRegistrationLink] = useState(""); // Thêm state để lưu link đăng ký

  const post_bid_api = "http://localhost:8080/bid/bidAuction"; //Bid
  const post_regis_api = "http://localhost:8080/register-lot/regis"; //Deposit

  const handleBid = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // Move the headers object outside of the data you're sending
      const response = await axios.post(
        post_bid_api,
        {
          lotId: lotId,
          price: bidPrice.replace(/\./g, ""), // Format price
          memberId: currentMemberId, // Ensure this is correctly passed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      if (response.data.message === "Member is not registered for the Lot") {
        // If the member is not registered, make another API call to register
        const regResponse = await axios.post(
          post_regis_api,
          {
            memberId: currentMemberId,
            lotId: lotId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const link = regResponse.data;
        console.log("Link: ", link);
        setRegistrationLink(link);
      } else {
        toast.success(response.data.message);
        fetchLot();
        fetchBidList();
        setRegistrationLink("");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      console.log("Registration link: ", registrationLink);
    }
  };

  // Hàm định dạng số
  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""; // {{ edit_8 }}
  };

  // Hàm xử lý khi nhấn vào link
  const handleLinkClick = () => {
    setRegistrationLink(""); // Đặt lại link khi nhấn vào
  };

  return (
    <div
      className={`ml-[30px] mt-[20px] rounded-3xl ${
        registrationLink ? "h-[170px]" : "h-[150px]"
      } w-[800px] text-white shadow-md bg-slate-500`}
    >
      <div className="flex items-center justify-between gap-3 mt-7">
        <div className="bg-slate-400 h-[40px] w-[550px] rounded-[50px] flex items-center justify-between pl-7 ml-3 mt-5">
          <h1 className="text-xl font-bold">Highest price</h1>
          <h1 className="text-xl font-bold mr-8">
            {formatNumber(currentPrice)}
          </h1>
        </div>
        <div className="bg-slate-400 h-[40px] w-[550px] rounded-[50px] flex items-center justify-between pl-7 mr-3 mt-5">
          <h1 className="text-xl font-bold">Giá khởi điểm</h1>
          <h1 className="text-xl font-bold mr-8">
            {formatNumber(startingPrice)}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 mt-7">
        <div className="ml-3 ">
          <Button
            className="bg-blue-500 rounded-[50px] h-[40px] w-[100px] text-white"
            onClick={handleBid}
          >
            Bid
          </Button>
        </div>
        <div>
          <Input
            className="rounded-3xl mr-2 h-[40px] w-[270px] text-black"
            type="text"
            value={formatNumber(bidPrice)} // Hiển thị giá trị đã định dạng
            onChange={(e) => setBidPrice(e.target.value.replace(/\./g, ""))} // Lưu giá trị không có dấu phẩy
          />
        </div>

        <div className="bg-slate-400 h-[40px] w-[550px] rounded-[50px] flex items-center justify-between pl-7 mr-3">
          <h1 className="text-xl font-bold">Bước giá</h1>
          <h1 className="text-xl font-bold mr-8">{formatNumber(increment)}</h1>
        </div>
      </div>
      {registrationLink && ( // Hiển thị link đăng ký nếu có
        <div className="mt-2 ml-5">
          <p>
            You have not deposited yet. Please deposit{" "}
            <a
              href={registrationLink}
              target="_blank" // Mở link trong tab mới
              rel="noopener noreferrer" // Bảo mật
              className="text-teal-300 font-bold underline"
              onClick={handleLinkClick} // Gọi hàm khi nhấn vào link
            >
              here
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

export default EnterPrice;
