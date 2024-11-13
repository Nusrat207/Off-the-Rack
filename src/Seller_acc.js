import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Web from './img/seller_web.svg'
import Show from './img/show.png'
import Hide from './img/hide.png'
import Logoo from './img/logo2.jpg'
import styles from './seller.module.css'
import axios from 'axios';
export default function Seller_acc() {
    const authToken_seller = localStorage.getItem('authToken_seller');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [email1, setEmail1] = useState('');
    const [password1, setPassword1] = useState('');
    let navigate = useNavigate();
    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/seller_login', {
                email1,
                password1,
            });

            if (response.data.success) {
                alert('Login successful!');
                const token = response.data.token;

                localStorage.setItem('seller_authToken', token);
                localStorage.setItem('seller_mail', email1);
                localStorage.setItem('seller_name', response.data.shop_name);

                navigate("/sellerHome");
            } else {
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again :(');
        }
    };





    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');


    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        return re.test(phone);
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            alert('Invalid email format');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if (!validatePhone(phone)) {
            alert('Invalid phone number format');
            return;
        }

        try {

            const response = await axios.post('http://localhost:5000/api/seller_register', {
                email,
                username,
                phone,
                password: password,

            });

            if (response.data.success) {
                alert('Registered successfully!');

                navigate("/sellerHome");
            } else {
                alert('Register failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again :(');
        }
    };

    return (
        <div style={{ backgroundColor: '#ebebeb' }}>
            <nav className="navbar" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 50px',
                backgroundColor: '#ffd6ed',
                color: 'black'
            }}>
                <div className="navbar-left" style={{ flex: '1' }}  >
                    <div className="logo" style={{ paddingRight: '0px' }}>
                        <img src={Logoo} style={{ height: '55px' }} alt="settings" />
                    </div>
                </div>
                <div className="navbar-middle" style={{ flex: '2' }}></div>
                <div className="navbar-right" style={{
                    flex: '3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}>
                    <input type="email" placeholder="Email" className="navbar-input" style={{
                        margin: '0 8px',
                        padding: '5px',
                        width: '280px',
                        border: '2px solid #c9c3c7',
                        borderRadius: '8px',
                        borderColor: '#c9c3c7',
                        fontSize: '18px'
                    }}
                        value={email1} onChange={(e) => setEmail1(e.target.value)}
                    />
                    <input placeholder="Password" className="navbar-input" style={{
                        margin: '0 8px',
                        padding: '5px',
                        width: '260px',
                        border: '2px solid #c9c3c7',
                        borderRadius: '8px',
                        borderColor: '#c9c3c7',
                        fontSize: '18px'
                    }} type='password'
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                    />

                    <button className="navbar-button" onClick={handleSubmitLogin} style={{
                        padding: '5px 10px',
                        backgroundColor: '#8f0a4f',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>Login</button>
                </div>
            </nav>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '20px',
                paddingRight: '100px',
                paddingLeft: '100px'
            }}>
                <img src={Web} style={{ width: '48%', paddingTop: '100px' }} alt="web shopping" />
                <form className="form" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    backgroundColor: '#fcdcee',
                    padding: '60px',
                    borderRadius: '20px',
                    boxshadow: '4px 4px #570232',
                    width: '600px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingRight: '100px'
                }}>
                    <span className="heading" style={{
                        fontSize: '32px',
                        textAlign: 'center',
                        fontWeight: '600', paddingBottom: '15px'
                    }}>REGISTER AS SELLER</span>
                    <div style={{ paddingBottom: '8px' }}>
                        <div className="Mail">Email</div>
                        <input placeholder="Enter Email" type="text" className={styles.sellerInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div style={{ paddingBottom: '8px' }}>
                        <div className="Mail">Phone No.</div>
                        <input placeholder="Enter phone no." type="text" className={styles.sellerInput} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div style={{ paddingBottom: '8px' }}>
                        <div className="Mail">Shop/Business Name</div>
                        <input placeholder="Enter shop name" type="text" className={styles.sellerInput} value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div style={{ paddingBottom: '8px' }}>
                        <div className="Password">Password</div>
                        <input placeholder="Enter Password" type="password" className={styles.sellerInput} value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />

                    </div>

                    <button className={styles.sellerButton} onClick={handleSubmitRegister} >Submit</button>
                </form>
            </div>
        </div >

    );


}
