import { Button, Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../config/firebase";
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { toast } from 'react-toastify';
import Logo from "../assets/logo/koi69Logo_dark.png";

function FormLogin() {
    const navigate = useNavigate();
    const handleLoginGoogle = () => {
        const auth = getAuth();
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    const handleLogin = async (values) => {
        try {
            console.log(values);
            const response = await api.post("authenticate/login", values);
            console.log(response);

            //These 2 lines are used to storage the accessToken, refreshToken from BackEnd//
            const accessToken = response.data.data.accessToken;
            const resquestToken = response.data.data.resquestToken;
            console.log(accessToken);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', resquestToken);
            ///////////////////////////////////////////////////////////////////////
            const { role } = response.data.data.account;
            console.log(role);
            console.log("Hello");

            if (role === "MANAGER") {
                toast.success("Successfully Login In as Manager!");
                navigate("/admin");
            } else if (role === "MEMBER") {
                toast.success("Successfully Login In as Member!");
                navigate("/");
            } else if (role === "BREEDER") {
                toast.success("Successfully Login In as Breeder!");
                navigate("/breeder");
            } else if (role === "STAFF") {
                toast.success("Successfully Login In as Staff!");
                navigate("/staff");
            }
        } catch (error) {
            toast.error("This account doesn't exit, really!");
        }
    };

    return (
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#e8eae5]'>
            <div className='pl-2 pr-2 sm:mx-auto sm:w-full sm:max-w-sm  bg-white rounded-xl py-10 shadow-lg'>
                <img
                    src={Logo}
                    alt="Koi69 Logo"
                    className="mx-auto h-10 w-14"
                />
                <h2 className="mt-5 mb-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                <Form labelCol={{ span: 24, }} onFinish={handleLogin}>
                    <FormItem
                        label="Email"
                        name="email"
                        className='block text-sm font-medium leading-6 text-gray-900'
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
                        label="Password"
                        name="password"
                        className='block text-sm font-medium leading-6 text-gray-900'
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
                        <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Register here!
                        </Link>
                    </p>
                    <div>
                        <Button
                            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            type="primary"
                            htmlType='submit'>Login</Button>
                        <br></br>
                        <Button className='flex w-full justify-center' onClick={handleLoginGoogle}>Login Google</Button>
                    </div>
                </Form>
            </div>
        </div >
    )
}

export default FormLogin