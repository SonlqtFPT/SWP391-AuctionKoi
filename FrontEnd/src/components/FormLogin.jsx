import { Button, Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../config/firebase";
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { toast } from 'react-toastify';

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
        try{

            const response = await api.post("login", values);
            console.log(response);
            const {role} = response.data;

            if (role === "ADMIN" ) {
                navigate("/admin");
            }
        }catch(error){
            toast.error(error.response.data);
        }
    };  
    return (
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#e8eae5]'>
            <div className='pl-2 pr-2 sm:mx-auto sm:w-full sm:max-w-sm  bg-white rounded-xl py-10 shadow-lg'>
                <Form labelCol={{span: 24,}} onFinish={handleLogin}>
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

                    <Button className='flex w-full justify-center' type="primary" htmlType='submit'>Login</Button>

                    <Button className='flex w-full justify-center' onClick={handleLoginGoogle}>Login Google</Button>
                </Form>
            </div>
        </div>
    )
}

export default FormLogin