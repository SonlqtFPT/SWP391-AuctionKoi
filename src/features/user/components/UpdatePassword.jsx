import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../config/axios';
import { toast } from 'react-toastify';

function UpdatePassword() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (values) => {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        try {
            const response = await api.patch("authenticate/update-password", values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { status } = response.data;
            const { message } = response.data;


            if (status === 1003) {
                toast.success(message);
                navigate("/member/profile/details")
            }

        } catch (error) {
            console.log(error);
            toast.error("Wrong Old Password!");
            navigate("/member/profile/details");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className='max-w-md mx-auto md:max-w-2xl shadow-xl'>
            <div className='md:flex'>
                <div className='relative px-5 sm:mx-auto sm:w-full sm:max-w-sm  bg-[#131313] rounded-2xl py-5 shadow-lg'>
                    <h2 className="my-5 text-center text-3xl font-extrabold leading-9 text-[#bcab6f]">
                        Update Your Password
                    </h2>
                    <Form labelCol={{ span: 24, }} onFinish={handleChangePassword}>

                        <FormItem
                            label={<label className='block text-sm font-medium leading-6 text-white'>Old Password</label>}
                            name="oldPassword"
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

                        <FormItem
                            label={<label className='block text-sm font-medium leading-6 text-white'>New Password</label>}
                            name="newPassword"
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
                            label={<label className='block text-sm font-medium leading-6 text-white'>Confirm New Password</label>}
                            name="confirmNewPassword"
                            className='block text-sm font-medium leading-6 text-gray-900'
                            dependencies={['newPassword']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your new password'
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
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
                            Change Your Mind? {' '}
                            <Link to="/member/profile/details" className="font-semibold leading-6 text-red-600 hover:text-red-500">
                                Back To Profile Page!
                            </Link>
                        </p>

                        <button className='flex w-full justify-center rounded-md bg-[#a9995d] px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-[#bcab6f] focus-visible:outline-2 focus-visible:outline-offset-2'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Update New Password"}
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePassword
