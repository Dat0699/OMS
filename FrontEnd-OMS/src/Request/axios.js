import axios from 'axios';


const ORIGIN = "http://ggvh.myddns.me";
// const ORIGIN = "http://localhost";
const PORT = "5702";

const userToken = localStorage.getItem("user-token");

const headers = userToken ? {
    "Content-Type": 'application/json',
    "user-token": userToken,
    "access-device": navigator.userAgent
} : {
    "Content-Type": 'application/json',
    "access-device": navigator.userAgent
};


const instance = axios.create({
    baseURL: `${ORIGIN}:${PORT}/api`, // Replace with your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers
});


const instanceFile = axios.create({
    baseURL: `${ORIGIN}:${PORT}/api`, // Replace with your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        "Content-Type": "multipart/form-data",    
        "user-token": userToken,
        "access-device": navigator.userAgent
    }
});

export const uploadFile = async (data) => {
    const formData = new FormData();
    formData.append('image', data);
    const rs = (await instanceFile.post(`/file/upload`, formData));
    return rs?.data;
}
  
  export default instance;