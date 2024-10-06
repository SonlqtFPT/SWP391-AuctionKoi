import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import LoginForm from "../components/LoginForm.jsx";

export const Login = () => {
  return <div>
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <LoginForm />
      </div>
      <Footer />
    </div>
  </div>;
};
