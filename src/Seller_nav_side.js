import React, { useState, useEffect } from 'react';
import styles from './sidebar.module.css';

import { Link, useNavigate } from 'react-router-dom'
import Menu from './img/menu.png'
import Close from './img/x.png'
import Home from './img/homeicon.png'
import Products from './img/inventory.png'
import Add from './img/carticon.png'
import Order from './img/ordericon.png'
import Review from './img/review.png'

import Logout from './img/logoutt.png'
import Acc from './img/userr.png'
import Logoo from './img/logo2.jpg'
export default function Seller_Menu() {
    useEffect(() => {
        const authToken = localStorage.getItem('seller_authToken');
        if (authToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    let navigate = useNavigate();

    const handleLogout = () => {
        navigate("/sellerAcc");
        localStorage.removeItem('seller_authToken');
        setIsLoggedIn(false);

    }

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <header className={styles.header}>
                        <div className={styles.header_in} onClick={toggleSidebar}>
                            <img src={isSidebarOpen ? Close : Menu} alt="toggle icon" className={styles.toggleImage} />

                        </div>
                        <div className="logo" style={{ marginTop: "0px" }}>
                            <img src={Logoo} style={{ height: '47px' }} alt="settings" />
                        </div>

                    </header>

                    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarshow : ''}`} id='sidebar'>
                        <ul>
                            <li style={{ paddingBottom: '6px' }}><Link to="/sellerHome">  <img src={Home} style={{ width: '26px', paddingRight: '7px' }} /> Home</Link></li>
                            <li style={{ paddingBottom: '6px' }}><Link to="/sellerInventory"> <img src={Products} style={{ width: '26px', paddingRight: '7px' }} /> Products</Link></li>
                            <li style={{ paddingBottom: '6px' }}><Link to="/addItem">  <img src={Add} style={{ width: '26px', paddingRight: '7px' }} /> Add Products</Link></li>
                            <li style={{ paddingBottom: '6px' }}><Link to="/seller_order">  <img src={Order} style={{ width: '26px', paddingRight: '7px' }} /> Orders</Link></li>
                            <li style={{ paddingBottom: '6px' }}><Link to="/sell_review">  <img src={Review} style={{ width: '26px', paddingRight: '7px' }} /> Reviews</Link></li>

                            <li style={{ paddingBottom: '6px' }}><Link onClick={handleLogout} to="/sellerAcc">  <img src={Logout} style={{ width: '29px', paddingRight: '4px' }} /> Logout</Link></li>

                        </ul>
                    </div>
                </div>

                
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#fed5ed'
                }}>
                    <img src={Logoo} style={{ height: '150px', paddingBottom: '20px' }} alt="logo" />
                    <p style={{ fontSize: '25px', fontWeight: 'bold', color: '#3d0324' }}> Please Login First ⬇ </p>
                    <Link style={{ fontSize: '20px', fontWeight: 'bold', fontStyle: 'italic' }} to="/sellerAcc">Login</Link>
                </div>
            )}

            
        </div>
    );
};
