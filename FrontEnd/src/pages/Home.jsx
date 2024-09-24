import Footer from "../components/Footer";
import Header from "../components/Header";
import Test from "../components/Test";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Test />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
