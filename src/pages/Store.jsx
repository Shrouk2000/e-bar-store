import { CardContent, CardMedia, Button, Typography, Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api, token } from "../api/axiosInstance";
import Spinner from '../components/spinner';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/e-bar-store")
      .then((res) => {
        setProducts(res.data);
        // console.log("Fetched products:", res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (id) => {
    await api.post("/cart/store", { bar_id: id, action: "INCREMENT", token });
    alert("Added to cart");
  };

  if (loading) return <Spinner />;  // show spinner while loading

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="shadow-lg">
          <CardMedia
            component="img"
            height="200"
            image={product.image}
            alt={product.name}
          />
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2">${product.price}</Typography>
            <Button onClick={() => handleAddToCart(product.id)} variant="contained" className="mt-2">
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outlined" onClick={() => navigate("/cart")} className="mt-4">
        Go to Cart
      </Button>
    </div>
  );
}

export default Store;
