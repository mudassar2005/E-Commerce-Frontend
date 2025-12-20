'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const ReviewsSection = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const [reviewsRes, statsRes] = await Promise.all([
                api.get(`/reviews/product/${productId}`),
                api.get(`/reviews/product/${productId}/stats`)
            ]);
            setReviews(reviewsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to submit a review');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/reviews', {
                product: productId,
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleHelpful = async (reviewId) => {
        if (!user) return;
        try {
            await api.post(`/reviews/${reviewId}/helpful`);
            fetchReviews();
        } catch (error) {
            console.error('Error marking helpful:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="animate-pulse h-40 bg-gray-100 rounded" />;
    }

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="text-4xl font-bold text-[#B88E2F]">{stats.averageRating?.toFixed(1) || '0.0'}</div>
                    <div className="flex justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={16}
                                className={star <= Math.round(stats.averageRating || 0) ? 'fill-[#FFC700] text-[#FFC700]' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{stats.totalReviews || 0} reviews</div>
                </div>
            </div>

            {/* Write Review Form */}
            {user && (
                <form onSubmit={handleSubmitReview} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-4">Write a Review</h4>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                >
                                    <Star
                                        size={24}
                                        className={star <= newReview.rating ? 'fill-[#FFC700] text-[#FFC700]' : 'text-gray-300'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-2">Your Review</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88E2F]"
                            rows={4}
                            placeholder="Share your experience with this product..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-[#B88E2F] text-white rounded-lg hover:bg-[#9a7628] disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {!reviews || reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    Array.isArray(reviews) ? reviews.map((review) => (
                        <div key={review._id} className="border-b pb-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={14}
                                                    className={star <= review.rating ? 'fill-[#FFC700] text-[#FFC700]' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{formatDate(review.createdAt)}</p>
                                    <p className="text-gray-700">{review.comment}</p>
                                    <button
                                        onClick={() => handleHelpful(review._id)}
                                        className="flex items-center gap-1 mt-3 text-sm text-gray-500 hover:text-[#B88E2F]"
                                    >
                                        <ThumbsUp size={14} />
                                        Helpful ({review.helpfulCount || 0})
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-8">Error loading reviews</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ReviewsSection;
