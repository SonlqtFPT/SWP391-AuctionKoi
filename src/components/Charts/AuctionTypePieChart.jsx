import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GavelIcon } from 'lucide-react';
import api from '../../config/axios';
import { toast } from 'react-toastify';




const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981"];

const AuctionTypePieChart = () => {

    const [requestData, setRequestData] = useState([]);
    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await api.get("manager/request/getRequest", {
                headers: {
                    Authorization: `Bearer ${token}`, // Corrected token syntax
                },
            });
            const requestData = response.data.data;
            console.log(requestData);

            // Filter out members and group by month in 2024
            const countAuctionType1 = requestData.filter(item => item.auctionTypeName === "FIXED_PRICE_SALE").length;
            const countAuctionType2 = requestData.filter(item => item.auctionTypeName === "SEALED_BID").length;
            const countAuctionType3 = requestData.filter(item => item.auctionTypeName === "ASCENDING_BID").length;
            const countAuctionType4 = requestData.filter(item => item.auctionTypeName === "DESCENDING_BID").length;

            const data = [
                { name: "Fixed Price Sale", value: countAuctionType1 || 0 },
                { name: "Sealed Bid", value: countAuctionType2 || 0 },
                { name: "Ascending Bid", value: countAuctionType3 || 0 },
                { name: "Descending Bid", value: countAuctionType4 || 0 },

            ].filter(item => item.value > 0);

            console.log(data);

            setRequestData(data);
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
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-lg font-medium mb-4">
                <span className='flex items-center text-sm font-medium text-black'>
                    <GavelIcon
                        size={20}
                        className='mr-2'
                    />
                    Percentage of Auction Type for Each Request
                </span>
            </h2>

            <div className="h-80">
                <ResponsiveContainer
                    width={"100%"}
                    height={"100%"}
                >
                    <PieChart>
                        <Pie
                            data={requestData}
                            cx={"50%"}
                            cy={"50%"}
                            LabelLine={false}
                            outerRadius={80}
                            fill="#884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {requestData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            itemStyle={{ color: "#2f4f4f" }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default AuctionTypePieChart
