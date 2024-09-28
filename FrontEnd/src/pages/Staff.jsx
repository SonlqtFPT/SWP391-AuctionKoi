import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SidebarStaff from "../components/SidebarStaff.jsx";
import Test from "../components/Test.jsx";

const StaffPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <SidebarStaff />
        <Test />
      </div>
      <Footer />
    </div>
  );
};

export default StaffPage;
