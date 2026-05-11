// Orders.jsx (Fixed - Working Review Functionality)
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, ChevronRight, Star, Camera, X, MessageCircle, ThumbsUp, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import reviewService from '../services/reviewService';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && user) {
      checkAllReviewStatus();
    }
  }, [orders, user]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      console.log('Fetched orders:', data);
      setOrders(data.results || data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const checkAllReviewStatus = async () => {
    setLoadingStatus(true);
    const statusMap = {};
    
    for (const order of orders) {
      for (const item of order.items) {
        const productId = item.product.id;
        const key = `${productId}_${order.id}`;
        
        try {
          console.log(`Checking review status for product ${productId}, order ${order.id}`);
          const canReviewData = await reviewService.canReviewProduct(productId);
          console.log(`Review status for product ${productId}:`, canReviewData);
          
          statusMap[key] = {
            canReview: canReviewData.can_review,
            alreadyReviewed: canReviewData.already_reviewed,
            hasPurchased: canReviewData.has_purchased
          };
        } catch (error) {
          console.error(`Failed to check review status for product ${productId}:`, error);
          statusMap[key] = {
            canReview: false,
            alreadyReviewed: false,
            hasPurchased: false,
            error: true
          };
        }
      }
    }
    
    setReviewStatus(statusMap);
    setLoadingStatus(false);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (reviewImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploadingImages(true);
    try {
      const response = await reviewService.uploadReviewImages(files);
      setReviewImages(prev => [...prev, ...response.urls]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!reviewComment.trim()) {
      toast.error('Please write a review');
      return;
    }

    if (!selectedProduct || !selectedProduct.id) {
      toast.error('Product information missing');
      return;
    }

    setSubmittingReview(true);
    try {
      console.log('Submitting review:', {
        product: selectedProduct.id,
        order: selectedOrder.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        images: reviewImages
      });

      const response = await reviewService.createReview({
        product: selectedProduct.id,
        order: selectedOrder.id,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        images: reviewImages
      });
      
      console.log('Review submitted:', response);
      toast.success('Thank you! Your review has been submitted and will appear after moderation.');
      setShowReviewModal(false);
      resetReviewForm();
      
      // Refresh review status for this product
      const key = `${selectedProduct.id}_${selectedOrder.id}`;
      setReviewStatus(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          alreadyReviewed: true,
          canReview: false
        }
      }));
      
    } catch (error) {
      console.error('Review submission error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.response?.data?.rating?.[0] ||
                          'Failed to submit review. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  const resetReviewForm = () => {
    setReviewRating(0);
    setReviewTitle('');
    setReviewComment('');
    setReviewImages([]);
    setHoverRating(0);
  };

  const openReviewModal = (product, order) => {
    console.log('Opening review modal for:', { product, order });
    setSelectedProduct(product);
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
      processing: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
      shipped: { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6' },
      delivered: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
      cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
    };
    return colors[status] || { bg: 'rgba(255,255,255,0.1)', text: 'var(--muted)' };
  };

  const renderStars = (rating, size = 14) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? '#f0a500' : 'none'}
        stroke="#f0a500"
      />
    ));
  };

  if (loading) return <Loader />;

  return (
    <div className="orders-page-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .orders-page-wrap {
          background: var(--midnight);
          min-height: 100vh;
          padding: 100px 0 80px;
          font-family: 'DM Sans', sans-serif;
        }

        :root {
          --midnight: #0a0f1e;
          --navy: #0d1635;
          --navy-2: #131c42;
          --gold: #f0a500;
          --gold-light: #fbbf24;
          --gold-dim: rgba(240,165,0,0.12);
          --muted: #8892aa;
          --white: #ffffff;
        }

        .orders-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-header {
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease forwards;
        }
        .page-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .page-header p {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .order-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          animation: fadeUp 0.5s ease forwards;
        }
        .order-card:hover {
          transform: translateY(-2px);
          border-color: rgba(240,165,0,0.3);
          box-shadow: 0 12px 28px rgba(0,0,0,0.3);
        }

        .order-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .order-info h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .order-date {
          font-size: 0.75rem;
          color: var(--muted);
        }
        .status-badge {
          padding: 6px 14px;
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }
        .order-item {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          transition: all 0.2s;
        }
        .order-item:hover {
          background: rgba(255,255,255,0.05);
        }
        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          flex-shrink: 0;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-details {
          flex: 1;
        }
        .item-name {
          font-weight: 600;
          color: #fff;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        .item-quantity {
          font-size: 0.7rem;
          color: var(--muted);
        }
        .item-price {
          font-weight: 700;
          color: var(--gold);
          font-size: 0.9rem;
        }
        .review-action {
          margin-left: auto;
          min-width: 140px;
          text-align: right;
        }
        .write-review-btn {
          background: var(--gold-dim);
          border: 1px solid rgba(240,165,0,0.3);
          border-radius: 40px;
          padding: 8px 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gold);
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .write-review-btn:hover {
          background: var(--gold);
          color: #000;
          transform: translateY(-2px);
        }
        .write-review-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .reviewed-badge {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 40px;
          padding: 8px 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #22c55e;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .review-unavailable {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 40px;
          padding: 8px 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #ef4444;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          cursor: not-allowed;
        }
        .loading-status {
          background: rgba(255,255,255,0.05);
          border-radius: 40px;
          padding: 8px 20px;
          font-size: 0.75rem;
          color: var(--muted);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .total-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
        }
        .total-amount {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--gold);
        }
        .view-details {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--gold-dim);
          border: 1px solid rgba(240,165,0,0.3);
          border-radius: 40px;
          padding: 8px 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gold);
          text-decoration: none;
          transition: all 0.2s;
        }
        .view-details:hover {
          background: var(--gold);
          color: #000;
          transform: translateX(3px);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          animation: fadeUp 0.5s ease forwards;
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          background: var(--navy-2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid rgba(240,165,0,0.2);
        }
        .empty-icon svg {
          color: var(--gold);
          width: 40px;
          height: 40px;
        }
        .empty-state h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }
        .empty-state p {
          color: var(--muted);
          margin-bottom: 28px;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--gold);
          color: #000;
          padding: 12px 28px;
          border-radius: 40px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s;
        }
        .btn-primary:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(240,165,0,0.3);
        }

        /* Review Modal Styles */
        .review-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .review-modal {
          background: var(--navy-2);
          border-radius: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(255,255,255,0.1);
          animation: fadeUp 0.3s ease;
        }
        .review-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .review-modal-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #fff;
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .review-modal-body {
          padding: 24px;
        }
        .rating-section {
          margin-bottom: 24px;
          text-align: center;
        }
        .rating-label {
          color: #fff;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .rating-star {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .rating-star:hover {
          transform: scale(1.1);
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-family: inherit;
          font-size: 0.9rem;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--gold);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        .image-upload-section {
          margin-bottom: 20px;
        }
        .image-upload-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 10px 16px;
          cursor: pointer;
          color: var(--muted);
          transition: all 0.2s;
        }
        .image-upload-label:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        .image-preview-grid {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 12px;
        }
        .image-preview {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-image-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.6);
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.2s;
        }
        .remove-image-btn:hover {
          background: #ef4444;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .btn-cancel {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 40px;
          padding: 10px 24px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover {
          background: rgba(255,255,255,0.1);
        }
        .btn-submit {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border: none;
          border-radius: 40px;
          padding: 10px 28px;
          font-weight: 600;
          color: #000;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(240,165,0,0.3);
        }
        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @media (max-width: 768px) {
          .orders-page-wrap { padding: 80px 0 60px; }
          .orders-container { padding: 0 20px; }
          .order-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .order-footer { flex-direction: column; align-items: flex-start; }
          .page-header h1 { font-size: 2rem; }
          .order-item { flex-wrap: wrap; }
          .review-action { margin-left: 0; width: 100%; text-align: left; margin-top: 8px; }
          .write-review-btn, .reviewed-badge, .review-unavailable, .loading-status { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="orders-container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track your orders and leave reviews for products you've purchased</p>
        </div>

        {orders.length > 0 ? (
          <div>
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>{order.order_number}</h3>
                      <div className="order-date">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className="status-badge"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => {
                      const reviewKey = `${item.product.id}_${order.id}`;
                      const status = reviewStatus[reviewKey];
                      
                      // Only show review options for delivered orders
                      const isDelivered = order.status === 'delivered';
                      
                      return (
                        <div key={item.id} className="order-item">


                          <div className="item-image">
                            <img
                              src={
                                item.product.primary_image ? 
                                  (item.product.primary_image.startsWith('http') ? 
                                    item.product.primary_image : 
                                    `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${item.product.primary_image}`
                                  ) : 'https://via.placeholder.com/60'
                              }
                              alt={item.product.name}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/60';
                              }}
                            />
                          </div>
                          <div className="item-details">
                            <div className="item-name">{item.product.name}</div>
                            <div className="item-quantity">Quantity: {item.quantity}</div>
                          </div>
                          <div className="item-price">
                            PKR {parseFloat(item.total_price).toFixed(2)}
                          </div>
                          <div className="review-action">
                            {loadingStatus ? (
                              <div className="loading-status">
                                <div className="spinner-small" />
                                Checking...
                              </div>
                            ) : isDelivered ? (
                              <>
                                {status?.canReview === true ? (
                                  <button
                                    className="write-review-btn"
                                    onClick={() => openReviewModal(item.product, order)}
                                  >
                                    <Star size={14} /> Write a Review
                                  </button>
                                ) : status?.already_reviewed === true ? (
                                  <div className="reviewed-badge">
                                    <MessageCircle size={14} /> Already Reviewed
                                  </div>
                                ) : status?.has_purchased === false ? (
                                  <div className="review-unavailable">
                                    <AlertCircle size={14} /> Not Purchased
                                  </div>
                                ) : (
                                  <div className="review-unavailable">
                                    <AlertCircle size={14} /> Review Unavailable
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="review-unavailable">
                                <AlertCircle size={14} /> Available after delivery
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-footer">
                    <div>
                      <div className="total-label">Total Amount</div>
                      <div className="total-amount">
                        PKR {parseFloat(order.total).toFixed(2)}
                      </div>
                    </div>
                    <Link to={`/order-success/${order.id}`} className="view-details">
                      View Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <ShoppingBag />
            </div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h2>Review {selectedProduct.name}</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="review-modal-body">
                <div className="rating-section">
                  <div className="rating-label">Your Rating</div>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        fill={star <= (hoverRating || reviewRating) ? '#f0a500' : 'none'}
                        stroke="#f0a500"
                        className="rating-star"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Review Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="Summarize your experience"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <div className="form-group">
                  <label>Your Review *</label>
                  <textarea
                    placeholder="Share your thoughts about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="image-upload-section">
                  <label className="image-upload-label">
                    <Camera size={16} />
                    Upload Photos (Max 5)
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingImages}
                    />
                  </label>
                  
                  {uploadingImages && (
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="spinner-small" />
                      Uploading...
                    </div>
                  )}

                  {reviewImages.length > 0 && (
                    <div className="image-preview-grid">
                      {reviewImages.map((img, idx) => (
                        <div key={idx} className="image-preview">
                          <img src={img} alt={`Preview ${idx + 1}`} />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(idx)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;