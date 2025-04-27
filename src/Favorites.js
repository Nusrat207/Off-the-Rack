import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

export default function Favorites() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userMail = localStorage.getItem('user_mail');
        const response = await axios.get('http://localhost:5000/all-favProducts', {
          params: { user_mail: userMail }
        });

        const productsData = response.data.products;
        const productSizeData = response.data.product_size_qty;

        const updatedProducts = productsData.map(product => {
          const sizeQty = productSizeData
            .filter(item => parseInt(item.product_id) === product.id)
            .map(item => ({ size: item.sizee, quantity: item.quantity }));

          return {
            ...product,
            size_qty: sizeQty,
          };
        });

        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error fetching fav products:', error);
      }
    };

    fetchProducts();
  }, []);

  

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px', minHeight: '100vh', background: '#f9f9f9' }}>
        <div className="row" style={{ display: 'flex', gap: '80px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.map((product) => (
            <div className="col-6 col-sm-4" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };
  const handleRemoveFromFav = async (productId) => {
    const user_mail = localStorage.getItem('user_mail');

    try {
      await axios.post('http://localhost:5000/api/remove-from-favorites', {
        user_mail,
        product_id: productId,
      });
      //alert("item removed from favs!");
      window.location.reload();
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };
  return (
    <motion.div
      onClick={handleProductClick}
      whileHover={{ scale: 1.02, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        width: '500px',
        height: '160px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        padding: '10px',
        border: '1px solid #ececec',
      }}
    >
      {/* Favorite icon (decorative) */}
      <FaHeart
        size={20}
        color="#ff3e6c"
        style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.7 }}
        onClick={() => handleRemoveFromFav(product.id)}
      />

      {/* Product Image */}
      <img
        src={product.img}
        alt={product.product_name}
        style={{
          width: '120px',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '12px',
        }}
      />

      {/* Product Info */}
      <div
        style={{
          flex: 1,
          marginLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontWeight: '600',
            fontSize: '18px',
            color: '#222',
            marginBottom: '8px',
          }}
        >
          {product.product_name}
        </div>

        <div style={{ color: '#ab0965', fontSize: '16px', fontWeight: 'bold' }}>
          {product.discount > 0 ? (
            <>
              Tk {(product.base_price * (1 - product.discount / 100)).toFixed(2)}
              <br />
              <span style={{ textDecoration: 'line-through', fontSize: '13px', color: '#999' }}>
                Tk {product.base_price}
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}> (-{product.discount}%)</span>
            </>
          ) : (
            <>Tk {product.base_price}</>
          )}
        </div>
      </div>
    </motion.div>
  );
}
