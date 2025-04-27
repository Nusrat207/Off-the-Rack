
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seller_Menu from './Seller_nav_side';
import IconOrder from './img/oorderr.png';
import Navbar from './navbar';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [details, setDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userMail = localStorage.getItem('user_mail');
        setLoading(true);

        if (userMail) {
            axios
                .post('http://localhost:5000/api/orders', { user: userMail })
                .then((response) => {
                    setOrders(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, []);

    const handleViewDetails = (order_id) => {
        setLoading(true);
        axios
            .post('http://localhost:5000/api/myOrderDetails', { order_id })
            .then((response) => {
                setDetails(response.data);
                setShowModal(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
                setError(error.message);
                setLoading(false);
            });
    };

    const closeModal = () => {
        setDetails(null);
        setShowModal(false);
    };

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#FFF0F0', text: '#D14343', border: '#D14343' };
            case 'shipped': return { bg: '#FFF8E6', text: '#E6A902', border: '#E6A902' };
            case 'cancelled': return { bg: '#F5F5F5', text: '#565657', border: '#565657' };
            case 'delivered': return { bg: '#F0FFF4', text: '#039855', border: '#039855' };
            default: return { bg: '#F0F4FF', text: '#363F72', border: '#363F72' };
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <h3>Error loading orders</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    return (
        <div className="order-history-container">
            <Navbar />
            <div className="order-history-content">
                <div className="page-header">
                    <h1 className="page-title">
                        <span>My Orders</span>
                        <img src={IconOrder} alt="Orders" className="order-icon" />
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-icon">📦</div>
                        <h3>No orders yet</h3>
                        <p>Your order history will appear here once you make purchases</p>
                    </div>
                ) : (
                    <div className="orders-table-container">
                        <div className="orders-table-responsive">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={order.order_id} className="order-row">
                                            <td>{index + 1}</td>
                                            <td className="order-id">{order.order_id}</td>
                                            <td className="order-date">{formatDate(order.order_time)}</td>
                                            <td>
                                                <div className="status-badge" style={{
                                                    backgroundColor: getStatusColor(order.status).bg,
                                                    color: getStatusColor(order.status).text,
                                                    borderColor: getStatusColor(order.status).border
                                                }}>
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td>
                                                <button 
                                                    className="view-details-btn"
                                                    onClick={() => handleViewDetails(order.order_id)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {showModal && details && (
                    <div className="order-modal-overlay">
                        <div className="order-modal">
                            <button className="modal-close-btn" onClick={closeModal}>
                                &times;
                            </button>
                            <h2 className="modal-title">Order Details</h2>
                            
                            <div className="order-summary">
                                <div className="summary-item">
                                    <span>Order Total:</span>
                                    <span className="summary-value">৳ {details.totalPrice}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Payment Method:</span>
                                    <span className="summary-value">{details.delivery.payment}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Customer:</span>
                                    <span className="summary-value">{details.delivery.fullname}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Contact:</span>
                                    <span className="summary-value">{details.delivery.phone}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Address:</span>
                                    <span className="summary-value">{details.delivery.address}</span>
                                </div>
                            </div>

                            <div className="order-items-container">
                                <table className="order-items-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Size</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.products.map((product, index) => (
                                            <tr 
                                                key={index} 
                                                className={`order-item ${product.status === 'cancelled' ? 'cancelled-item' : ''}`}
                                            >
                                                <td className="product-cell">
                                                    <div className="product-info">
                                                        <img 
                                                            src={product.img} 
                                                            alt={product.product_name} 
                                                            className="product-image" 
                                                        />
                                                        <div>
                                                            <div className="product-name">{product.product_name}</div>
                                                            {product.status === 'cancelled' && (
                                                                <div className="cancelled-label">
                                                                    Cancelled
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product.sizee}</td>
                                                <td>{product.quantity}</td>
                                                <td>৳ {product.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .order-history-container {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                .order-history-content {
                    padding: 20px 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .page-header {
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: center;
                }
                
                .page-title {
                    display: flex;
                    align-items: center;
                    color: #660640;
                    font-size: 28px;
                    font-weight: 600;
                    text-shadow: 0.5px 0.5px 0.5px rgba(0,0,0,0.1);
                }
                
                .order-icon {
                    width: 40px;
                    margin-left: 15px;
                }
                
                .empty-orders {
                    text-align: center;
                    padding: 50px 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .empty-icon {
                    font-size: 50px;
                    margin-bottom: 20px;
                }
                
                .empty-orders h3 {
                    color: #333;
                    margin-bottom: 10px;
                }
                
                .empty-orders p {
                    color: #666;
                }
                
                .orders-table-container {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    overflow: hidden;
                }
                
                .orders-table-responsive {
                    overflow-x: auto;
                }
                
                .orders-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .orders-table th {
                    padding: 15px;
                    text-align: left;
                    background-color: #f5f5f7;
                    color: #333;
                    font-weight: 600;
                    border-bottom: 2px solid #e1e1e1;
                }
                
                .orders-table td {
                    padding: 15px;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .order-row:hover {
                    background-color: #f9f9f9;
                }
                
                .order-id {
                    font-weight: 500;
                    color: #2d3748;
                }
                
                .order-date {
                    color: #4a5568;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 500;
                    border: 1px solid;
                }
                
                .view-details-btn {
                    background: transparent;
                    color: #3182ce;
                    border: 1px solid #3182ce;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s;
                }
                
                .view-details-btn:hover {
                    background: #ebf5ff;
                }
                
                .order-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                
                .order-modal {
                    background: white;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 25px;
                    position: relative;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                
                .modal-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }
                
                .modal-title {
                    color: #2d3748;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }
                
                .order-summary {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                }
                
                .summary-item {
                    display: flex;
                    flex-direction: column;
                }
                
                .summary-item span:first-child {
                    font-size: 13px;
                    color: #718096;
                    margin-bottom: 5px;
                }
                
                .summary-value {
                    font-weight: 500;
                    color: #2d3748;
                }
                
                .order-items-container {
                    overflow-x: auto;
                }
                
                .order-items-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .order-items-table th {
                    padding: 12px 15px;
                    text-align: left;
                    background-color: #f5f5f7;
                    color: #333;
                    font-weight: 500;
                    font-size: 14px;
                }
                
                .order-items-table td {
                    padding: 15px;
                    border-bottom: 1px solid #f0f0f0;
                    vertical-align: middle;
                }
                
                .product-cell {
                    min-width: 250px;
                }
                
                .product-info {
                    display: flex;
                    align-items: center;
                }
                
                .product-image {
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                    margin-right: 15px;
                    border-radius: 4px;
                    border: 1px solid #eee;
                }
                
                .product-name {
                    font-weight: 500;
                    margin-bottom: 5px;
                }
                
                .cancelled-item {
                    opacity: 0.7;
                    background-color: #fef2f2;
                }
                
                .cancelled-label {
                    font-size: 12px;
                    color: #dc2626;
                    background: #fee2e2;
                    padding: 2px 6px;
                    border-radius: 4px;
                    display: inline-block;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 50vh;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0,0,0,0.1);
                    border-radius: 50%;
                    border-top-color: #660640;
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 15px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .error-container {
                    text-align: center;
                    padding: 50px 20px;
                    background: white;
                    border-radius: 8px;
                    max-width: 500px;
                    margin: 50px auto;
                }
                
                .error-container h3 {
                    color: #dc2626;
                    margin-bottom: 15px;
                }
                
                .error-container button {
                    background: #660640;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 15px;
                }
            `}</style>
        </div>
    );
}