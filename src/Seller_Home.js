import React, { useState, useEffect } from 'react';
import styles from './sidebar.module.css';

import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Notif from './img/notiff.gif'
import Comp from './img/comp.png'
import Pend from './img/pendd.png'
import Ship from './img/ship.png'
import Seller_Menu from './Seller_nav_side';

export default function Seller_Home() {
    const [isEditing, setIsEditing] = useState(false);

    const [sellerInfo, setSellerInfo] = useState({
        name: '', email: '', phone: '', address: ''
    });

    const handleEditClick = () => setIsEditing(!isEditing);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSellerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    const handleSave = async () => {
        setIsEditing(false);
        try {
            const shopName = localStorage.getItem('seller_name');
            console.log("here", shopName);
            if (!shopName) {
                throw new Error("Shop name not found in localStorage");
            }

            console.log("here calling axios");

            const response = await axios.post('http://localhost:5000/update_seller', {
                shop_name: shopName,
                sellerInfo,
            });

            console.log("here after axios");

            if (response.status === 200) {
                alert('Seller information updated successfully!');
            } else {
                alert('Failed to update seller information. Please try again.');
            }
        } catch (error) {
            console.error('Error updating seller information:', error);
            alert('An error occurred while updating the information.');
        }
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSellerInfo = async () => {
            try {
                const email = localStorage.getItem('seller_mail');

                if (!email) {
                    throw new Error('Seller email is not available in local storage.');
                }
                const response = await axios.get('http://localhost:5000/seller-info', {
                    params: { email },
                });
                const { shop_name, email: sellerEmail, phone, address } = response.data;

                setSellerInfo({
                    name: shop_name,
                    email: sellerEmail,
                    phone,
                    address,
                });
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        };

        fetchSellerInfo();
    }, []);

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const sellerName = localStorage.getItem("seller_name");
                if (!sellerName) {
                    console.error("Seller name not found in localStorage!");
                    return;
                }


                const response = await axios.post('http://localhost:5000/getNotif', { seller: sellerName });
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);
    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const removeNotification = async (orderId) => {
        try {
            await axios.post('http://localhost:5000/removeNotif', { order_id: orderId });
            setNotifications((prev) => prev.filter((notif) => notif.order_id !== orderId));
        } catch (error) {
            console.error("Error removing notification:", error);
        }
    };

    const toggleStatus = async (orderId, currentStatus) => {
        try {
            const newStatus = currentStatus === "not checked" ? "checked" : "not checked";


            await axios.post('http://localhost:5000/update-status', { order_id: orderId, status: newStatus });


            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) =>
                    notif.order_id === orderId ? { ...notif, status: newStatus } : notif
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const [counts, setCounts] = useState({
        pending: 0,
        shipped: 0,
        completed: 0,
    });

    useEffect(() => {
        const sellerName = localStorage.getItem('seller_name'); // Get seller name from localStorage

        if (sellerName) {
            axios
                .post('http://localhost:5000/api/statusCounts', { seller: sellerName })
                .then((response) => {
                    setCounts(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching status counts:', error);
                });
        }
    }, []);


    return (
        <div style={{ paddingTop: '80px' }}>
            <div>
                <Seller_Menu />
            </div>
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>

                <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Shop/Business: {sellerInfo.name}</h1>

                <div style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px',
                    position: 'relative',
                    backgroundColor: 'white'
                }}>

                    <div style={{ marginBottom: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', }}>Email: </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="email"
                                value={sellerInfo.email}
                                onChange={handleChange}
                                style={{ width: '100%', fontSize: '14px' }}
                            />
                        ) : (
                            <span style={{ fontSize: '15px', paddingRight: '150px' }}>{sellerInfo.email}</span>
                        )}

                        <label style={{ fontSize: '14px', fontWeight: 'bold', }}>Phone: </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone"
                                value={sellerInfo.phone}
                                onChange={handleChange}
                                style={{ width: '100%', fontSize: '14px' }}
                            />
                        ) : (
                            <span style={{ fontSize: '15px', paddingRight: '150px' }}>{sellerInfo.phone}</span>
                        )}
                        <label style={{ fontSize: '14px', fontWeight: 'bold', }}>Pickup Address: </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address"
                                value={sellerInfo.address}
                                onChange={handleChange}
                                style={{ width: '100%', fontSize: '14px' }}
                            />
                        ) : (
                            <span style={{ fontSize: '15px' }}>{sellerInfo.address}</span>
                        )}
                    </div>



                    <button
                        onClick={isEditing ? handleSave : handleEditClick}
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            padding: '4px 8px',
                            backgroundColor: '#2393d9',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        {isEditing ? "Save" : "Edit"}
                    </button>
                </div>

                <div style={{ 
    display: 'flex', 
    gap: '20px', 
    marginBottom: '40px',
    justifyContent: 'space-between'
}}>
    {/* Completed Orders Card */}
    <div style={{ 
        flex: 1,
        padding: '25px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #d4f4dd,rgb(188, 251, 228))',
        color: '#333',
        boxShadow: '0 6px 15px rgba(0, 100, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0, 100, 0, 0.15)'
        }
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px'
            }}>
                <img src={Comp} style={{ width: '30px', filter: 'brightness(0.7)' }} />
            </div>
            <h3 style={{ 
                fontSize: '18px', 
                marginBottom: '12px',
                fontWeight: '600',
                color: '#2d7d5a'
            }}>Completed Orders</h3>
            <p style={{ 
                fontSize: '24px',
                fontWeight: '700',
                margin: 'auto 0 0 0',
                color: '#1a3e2c'
            }}>{counts.completed}</p>
        </div>
    </div>

    {/* On Shipment Card */}
    <div style={{ 
        flex: 1,
        padding: '25px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #fff4c4,rgb(251, 222, 157))',
        color: '#333',
        boxShadow: '0 6px 15px rgba(255, 180, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(255, 180, 0, 0.15)'
        }
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px'
            }}>
                <img src={Ship} style={{ width: '30px', filter: 'brightness(0.7)' }} />
            </div>
            <h3 style={{ 
                fontSize: '18px', 
                marginBottom: '12px',
                fontWeight: '600',
                color: '#b38b00'
            }}>On Shipment</h3>
            <p style={{ 
                fontSize: '24px',
                fontWeight: '700',
                margin: 'auto 0 0 0',
                color: '#5c4700'
            }}>{counts.shipped}</p>
        </div>
    </div>

    {/* Pending Orders Card */}
    <div style={{ 
        flex: 1,
        padding: '25px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #fde4e1,rgb(254, 177, 166))',
        color: '#333',
        boxShadow: '0 6px 15px rgba(255, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(255, 0, 0, 0.15)'
        }
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px'
            }}>
                <img src={Pend} style={{ width: '30px', filter: 'brightness(0.7)' }} />
            </div>
            <h3 style={{ 
                fontSize: '18px', 
                marginBottom: '12px',
                fontWeight: '600',
                color: '#c44536'
            }}>Pending Orders</h3>
            <p style={{ 
                fontSize: '24px',
                fontWeight: '700',
                margin: 'auto 0 0 0',
                color: '#7a2c1d'
            }}>{counts.pending}</p>
        </div>
    </div>
</div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '21px', marginBottom: '15px', fontWeight: 'bold', textShadow: '0.5px 0.5px 0.5px #000000' }}>

                        Order Dashboard <img src={Notif} style={{ width: '25px' }} /> </h3>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid #ddd", padding: "12px", backgroundColor: "#f8f8f8", fontWeight: "bold", textAlign: "left" }}>Order ID</th>

                                <th style={{ border: "1px solid #ddd", padding: "12px", backgroundColor: "#f8f8f8", fontWeight: "bold", textAlign: "left" }}>Date</th>
                                <th style={{ border: "1px solid #ddd", padding: "12px", backgroundColor: "#f8f8f8", fontWeight: "bold", textAlign: "left" }}>
                                    Status
                                    <label style={{fontSize:'12px', fontWeight:'150', fontStyle:'italic', paddingLeft:'10px'}}>[Click to change]</label>
                                    </th>
                                <th style={{ border: "1px solid #ddd", padding: "12px", backgroundColor: "#f8f8f8", fontWeight: "bold", textAlign: "left" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length > 0 ? (
                                notifications.slice().reverse().map((notif, index) => (
                                    <tr key={notif.order_id}>
                                        <td style={{ border: "1px solid #ddd", padding: "12px", fontSize: "16px" }}>{notif.order_id}</td>

                                        <td style={{ border: "1px solid #ddd", padding: "12px", fontSize: "16px" }}>{formatDate(notif.order_time)}</td>
                                        {/*  <td style={{ border: "1px solid #ddd", padding: "12px", fontSize: "16px" }}>{notif.status}</td> */}
                                        <td style={{ border: "1px solid #ddd", padding: "12px", fontSize: "16px" }}>
                                            <button
                                                onClick={() => toggleStatus(notif.order_id, notif.status)}
                                                style={{
                                                    backgroundColor: notif.status === "not checked" ? "#ff4d4d" : "#4caf50",
                                                    color: "#fff",
                                                    padding: "5px 10px",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {notif.status}
                                            </button>
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: "12px", fontSize: "16px" }}>
                                            <button onClick={() => removeNotification(notif.order_id)} style={{ borderColor: "red", borderWidth: '2px', backgroundColor: 'white', borderRadius: '10px', color: "maroon", padding: "5px 10px", cursor: "pointer" }}>
                                                Remove 
                                            </button>
                                        </td>
                                        {index === 0 && (
                                            <td
                                                rowSpan={notifications.length}
                                                style={{
                                                    border: "1px solid #ddd",
                                                    padding: "12px",
                                                    textAlign: "center",
                                                    verticalAlign: "middle",

                                                }}
                                            >
                                                <Link
                                                    to="/seller_order"
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "#007bff",
                                                        fontWeight: "bold",
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    Navigate to Orders Page <br/> for Details
                                                </Link>
                                            </td>
                                        )}
                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
                                        No notifications available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

