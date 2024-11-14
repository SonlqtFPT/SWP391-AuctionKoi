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
import { UserCircle, UserCircle2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";


function UserBarChart() {
    const [userData, setUserData] = useState([]);
    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await api.get("manager/manager/get-all-account", {
                headers: {
                    Authorization: `Bearer ${token}`, // Corrected token syntax
                },
            });
            const userData = response.data.data;
            console.log(userData);
            // Filter out members and group by month in 2024
            const membersByMonth2024 = userData
                .filter(item => item.role === "MEMBER" && item.createAt)
                .filter(item => new Date(item.createAt).getFullYear() === 2024)
                .reduce((acc, item) => {
                    const month = new Date(item.createAt).getMonth();
                    acc[month] = (acc[month] || 0) + 1;
                    return acc;
                }, {});

            // Define the monthly data array for the chart
            const data = [
                { name: "Jan.", user: membersByMonth2024[0] || 0 },
                { name: "Feb.", user: membersByMonth2024[1] || 0 },
                { name: "Mar.", user: membersByMonth2024[2] || 0 },
                { name: "Apr.", user: membersByMonth2024[3] || 0 },
                { name: "May.", user: membersByMonth2024[4] || 0 },
                { name: "Jun.", user: membersByMonth2024[5] || 0 },
                { name: "Jul.", user: membersByMonth2024[6] || 0 },
                { name: "Aug.", user: membersByMonth2024[7] || 0 },
                { name: "Sep.", user: membersByMonth2024[8] || 0 },
                { name: "Oct.", user: membersByMonth2024[9] || 0 },
                { name: "Nov.", user: membersByMonth2024[10] || 0 },
                { name: "Dec.", user: membersByMonth2024[11] || 0 },
            ];

            console.log("Monthly data for chart:", data);
            setUserData(data);

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
                    <UserCircle2Icon
                        size={20}
                        className='mr-2'
                    />
                    Member Registered Overview in 2024
                </span>
            </h2>

            <div className="h-80">
                <BarChart
                    width={500}
                    height={300}
                    data={userData}
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
                        dataKey="user"
                        fill="#B3CDAD"
                        activeBar={<Rectangle fill="pink" stroke="blue" />}
                    />
                </BarChart>
            </div>
        </motion.div>
    )
}

export default UserBarChart

