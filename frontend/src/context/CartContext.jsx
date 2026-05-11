// context/CartContext.js

import { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      
      console.log('RAW CART DATA:', data);
      
      // Transform the data - NOTE: Use 'primary_image' as the image field
      const transformedCart = {
        ...data,
        total_amount: data.subtotal,
        // Preserve coupon data from backend
        coupon: data.coupon,
        coupon_discount: parseFloat(data.coupon_discount || 0),
        total: parseFloat(data.total || data.subtotal),
        items: data.items.map(item => ({
          ...item,
          product_id: item.product.id,
          name: item.product.name,
          // The image field is 'primary_image' in your serializer
          image: item.product.primary_image,
          description: item.product.description,
          category_name: item.product.category_name,
          slug: item.product.slug,
          sku: item.product.sku,
          price: parseFloat(item.price),
          in_stock: item.product.in_stock,
          stock: item.product.stock,
          is_bundle: item.product.is_bundle,
        }))
      };
      
      console.log('TRANSFORMED CART:', transformedCart);
      console.log('FIRST ITEM IMAGE URL:', transformedCart.items[0]?.image);
      
      setCart(transformedCart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    try {
      await cartService.addToCart({
        product_id: productId,
        quantity,
        variant_id: variantId,
      });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem({
        item_id: itemId,
        quantity,
      });
      await fetchCart();
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  // NEW: Apply coupon method
  const applyCoupon = async (code) => {
    try {
      const response = await cartService.applyCoupon(code);
      if (response.valid) {
        await fetchCart(); // Refresh cart to get updated totals
        toast.success(response.message);
        return response;
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to apply coupon';
      toast.error(errorMsg);
      throw error;
    }
  };

  // NEW: Remove coupon method
  const removeCoupon = async () => {
    try {
      const response = await cartService.removeCoupon();
      await fetchCart(); // Refresh cart to get updated totals
      toast.success(response.message || 'Coupon removed');
      return response;
    } catch (error) {
      toast.error('Failed to remove coupon');
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        applyCoupon,    // NEW
        removeCoupon,   // NEW
      }}
    >
      {children}
    </CartContext.Provider>
  );
};