import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './nav.css'
import Bag from './img/bag.png'

import Cart from './img/cartt.png'
import Home from './img/homee.png'
import Wish from './img/wishh.png'
import Order from './img/orderr.png'
import SignupIcon from './img/regis.png'

import Modal from './Modal';
import User from './img/user.png'
import Logout from './img/logout.png'
import Edit from './img/edit.png'
import Logoo from './img/logo1.jpg'
import Setting from './img/profile_settings.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function () {
    const [signupModalView, setsignupModalView] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const authToken = localStorage.getItem('authToken');
    let navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate("/");
    };

    const loadSignup = () => {
        setsignupModalView(true)
    }

    return (
        <div className="navbar-container">

            <div className="logo">
                <img src={Logoo} style={{ height: '40px' }} alt="settings" />
            </div>

            <div className="nav-links">
                <Link to="/home">  <img src={Home} style={{ width: '22px' }} alt="home" />  Home</Link>
                <Link to="/shop"> <img src={Bag} style={{ width: '22px' }} alt="Shopping Bag" />
                    Shop</Link>
                <Link to="/cart"><img src={Cart} style={{ width: '23px' }} alt="cart" /> Cart</Link>
                {authToken ? (
                    <>
                        <div className="dropdown">
                            <button onClick={toggleDropdown} className="dropbtn"
                                data-toggle="tooltip" data-placement="top" title="ACCOUNT"
                            >

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
            {authToken ? (<>
            </>) : (<>

          

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
            </>)}
        </div>
    )
}
/*
  <Link onClick={loadSignup} >SIGNUP</Link>
                    {signupModalView? <Modal onClose={() => setsignupModalView(false)}><Signup></Signup></Modal> : ""}
                    <Link to="/login">LOGIN</Link>
*/