import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar'
import Footerr from './Footerr'
import { Link, useNavigate } from 'react-router-dom';
import './shopp.css'
import Banner1 from './img/banner1.jpg'
import './nav.css'
import Bag from './img/bag.png'
import Cart from './img/cartt.png'
import Home from './img/homee.png'
import Wish from './img/wishh.png'
import Order from './img/orderr.png'
import SignupIcon from './img/regis.png'

import Modal from './Modal';
import User from './img/user.png'
import Logoo from './img/logo1.jpg'
import Logout from './img/logout.png'
import Edit from './img/edit.png'
import Setting from './img/profile_settings.png'
export default function Shop_header() {
    const authToken = localStorage.getItem('authToken');

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    let navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate("/");
    };
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const categories = {
        Clothes: ['T-Shirt', 'One Piece', 'Three Piece', 'Pant'],
        Jewellery: ['Ring', 'Earring', 'Necklace', 'Bracelet'],
        Footwear: ['Sandal', 'Heels', 'Sneakers'],
        Bags: ['Backpack', 'Handbag'],
    };

    const categoryImages = {
        Clothes: require('./img/dress.png'),
        Jewellery: require('./img/jewel.png'),
        Bags: require('./img/bagg.png'),
        Footwear: require('./img/shoe.png'),

    };

    const handleMouseEnter = (category) => {
        setHoveredCategory(category);
    };

    const handleMouseLeave = () => {
        setHoveredCategory(null);
    };

    return (
        <div>
            <div className="navbar-container">

                <div className="logo" style={{ paddingRight: '0px' }}>
                    <img src={Logoo} style={{ height: '40px' }} alt="settings" />
                </div>
                <div style={{
                    paddingRight: '20px', paddingLeft: '140px',
                }}>
                    <div className="searchbar">
                        <input placeholder="⌕  Search.." id="input" className="searchbar_in" name="text" type="text" />

                    </div>
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
                                    data-toggle="tooltip" data-placement="top" title="ACCOUNT" >

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


            <div style={{ display: 'flex', position: 'relative', padding: '40px' }}>

                <div style={{ width: '20%', height: '500px', border: '1px solid #ccc', padding: '10px', alignContent: 'center', alignItems: 'center', backgroundColor: '#ffedf6', borderRadius: '20px', justifyContent: 'center' }}>
                    <h3 style={{ alignItems: 'center' }}>Categories</h3>
                    <ul style={{ listStyleType: 'none', padding: '10px' }}>
                        {Object.keys(categories).map((category) => (

                            <li
                                key={category}
                                className="main-category"
                                onMouseEnter={() => handleMouseEnter(category)}
                                onMouseLeave={handleMouseLeave}
                                style={{ position: 'relative', padding: '10px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                            >
                                <div style={{ paddingTop: '10px', paddingBottom: '10px', fontWeight: 'bold', alignContent: 'center' }}>
                                    <img src={categoryImages[category]} style={{ width: '34px', paddingRight: '10px' }} />
                                    {category}  </div>
                                {hoveredCategory === category && (
                                    <ul style={{
                                        listStyleType: 'none',
                                        padding: '10px',
                                        margin: '0',
                                        position: 'absolute',
                                        top: '0',
                                        left: '95%',
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                        zIndex: '1000', // Ensure it stays on top
                                        width: '150px',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>

                                        {/*      {categories[category].map((subCategory) => (
                                            <li key={subCategory} className='sub' style={{ padding: '5px 10px', borderBottom: '0.5px solid #e6e6e6' }}> 
                                            <Link className='lilink' to={`/shop/${subCategory}`} 
                                            onClick={() => localStorage.setItem('current_subcat', subCategory)}
                                            > {subCategory} </Link></li>

                                        ))}  */}
                                        {categories[category].map((subCategory) => (
                                            <li key={subCategory} className="sub" style={{ padding: '5px 10px', borderBottom: '0.5px solid #e6e6e6' }}>
                                                <Link
                                                    className="lilink"
                                                    to={`/shop/${subCategory}`} // URL that matches with the route defined in App.js
                                                    onClick={() => localStorage.setItem('current_subcat', subCategory)}
                                                >
                                                    {subCategory}
                                                </Link>
                                            </li>
                                        ))}

                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ width: '80%', padding: '10px' }}>
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                        </ol>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img className="d-block w-100" src={Banner1} alt="First slide" />
                            </div>
                            <div className="carousel-item">
                                <img className="d-block w-100"  src={Banner1}  alt="Second slide" />
                            </div>
                            <div className="carousel-item">
                                <img className="d-block w-100"  src={Banner1}  alt="Third slide" />
                            </div>
                        </div>
                        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    )
}
