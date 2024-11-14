import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import UpdateBreederRequest from "../components/UpdatebreederRequest";

const UpdateRequestPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UpdateBreederRequest />
      </div>
      <Footer />
    </div>
  );
};

export default UpdateRequestPage;
