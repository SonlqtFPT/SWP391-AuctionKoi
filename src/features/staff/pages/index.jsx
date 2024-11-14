import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";
import StaffProfile from "../components/StaffProfile.jsx";
import { useState } from "react";
import SidebarStaff from "../../../components/SidebarStaff.jsx";
import ManageRequestStatus from "../components/ManageRequestStatus.jsx";
import ManageTransport from "../components/ManageTransport.jsx";

const StaffPage = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const renderComponent = () => {
    console.log(activeComponent);
    switch (activeComponent) {
      case "Profile":
        return <StaffProfile />;
      case "Manage Request":
        return <ManageRequestStatus />;
      case "Manage Transport":
        return <ManageTransport />;
      default:
        return <div>Welcome to the Staff Dashboard!</div>; // Default content
    }
  };

  return (
    <div className="flex flex-col min-h-screen min-w-max">
      <Header />
      <div className="flex flex-grow w-full">
        <SidebarStaff setActiveComponent={setActiveComponent} />
        <div className="flex-grow p-4 w-full mt-20">
          {renderComponent()} {/* Render the appropriate component */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaffPage;
