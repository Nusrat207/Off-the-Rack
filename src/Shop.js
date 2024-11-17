import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './shopp.css';
import Footerr from './Footerr';
import Shop_header from './Shop_header';
export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/all-products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div>
       <Shop_header />
      
      <div className="container" style={{ backgroundColor:'transparent',marginTop: '20px', position: 'relative', zIndex: 1 }}>
        <div className="row" style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          {products.map((product, index) => (
            <div className="col-12 col-md-6 col-lg-2" key={index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <Footerr/>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div style={{ paddingRight:'50px',
            width: '230px', height: '322px', borderRadius: '0', display: 'flex',
      flexDirection: 'column', alignItems: 'center', overflow: 'hidden', justifyContent: 'center',
      boxShadow: '10px 10px 30px #e6e6e6, -10px -10px 30px #ffffff', background: '#fff'
    }}>
      <img 
        src={product.img} 
        className="card-img-top" 
        alt={product.product_name} 
        style={{ height: "235px", objectFit: "cover" }} 
      />
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card-title" style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {product.product_name}
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#ab0965', fontWeight: 'bold' }}>
          Tk {product.base_price}
        </div>
      </div>
    </div>
  );
}
