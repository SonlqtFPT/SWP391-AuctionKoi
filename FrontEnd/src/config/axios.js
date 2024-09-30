import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:8080",
});

// Function that is used to take token from localStorage and put it into the config axios
// Đẩy token từ localStorage và bỏ vào trong config axios để gửi cho back-end
const handleBeforeApi = (config) => {
    const accessToken = localStorage.getItem("accessToken");
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
};

//Using when errors happened
const handleAfterApi = (error) => {
    console.log(error);
};

api.interceptors.request.use(handleBeforeApi, handleAfterApi);

export default api;  