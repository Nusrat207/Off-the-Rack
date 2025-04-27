import React, { useState, useEffect } from 'react';
import Footerr from './Footerr.js';
import Navbar from './navbar.js';
import Shop from './img/shop1.svg';
import './buttons.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiscountedProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/discounted-products');
                setDiscountedProducts(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscountedProducts();
    }, []);

    // Group products into sets of 3 for display
    const groupProducts = (products, size) => {
        return Array.from({ length: Math.ceil(products.length / size) }, (_, i) =>
            products.slice(i * size, i * size + size)
        );
    };

    const productGroups = groupProducts(discountedProducts, 3);

    const handleShop = () => navigate("/shop");

    const handleBannerClick = (product) => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{backgroundColor:'white'}}>
            <Navbar />
            
            <div className="welcome-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2em' }}>
            <div className="welcome-text" style={{ flex: 1, paddingRight: '1em', textAlign: 'center' }}>
                    <h1 style={{ textAlign: 'left', fontSize: '3.5rem', paddingBottom: '40px' }}>Discover the Perfect Pieces to Elevate Your Wardrobe</h1>
                    <p style={{ textAlign: 'left', fontSize: '1.2rem', opacity: '0.5' }}>A curated collection of fashion, accessories, lifestyle essentials crafted exclusively for women</p>
                    <button className='shop-now' onClick={handleShop}>Shop Now</button>
                </div>
                <div className="image-container" style={{ flex: 1, textAlign: 'center' }}>
                    <img src={Shop} alt="Shop" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            </div>
            
            {discountedProducts.length > 0 ? (
                <div style={{ width: '90%', margin: '0 auto', padding: '30px 0' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px',color:'rgb(204, 32, 132)' }}><b>Hot Deals - Limited Time Offers!!</b></h2>
                    
                    <div id="productCarousel" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                            {productGroups.map((_, index) => (
                                <li 
                                    key={index}
                                    data-target="#productCarousel"
                                    data-slide-to={index}
                                    className={index === 0 ? 'active' : ''}
                                />
                            ))}
                        </ol>
                        
                        <div className="carousel-inner">
                            {productGroups.map((group, groupIndex) => (
                                <div key={groupIndex} className={`carousel-item ${groupIndex === 0 ? 'active' : ''}`}>
                                    <div className="d-flex justify-content-around">
                                        {group.map((product) => {
                                            const originalPrice = (product.base_price * 100 / (100 - product.discount)).toFixed(2);
                                            return (
                                                <div 
                                                    key={product.id}
                                                    className="product-banner mx-2"
                                                    onClick={() => handleBannerClick(product)}
                                                    style={{
                                                        width: '30%',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.3s'
                                                    }}
                                                >
                                                    <img 
                                                        src={product.img}
                                                        alt={product.product_name}
                                                        style={{
                                                            width: '100%',
                                                            height: '300px',
                                                            objectFit: 'contain',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f8f9fa'
                                                        }}
                                                    />
                                                    <div style={{ 
                                                        padding: '15px',
                                                        backgroundColor: 'white',
                                                        borderRadius: '0 0 8px 8px'
                                                    }}>
                                                        <h5>{product.product_name}</h5>
                                                        <div>
                                                            <span style={{ textDecoration: 'line-through', color: '#6c757d' }}>
                                                                Tk {originalPrice}
                                                            </span>
                                                            <span style={{ color: '#dc3545', fontWeight: 'bold', marginLeft: '10px' }}>
                                                                Tk {product.base_price} ({product.discount}% OFF)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {productGroups.length > 1 && (
                            <>
                                <a className="carousel-control-prev" href="#productCarousel" role="button" data-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#productCarousel" role="button" data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true" />
                                    <span className="sr-only">Next</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h3>No special offers available at the moment</h3>
                </div>
            )}
            
            <Footerr />
        </div>
    );
}