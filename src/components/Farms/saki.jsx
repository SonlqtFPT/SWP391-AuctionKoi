import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";

function saki() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được tải
  }, []);

  return (
    <div className="bg-hero-pattern bg-cover relative grid  min-h-screen ">
      <Header />
      <div className="absolute bg-black bg-opacity-70 inset-0" />
      <div className="relative flex justify-center mt-28">
        <img
          src="https://sff-koi.com/wp/wp-content/themes/sffkoi_theme/cmn/img/global/logo.svg"
          className="rounded-2xl w-[300px] h-[200px]"
          alt="Logo Saki"
        />
      </div>
      <div className="relative flex justify-center gap-20 mb-20 mt-16">
        <div className=" ">
          <img
            src="https://i.ytimg.com/vi/kHbvk72l_rk/maxresdefault.jpg"
            className="rounded-2xl w-[800px] h-[500px]"
            alt="Koi Fish"
          />
        </div>
        <div className="w-[800px] h-auto">
          <div>
            <h1 className="text-white font-bold text-4xl flex justify-center">
              Sakai Koi Farm: A Legacy of Excellence in Nishikigoi Breeding
            </h1>
            <h2 className="text-slate-100 mt-14 mb-5">
              With over 120 years of experience, Sakai Koi Farm stands as a
              symbol of innovation and quality in koi breeding. Starting in 1890
              with Ichiroji Sakai breeding Magoi, our family has evolved through
              three generations, ultimately focusing on the unique Nishikigoi.
            </h2>
          </div>
          <div className="flex justify-between gap-10 mt-20">
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Proven Quality and Trust
              </h1>
              <h2 className="text-slate-100 mt-10">
                Through science and expertise, Sakai Koi Farm leads in Kohaku
                and Sanke bloodlines, with 11 Grand Champion wins at the All
                Japan Koi Show since 2000, reflecting our trusted quality.
              </h2>
            </div>
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Recognition in Koi Sales
              </h1>
              <h2 className="text-slate-100 mt-10">
                Renowned for beauty and lineage, our koi are treasured
                worldwide. With loyal support, we continue advancing Nishikigoi
                excellence. Thank you for your trust.
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

export default saki;
