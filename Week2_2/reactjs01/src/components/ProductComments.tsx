import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './context/auth.context';
import type { ProductComment, CommentPagination } from '../types/product';
import { getProductCommentsApi, postProductCommentApi } from '../util/api';
import '../styles/product-components.css';

interface ProductCommentsProps {
    productId: string;
    onCommentAdded?: () => void;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId, onCommentAdded }) => {
    const [comments, setComments] = useState<ProductComment[]>([]);
    const [pagination, setPagination] = useState<CommentPagination>({ currentPage: 1, totalItems: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [newComment, setNewComment] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const { user } = useContext(AuthContext);
    const itemsPerPage = 20;

    const fetchComments = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError('');
            const response = await getProductCommentsApi(productId, page, itemsPerPage);
            
            if (response.success) {
                setComments(response.data);
                setPagination(response.pagination);
            } else {
                setError('Không thể tải bình luận');
            }
        } catch (err: unknown) {
            console.error('Error fetching comments:', err);
            setError('Có lỗi xảy ra khi tải bình luận');
        } finally {
            setLoading(false);
        }
    }, [productId, itemsPerPage]);

    useEffect(() => {
        fetchComments(currentPage);
    }, [productId, currentPage, fetchComments]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            alert('Vui lòng đăng nhập để bình luận');
            return;
        }

        if (!newComment.trim()) {
            alert('Vui lòng nhập nội dung bình luận');
            return;
        }

        try {
            setSubmitting(true);
            await postProductCommentApi(productId, newComment.trim());
            
            // Clear the comment input
            setNewComment('');
            
            // Refresh comments to show the new one
            await fetchComments(1);
            setCurrentPage(1);
            
            // Notify parent component
            onCommentAdded?.();
            
        } catch (err: unknown) {
            console.error('Error posting comment:', err);
            const errorMessage = err && typeof err === 'object' && 'response' in err && 
                err.response && typeof err.response === 'object' && 'data' in err.response &&
                err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
                ? (err.response.data as { message: string }).message 
                : 'Có lỗi xảy ra khi đăng bình luận';
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalPages = Math.ceil(pagination.totalItems / itemsPerPage);

    return (
        <div className="product-comments">
            <div className="comments-header">
                <h3 className="comments-title">
                    Bình luận ({pagination.totalItems})
                </h3>
            </div>

            {/* Comment Form */}
            <div className="comment-form-section">
                {user ? (
                    <form onSubmit={handleSubmitComment} className="comment-form">
                        <div className="comment-input-section">
                            <div className="user-avatar">
                                <span className="avatar-placeholder">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="comment-input-container">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Viết bình luận của bạn..."
                                    className="comment-textarea"
                                    rows={3}
                                    disabled={submitting}
                                    maxLength={1000}
                                />
                                <div className="comment-actions">
                                    <span className="character-count">
                                        {newComment.length}/1000
                                    </span>
                                    <button 
                                        type="submit" 
                                        className="submit-comment-button"
                                        disabled={submitting || !newComment.trim()}
                                    >
                                        {submitting ? 'Đang đăng...' : 'Đăng bình luận'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="login-prompt">
                        <p>Vui lòng <a href="/login">đăng nhập</a> để bình luận.</p>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="comments-list">
                {loading ? (
                    <div className="comments-loading">
                        <div className="loading-spinner">Đang tải bình luận...</div>
                    </div>
                ) : error ? (
                    <div className="comments-error">
                        <p className="error-message">{error}</p>
                        <button 
                            onClick={() => fetchComments(currentPage)} 
                            className="retry-button"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="comments-empty">
                        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <div key={comment._id} className="comment-item">
                                <div className="comment-avatar">
                                    <span className="avatar-placeholder">
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="commenter-name">{comment.user.name}</span>
                                        <span className="comment-date">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    
                                    <div className="comment-text">
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="comments-pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="pagination-button prev-button"
                    >
                        ← Trước
                    </button>
                    
                    <div className="pagination-info">
                        <span>Trang {currentPage} / {totalPages}</span>
                    </div>
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="pagination-button next-button"
                    >
                        Sau →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductComments;