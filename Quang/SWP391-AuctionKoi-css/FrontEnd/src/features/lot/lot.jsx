import "./index.css";
import Time from "./component-lot/time";
import Picture from "./component-lot/picture";
import Information from "./component-lot/infomation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Lot() {
  const handleTransform = () => {
    // Use history.push to navigate to /bid
    window.location.href = "/bid"; // Changed to navigate to the /bid page
  };
  return (
    <div className="bg-black h-screen">
      <Header />
      <Time />
      <button
        onClick={handleTransform}
        className="flex items-center mt-[50px] mb-[50px]"
      >
        <div className="mt-10">
          <div className="h-[600px] w-[300px] bg-slate-800 ml-[200px] rounded-tl-[50px] rounded-[50px]">
            <Picture />

            <div>
              <Information />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="h-[600px] w-[300px] bg-slate-800 ml-[200px] rounded-tl-[50px] rounded-[50px]">
            <Picture />
            <div>
              <Information />
            </div>
          </div>
        </div>
      </button>
      <Footer />
    </div>
  );
}

export default Lot;
