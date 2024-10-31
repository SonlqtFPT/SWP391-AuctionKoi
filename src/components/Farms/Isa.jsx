import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";

function Isa() {
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được tải
  }, []);
  return (
    <div className="bg-hero-pattern bg-cover relative grid min-h-screen ">
      <Header />
      <div className="absolute bg-black bg-opacity-70 inset-0" />
      <div className="relative flex justify-center items-center mt-20">
        <img
          src="https://th.bing.com/th/id/R.a0f012d976a1b109ee2bdde1147fe6cf?rik=C6AoaugI7LDLaA&riu=http%3a%2f%2fkoikichi-auction.com%2fimages%2fupload%2fbreeder%2f111320_Breeder_ISA-LOGO.jpg&ehk=Hf1sTTJWFP0CQnkh7Ln%2bLlVW3%2fYSq1ZIAFuiJoHQ6xQ%3d&risl=&pid=ImgRaw&r=0"
          className="rounded-2xl w-[300px] h-[200px]"
          alt="Logo Isa"
        />
      </div>
      <div className="relative flex justify-center gap-20 mb-20 mt-16">
        <div className=" ">
          <img
            src="https://www.koi.com/sales/upload/1975-3.jpg"
            className="rounded-2xl w-[600px] h-[700px]"
            alt="Koi Fish"
          />
        </div>
        <div className="w-[800px] h-auto">
          <div>
            <h1 className="text-white font-bold text-4xl flex justify-center">
              Isa Koi Farm: Passion and Excellence in Showa Breeding
            </h1>
            <h2 className="text-slate-100 mt-14 mb-5">
              Founded in 1971 by Mitsunori Isa, Isa Koi Farm has become one of
              the most popular and respected breeders in Niigata, Japan. Known
              for his sincere dedication, passion, and likable personality, Mr.
              Isa has built a reputation that goes beyond koi quality alone.
            </h2>
          </div>
          <div className="flex justify-between gap-10 mt-20">
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                Leading in Showa Variety
              </h1>
              <h2 className="text-slate-100 mt-10">
                Specializing in Showa, Isa Koi Farm produces koi with bold and
                unique body structures that set them apart. Alongside Dainichi
                Koi Farm, Isa Koi Farm is recognized as a leader in Showa
                breeding, with many of its koi taking top honors at the All
                Japan Koi Show, showcasing the farm's dedication to excellence.
              </h2>
            </div>
            <div className="w-2/4">
              <h1 className="text-white font-bold text-2xl">
                A Trusted Name in Koi Breeding
              </h1>
              <h2 className="text-slate-100 mt-10">
                Isa Koi Farm's consistent quality and outstanding winning
                records have earned the trust of koi enthusiasts worldwide.
                Through a blend of skill and genuine love for koi, Mr. Isa and
                his team continue to produce Showa koi that captivate collectors
                and set the standard in Nishikigoi breeding.
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

export default Isa;
