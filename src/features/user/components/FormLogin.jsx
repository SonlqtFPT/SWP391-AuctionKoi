import { Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import Logo from "../../../assets/logo/PrestigeKoi_White.png";
import Picture from "../../../assets/picture/TwoFish.jpg";
import { useAuth } from "../../protectedRoutes/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

function FormLogin() {
  const navigate = useNavigate();
  const { setUserName, setRole, setAccessToken, setRefreshToken } = useAuth(); // Get setters from AuthContext


  const handleLoginGoogle = async (values) => {
    const googleToken = values.credential;
    console.log("Google token: " + googleToken);

    const data = { token: googleToken };

    const handleResponse = async () => {
      try {
        const response = await api.post("authenticate/login-google", data);
        console.log(response.data);

        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const accountData = response.data.data.account;
        localStorage.setItem("accountData", JSON.stringify(accountData));

        setUserName(`${accountData.firstName} ${accountData.lastName}`);
        setRole(accountData.role);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        const { role } = accountData;

        // Navigation based on role
        if (role === "MANAGER") {
          navigate("/admin");
        } else if (role === "MEMBER") {
          navigate("/member");
        } else if (role === "BREEDER") {
          navigate("/breeder");
        } else if (role === "STAFF") {
          navigate("/staff");
        }

      } catch (error) {
        if (error.response) {
          // Retry logic: If the token is not valid yet, wait for a second and retry
          setTimeout(() => {
            handleLoginGoogle(values); // Retry login after 1 second
          }, 1000);
        } else {
          toast.error("Login GG was failed!");
          console.log(error);
        }
      }
    };

    handleResponse();
  };



  const handleLogin = async (values) => {
    try {
      console.log(values);
      const response = await api.post("authenticate/login", values);
      console.log(response);

      // Store tokens
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken; // Corrected from resquestToken
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const accountData = response.data.data.account;
      localStorage.setItem("accountData", JSON.stringify(accountData));

      // Immediately update AuthContext values
      setUserName(`${accountData.firstName} ${accountData.lastName}`);
      setRole(accountData.role);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      const { role } = accountData;

      // Handle navigation based on role
      if (role === "MANAGER") {
        navigate("/admin");
      } else if (role === "MEMBER") {
        navigate("/member");
      } else if (role === "BREEDER") {
        navigate("/breeder");
      } else if (role === "STAFF") {
        navigate("/staff");
      }
    } catch (error) {
      toast.error("This account doesn't exist, really!");
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 columns-2 justify-center px-6 py-20 lg:px-8 bg-hero-pattern mt-25 bg-cover relative">
      <div className="absolute bg-black bg-opacity-80 inset-0"></div>
      <div className="max-w-md mx-auto md:max-w-2xl shadow-xl mt-10">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-80 rounded-l-2xl filter brightness-100"
              src={Picture}
              alt="Modern building architecture"
            />
          </div>
          <div className="relative p-8 sm:mx-auto sm:w-full sm:max-w-sm bg-[#131313] py-10 rounded-r-2xl">
            <img src={Logo} alt="Koi69 Logo" className="mx-auto h-10 w-14" />
            <h2 className="mt-5 mb-5 text-center text-3xl font-extrabold leading-9 text-[#bcab6f]">
              Login in
            </h2>
            <Form labelCol={{ span: 24 }} onFinish={handleLogin}>
              <FormItem
                label={
                  <label className="block text-sm font-medium leading-6 text-white">
                    Email
                  </label>
                }
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email",
                  },
                ]}
              >
                <Input />
              </FormItem>

              <FormItem
                label={
                  <label className="block text-sm font-medium leading-6 text-white">
                    Password
                  </label>

                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                ]}
              >
                <Input.Password />
              </FormItem>

              <label className="ml-24 text-center text-sm text-gray-500">
                Forgot password?{" "}
                <Link
                  to="/forgotPass"
                  className="font-semibold leading-6  hover:text-[#c1b178] text-[#a99a65]"
                >
                  Click Here!
                </Link>
              </label>

              <div className="mt-10">
                <button
                  className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="submit"
                >
                  Login
                </button>

                <p className="mt-2 text-center text-sm text-gray-500">
                  Not a member?{" "}
                  <Link
                    to="/register"
                    className="font-semibold leading-6  hover:text-yellow-500 text-yellow-600"
                  >
                    Register Here!
                  </Link>
                </p>
                <br></br>
                <div className="flex w-full justify-center px-5 py-1.5 text-sm font-semibold leading-6">
                  <GoogleLogin
                    onSuccess={handleLoginGoogle}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormLogin;
