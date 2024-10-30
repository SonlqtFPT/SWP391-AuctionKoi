import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";

function dainichi() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được tải
  }, []);

  return (
    <div className="bg-hero-pattern bg-cover relative grid min-h-screen ">
      <Header />
      <div className="absolute bg-black bg-opacity-70 inset-0" />
      <div className="relative flex justify-center items-center mt-20 bg-white w-full p-2 ">
        <img
          src="https://dainichikoifarm.com/wp-content/themes/dainichi_231122/assets/images/common/main_logo.svg"
          className="rounded-2xl w-[300px] h-[200px]"
          alt="Logo Dainichi"
        />
      </div>
      <div className="relative flex justify-center gap-16 mb-20 mt-16">
        <div className=" ">
          <img
            src="https://dainichikoifarm.com/wp-content/themes/dainichi_231122/assets/images/top/mv02.jpg"
            className="rounded-2xl w-[800px] h-[500px]"
            alt="Koi Fish"
          />
        </div>
        <div className="w-[800px] h-auto">
          <div>
            <h1 className="text-white font-bold text-4xl flex justify-center">
              Dainichi Koi Farm: Excellence in World-Class Koi Breeding
            </h1>
            <h2 className="text-slate-100 mt-14 mb-5">
              Located in Sanbusho, Ojiya, Japan, Dainichi Koi Farm is a globally
              respected name in koi breeding. Founded by the late Mano and now
              led by his sons, Futoshi and Shigeru Mano, Dainichi has become
              synonymous with high quality and impeccable koi body structure,
              attracting enthusiasts worldwide who seek to own a Dainichi koi.
            </h2>
          </div>
          <div className="flex justify-between gap-10 mt-20">
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Specialization in Championship Varieties
              </h1>
              <h2 className="text-slate-100 mt-10">
                Dainichi Koi Farm specializes in Showa, Kohaku, Sanke, and other
                top koi varieties, known for their refined beauty and
                championship qualities. As the first farm to produce an
                award-winning large Gosanke, Dainichi has established a legacy
                of excellence, with numerous grand champions at the prestigious
                All Japan Nishikigoi Show.
              </h2>
            </div>
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Dedication to Quality and Innovation
              </h1>
              <h2 className="text-slate-100 mt-10">
                Spanning over 400,000 square meters, Dainichi Koi Farm is
                committed to continuously improving Nishikigoi quality. Their
                dedication and innovative breeding practices make them a trusted
                name among koi enthusiasts, as they work tirelessly to raise the
                standard of excellence in the koi world.
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

export default dainichi;
