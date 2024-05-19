import Axios from "axios";

const axiosInstance = Axios.create({
  // Configuring a base URL if needed
  // baseURL: 'http://example.com/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const Ttoken = localStorage.getItem("Ttoken");
    const Admintoken = localStorage.getItem("Admintoken");
    const Partytoken = localStorage.getItem("partyToken");
    if (Ttoken || Admintoken || Partytoken) {
      config.headers.Authorization = Ttoken || Admintoken || Partytoken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
axiosInstance.defaults.headers.put["Content-Type"] = "application/json";

export default axiosInstance;
