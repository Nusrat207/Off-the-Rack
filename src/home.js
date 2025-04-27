
import React, { useState, useEffect } from 'react';
import Footerr from './Footerr.js';
import Navbar from './navbar.js';
import Shop from './img/shop1.svg';
import './buttons.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaArrowLeft, FaFire, FaRegHeart, FaHeart, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [productSizes, setProductSizes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiscountedProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/discounted-products');
                
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
                
                setDiscountedProducts(updatedProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscountedProducts();
    }, []);

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

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === productGroups.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? productGroups.length - 1 : prev - 1));
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId) 
                : [...prev, productId]
        );
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading your fashion finds...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-screen">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    return (
        <div style={{backgroundColor:'white'}}>
            <Navbar />
            
            {/* Hero Section */}
            <motion.div 
                className="hero-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="welcome-container">
                    <div className="welcome-text">
                        <motion.h1 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Discover the Perfect Pieces to Elevate Your Wardrobe
                        </motion.h1>
                        <motion.p
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 0.7 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            A curated collection of fashion, accessories, lifestyle essentials crafted exclusively for women
                        </motion.p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='shop-now'
                            onClick={handleShop}
                        >
                            Shop Now <FaArrowRight style={{ marginLeft: '8px' }} />
                        </motion.button>
                    </div>
                    <motion.div 
                        className="image-container"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <img src={Shop} alt="Woman shopping" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Floating Discount Banner */}
            <motion.div 
                className="floating-discount-banner"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <div className="discount-tag">
                    <FaFire className="fire-icon" />
                    <span>UP TO {Math.max(...discountedProducts.map(p => p.discount))}% OFF</span>
                </div>
                <div>Shop now before it's gone!</div>
               
            </motion.div>

            {/* Hot Deals Section */}
            {discountedProducts.length > 0 ? (
                <div className="hot-deals-section">
                    <div className="section-header">
                        <h2><FaFire className="fire-icon" /> Hot Deals - Limited Time Offers!!</h2>
                        <div className="view-all" onClick={() => navigate('/shop')}>
                            View All <FaArrowRight />
                        </div>
                    </div>
                    
                    <div className="product-carousel">
                        <button className="carousel-control prev" onClick={prevSlide}>
                            <FaArrowLeft />
                        </button>
                        
                        <div className="carousel-track">
                            {productGroups.map((group, groupIndex) => (
                                <div 
                                    key={groupIndex}
                                    className={`product-group ${groupIndex === currentSlide ? 'active' : ''}`}
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {group.map((product) => {
                                        const originalPrice = (product.base_price * 100 / (100 - product.discount)).toFixed(2);
                                        const isWishlisted = wishlist.includes(product.id);
                                        
                                        return (
                                            <motion.div 
                                                key={product.id}
                                                className="product-card"
                                                onClick={() => handleBannerClick(product)}
                                                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="product-badge">
                                                    {product.discount}% OFF
                                                </div>
                                               
                                                <div className="product-image">
                                                    <img 
                                                        src={product.img}
                                                        alt={product.product_name}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="product-info">
                                                    <h3>{product.product_name}</h3>
                                                    <div className="price-container">
                                                        <span className="original-price">Tk {originalPrice}</span>
                                                        <span className="discounted-price">Tk {product.base_price}</span>
                                                    </div>
                                                  
                                                    {product.size_qty && product.size_qty.length > 0 && (
                                                        <div className="available-sizes">
                                                            Sizes: {product.size_qty.map(s => s.size).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        
                        <button className="carousel-control next" onClick={nextSlide}>
                            <FaArrowRight />
                        </button>
                    </div>
                    
                    <div className="carousel-indicators">
                        {productGroups.map((_, index) => (
                            <div 
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-offers">
                    <h3>No special offers available at the moment</h3>
                    <button className="explore-btn" onClick={() => navigate('/shop')}>
                        Explore Our Collection
                    </button>
                </div>
            )}
            
            {/* Additional Sections */}
            <div className="features-section">
                <div className="feature-card">
                    <div className="feature-icon">🚚</div>
                    <h4>Free Shipping</h4>
                    <p>On orders over 1000TK</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">↩️</div>
                    <h4>Easy Returns</h4>
                    <p>30-day return policy</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h4>Secure Payment</h4>
                    <p>100% secure checkout</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📞</div>
                    <h4>24/7 Support</h4>
                    <p>Dedicated support</p>
                </div>
            </div>
            
            <Footerr />
            
            {/* Add this to your CSS */}
            <style jsx>{`
                .hero-container {
                    background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
                    padding: 4em 2em;
                    padding-bottom: 180px;
                    position: relative;
                    overflow: hidden;
                }
                
                .welcome-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    
                }
                
                .welcome-text {
                    flex: 1;
                    padding-right: 2em;
                    text-align: left;
                }
                
                .welcome-text h1 {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                    color: #333;
                    line-height: 1.2;
                }
                
                .welcome-text p {
                    font-size: 1.2rem;
                    opacity: 0.7;
                    margin-bottom: 2rem;
                    max-width: 80%;
                }
                
                .image-container {
                    flex: 1;
                    text-align: center;
                    position: relative;
                }
                
                .image-container img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }
                
                .floating-discount-banner {
                    background: linear-gradient(to right, #ff4d4d, #ff1a75);
                    color: white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    max-width: 600px;
                    margin: -60px auto 60px;
                    position: relative;
                    z-index: 3;
                    box-shadow: 0 10px 30px rgba(255, 77, 77, 0.3);
                    margin-top:50px;
                }
                
                .discount-tag {
                    display: flex;
                    align-items: center;
                    background: white;
                    color: #ff1a75;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                }
                
                .fire-icon {
                    margin-right: 8px;
                }
                
                .hot-deals-section {
                    width: 90%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 60px 0;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                
                .section-header h2 {
                    color: #cc2084;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .view-all {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #cc2084;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                }
                
                .view-all:hover {
                    color: #ff1a75;
                    transform: translateX(5px);
                }
                
                .product-carousel {
                    position: relative;
                    overflow: hidden;
                    margin: 0 auto;
                }
                
                .carousel-track {
                    display: flex;
                    transition: transform 0.5s ease;
                    width: 100%;
                }
                
                .product-group {
                    display: flex;
                    justify-content: space-between;
                    min-width: 100%;
                    gap: 20px;
                    padding: 10px;
                }
                
                .product-card {
                    flex: 1;
                    min-width: 0;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s;
                }
                
                .product-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #ff1a75;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    z-index: 2;
                }
                
                .wishlist-icon {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    color: #ccc;
                    transition: all 0.3s;
                }
                
                .wishlist-icon:hover, .wishlisted {
                    color: #ff1a75;
                }
                
                .product-image {
                    width: 100%;
                    height: 250px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8f9fa;
                }
                
                .product-image img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    transition: transform 0.5s;
                }
                
                .product-card:hover .product-image img {
                    transform: scale(1.05);
                }
                
                .product-info {
                    padding: 15px;
                }
                
                .product-info h3 {
                    font-size: 1rem;
                    margin-bottom: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .price-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                }
                
                .original-price {
                    text-decoration: line-through;
                    color: #999;
                    font-size: 0.9rem;
                }
                
                .discounted-price {
                    color: #ff1a75;
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                
                .rating {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 8px;
                }
                
                .rating .filled {
                    color: #ffc107;
                }
                
                .rating span {
                    font-size: 0.8rem;
                    color: #999;
                }
                
                .available-sizes {
                    font-size: 0.8rem;
                    color: #666;
                }
                
                .carousel-control {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    border: none;
                    cursor: pointer;
                    z-index: 3;
                    transition: all 0.3s;
                }
                
                .carousel-control:hover {
                    background: #f8f9fa;
                    transform: translateY(-50%) scale(1.1);
                }
                
                .prev {
                    left: -20px;
                }
                
                .next {
                    right: -20px;
                }
                
                .carousel-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .indicator {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #ddd;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .indicator.active {
                    background: #ff1a75;
                    transform: scale(1.2);
                }
                
                .features-section {
                    display: flex;
                    justify-content: space-around;
                    max-width: 1200px;
                    margin: 60px auto;
                    padding: 0 20px;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                
                .feature-card {
                    flex: 1;
                    min-width: 200px;
                    background: white;
                    border-radius: 10px;
                    padding: 30px 20px;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    transition: all 0.3s;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                
                .feature-icon {
                    font-size: 2rem;
                    margin-bottom: 15px;
                }
                
                .feature-card h4 {
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .feature-card p {
                    color: #666;
                    font-size: 0.9rem;
                }
                
                .no-offers {
                    text-align: center;
                    padding: 60px 20px;
                    background: #f9f9f9;
                    border-radius: 10px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .no-offers h3 {
                    margin-bottom: 20px;
                    color: #666;
                }
                
                .explore-btn {
                    background: #cc2084;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 30px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .explore-btn:hover {
                    background: #ff1a75;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(204, 32, 132, 0.3);
                }
                
                .loading-screen {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                }
                
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #cc2084;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .error-screen {
                    text-align: center;
                    padding: 100px 20px;
                }
                
                .error-screen h2 {
                    color: #ff1a75;
                    margin-bottom: 20px;
                }
                
                .error-screen button {
                    background: #cc2084;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}