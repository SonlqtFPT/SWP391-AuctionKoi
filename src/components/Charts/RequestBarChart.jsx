import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Rectangle,
} from "recharts";
import { motion } from "framer-motion"
import { ScrollTextIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";


function RequestBarChart() {
    const [requestData, setRequestData] = useState([]);
    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await api.get("manager/request/getRequest", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const requestData = response.data.data;

            const requestsByMonth2024 = requestData
                .filter(item => item.requestedAt)
                .filter(item => new Date(item.requestedAt).getFullYear() === 2024)
                .reduce((acc, item) => {
                    const month = new Date(item.requestedAt).getMonth();
                    acc[month] = (acc[month] || 0) + 1;
                    return acc;
                }, {});

            const data = [
                { name: "Jan.", Request: requestsByMonth2024[0] || 0 },
                { name: "Feb.", Request: requestsByMonth2024[1] || 0 },
                { name: "Mar.", Request: requestsByMonth2024[2] || 0 },
                { name: "Apr.", Request: requestsByMonth2024[3] || 0 },
                { name: "May.", Request: requestsByMonth2024[4] || 0 },
                { name: "Jun.", Request: requestsByMonth2024[5] || 0 },
                { name: "Jul.", Request: requestsByMonth2024[6] || 0 },
                { name: "Aug.", Request: requestsByMonth2024[7] || 0 },
                { name: "Sep.", Request: requestsByMonth2024[8] || 0 },
                { name: "Oct.", Request: requestsByMonth2024[9] || 0 },
                { name: "Nov.", Request: requestsByMonth2024[10] || 0 },
                { name: "Dec.", Request: requestsByMonth2024[11] || 0 },
            ];

            console.log("Monthly data for chart:", data);
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
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-lg font-medium mb-4">
                <span className='flex items-center text-sm font-medium text-black'>
                    <ScrollTextIcon
                        size={20}
                        className='mr-2'
                    />
                    Total Request Overview For Each Month In 2024
                </span>
            </h2>

            <div className="h-80">
                <BarChart
                    width={500}
                    height={300}
                    data={requestData}
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
                    <Bar
                        dataKey="Request"
                        fill="#B3CDAD"
                        activeBar={<Rectangle fill="pink" stroke="blue" />}
                    />
                </BarChart>
            </div>
        </motion.div>
    )
}

export default RequestBarChart

