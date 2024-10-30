import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";

function ishi() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được tải
  }, []);
  return (
    <div className="bg-hero-pattern bg-cover relative grid min-h-screen ">
      <Header />
      <div className="absolute bg-black bg-opacity-70 inset-0" />
      <div className="relative flex justify-center items-center mt-20 bg-white w-full">
        <img
          src="https://ishikoi.vn/tassets/images/hinh-anh-footer-1.png"
          className="rounded-2xl w-[300px] h-[200px]"
          alt="Logo Ishi"
        />
      </div>
      <div className="relative flex justify-center gap-20 mb-20 mt-16">
        <div className=" ">
          <img
            src="https://ishikoi.vn/tassets/images/hinh-anh-secIntroDirection.png"
            className="rounded-2xl w-[600px] h-[700px]"
            alt="Koi Fish"
          />
        </div>
        <div className="w-[800px] h-auto">
          <div>
            <h1 className="text-white font-bold text-4xl flex justify-center">
              Ishi Koi Farm: Breeding Japanese Koi fish in Vietnam
            </h1>
            <h2 className="text-slate-100 mt-14 mb-5">
              With a deep passion for koi, Ishi Koi Farm was established to meet
              the growing demand for koi across Vietnam. Since our inception, we
              have built strong partnerships with top Japanese koi farms,
              bringing the beauty and quality of authentic Japanese koi to our
              clients in Vietnam.
            </h2>
          </div>
          <div className="flex justify-between gap-10 mt-20">
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Reliable Quality and Trusted Expertise
              </h1>
              <h2 className="text-slate-100 mt-10">
                Our dedication to quality and expertise has made us a pioneer in
                local koi breeding, combining Japanese broodstock with local
                knowledge. Working closely with Japanese breeders in Vietnam, we
                produce koi that thrive in the local climate and water
                conditions, offering high-quality koi that koi enthusiasts can
                trust.
              </h2>
            </div>
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Recognized Excellence and Accessibility
              </h1>
              <h2 className="text-slate-100 mt-10">
                Today, Ishi Koi Farm is proud to supply koi throughout Vietnam,
                recognized for their beauty, resilience, and adaptability. By
                breeding locally, we are able to offer koi at accessible prices
                without the added costs of importation. We thank our clients for
                their support and look forward to continuing to elevate the koi
                experience in Vietnam.
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

export default ishi;
