import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SidebarAdmin from "../components/SidebarAdmin.jsx";
import Test from "../components/Test.jsx";

const AdminPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <SidebarAdmin />
        <Test />
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
