import { getDownloadURL, ref, uploadBytes } from "D:/FPTU/Reactjs/SWP391-AuctionKoi/FrontEnd/node_modules/firebase/storage";
import { storage } from "../config/firebase";

const uploadFile = async (file) => {
    //Lưu cái file này lên firebase 
    
    //lấy cái đường dẫn tới file vừa tạo
    const storageRef = ref(storage, file.name);
    const response = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(response.ref);
    return downloadURL;
}

export default uploadFile