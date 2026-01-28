import axios from "axios";

/*
 Axios instance
 Used to connect frontend with backend APIs
*/
const API = axios.create({
  baseURL: "https://examgenrator.onrender.com/api",
  withCredentials: true,
});

export default API;
