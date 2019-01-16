import axios from "axios";
// const baseURL = "http://localhost:5555/rest/";
const baseURL = "http://10.4.148.155:5555/rest/";
// const baseURL = "http://192.168.191.1:5555/rest/";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 1000
});

export default instance;
