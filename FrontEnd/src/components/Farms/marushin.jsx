import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";

function marushin() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được tải
  }, []);

  return (
    <div className="bg-hero-pattern bg-cover relative grid min-h-screen ">
      <Header />
      <div className="absolute bg-black bg-opacity-70 inset-0" />
      <div className="relative flex justify-center items-center mt-24 ">
        <img
          src="https://auctionkoi.com/images/marushin-logo.png"
          className="rounded-2xl w-[300px] h-[200px]"
          alt="Logo Marushin"
        />
      </div>
      <div className="relative flex justify-center gap-16 mb-20 mt-16">
        <div className=" ">
          <img
            src="https://www.kodamakoifarm.com/wp-content/uploads/2023/03/marushin-koi-farm.jpg"
            className="rounded-2xl w-[800px] h-[500px]"
            alt="Koi Fish"
          />
        </div>
        <div className="w-[800px] h-auto">
          <div>
            <h1 className="text-white font-bold text-4xl flex justify-center">
              Discover Marushin Koi Farm
            </h1>
            <h2 className="text-slate-100 mt-14 mb-5">
              Marushin Koi Farm, owned by Mr. Mitsuhiro Tanaka, has become a
              renowned name in the koi industry, specializing in high-quality
              Doitsu Showa, Ginrin Showa, and Showa varieties. Founded in 1968,
              this farm has consistently delivered excellence in koi breeding,
              gaining a reputation for its koi's impressive body size and
              striking Sumi patterns.
            </h2>
          </div>
          <div className="flex justify-between gap-10 mt-20">
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Reliability and Quality
              </h1>
              <h2 className="text-slate-100 mt-10">
                With over five decades of dedicated koi breeding, Marushin Koi
                Farm is celebrated for its commitment to quality and
                credibility. Mr. Tanaka, a master of Tamasaba goldfish as well,
                has become a go-to expert for premium koi, consistently meeting
                the expectations of koi enthusiasts worldwide.
              </h2>
            </div>
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">Sales and Reach</h1>
              <h2 className="text-slate-100 mt-10">
                Marushin Koi Farm has supplied thousands of koi to enthusiasts
                and collectors, with its varieties highly sought after by
                breeders and hobbyists alike. This extensive reach and
                substantial volume of sales underscore its status as a trusted
                and quality source for koi fish.
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

export default marushin;
