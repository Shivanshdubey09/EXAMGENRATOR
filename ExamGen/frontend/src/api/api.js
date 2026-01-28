import axios from "axios";

/*
 Axios instance
 Used to connect frontend with backend APIs
*/
const API = axios.create({
  baseURL: "https://examgen-pro-smart-exam-paper-generator.onrender.com/api",
  withCredentials: true,
});

export default API;
