import axios from "axios";

export const baseUrl = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
        'Content-Type': 'application/json',
    }
})


const refreshToken = async () => {
    const params = new URLSearchParams({
        grant_type: "client_credentials"
    }).toString()

    const res = await axios.post("https://accounts.spotify.com/api/token",
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(import.meta.env.VITE_SPOTFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTFY_SECRET)
            }
        }
    )

    localStorage.setItem("access_token", res.data.access_token)
    return res.data.access_token
}

baseUrl.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

baseUrl.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const newToken = await refreshToken()

                originalRequest.headers.Authorization = `Bearer ${newToken}`

                return baseUrl(originalRequest)
            } catch {

                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)