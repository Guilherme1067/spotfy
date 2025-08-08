import axios from "axios";

export const baseUrl = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
        'Content-Type': 'application/json',
    }
})


baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})