import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api, token } from "../../api/axiosInstance";
import Spinner from "../../components/spinner";
import {
  CardContent,
  CardMedia,
  Button,
  Typography,
  Card,
  Snackbar,
  Alert,
} from '@mui/material';
import './StorePage.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error

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
      setSnackbarMsg("Added to cart");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMsg("Failed to add to cart");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="store-container">
      <Typography variant="h4" className="store-title">
        Gold Bars Store
      </Typography>

      <div className="products-grid">
        {products.map((product, idx) => (
          <Card key={product.id || idx} className="product-card">
            <CardMedia
              component="img"
              className="product-image"
              image={product.image || "https://via.placeholder.com/220"}
              alt={product.name?.en || product.name?.ar || "No Name"}
            />
            <CardContent className="product-content">
              <Typography variant="h6" className="product-title">
                {product.name?.en || product.name?.ar || "No Name"}
              </Typography>
              <Typography variant="body2" className="product-text">
                Maker: {product.maker ?? "N/A"}
              </Typography>
              <Typography variant="body2" className="product-text">
                Karat: {product.karat ?? "N/A"} | Fineness: {product.fineness ?? "N/A"}%
              </Typography>
              <Typography variant="body2" className="product-text">
                Weight: <span className="bold">{product.weight ?? "N/A"} g</span>
              </Typography>
              <Typography variant="body2" className="product-text">
                Gold Price: <span className="bold">{product.gold_price?.toLocaleString() ?? "N/A"} EGP</span>
              </Typography>
              <Typography variant="body2" className="product-text">
                Making Charge: <span className="bold">{product.making_charge?.toLocaleString() ?? "N/A"} EGP</span>
              </Typography>
              <Typography variant="body2" className="product-total">
                Total: <span>{product.total?.toLocaleString() ?? "N/A"} EGP</span>
              </Typography>
              <Button
                onClick={() => handleAddToCart(product.id)}
                className="add-to-cart-btn"
                variant="contained"
                color="warning"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="go-to-cart-container">
        <Button
          variant="outlined"
          onClick={() => navigate("/cart")}
          className="go-to-cart-btn"
        >
          Go to Cart
        </Button>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Store;
