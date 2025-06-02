import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { api, token } from '../api/axiosInstance';
import Spinner from '../components/spinner';

function Cart() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/cart/index?token=${token}`);
      setItems(res.data);
      const prices = await api.get(`/cart/prices?token=${token}`);
      setSummary(prices.data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleAction = async (id, action) => {
    await api.post("/cart/store", { bar_id: id, action, token });
    loadCart();
  };

  const handleClearCart = async () => {
    await api.get(`/cart/clear-cart?token=${token}`);
    loadCart();
  };

  if (loading) return <Spinner />;  // use spinner component

  return (
    <div className="p-4">
      <Typography variant="h5">Shopping Cart</Typography>
      {items.length === 0 ? (
        <Typography className="mt-4">Your cart is empty.</Typography>
      ) : (
        items.map((item) => (
          <div key={item.id} className="border-b py-4 flex justify-between items-center">
            <div>
              <Typography>{item.name}</Typography>
              <Typography>Price: ${item.price}</Typography>
              <Typography>Quantity: {item.quantity}</Typography>
              <Typography>Total: ${item.price * item.quantity}</Typography>
            </div>
            <div className="space-x-2">
              <Button onClick={() => handleAction(item.id, "INCREMENT")}>+</Button>
              <Button onClick={() => handleAction(item.id, "DECREMENT")}>-</Button>
              <Button onClick={() => handleAction(item.id, "DELETE")} color="error">X</Button>
            </div>
          </div>
        ))
      )}
      {items.length > 0 && (
        <>
          <div className="mt-4">
            <Typography variant="h6">Subtotal: ${summary.subtotal}</Typography>
            <Typography variant="h6">Total: ${summary.total}</Typography>
          </div>
          <Button onClick={handleClearCart} variant="contained" color="error" className="mt-4">
            Clear Cart
          </Button>
        </>
      )}
    </div>
  );
}

export default Cart;
