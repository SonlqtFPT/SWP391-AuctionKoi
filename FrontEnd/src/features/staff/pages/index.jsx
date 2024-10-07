import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";
import SidebarStaff from "../components/SidebarStaff.jsx";
import ManageRequestStatus from "../components/ManageRequestStatus.jsx";

const StaffPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <SidebarStaff />
        <div className="flex-grow p-4 mt-20">
          <ManageRequestStatus />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaffPage;
