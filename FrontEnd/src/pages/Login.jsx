import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import FormLogin from "../components/FormLogin.jsx";


const LoginPage = () => {
  return <div>
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <FormLogin/>
      </div>
      <Footer />
    </div>
  </div>;
};

export default LoginPage;
