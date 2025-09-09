export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: {
        _id: string;
        name: string;
    };
    image: string;
    stock: number;
    discount?: number;
    views?: number;
    rating?: number;
    featured?: boolean;
    inStock?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    pagination?: PaginationInfo;
    message?: string;
}
