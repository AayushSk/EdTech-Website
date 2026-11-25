import axios from "axios";
import { toast } from "react-hot-toast";
import { ENV } from "../config/env";

export const axiosInstance = axios.create({
    withCredentials: true,
});

// Response Interceptor for Rate Limiting & Global HTTP 429 Awareness
let refreshPromise = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;

        if (
            error?.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            try {
                refreshPromise = refreshPromise || axiosInstance.post(`${ENV.BASE_URL}/auth/refresh`);
                await refreshPromise;
                refreshPromise = null;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;
                window.dispatchEvent(new CustomEvent("auth:session-expired"));
                return Promise.reject(refreshError);
            }
        }

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