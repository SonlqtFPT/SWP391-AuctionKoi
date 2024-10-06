import Footer from "../components/Footer";
import Header from "../components/Header";
import Test from "../components/Test";
import Testcontent from "../components/Testcontent";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow"></div>
      <Footer />
    </div>
  );
};

export default HomePage;
