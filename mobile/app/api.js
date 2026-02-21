import axios from "axios";

const API = axios.create({
  baseURL: "http://10.60.247.229:4300/api"
});

export default API;
