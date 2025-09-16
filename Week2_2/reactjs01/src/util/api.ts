import axios from './axios.customize';
import type { Product, ApiResponse, SimilarProduct, CommentsResponse, FavoriteResponse, PurchaseRequest } from '../types/product';

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

// Product APIs
const getProductDetailApi = (productId: string): Promise<ApiResponse<Product>> => {
    const URL_API = `/v1/api/products/${productId}`;
    return axios.get(URL_API);
}

const postProductViewApi = (productId: string): Promise<ApiResponse<Product>> => {
    const URL_API = `/v1/api/products/${productId}/view`;
    return axios.post(URL_API);
}

const toggleFavoriteApi = (productId: string): Promise<FavoriteResponse> => {
    const URL_API = `/v1/api/products/${productId}/favorite`;
    return axios.post(URL_API);
}

const getSimilarProductsApi = (productId: string): Promise<ApiResponse<SimilarProduct[]>> => {
    const URL_API = `/v1/api/products/${productId}/similar`;
    return axios.get(URL_API);
}

const getProductCommentsApi = (productId: string, page: number = 1, limit: number = 20): Promise<CommentsResponse> => {
    const URL_API = `/v1/api/products/${productId}/comments?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
}

const postProductCommentApi = (productId: string, content: string) => {
    const URL_API = `/v1/api/products/${productId}/comment`;
    const data = { content };
    return axios.post(URL_API, data);
}

const incrementPurchasedApi = (productId: string, qty: number): Promise<ApiResponse<Product>> => {
    const URL_API = `/v1/api/products/${productId}/purchased`;
    const data: PurchaseRequest = { qty };
    return axios.post(URL_API, data);
}

export { 
    createUserApi, 
    loginApi, 
    getUserApi, 
    forgotPasswordApi, 
    resetPasswordApi,
    // Product APIs
    getProductDetailApi,
    postProductViewApi,
    toggleFavoriteApi,
    getSimilarProductsApi,
    getProductCommentsApi,
    postProductCommentApi,
    incrementPurchasedApi
};
