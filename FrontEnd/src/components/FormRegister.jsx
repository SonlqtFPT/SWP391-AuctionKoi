import { Button, Form, Input, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { toast } from 'react-toastify';


function FormRegister() {
    const navigate = useNavigate();
    const handleRegister = async (values) => {
        //submit into backend with receive values
        console.log(values);
        try {
            const response = await api.post("authenticate/signup", values);
            console.log(response);
            const { status } = response.data;
            const { message } = response.data;
            console.log(status);
            console.log(message);
            if (status === 200) {
                toast.success(message);
                navigate("/login");
            }
            else if (status != 200)
                toast.error(message);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data);
        }
    };


    return (
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-9 lg:px-8 bg-[#e8eae5]'>
            <div className='pl-2 pr-2 sm:mx-auto sm:w-full sm:max-w-sm  bg-white rounded-xl py-10 shadow-lg'>
                <Form labelCol={{ span: 24, }} onFinish={handleRegister}>
                    <FormItem
                        label="Email"
                        name="email"
                        className='block text-sm font-medium leading-6 text-gray-900'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email',
                            },
                            {
                                type: 'email',
                                message: 'Please enter a valid email',
                            },
                        ]}
                    >
                        <Input />
                    </FormItem>

                    <FormItem
                        label="First Name"
                        name="firstName"
                        className='block text-sm font-medium leading-6 text-gray-900'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name',
                            },
                            {
                                type: 'string',
                                message: 'Please enter a valid name',
                            },
                        ]}
                    >
                        <Input />
                    </FormItem>

                    <FormItem
                        label="Last Name"
                        name="lastName"
                        className='block text-sm font-medium leading-6 text-gray-900'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name',
                            },
                            {
                                type: 'string',
                                message: 'Please enter a valid name',
                            },
                        ]}
                    >
                        <Input />
                    </FormItem>
                    <FormItem
                        label="Phone Number"
                        name="phoneNumber"
                        className='block text-sm font-medium leading-6 text-gray-900'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number',
                            },
                            {
                                pattern: /^[0-9]+$/,
                                message: 'Phone number must contain only digits',
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

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        className='block text-sm font-medium leading-6 text-gray-900'
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <p className="mt-5 text-center text-sm text-gray-500">
                        Already a member? {' '}
                        <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Login here!
                        </Link>
                    </p>

                    <Button className='flex w-full justify-center' type='primary' htmlType='submit'>Register</Button>

                </Form>
            </div>
        </div>
    )
}

export default FormRegister