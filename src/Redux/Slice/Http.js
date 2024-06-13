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
    config.headers['Access-Control-Allow-Origin'] = '*'; // Allowing all origins
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'; // Allowing specific methods
    config.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'; // Allowing specific headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
axiosInstance.defaults.headers.put["Content-Type"] = "application/json";

export default axiosInstance;
