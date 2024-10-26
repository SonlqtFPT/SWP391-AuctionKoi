import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../config/axios';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"
import { HandCoins } from 'lucide-react';




const IncomeLineChart = () => {

    const [incomeData, setIncomeData] = useState([]);
    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log(token);
            const response = await api.get("invoice/get-invoices", {
                headers: {
                    Authorization: `Bearer ${token}`, // Corrected token syntax
                },
            });
            const requestData = response.data.data;
            console.log("Invoices data: " + requestData);

            const incomeByMonth2024 = requestData
                .filter(item => item.status === "PAID")
                .filter(item => item.invoiceDate)
                .filter(item => new Date(item.invoiceDate).getFullYear() === 2024)
                .reduce((acc, item) => {
                    const month = new Date(item.invoiceDate).getMonth();
                    const income = (item.subTotal || 0) * 0.1;
                    acc[month] = (acc[month] || 0) + income;
                    return acc;
                }, {});

            const data = [
                { name: "Jan.", Income: incomeByMonth2024[0] || 0 },
                { name: "Feb.", Income: incomeByMonth2024[1] || 0 },
                { name: "Mar.", Income: incomeByMonth2024[2] || 0 },
                { name: "Apr.", Income: incomeByMonth2024[3] || 0 },
                { name: "May.", Income: incomeByMonth2024[4] || 0 },
                { name: "Jun.", Income: incomeByMonth2024[5] || 0 },
                { name: "Jul.", Income: incomeByMonth2024[6] || 0 },
                { name: "Aug.", Income: incomeByMonth2024[7] || 0 },
                { name: "Sep.", Income: incomeByMonth2024[8] || 0 },
                { name: "Oct.", Income: incomeByMonth2024[9] || 0 },
                { name: "Nov.", Income: incomeByMonth2024[10] || 0 },
                { name: "Dec.", Income: incomeByMonth2024[11] || 0 },
            ];

            setIncomeData(data);


        } catch (error) {
            toast.error("Failed to fetch auction request data");
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);

    return (
        <motion.div
            className='bg-slate-300 bg-opacity-50 backdrop-blur-md overflow-hidden p-6 shadow-lg rounded-xl border border-slate-200'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-lg font-medium mb-4">
                <span className='flex items-center text-sm font-medium text-black'>
                    <HandCoins
                        size={20}
                        className='mr-2'
                    />
                    Auction Incomes for Each Month In 2024 (VND)
                </span>
            </h2>

            <div className="h-80">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={incomeData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                        <XAxis dataKey={"name"} />
                        <XAxis stroke="#9ca3af" />
                        <Tooltip
                            itemStyle={{ color: "#2f4f4f" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Income"
                            stroke='#6366F1'
                            strokeWidth={3}
                            dot={{ fill: "6366F1", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                    </LineChart>

                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default IncomeLineChart
