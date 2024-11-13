import React from 'react';
import Footerr from './Footerr.js';
import Navbar from './navbar.js';
import Shop from './img/shop1.svg';
import './buttons.css'
import { Link, useNavigate } from 'react-router-dom'
export default function () {
    let navigate = useNavigate();

    const handleShop = () =>{
        navigate("/shop");
    }

    return (
        <div style={{backgroundColor:'white'}}>
            <div> <Navbar /> </div>
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
            <div> <Footerr /> </div>
        </div>
    )
}
