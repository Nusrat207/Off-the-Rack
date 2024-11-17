import React, { useState, useEffect } from 'react';
import styles from './sidebar.module.css';

import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

import Seller_Menu from './Seller_nav_side';

export default function Seller_Home() {

    const [isEditing, setIsEditing] = useState(false); 

    //dummy data for now. data will be fetched from db
    const [sellerInfo, setSellerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleEditClick = () => setIsEditing(!isEditing);  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSellerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // Later: Save updated info to the database here
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
    
    return (
        <div style={{paddingTop:'80px'}}>
            <div>
                <Seller_Menu/>
            </div>
           
             <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                 
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Shop/Business: {sellerInfo.name}</h1>
              
                   <div style={{
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '30px',
                            position: 'relative',
                            backgroundColor:'white'
                        }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '14px', fontWeight:'bold' }}>Profile</h2>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Email: </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="email"
                                        value={sellerInfo.email}
                                        onChange={handleChange}
                                        style={{ padding: '5px', width: '100%' }}
                                    />
                                ) : (
                                    <span>{sellerInfo.email}</span>
                                )}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Phone: </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={sellerInfo.phone}
                                        onChange={handleChange}
                                        style={{ padding: '5px', width: '100%' }}
                                    />
                                ) : (
                                    <span>{sellerInfo.phone}</span>
                                )}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Pickup Address: </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={sellerInfo.address}
                                        onChange={handleChange}
                                        style={{ padding: '5px', width: '100%' }}
                                    />
                                ) : (
                                    <span>{sellerInfo.address}</span>
                                )}
                            </div>
                            
                            <button
                                onClick={isEditing ? handleSave : handleEditClick}
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: '#333',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                {isEditing ? "Save" : "Edit"}
                            </button>
                        </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ flex: 1, padding: '20px', borderRadius: '8px', backgroundColor: '#d4f4dd', textAlign: 'center', color: '#333', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Completed Orders</h2>
                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>XX Orders</p>
                        </div>
                        <div style={{ flex: 1, padding: '20px', borderRadius: '8px', backgroundColor: '#fff4c4', textAlign: 'center', color: '#333', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>On Shipment</h2>
                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>XX Orders</p>
                        </div>
                        <div style={{ flex: 1, padding: '20px', borderRadius: '8px', backgroundColor: '#fde4e1', textAlign: 'center', color: '#333', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Pending Orders</h2>
                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>XX Orders</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Notifications</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f8f8f8', fontWeight: 'bold', textAlign: 'left' }}>Order ID</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f8f8f8', fontWeight: 'bold', textAlign: 'left' }}>Message</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f8f8f8', fontWeight: 'bold', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '16px' }}>#12345</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '16px' }}>New order placed by Customer A</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '16px' }}>Not Checked</td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '16px' }}>#12346</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '16px' }}>New order placed by Customer B</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '16px' }}>Not Checked</td>
                                </tr>
                           
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    );
};
