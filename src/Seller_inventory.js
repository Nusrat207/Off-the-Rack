import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seller_Home from './Seller_nav_side'
import './inven.css'

const ProductCard = ({ product }) => (
    <div className="itemflip-card">
        <div className="itemflip-card-inner">
            <div className="itemflip-card-front">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="img-container" style={{ flex: '1', marginLeft:'4px' }}>
                        <img 
                            src={product.img} 
                            alt={product.product_name} 
                            style={{ width: '200px', height: '240px', objectFit: 'cover' }} 
                            onError={(e) => e.target.src = 'https://via.placeholder.com/100'} 
                        />
                    </div>
                    <div style={{ flex: '2', paddingLeft: '10px' }}>
                        <p className="itemtitle">{product.product_name}</p>
                        <p className='itemtitle2'>Tk. {product.price}</p>
                        <p className='itemtitle2'> Category: {product.category}</p>
                        <p className='itemtitle2'>Subcategory: {product.subcategory}</p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
);


export default function Seller_inventory() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const seller_name = localStorage.getItem('seller_name');
            try {
                const response = await axios.get('http://localhost:5000/products', {
                    params: { seller_name }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);
  return (
    <div >
        <Seller_Home/>
        <div className="product-grid">
            {products.map((product, index) => (
                <ProductCard key={index} product={product} />
            ))}
        </div>
    </div>
  )
}
