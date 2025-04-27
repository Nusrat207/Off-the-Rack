import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import Bag from './img/bag.png';
import Cartt from './img/cartt.png';
import Home from './img/homee.png';
import Wish from './img/wishh.png';
import Order from './img/orderr.png';
import SignupIcon from './img/regis.png';
import Modal from './Modal';
import User from './img/user.png';
import Logoo from './img/logo1.jpg';
import Logout from './img/logout.png';
import Edit from './img/edit.png';
import Cod from './img/cod.png';
import Bkash from './img/bkash.png';
import Setting from './img/profile_settings.png';
import axios from 'axios';
import './Cart.css'
export default function Cart() {
    const authToken = localStorage.getItem('authToken');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const [cartItems, setCartItems] = useState([]);
    const [userMail, setUserMail] = useState(localStorage.getItem('user_mail'));
    const [totalProd, setTotalProd] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (userMail) {
            fetchCartItems();
        }
    }, [userMail]);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/cart?user_mail=${userMail}`);
            setCartItems(response.data);

        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };


    useEffect(() => {
        let items = 0;
        let price = 0;

        cartItems.forEach(product => {
            items += product.quantity;
            price += product.price;
        });

        setTotalProd(items);
        setTotalPrice(price);
    }, [cartItems]);


    const handleDelete = async (timestamp) => {
        try {
            await axios.delete(`http://localhost:5000/cart/${timestamp}`);

            // setCartItems(cartItems.filter(item => item.timestamp !== timestamp));
            navigate('/cart');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        paymentMethod: "",
        trxId: "",
    });

    const handleCheckout = () => {
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmOrder = async () => {
        setIsLoading(true);
      
        const payload = {
          cartItems,
          customerDetails: {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            paymentMethod: formData.paymentMethod,
            trxId: formData.paymentMethod === "bkash" ? formData.trxId : null,
          },
        };
      
        try {
          const response = await axios.post("http://localhost:5000/checkout", payload);
      
          if (response.status === 200) {
            setCheckoutMessage("Order confirmed!");
            setIsModalOpen(false);
            navigate("/cart");
            window.location.reload();
          } else {
            setCheckoutMessage("Order confirmation failed. Please try again.");
          }
        } catch (error) {
          console.error("Error during order confirmation:", error);
      
         
          if (error.response && error.response.data && error.response.data.error) {
            setIsModalOpen(false);
            alert(error.response.data.error); // show backend message (e.g. stock issue)
          } else {
            setCheckoutMessage("An error occurred. Please try again later.");
          }
        } finally {
          setIsLoading(false);
        }
      };
      

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="navbar-container">
                <div className="logo" style={{ paddingRight: '0px' }}>
                    <img src={Logoo} style={{ height: '40px' }} alt="settings" />
                </div>


                <div className="nav-links">
                    <Link to="/home">
                        <img src={Home} style={{ width: '22px' }} alt="home" /> Home
                    </Link>
                    <Link to="/shop">
                        <img src={Bag} style={{ width: '22px' }} alt="Shopping Bag" />
                        Shop
                    </Link>
                    <Link to="/cart">
                        <img src={Cartt} style={{ width: '23px' }} alt="cart" /> Cart
                    </Link>
                    {authToken ? (
                        <>
                            <div className="dropdown">
                                <button onClick={toggleDropdown} className="dropbtn" data-toggle="tooltip" data-placement="top" title="ACCOUNT">
                                    <img src={Setting} style={{ width: '24px' }} alt="settings" />
                                    Account
                                </button>
                                {isOpen && (
                                    <ul className="dropdown-content">
                                        <li><Link to="/myProfile"> <img src={User} style={{ width: '24px' }} alt="user" />  My profile</Link></li>
                                        <li><Link to="/edit-profile"> <img src={Edit} style={{ width: '24px' }} alt="edit" />  Edit profile</Link></li>
                                        <li><Link to="/myOrders"> <img src={Order} style={{ width: '24px' }} alt="order" />  Order history</Link></li>
                                        <li><Link to="/wishlist"> <img src={Wish} style={{ width: '24px' }} alt="order" /> Wishlist/Favorites</Link></li>
                                        <li><Link onClick={handleLogout} to="/"> <img src={Logout} style={{ width: '24px' }} alt="order" /> Log out</Link></li>
                                    </ul>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/"> <img src={SignupIcon} style={{ width: '20px' }} alt="user" />  Login | Signup</Link>
                        </>
                    )}
                </div>

                {authToken ? (<></>) : (
                    <Link
                        to="/sellerAcc"
                        style={{
                            color: 'black',
                            textDecoration: 'none',
                            border: '1px solid black',
                            padding: '2px 2px',
                            borderRadius: '3px',
                            transition: 'color 0.2s, textDecoration 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = 'blue';
                            e.target.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = 'black';
                            e.target.style.textDecoration = 'none';
                        }}
                    >
                        Join as Seller
                    </Link>
                )}
            </div>

            <div className="cart-page-container">
                <h2>Your Cart</h2>
                
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven't added anything to your cart yet</p>
                        <Link to="/shop" className="shop-btn">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product Name</th>
                                    <th>Size</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Price</th>
                                    <th>Seller</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img src={item.img} alt={item.product_name} width="200px" />
                                        </td>
                                        <td>{item.product_name}</td>
                                        <td>{item.sizee}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price/item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{item.seller}</td>
                                        <td>
                                            <button onClick={() => handleDelete(item.timestamp)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{paddingTop:'20px', paddingBottom:'15px'}}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: '#f8f9fa',
                                padding: '20px 20px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                width: '400px',
                                margin: 'auto'
                            }}>
                                <h4 style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginBottom: '15px'
                                }}>
                                    Cart Summary
                                </h4>
                                <div style={{
                                    fontSize: '18px',
                                    color: '#555',
                                    marginBottom: '10px'
                                }}>
                                    Total Items in Cart: <span style={{ fontWeight: 'bold', color: '#007bff' }}>{totalProd}</span>
                                </div>
                                <div style={{
                                    fontSize: '18px',
                                    color: '#555'
                                }}>
                                    Total Price: <span style={{ fontWeight: 'bold', color: '#28a745' }}>৳{totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-actions">
                            <button style={{fontSize:'18px', fontWeight:'550', marginTop:'15px'}} onClick={handleCheckout} disabled={isLoading || totalProd <= 0}>
                                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                            {checkoutMessage && <p>{checkoutMessage}</p>}
                        </div>
                    </>
                )}

                {isModalOpen && (
                    <div
                        style={{
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: "1000",
                        }}
                    >
                        <div
                            style={{
                                width: "400px",
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <button
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "transparent",
                                    border: "none",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                }}
                                onClick={closeModal}
                            >
                                ✖
                            </button>
                            <h2 style={{ marginBottom: "15px" }}>Delivery Information</h2>
                            <input
                                style={{ marginBottom: "10px", padding: "8px" }}
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                            <input
                                style={{ marginBottom: "10px", padding: "8px" }}
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                            <textarea
                                style={{ marginBottom: "10px", padding: "8px" }}
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                            ></textarea>

                            <h3 style={{ marginBottom: "10px" }}>Payment Process</h3>
                            <div style={{ marginBottom: "10px" }}>
                                <label style={{ marginRight: "10px" }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={formData.paymentMethod === "cash"}
                                        onChange={handleInputChange}
                                    />
                                    Cash on Delivery
                                    <img src={Cod} style={{ height: '30px', paddingRight:'15px' }} alt="cod" />
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bkash"
                                        checked={formData.paymentMethod === "bkash"}
                                        onChange={handleInputChange}
                                    />
                                    bKash
                                    <img src={Bkash} style={{ height: '40px' }} alt="bkash" />
                                </label>
                            </div>
                            {formData.paymentMethod === "bkash" && (
                                <div style={{ marginBottom: "10px" }}>
                                    <p style={{ marginBottom: "5px" }}>Send to: 017XXXXXXXX</p>
                                    <input
                                        style={{ marginBottom: "10px", padding: "8px" }}
                                        type="text"
                                        name="trxId"
                                        placeholder="Enter TRX ID"
                                        value={formData.trxId}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            <button
                                style={{
                                    backgroundColor: "#007BFF",
                                    color: "white",
                                    padding: "10px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={handleConfirmOrder}
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add the empty cart styles */}
            <style jsx>{`
                .empty-cart {
                    text-align: center;
                    padding: 50px 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    margin-top: 30px;
                }
                
                .empty-cart-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                }
                
                .empty-cart h3 {
                    color: #333;
                    margin-bottom: 10px;
                }
                
                .empty-cart p {
                    color: #666;
                    margin-bottom: 20px;
                }
                
                .shop-btn {
                    display: inline-block;
                    padding: 10px 25px;
                    background-color: #660640;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                .shop-btn:hover {
                    background-color: #4d0530;
                }
            `}</style>
        </div>
    )
}