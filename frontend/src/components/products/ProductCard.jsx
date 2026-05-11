import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star, Zap, Package, Check } from 'lucide-react';
import { useContext, useState, useRef, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import wishlistService from '../../services/wishlistService';
import toast from 'react-hot-toast';
import { cartService } from '../../services/cartService';

/* ─────────────────────────────────────────────
   STYLES — injected once into <head>
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

:root{
  --pc-bg:       #0d1635;
  --pc-bg2:      #0a0f1e;
  --pc-surface:  #131c42;
  --pc-slate:    #1e2a4a;
  --pc-gold:     #f0a500;
  --pc-gold-lt:  #fbbf24;
  --pc-gold-dim: rgba(240,165,0,.10);
  --pc-gold-bdr: rgba(240,165,0,.28);
  --pc-muted:    #8892aa;
  --pc-border:   rgba(255,255,255,.07);
  --pc-white:    #ffffff;
  --pc-green:    #4ade80;
  --pc-red:      #f87171;
  --pc-spring:   cubic-bezier(.34,1.56,.64,1);
  --pc-ease:     cubic-bezier(.25,.46,.45,.94);
}

/* ══ CARD ROOT ══ */
.xpc{
  position:relative;
  display:flex; flex-direction:column;
  background:var(--pc-bg);
  border:1.5px solid var(--pc-border);
  border-radius:22px; overflow:hidden;
  text-decoration:none;
  font-family:'DM Sans',sans-serif;
  transition:
    transform .4s var(--pc-spring),
    border-color .35s ease,
    box-shadow .4s ease;
  will-change:transform;
  isolation:isolate;
}
.xpc:hover{
  transform:translateY(-8px) scale(1.015);
  border-color:var(--pc-gold-bdr);
  box-shadow:
    0 0 0 1px var(--pc-gold-bdr),
    0 24px 56px rgba(0,0,0,.55),
    0 4px 16px rgba(240,165,0,.08);
}
/* ambient glow */
.xpc::before{
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(240,165,0,.11) 0%,transparent 65%);
  opacity:0; transition:opacity .45s ease;
  pointer-events:none; z-index:0;
}
.xpc:hover::before{opacity:1;}
/* shimmer scan */
.xpc::after{
  content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
  background:linear-gradient(105deg,transparent 40%,rgba(240,165,0,.06) 50%,transparent 60%);
  pointer-events:none; z-index:1; transition:left 0s;
}
.xpc:hover::after{left:160%;transition:left .7s ease;}

/* ══ IMAGE ZONE ══ */
.xpc-img-zone{
  position:relative; aspect-ratio:4/3.2;
  overflow:hidden; background:var(--pc-surface); flex-shrink:0;
}
.xpc-img{
  width:100%; height:100%; object-fit:cover; display:block;
  transition:transform .6s var(--pc-ease), filter .4s ease;
  transform-origin:center 60%;
}
.xpc:hover .xpc-img{transform:scale(1.10);filter:brightness(1.05) saturate(1.08);}

/* fog */
.xpc-fog{
  position:absolute; bottom:0; left:0; right:0; height:55%;
  background:linear-gradient(to top,rgba(13,22,53,.98) 0%,rgba(13,22,53,.55) 45%,transparent 100%);
  z-index:2; transform:translateY(30%); transition:transform .35s ease;
}
.xpc:hover .xpc-fog{transform:translateY(0);}

/* badges */
.xpc-badges{
  position:absolute; top:13px; left:13px;
  display:flex; flex-direction:column; gap:5px; z-index:5;
}
.xpc-badge{
  display:inline-flex; align-items:center; gap:4px;
  padding:4px 10px; border-radius:100px;
  font-size:.67rem; font-weight:800; letter-spacing:.05em; text-transform:uppercase;
  backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
}
.xpc-disc{background:rgba(239,68,68,.85);color:#fff;box-shadow:0 3px 10px rgba(239,68,68,.45);}
.xpc-new{background:rgba(240,165,0,.88);color:#000;box-shadow:0 3px 10px rgba(240,165,0,.4);}
.xpc-hot{background:rgba(249,115,22,.85);color:#fff;}

/* quick actions */
.xpc-qa{
  position:absolute; top:13px; right:13px;
  display:flex; flex-direction:column; gap:7px; z-index:5;
}
.xpc-qa-btn{
  width:36px; height:36px; border-radius:11px;
  background:rgba(10,15,30,.78); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,.11);
  display:flex; align-items:center; justify-content:center;
  color:var(--pc-muted); cursor:pointer;
  opacity:0; transform:translateX(14px);
  transition:
    opacity .28s ease,
    transform .3s var(--pc-spring),
    background .2s ease, color .2s ease, border-color .2s ease;
}
.xpc:hover .xpc-qa-btn{opacity:1;transform:translateX(0);}
.xpc:hover .xpc-qa-btn:nth-child(2){transition-delay:.07s;}
.xpc-qa-btn:hover{background:var(--pc-gold);color:#000;border-color:var(--pc-gold);transform:translateX(0) scale(1.12);}
.xpc-qa-btn.wishlisted{opacity:1;transform:translateX(0);color:var(--pc-red);border-color:rgba(248,113,113,.35);}
.xpc-qa-btn.wishlisted:hover{background:rgba(248,113,113,.15);color:var(--pc-red);}
.xpc-qa-btn:disabled{opacity:0.5;cursor:not-allowed;}

/* oos overlay */
.xpc-oos{
  position:absolute;inset:0;z-index:6;
  background:rgba(10,15,30,.70);backdrop-filter:blur(2px);
  display:flex;align-items:center;justify-content:center;
}
.xpc-oos-pill{
  display:flex;align-items:center;gap:7px;
  background:rgba(10,15,30,.92);border:1px solid rgba(255,255,255,.13);
  color:var(--pc-muted);padding:9px 20px;border-radius:100px;
  font-size:.82rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
}

/* quick-add bar */
.xpc-quickadd{
  position:absolute;bottom:0;left:0;right:0;z-index:7;
  padding:18px 14px 14px;
  transform:translateY(100%); transition:transform .36s var(--pc-spring);
}
.xpc:hover .xpc-quickadd{transform:translateY(0);}
.xpc-quickadd-btn{
  width:100%;padding:10px 0;
  background:var(--pc-gold);color:#000;
  border:none;border-radius:11px;
  font-family:'DM Sans',sans-serif;font-weight:700;font-size:.87rem;
  display:flex;align-items:center;justify-content:center;gap:7px;
  cursor:pointer;
  transition:background .2s ease,transform .15s ease,box-shadow .2s ease;
}
.xpc-quickadd-btn:hover{background:var(--pc-gold-lt);transform:scale(1.02);box-shadow:0 6px 18px rgba(240,165,0,.38);}
.xpc-quickadd-btn:disabled{background:var(--pc-slate);color:var(--pc-muted);cursor:not-allowed;transform:none;}

/* toast */
.xpc-toast{
  position:absolute;bottom:74px;left:50%;transform:translateX(-50%);
  background:rgba(74,222,128,.14);border:1px solid rgba(74,222,128,.32);
  color:var(--pc-green);padding:6px 18px;border-radius:100px;
  font-size:.76rem;font-weight:700;white-space:nowrap;z-index:10;
  pointer-events:none;animation:xpc-toast-anim .95s ease forwards;
}
@keyframes xpc-toast-anim{
  0%{opacity:0;transform:translateX(-50%) translateY(8px);}
  18%{opacity:1;transform:translateX(-50%) translateY(0);}
  72%{opacity:1;}
  100%{opacity:0;transform:translateX(-50%) translateY(-8px);}
}

/* ══ BODY ══ */
.xpc-body{
  position:relative;z-index:2;
  padding:16px 17px 18px;
  display:flex;flex-direction:column;gap:11px; flex:1;
}
.xpc-meta{display:flex;align-items:center;justify-content:space-between;}
.xpc-cat{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--pc-gold);opacity:.85;}
.xpc-rating{display:flex;align-items:center;gap:3px;font-size:.73rem;color:var(--pc-muted);font-weight:500;}
.xpc-rating svg{color:var(--pc-gold);fill:var(--pc-gold);}
.xpc-name{
  font-size:.97rem;font-weight:600;color:var(--pc-white);line-height:1.45;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  transition:color .25s ease; margin:0;
}
.xpc:hover .xpc-name{color:var(--pc-gold-lt);}
.xpc-price-row{display:flex;align-items:center;justify-content:space-between;}
.xpc-prices{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;}
.xpc-price{
  font-family:'Playfair Display',serif;
  font-size:1.22rem;font-weight:700;color:var(--pc-white);transition:color .25s ease;
}
.xpc:hover .xpc-price{color:var(--pc-gold);}
.xpc-compare{font-size:.77rem;color:var(--pc-muted);text-decoration:line-through;}
.xpc-saving{
  display:inline-flex;align-items:center;
  font-size:.68rem;font-weight:700;color:var(--pc-green);
  background:rgba(74,222,128,.10);border:1px solid rgba(74,222,128,.22);
  padding:2px 8px;border-radius:100px;
}
.xpc-stock{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;font-weight:600;}
.xpc-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.xpc-stock-in  .xpc-dot{background:var(--pc-green);box-shadow:0 0 6px rgba(74,222,128,.6);}
.xpc-stock-low .xpc-dot{background:var(--pc-gold); box-shadow:0 0 6px rgba(240,165,0,.6);}
.xpc-stock-out .xpc-dot{background:var(--pc-red);}
.xpc-stock-in  .xpc-stock-lbl{color:var(--pc-green);}
.xpc-stock-low .xpc-stock-lbl{color:var(--pc-gold);}
.xpc-stock-out .xpc-stock-lbl{color:var(--pc-red);}

/* CTA */
.xpc-cta{
  position:relative;overflow:hidden;
  width:100%;padding:12px 0;
  background:transparent;border:1.5px solid var(--pc-border);border-radius:13px;
  font-family:'DM Sans',sans-serif;font-weight:700;font-size:.9rem;color:var(--pc-muted);
  display:flex;align-items:center;justify-content:center;gap:8px;
  cursor:pointer;
  transition:background .3s ease,border-color .3s ease,color .3s ease,transform .2s var(--pc-spring),box-shadow .3s ease;
}
.xpc-cta::before{
  content:'';position:absolute;inset:0;background:var(--pc-gold);
  transform:scaleX(0);transform-origin:left center;
  transition:transform .35s var(--pc-ease);z-index:0;
}
.xpc-cta:hover:not(:disabled)::before{transform:scaleX(1);}
.xpc-cta:hover:not(:disabled){color:#000;border-color:var(--pc-gold);transform:translateY(-2px);box-shadow:0 10px 28px rgba(240,165,0,.32);}
.xpc-cta > *{position:relative;z-index:1;}
.xpc-cta:active:not(:disabled){transform:scale(.97);}
.xpc-cta:disabled{opacity:.35;cursor:not-allowed;}
.xpc-cta.xpc-adding{background:var(--pc-gold-dim);border-color:var(--pc-gold-bdr);color:var(--pc-gold);}
.xpc-cta.xpc-done{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.3);color:var(--pc-green);}
.xpc-cta.xpc-done::before{transform:scaleX(0)!important;}
.xpc-cta svg{transition:transform .3s ease;}
.xpc-cta:hover:not(:disabled) svg{transform:rotate(-10deg) scale(1.15);}
`;

/* inject once */
if (typeof document !== 'undefined' && !document.getElementById('xpc-css')) {
  const el = document.createElement('style');
  el.id = 'xpc-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}

/* ─── helpers ─── */
const pkr = (v) =>
  'PKR ' + parseFloat(v).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const stockInfo = (p) => {
  if (!p.in_stock) return { key: 'out', label: 'Out of Stock' };
  if (p.stock != null && p.stock <= 5)
    return { key: 'low', label: `Only ${p.stock} left!` };
  return { key: 'in', label: 'In Stock' };
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const ProductCard = ({ product }) => {

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [ctaState, setCtaState] = useState('idle'); // idle | adding | done
  const [showToast, setShowToast] = useState(false);
  const timer = useRef(null);

  // Check if product is already in wishlist when component mounts
  useEffect(() => {
    if (user && product.id) {
      checkWishlistStatus();
    }
  }, [user, product.id]);

  const checkWishlistStatus = async () => {
    try {
      const wishlistData = await wishlistService.getWishlist();
      const existingItem = wishlistData.items.find(item => item.product === product.id);
      if (existingItem) {
        setWishlisted(true);
        setWishlistItemId(existingItem.id);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const stock = stockInfo(product);
  if (product.is_bundle) return null;
  
  const savings = product.compare_price
    ? Math.round(parseFloat(product.compare_price) - parseFloat(product.price))
    : null;

  /* Add to cart handler */
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock || ctaState !== 'idle') return;
    
    setCtaState('adding');
    
    // Use cartService.addToCart with the correct data structure
    cartService.addToCart({
      product_id: product.id,
      quantity: 1,
      variant_id: null
    }).then(() => {
      setTimeout(() => {
        setCtaState('done');
        setShowToast(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          setShowToast(false);
          setCtaState('idle');
        }, 1100);
      }, 550);
    }).catch((error) => {
      console.error('Failed to add to cart:', error);
      setCtaState('idle');
      toast.error('Failed to add to cart');
    });
  };

  /* Wishlist handler */
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);

    try {
      if (wishlisted) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(wishlistItemId);
        setWishlisted(false);
        setWishlistItemId(null);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const response = await wishlistService.addToWishlist(product.id, null);
        setWishlisted(true);
        setWishlistItemId(response.item?.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view modal here if needed
    console.log('Quick view for product:', product.slug);
  };

  /* CTA label */
  const ctaContent = () => {
    if (!product.in_stock)     return { icon: <Package size={16}/>,     text: 'Out of Stock' };
    if (ctaState === 'adding') return { icon: <ShoppingCart size={16}/>, text: 'Adding…' };
    if (ctaState === 'done')   return { icon: <Check size={16}/>,        text: 'Added!' };
    return                            { icon: <ShoppingCart size={16}/>, text: 'Add to Cart' };
  };
  const { icon, text } = ctaContent();

  return (
    <Link to={`/products/${product.slug}`} className="xpc" style={{ textDecoration: 'none' }}>

      {/* ════ IMAGE ZONE ════ */}
      <div className="xpc-img-zone">
        <img
          src={product.primary_image || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=600'}
          alt={product.name}
          className="xpc-img"
          loading="lazy"
        />
        <div className="xpc-fog" />

        {/* Badges */}
        <div className="xpc-badges">
          {product.discount_percentage > 0 && (
            <span className="xpc-badge xpc-disc">
              <Zap size={9} strokeWidth={2.5} /> -{product.discount_percentage}%
            </span>
          )}
          {product.is_new && <span className="xpc-badge xpc-new">New</span>}
          {product.is_featured && !product.is_new && <span className="xpc-badge xpc-hot">🔥 Hot</span>}
        </div>

        {/* Quick actions */}
        <div className="xpc-qa">
          <button
            className={`xpc-qa-btn ${wishlisted ? 'wishlisted' : ''}`}
            onClick={handleWishlist}
            disabled={wishlistLoading}
            title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart 
              size={14} 
              fill={wishlisted ? 'currentColor' : 'none'} 
              strokeWidth={2} 
            />
          </button>
          <button 
            className="xpc-qa-btn" 
            onClick={handleQuickView} 
            title="Quick view"
          >
            <Eye size={14} strokeWidth={2} />
          </button>
        </div>

        {/* OOS */}
        {!product.in_stock && (
          <div className="xpc-oos">
            <div className="xpc-oos-pill"><Package size={13} /> Out of Stock</div>
          </div>
        )}

        {/* Quick-add */}
        {product.in_stock && (
          <div className="xpc-quickadd">
            <button
              className="xpc-quickadd-btn"
              onClick={handleAddToCart}
              disabled={ctaState !== 'idle'}
            >
              {ctaState === 'done'
                ? <><Check size={14}/> Added!</>
                : ctaState === 'adding'
                  ? <><ShoppingCart size={14}/> Adding…</>
                  : <><ShoppingCart size={14}/> Quick Add</>
              }
            </button>
          </div>
        )}

        {showToast && <div className="xpc-toast">✓ Added to Cart</div>}
      </div>

      {/* ════ BODY ════ */}
      <div className="xpc-body">

        <div className="xpc-meta">
          <span className="xpc-cat">{product.category_name || 'Gilgit Bazaar'}</span>
          {product.rating != null && (
            <div className="xpc-rating">
              <Star size={11} strokeWidth={0} />
              <span>{parseFloat(product.rating).toFixed(1)}</span>
              {product.review_count && <span style={{ opacity:.6 }}>({product.review_count})</span>}
            </div>
          )}
        </div>

        <p className="xpc-name">{product.name}</p>

        <div className="xpc-price-row">
          <div className="xpc-prices">
            <span className="xpc-price">{pkr(product.price)}</span>
            {product.compare_price && <span className="xpc-compare">{pkr(product.compare_price)}</span>}
          </div>
          {savings > 0 && <span className="xpc-saving">Save {pkr(savings)}</span>}
        </div>

        <div className={`xpc-stock xpc-stock-${stock.key}`}>
          <span className="xpc-dot" />
          <span className="xpc-stock-lbl">{stock.label}</span>
        </div>

        <button
          className={`xpc-cta${ctaState === 'adding' ? ' xpc-adding' : ''}${ctaState === 'done' ? ' xpc-done' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.in_stock || ctaState !== 'idle'}
        >
          {icon}{text}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;