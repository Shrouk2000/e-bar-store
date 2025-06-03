import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { api, token } from '../../api/axiosInstance';
import Spinner from '../../components/spinner';
import './CartPage.css';

function Cart() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  // Load cart items
  const loadCartItems = async () => {
    try {
      const res = await api.get(`/cart/index?token=${token}`);
      const cartItems = res?.data?.Cart?.items || [];
      setItems(cartItems);
    } catch (error) {
      console.error("Failed to load cart items:", error);
      setItems([]);
    }
  };

  // Load cart summary (subtotal, total)
  const loadCartSummary = async () => {
    try {
      const res = await api.get(`/cart/prices?token=${token}`);
      setSummary({
        subtotal: res.data.subtotal ?? 0,
        total: res.data.total ?? 0,
      });
    } catch (error) {
      console.error("Failed to load cart summary:", error);
      setSummary({ subtotal: 0, total: 0 });
    }
  };

  // Load both items and summary
  const loadCart = async () => {
    setLoading(true);
    await Promise.all([loadCartItems(), loadCartSummary()]);
    setLoading(false);
  };

  // Cart action handlers
  const handleAction = async (barId, action) => {
    try {
      await api.post("/cart/store", { bar_id: barId, action, token });
      await loadCart();
    } catch (error) {
      console.error("Cart action error:", error.response?.data || error.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await api.get(`/cart/clear-cart?token=${token}`);
      await loadCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="cart-container">
      <Typography variant="h5" gutterBottom>Shopping Cart</Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <div className="cart-grid">
            {items.map((item) => {
              const barId = item.bar?.id;
              const name = item.bar?.name?.en || item.bar?.name?.ar || 'Unnamed';
              const quantity = item.quantity ?? 1;
              const price = item.gold_price ?? 0;
              const makingCharge = item.making_charge ?? 0;
              const total = item.total ?? (price && quantity ? price * quantity : 0);

              return (
                <div key={item.id} className="cart-card">
                  {/* Delete X button*/}
                  <div className="cart-card-header">
                    <Button
                      onClick={() => handleAction(barId, 'DELETE')}
                      color="error"
                      size="small"
                      variant="contained"
                    >
                      X
                    </Button>
                  </div>

                  {/* Product details */}
                  <div className="cart-card-content">
                    <Typography><strong>{name}</strong></Typography>
                    <Typography>Price: {price}</Typography>
                    <Typography>Making Charge: {makingCharge}</Typography>
                    <Typography>Quantity: {quantity}</Typography>
                    <Typography>Total: {total}</Typography>
                  </div>

                  {/* Increment and Decrement buttons */}
                  <div className="cart-card-footer">
                    <Button onClick={() => handleAction(barId, 'INCREMENT')} variant="outlined">+</Button>
                    <Button onClick={() => handleAction(barId, 'DECREMENT')} variant="outlined">-</Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <Typography variant="h6">Subtotal: {summary.subtotal.toLocaleString()} EGP</Typography>
            <Typography variant="h6">Total: {summary.total.toLocaleString()} EGP</Typography>

            <Button onClick={handleClearCart} variant="contained" color="error" className="clear-cart-btn">
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
