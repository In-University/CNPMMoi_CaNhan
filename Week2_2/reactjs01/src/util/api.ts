import axios from './axios.customize';

const createUserApi = (name: string, email: string, password: string) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
}

const loginApi = (email: string, password: string) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

const forgotPasswordApi = (email: string) => {
    const URL_API = "/v1/api/forgot-password";
    const data = { email };
    return axios.post(URL_API, data);
}

const resetPasswordApi = (email: string, otp: string, newPassword: string) => {
    const URL_API = "/v1/api/reset-password";
    const data = { email, otp, newPassword };
    return axios.post(URL_API, data);
}

export { createUserApi, loginApi, getUserApi, forgotPasswordApi, resetPasswordApi };
