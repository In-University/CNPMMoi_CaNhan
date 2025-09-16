export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: {
        _id: string;
        name: string;
        description?: string;
        __v?: number;
        createdAt?: string;
        updatedAt?: string;
    };
    image: string;
    stock: number;
    discount?: number;
    views?: number;
    purchasedCount?: number;
    commentCount?: number;
    favoritedCount?: number;
    isFavorited?: boolean;
    rating?: number;
    featured?: boolean;
    inStock?: boolean;
    __v?: number;
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

// Product Comment interfaces
export interface ProductComment {
    _id: string;
    content: string;
    // backend may return user info under `user` or `userId` and it may be populated or not
    user?: {
        _id?: string;
        name?: string;
        email?: string;
    } | null;
    userId?: {
        _id?: string;
        name?: string;
        email?: string;
    } | string | null;
    product: string;
    createdAt: string;
    updatedAt: string;
}

export interface CommentPagination {
    currentPage: number;
    totalItems: number;
}

export interface CommentsResponse {
    success: boolean;
    data: ProductComment[];
    pagination: CommentPagination;
}

// Similar Product interface (from API response)
export interface SimilarProduct {
    id: string;
    _score: number | null;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    categoryName: string;
    image: string;
    stock: number;
    discount: number;
    views: number;
    rating: number;
    featured: boolean;
    inStock: boolean;
    createdAt: string;
}

// Favorite response
export interface FavoriteResponse {
    success: boolean;
    data: {
        // new stable shape returned by backend
        isFavorited?: boolean;
        favoritedCount?: number;
        // legacy field
        favorited?: boolean;
    };
}

// Purchase response
export interface PurchaseRequest {
    qty: number;
}
