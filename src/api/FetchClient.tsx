import axios from "axios"
//  Creating reusable Axios instance
const fetchClient = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  withCredentials: true, // needed for auth cookie to persist session
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for debugging
fetchClient.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
fetchClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default fetchClient
