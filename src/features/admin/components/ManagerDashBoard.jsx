import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import StatCard from '../../../components/StatCard'
import { CheckCheck, CircleX, PenLine, UserCircle, Zap } from 'lucide-react'
import { toast } from "react-toastify";
import api from '../../../config/axios';
import UserBarChart from '../../../components/Charts/UserBarChart';
import RequestBarChart from '../../../components/Charts/RequestBarChart';
import AuctionTypePieChart from '../../../components/Charts/AuctionTypePieChart';
import TransactionBarChar from '../../../components/Charts/TransactionBarChar';
import IncomeLineChart from '../../../components/Charts/IncomeLineChart';

function ManagerDashBoard() {
    const [registeredCount, setRegisteredCount] = useState([]);
    const [cancleCount, setCancleCount] = useState([]);
    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await api.get("manager/request/getRequest", {
                headers: {
                    Authorization: `Bearer ${token}`, // Corrected token syntax
                },
            });
            const auctionData = response.data.data;

            // Count all requests with status "PENDING"

            const countRegistered = auctionData.filter(item => item.status === "APPROVE").length;
            setRegisteredCount(countRegistered);

            const countCancle1 = auctionData.filter(item => item.status === "CANCELLED").length;
            const countCancle2 = auctionData.filter(item => item.status === "INSPECTION_FAILED").length;
            setCancleCount(countCancle1 + countCancle2);

        } catch (error) {
            toast.error("Failed to fetch auction request data");
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);



    return (
        <div>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <h1 className='text-2xl mb-4'>
                    Welcome to Manager DashBoard
                </h1>

                {/* Transaction Section */}
                <div className="my-8">
                    <hr className="border-t-4 border-gray-300 mb-4 w-autp  md:w-full mx-auto" />
                    <h3 className="text-2xl text-justify md:text-center lg:text-center font-bold w-auto lg:w-full">
                        Income and Transaction Dashboard
                    </h3>
                    <hr className="border-t-4 border-gray-300 mt-4 w-auto  md:w-full mx-auto" />
                </div>

                {/* Chart Section */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <TransactionBarChar />
                    <IncomeLineChart />
                </div>

                {/* Request Section */}
                <div className="my-8">
                    <hr className="border-t-4 border-gray-300 mb-4 w-autp  md:w-full mx-auto" />
                    <h2 className="text-2xl text-justify md:text-center lg:text-center font-bold w-auto lg:w-full">
                        Request Dashboard
                    </h2>
                    <hr className="border-t-4 border-gray-300 mt-4 w-auto  md:w-full mx-auto" />
                </div>


                {/* Stat Card Section */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 lg:flex lg:justify-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name="Total Registered Request" icon={CheckCheck} value={registeredCount} color='#32cd32' />
                    <StatCard name="Total Cancled Request" icon={CircleX} value={cancleCount} color='#ff0000' />
                </motion.div>

                {/* Chart Section */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <RequestBarChart />
                    <AuctionTypePieChart />
                </div>


            </main>
        </div>
    )
}

export default ManagerDashBoard
