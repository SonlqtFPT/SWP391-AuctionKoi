import Footer from "../../components/Footer";
import Header from "../../components/Header";

import BreederRequest from "./components/BreederRequest";

const BreederPage = () => {
  return (

    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <BreederRequest />
      </div>
      <Footer />

    </div>
  );
};

export default BreederPage;
