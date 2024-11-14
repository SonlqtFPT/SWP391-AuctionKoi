import { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Rectangle,
} from "recharts";
import api from '../../config/axios';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"
import { ReceiptTextIcon } from 'lucide-react';

const TransactionBarChar = () => {
    const [transactionData, setTransactionData] = useState([]);
    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await api.get("transaction/get-all-transaction", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const requestData = response.data.data;
            console.log(requestData);


            const paymentTransactionByMonth2024 = requestData
                .filter(item => item.transactionType === "INVOICE_PAYMENT" && item.paymentStatus === "SUCCESS")
                .filter(item => item.transactionDate)
                .filter(item => new Date(item.transactionDate).getFullYear() === 2024)
                .reduce((acc, item) => {
                    const month = new Date(item.transactionDate).getMonth();
                    acc[month] = (acc[month] || 0) + 1;
                    return acc;
                }, {});


            const data = [
                { name: "Jan.", Payment: paymentTransactionByMonth2024[0] || 0 },
                { name: "Feb.", Payment: paymentTransactionByMonth2024[1] || 0 },
                { name: "Mar.", Payment: paymentTransactionByMonth2024[2] || 0 },
                { name: "Apr.", Payment: paymentTransactionByMonth2024[3] || 0 },
                { name: "May.", Payment: paymentTransactionByMonth2024[4] || 0 },
                { name: "Jun.", Payment: paymentTransactionByMonth2024[5] || 0 },
                { name: "Jul.", Payment: paymentTransactionByMonth2024[6] || 0 },
                { name: "Aug.", Payment: paymentTransactionByMonth2024[7] || 0 },
                { name: "Sep.", Payment: paymentTransactionByMonth2024[8] || 0 },
                { name: "Oct.", Payment: paymentTransactionByMonth2024[9] || 0 },
                { name: "Nov.", Payment: paymentTransactionByMonth2024[10] || 0 },
                { name: "Dec.", Payment: paymentTransactionByMonth2024[11] || 0 },
            ];

            console.log("Monthly data for chart:", data);
            setTransactionData(data);

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
                    <ReceiptTextIcon
                        size={20}
                        className='mr-2'
                    />
                    Total Payment Transaction For Each Month In 2024
                </span>
            </h2>

            <div className="h-80">
                <BarChart
                    width={500}
                    height={300}
                    data={transactionData}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip itemStyle={{ color: "#2f4f4f" }} />
                    <Bar dataKey="Payment" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
            </div>
        </motion.div>
    )
}

export default TransactionBarChar
