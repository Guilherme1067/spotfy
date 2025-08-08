import axios from "axios"
import { useQuery } from "@tanstack/react-query"

interface ITokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string
}

const fetchAcessToken = async () => {
    const params = new URLSearchParams({
        grant_type: "client_credentials"
    }).toString()

    const res = await axios.post<ITokenResponse>("https://accounts.spotify.com/api/token",
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(import.meta.env.VITE_SPOTFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTFY_SECRET)
            }
        }
    )

    localStorage.setItem("access_token", res.data.access_token)

    return res.data
}

export const useGetAcessToken = () => {
    return useQuery({
        queryKey: ["access-token"],
        queryFn: fetchAcessToken
    })
}
