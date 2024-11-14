import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";

function kanno() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được tải
  }, []);

  return (
    <div className="bg-hero-pattern bg-cover relative grid min-h-screen ">
      <Header />
      <div className="absolute bg-black bg-opacity-70 inset-0" />
      <div className="relative flex justify-center items-center mt-20 bg-white w-full p-2 ">
        <img
          src="https://auctionkoi.com/images/kanno-logo.png"
          className="rounded-2xl w-[300px] h-[200px]"
          alt="Logo Kanno"
        />
      </div>
      <div className="relative flex justify-center gap-16 mb-20 mt-16">
        <div className=" ">
          <img
            src="https://www.kodamakoifarm.com/wp-content/uploads/2021/04/Kanno-Special-Auction-Landing-Page-Banner2.jpg"
            className="rounded-2xl w-[800px] h-[500px]"
            alt="Koi Fish"
          />
        </div>
        <div className="w-[800px] h-auto">
          <div>
            <h1 className="text-white font-bold text-4xl flex justify-center">
              Explore the Legacy of Kanno Koi Farm
            </h1>
            <h2 className="text-slate-100 mt-14 mb-5">
              Established in the 1970s by Hiroshi Hirasawa and now managed by
              his son, Kazuhiro Hirasawa, Kanno Koi Farm is celebrated for its
              exceptional Goshiki and Sanke varieties. Known worldwide, their
              Goshiki stands out for its award-winning quality, admired for its
              unique color and pattern.
            </h2>
          </div>
          <div className="flex justify-between gap-10 mt-20">
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Trust and Excellence
              </h1>
              <h2 className="text-slate-100 mt-10">
                With a longstanding tradition of koi breeding, Kanno Koi Farm
                has built a solid reputation. Their expertise and meticulous
                breeding practices have made them a preferred choice for koi
                enthusiasts, ensuring that each koi meets high-quality
                standards.
              </h2>
            </div>
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Market Reach and Success
              </h1>
              <h2 className="text-slate-100 mt-10">
                Kanno Koi Farm has reached thousands of collectors and hobbyists
                globally, with a high volume of koi sold internationally. Known
                for their outstanding Goshiki and Sanke, Kanno Koi Farm
                continues to attract attention in the koi community for their
                remarkable fish.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}

export default kanno;
