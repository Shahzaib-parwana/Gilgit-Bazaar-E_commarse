// src/pages/Wishlist.jsx
import { useState, useEffect, useContext } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import wishlistService from '../services/wishlistService';
import { cartService } from '../services/cartService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingItems, setMovingItems] = useState({});
  const { refreshCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      console.log('Wishlist data:', data);
      setWishlistItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await wishlistService.removeFromWishlist(itemId);
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (item) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    setMovingItems(prev => ({ ...prev, [item.id]: true }));
    
    try {
      await cartService.addToCart({
        product_id: item.product,
        quantity: 1,
        variant_id: item.variant || null
      });
      
      if (refreshCart) {
        await refreshCart();
      }
      
      toast.success(`${item.product_detail?.name || 'Item'} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setMovingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="wishlist-wrap">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <Loader size={48} className="spinner" />
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner {
            animation: spin 1s linear infinite;
            color: #f0a500;
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wishlist-wrap">
        <style>{`
          .wishlist-wrap {
            background: #0a0f1e;
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
          }
          .empty-state {
            text-align: center;
          }
          .empty-icon {
            background: #131c42;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          .empty-icon svg {
            color: #f0a500;
            width: 48px;
            height: 48px;
          }
          .empty-state h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: #fff;
          }
          .empty-state p {
            color: #8892aa;
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f0a500;
            color: #000;
            padding: 12px 28px;
            border-radius: 40px;
            text-decoration: none;
          }
        `}</style>
        <div className="empty-state">
          <div className="empty-icon">
            <Heart />
          </div>
          <h2>Login to View Wishlist</h2>
          <p>Please login to see your saved items</p>
          <Link to="/login" className="btn-primary">
            Login Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-wrap">
        <style>{`
          .wishlist-wrap {
            background: #0a0f1e;
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
          }
          .empty-state {
            text-align: center;
          }
          .empty-icon {
            background: #131c42;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          .empty-icon svg {
            color: #f0a500;
            width: 56px;
            height: 56px;
          }
          .empty-state h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: #fff;
          }
          .empty-state p {
            color: #8892aa;
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f0a500;
            color: #000;
            padding: 14px 32px;
            border-radius: 40px;
            text-decoration: none;
          }
        `}</style>
        <div className="empty-state">
          <div className="empty-icon">
            <Heart />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>Save items you love to buy them later</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-wrap">
      <style>{`
        .wishlist-wrap {
          background: #0a0f1e;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 0;
          min-height: 100vh;
        }
        .wishlist-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .wishlist-header {
          margin-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 20px;
        }
        .wishlist-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: #fff;
        }
        .wishlist-header h1 span {
          color: #f0a500;
        }
        .wishlist-header .count {
          color: #8892aa;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .wish-product-card {
          background: #131c42;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .wish-product-card:hover {
          transform: translateY(-6px);
          border-color: rgba(240,165,0,0.4);
        }
        .product-image {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #1e2a4a;
        }
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: rgba(0,0,0,0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        .remove-btn:hover {
          background: #dc2626;
        }
        .remove-btn svg {
          color: #fff;
          width: 16px;
          height: 16px;
        }
        .product-info {
          padding: 16px;
        }
        .product-category {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #f0a500;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .product-name {
          font-weight: 600;
          font-size: 1rem;
          color: #fff;
          margin-bottom: 8px;
        }
        .product-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #f0a500;
          margin-bottom: 12px;
        }
        .add-to-cart-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(240,165,0,0.4);
          border-radius: 40px;
          padding: 10px;
          font-weight: 600;
          color: #f0a500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .add-to-cart-btn:hover:not(:disabled) {
          background: #f0a500;
          color: #000;
        }
        .add-to-cart-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner-small {
          animation: spin 0.8s linear infinite;
        }
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .wishlist-container { padding: 0 20px; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My <span>Wishlist</span></h1>
          <div className="count">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</div>
        </div>

        <div className="products-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wish-product-card">
              <div className="product-image">
                <img 
                  src={item.product_detail?.primary_image || '/placeholder-image.jpg'} 
                  alt={item.product_detail?.name || 'Product'} 
                  loading="lazy"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                  disabled={movingItems[item.id]}
                >
                  <Trash2 />
                </button>
              </div>
              <div className="product-info">
                <div className="product-category">
                  {item.product_detail?.category_name || 'Product'}
                </div>
                <div className="product-name">{item.product_detail?.name}</div>
                <div className="product-price">
                  PKR {parseFloat(item.product_detail?.price || 0).toLocaleString()}
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="add-to-cart-btn"
                  disabled={movingItems[item.id]}
                >
                  {movingItems[item.id] ? (
                    <>
                      <svg className="spinner-small" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;