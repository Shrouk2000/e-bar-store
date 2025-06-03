import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { api, token } from '../api/axiosInstance';
import Spinner from '../components/spinner';

function Cart() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  // Load cart data
  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/cart/index?token=${token}`);
      console.log("Cart API response:", res.data);

      const cartItems = res?.data?.Cart?.items || [];
      const prices = res?.data?.Cart?.prices;

      setItems(cartItems);
      if (prices) {
        setSummary(prices);
      } else {
        const fallbackPrices = await api.get(`/cart/prices?token=${token}`);
        setSummary(fallbackPrices.data);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform action: increment, decrement, delete
  const handleAction = async (barId, action) => {
    console.log("Action triggered:", action, "for bar_id:", barId);

    try {
      const res = await api.post("/cart/store", { bar_id: barId, action, token });
      console.log("Cart action response:", res.data);
      await loadCart();
    } catch (error) {
      if (error.response) {
        console.error("Cart action error:", error.response.data);
      } else {
        console.error("Cart action error:", error.message);
      }
    }
  };

  // Clear all cart items
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
    <div className="p-4">
      <Typography variant="h5" gutterBottom>Shopping Cart</Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
{items.map((item) => {
 
  const barId = item.bar?.id;
  const name = item.bar?.name?.en || item.bar?.name?.ar || 'Unnamed';
  const quantity = item.quantity ?? 1;
  const price = item.gold_price ?? 0;
  const makingCharge = item.making_charge ?? 0;
  const total = item.total ?? (price && quantity ? price * quantity : 0);

  return (
    <div key={item.id} className="border-b py-4 flex justify-between items-center">
      <div>
        <Typography><strong>{name}</strong></Typography>
        <Typography>Price: {price}</Typography>
        <Typography>Making Charge: {makingCharge}</Typography>
        <Typography>Quantity: {quantity}</Typography>
        <Typography>Total: {total}</Typography>
      </div>
      <div className="space-x-2">
        <Button onClick={() => handleAction(barId, 'INCREMENT')}>+</Button>
        <Button onClick={() => handleAction(barId, 'DECREMENT')}>-</Button>
        <Button onClick={() => handleAction(barId, 'DELETE')} color="error">X</Button>
      </div>
    </div>
  );
})}

          <div className="mt-4">
            <Typography variant="h6">Subtotal: {summary.subtotal ?? 'N/A'}</Typography>
            <Typography variant="h6">Total: {summary.total ?? 'N/A'}</Typography>
          </div>

          <Button
            onClick={handleClearCart}
            variant="contained"
            color="error"
            className="mt-4"
          >
            Clear Cart
          </Button>
        </>
      )}
    </div>
  );
}

export default Cart;