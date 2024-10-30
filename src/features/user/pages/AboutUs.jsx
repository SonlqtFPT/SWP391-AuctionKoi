import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Collapse } from "antd";
import { RightOutlined } from "@ant-design/icons";

function AboutUs() {
  const items = [
    {
      key: "1",
      label: (
        <span className="text-gray-100 text-xl">
          How can I participate in an auction?
        </span>
      ),
      children: (
        <p className="text-gray-200 text-base">
          To participate, you need to place a deposit equal to 10% of the
          starting price of the koi fish in the lot you're interested in. Once
          the deposit is made, you can join the bidding session when it begins.
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <span className="text-gray-100 text-xl">
          When can I place a deposit?
        </span>
      ),
      children: (
        <p className="text-gray-200 text-base">
          Deposits can be placed as soon as a lot is listed in the "Upcoming
          Auction" section or during an active "Bidding" session. Depositing
          early allows you to participate in the auction immediately once it
          opens.
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <span className="text-gray-100 text-xl">
          What happens to my deposit if I win or lose the bid?
        </span>
      ),
      children: (
        <p className="text-gray-200 text-base">
          If you win, your deposit will be deducted from the final price of the
          koi. If you do not win, your deposit will be refunded according to our
          refund policy.
        </p>
      ),
    },
    {
      key: "4",
      label: (
        <span className="text-gray-100 text-xl">
          Can I place multiple deposits for different lots?
        </span>
      ),
      children: (
        <p className="text-gray-200 text-base">
          Yes, you can place deposits on multiple lots across different
          auctions. Each lot requires a separate deposit.
        </p>
      ),
    },
    {
      key: "5",
      label: (
        <span className="text-gray-100 text-xl">
          How is the final price calculated if I win?
        </span>
      ),
      children: (
        <p className="text-gray-200 text-base">
          The final amount you’ll pay includes: The winning bid amount, a system
          fee, delivering costs minus the deposit you placed.
        </p>
      ),
    },
    {
      key: "6",
      label: (
        <span className="text-gray-100 text-xl">
          How are shipping costs calculated?
        </span>
      ),
      children: (
        <p className="text-gray-200 text-base">
          Shipping is based on the distance from the auction location: <br />
          - 0–10 km:Free <br />
          - 11–50 km: 1,500 VND/km <br />
          - 51–100 km: 1,200 VND/km <br />
          - 101–200km: 1,000 VND/km <br />
          - 200+ km: 800 VND/km <br />
        </p>
      ),
    },
    {
      key: "7",
      label: (
        <span className="text-gray-100 text-xl">
          Is there a maximum bid limit?
        </span>
      ),
      children: (
        <p className="text-gray-200 text-base">
          Yes, the maximum bid for any koi fish is capped at 20 times its
          starting price.
        </p>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-hero-pattern bg-cover relative flex justify-center min-h-screen ">
        <Header />
        <div className="absolute bg-black bg-opacity-70 inset-0" />
        <div className="">
          <div className=" bg-slate-900 w-4/5 h-56 relative rounded-3xl mt-28 mx-auto bg-opacity-80">
            <h1 className="text-2xl text-white p-3 font-bold ml-4">
              Welcome to PrestigeKoi!
            </h1>
            <div className="p-3 ml-7 text-gray-300  ">
              <h2>
                PrestigeKoi Auctions is your one-stop shop in Vietnam for
                Japanese Koi auctions. We connect Koi lovers and collectors with
                top breeders. Our platform features a wide variety of beautiful
                Japanese Koi, carefully selected for buyers in Vietnam.
              </h2>
              <h2 className="mt-3 ">
                With a love for the art and beauty of Koi, we have created an
                online marketplace that connects the best breeders with
                enthusiasts. Through our auctions, collectors can buy
                high-quality Koi directly from trusted breeders.
              </h2>
            </div>
          </div>
          <div className="relative mx-auto w-4/5 bg-slate-900 bg-opacity-80 rounded-3xl p-3 mt-10">
            <h1 className="text-2xl text-white font-bold ml-2">
              Frequently Asked Questions
            </h1>
            <div className="mt-3">
              <Collapse
                ghost
                items={items}
                expandIcon={({ isActive }) => (
                  <RightOutlined
                    style={{
                      color: "white",
                    }}
                    rotate={isActive ? 90 : 0}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
