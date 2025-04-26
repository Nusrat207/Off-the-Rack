import React, { useState, useEffect } from 'react';
import Navbar from './navbar'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
                .filter(item => {
    
                  return parseInt(item.product_id) === product.id;
                })
                .map(item => ({ size: item.sizee, quantity: item.quantity }));
              return {
                ...product,
                size_qty: sizeQty,
              };
            });
    
            setProducts(updatedProducts);
    
            console.log("Fetched fav Products:", updatedProducts);
          } catch (error) {
            console.error('Error fetching fav products:', error);
          }
        };
        fetchProducts();
      }, []); 
  return (
    <div>
        <Navbar/>
        <div  style={{ padding: '10px', minHeight: '100vh'}}>
          <div className="row" style={{ display: 'flex', gap: '125px', flexWrap: 'wrap', paddingLeft:'150px' }}>
            {products.map((product) => (
              <div className="col-6 col-sm-4" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}



function ProductCard({ product }) {
    const navigate = useNavigate();
  
    const handleProductClick = () => {
      navigate(`/product/${product.id}`, { state: { product } });
      
    };
  
  
    return (
        <div
          onClick={handleProductClick}
          style={{
            width: '500px',
            height: '150px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '10px 10px 30px #e6e6e6, -10px -10px 30px #ffffff',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          {/* Left side: Product Image */}
          <img
            src={product.img}
            alt={product.product_name}
            style={{
              width: '120px',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px 0 0 8px',
            }}
          />
      
          {/* Middle: Product Name */}
          <div
            style={{
              flex: 1,
              maxWidth: '180px',  // Fix width for the name section
              paddingLeft: '0px',  // Space between image and text
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#333',
              whiteSpace: 'normal',  // Allow text to wrap
              overflow: 'hidden',  // Prevent overflow
              textOverflow: 'ellipsis',  // Optional: add ellipsis if the text is too long
            }}
          >
            {product.product_name}
          </div>
      
          {/* Right side: Price */}
          <div
            style={{
              width: '100px',
              paddingRight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              fontSize: '15px',
              color: '#ab0965',
              fontWeight: 'bold',
            }}
          >
            {product.discount > 0 ? (
              <>
                Tk {(product.base_price * (1 - product.discount / 100)).toFixed(2)}
                <br />
                <span style={{ textDecoration: 'line-through', fontSize: '12px', color: '#888' }}>
                  Tk {product.base_price}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}> (-{product.discount}%)</span>
              </>
            ) : (
              <>Tk {product.base_price}</>
            )}
          </div>
        </div>
      );
      
      
  }
  