import { CardContent, CardMedia, Button, Typography, Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api, token } from "../api/axiosInstance";
import Spinner from '../components/spinner';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/e-bar-store")
      .then((res) => {
        let productsArr = [];
        if (Array.isArray(res.data.ECommerceBars)) {
          productsArr = res.data.ECommerceBars;
        }
        setProducts(productsArr);
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (id) => {
    try {
      await api.post("/cart/store", { bar_id: id, action: "INCREMENT", token });
      alert("Added to cart");
    } catch {
      alert("Failed to add to cart");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 min-h-screen">
      <Typography variant="h4" className="mb-8 font-bold text-center text-yellow-900">
        Gold Bars Store
      </Typography>
      <div className="w-full overflow-x-auto">
        <div className="flex flex-nowrap space-x-6 pb-4">
          {products.map((product, idx) => (
            <Card
              key={product.id || idx}
              className="min-w-[320px] shadow-xl transition-transform hover:scale-105 border border-yellow-200 flex-shrink-0"
              style={{ background: "#fffbe6" }}
            >
              <CardMedia
                component="img"
                height="220"
                image={product.image || "https://via.placeholder.com/220"}
                alt={product.name?.en || product.name?.ar || "No Name"}
                style={{ objectFit: "contain", background: "#fffde7" }}
              />
              <CardContent>
                <Typography variant="h6" className="font-semibold text-yellow-800">
                  {product.name?.en || product.name?.ar || "No Name"}
                </Typography>
                <Typography variant="body2" className="text-yellow-700">
                  Maker: {product.maker ?? "N/A"}
                </Typography>
                <Typography variant="body2" className="text-yellow-700">
                  Karat: {product.karat ?? "N/A"} | Fineness: {product.fineness ?? "N/A"}%
                </Typography>
                <Typography variant="body2" className="text-yellow-700">
                  Weight: <span className="font-bold">{product.weight ?? "N/A"} g</span>
                </Typography>
                <Typography variant="body2" className="text-yellow-700">
                  Gold Price: <span className="font-bold">{product.gold_price?.toLocaleString() ?? "N/A"} EGP</span>
                </Typography>
                <Typography variant="body2" className="text-yellow-700">
                  Making Charge: <span className="font-bold">{product.making_charge?.toLocaleString() ?? "N/A"} EGP</span>
                </Typography>
                <Typography variant="body2" className="text-yellow-700 mb-2">
                  Total: <span className="font-bold text-yellow-900">{product.total?.toLocaleString() ?? "N/A"} EGP</span>
                </Typography>
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  variant="contained"
                  color="warning"
                  className="mt-2 w-full"
                  style={{ background: "#fbc02d", color: "#fff", fontWeight: "bold" }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Button
          variant="outlined"
          onClick={() => navigate("/cart")}
          className="mt-4"
          style={{ borderColor: "#fbc02d", color: "#b8860b", fontWeight: "bold" }}
        >
          Go to Cart
        </Button>
      </div>
    </div>
  );
}

export default Store;