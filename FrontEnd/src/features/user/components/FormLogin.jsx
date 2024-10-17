import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../../config/firebase";
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../config/axios';
import { toast } from 'react-toastify';
import Logo from "../../../assets/logo/koi69Logo_white.png";
import Picture from "../../../assets/picture/TwoFish.jpg";
import { GoogleButton } from 'react-google-button';
import { useAuth } from '../../protectedRoutes/AuthContext';

function FormLogin() {
    const navigate = useNavigate();
    const { setUserName, setRole, setAccessToken, setRefreshToken } = useAuth(); // Get setters from AuthContext

    const handleLoginGoogle = () => {
        const auth = getAuth();
        signInWithPopup(auth, googleProvider)
            .then(async (result) => {
                // Get Google Access Token
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // Get user information
                const user = result.user;

                // Send token and user info to your backend for verification and processing
                try {
                    const response = await api.post("authenticate/google-login", {
                        token, // Google Access Token
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    });

                    // Store tokens or other data from your backend response
                    const accessToken = response.data.data.accessToken;
                    const refreshToken = response.data.data.refreshToken;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    // Store account data
                    const accountData = response.data.data.account;
                    localStorage.setItem('accountData', JSON.stringify(accountData));

                    // Immediately update AuthContext values
                    setUserName(`${accountData.firstName} ${accountData.lastName}`);
                    setRole(accountData.role);
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);

                    // Navigate based on role
                    const { role } = accountData;
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
                    toast.error("Google login failed!");
                    console.error(error);
                }
            }).catch((error) => {
                console.error(error);
                toast.error("Google sign-in failed!");
            });
    };

    const handleLogin = async (values) => {
        try {
            console.log(values);
            const response = await api.post("authenticate/login", values);
            console.log(response);

            // Store tokens
            const accessToken = response.data.data.accessToken;
            const refreshToken = response.data.data.refreshToken; // Corrected from resquestToken
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Store entire account data
            const accountData = response.data.data.account;
            localStorage.setItem('accountData', JSON.stringify(accountData));


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
        <div className='flex min-h-full flex-1 columns-2 justify-center px-6 py-20 lg:px-8 bg-hero-pattern mt-25 bg-cover relative'>
            <div className='absolute bg-black bg-opacity-70 inset-0'></div>
            <div className='max-w-md mx-auto md:max-w-2xl shadow-xl mt-10'>
                <div className='md:flex'>
                    <div className="md:shrink-0">
                        <img
                            className="h-48 w-full object-cover md:h-full md:w-80 rounded-l-2xl filter brightness-100"
                            src={Picture}
                            alt="Modern building architecture"
                        />
                    </div>
                    <div className='relative p-8 sm:mx-auto sm:w-full sm:max-w-sm bg-[#131313] py-10 rounded-r-2xl'>
                        <img
                            src={Logo}
                            alt="Koi69 Logo"
                            className="mx-auto h-10 w-14"
                        />
                        <h2 className="mt-5 mb-5 text-center text-3xl font-extrabold leading-9 text-[#bcab6f]">
                            Login in
                        </h2>
                        <Form labelCol={{ span: 24, }} onFinish={handleLogin} >
                            <FormItem
                                label={<label className='block text-sm font-medium leading-6 text-white'>Email</label>}
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email',
                                    },
                                ]}
                            >
                                <Input />
                            </FormItem>

                            <FormItem
                                label={<label className='block text-sm font-medium leading-6 text-white'>Password</label>}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </FormItem>

                            <p className="mt-10 text-center text-sm text-gray-500">
                                Not a member? {' '}
                                <Link to="/register" className="font-semibold leading-6  hover:text-yellow-500 text-yellow-600">
                                    Register here!
                                </Link>
                            </p>
                            <div>
                                <button
                                    className='flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2'
                                    type="submit"
                                >Login</button>
                                <br></br>
                                <div className='flex w-full justify-center px-5 py-1.5 text-sm font-semibold leading-6' onClick={handleLoginGoogle}>
                                    <GoogleButton />
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default FormLogin