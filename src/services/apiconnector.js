import axios from "axios";
import { toast } from "react-hot-toast";

export const axiosInstance = axios.create({});

// Response Interceptor for Rate Limiting & Global HTTP 429 Awareness
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 429) {
            const message =
                error?.response?.data?.message ||
                "Too many requests! Please slow down and wait a moment before trying again.";
            toast.error(message, { id: "rate-limit-toast" });
        }
        return Promise.reject(error);
    }
);

export const apiConnector = (method, url, bodyData, header, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: header ? header : null,
        params: params ? params : null,
    });
};