
import styles from './Auth.module.css';
import React, { useEffect, useState } from 'react';
import Footerr from './Footerr.js';
import Navbar from './navbar.js';

import Mail from './img/mail.png'
import Username from './img/username.png'
import Pw from './img/pw.png'
import { Link, useNavigate } from 'react-router-dom'

import Phone from './img/phone.png'
import axios from 'axios';

import { GoogleLogin } from '@leecheuk/react-google-login';
import GoogleLoginButton from './GoogleLoginButton';
const Sign_log = () => {


    const [isRightPanelActive, setIsRightPanelActive] = useState(true);

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };

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
            const response = await axios.post('http://localhost:5000/api/login', {
                email1,
                password1,
            });

            if (response.data.success) {
                alert('Login successful!');
                const token = response.data.token;
                localStorage.setItem('authToken', token);

                localStorage.setItem('user_mail', email1);
    
                navigate("/home");
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

    const handleSubmitSignup = async (e) => {
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

            const response = await axios.post('http://localhost:5000/api/signup', {
                email,
                username,
                phone,
                password: password,

            });

            if (response.data.success) {
                alert('Signup successful!');

                navigate("/login");
            } else {
                alert('Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again :(');
        }
    };

    return (
        <div style={{backgroundColor:'white'}}> <Navbar />

            <div className={`${styles.authForm__container} ${isRightPanelActive ? styles.authForm__containerRightPanelActive : ''}`}>
                {/* Sign Up */}
                <div className={styles.authForm__containerForm + ' ' + styles.authForm__containerSignup}>
                    <form className={styles.authForm__form2} id="form1" >
                        <div className="welcome-text" style={{ fontWeight: 'bold', fontSize: '2rem', color: '#5c0532', textAlign: 'center' }}>Welcome to Our Website!</div>
                        <div className="sub-text" style={{ fontSize: '1rem', opacity: '0.7', color: '#5c0532', textAlign: 'center' }}>Create Your Account</div>

                        <div className={styles.flex_column}>
                            <label style={{fontSize:'15px'}}>Email</label>
                            <div className={styles.inputForm}>
                                <img src={Mail} alt="Email Icon" className={styles.input_icon} />
                                <input type="text" className={styles.input} placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.flex_column}>
                            <label style={{fontSize:'15px'}}>Username</label>
                            <div className={styles.inputForm}>
                                <img src={Username} alt="user Icon" className={styles.input_icon} />
                                <input type="text" className={styles.input} placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </div>


                        <div className={styles.flex_column}>
                            <label style={{fontSize:'15px'}}>Phone No.</label>
                            <div className={styles.inputForm}>
                                <img src={Phone} alt="phone Icon" className={styles.input_icon} />
                                <input type="text" className={styles.input} placeholder="Enter your phone no." value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className={styles.flex_column}>
                            <label style={{fontSize:'15px'}}>Password</label>
                            <div className={styles.inputForm}>
                                <img src={Pw} alt="Password Icon" className={styles.input_icon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles.input}
                                    placeholder="Enter your Password (minimum 6 digits)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {/*     <span className="password-toggle" onClick={togglePasswordVisibility}>
                                        {showPassword ? (
                                            <img src={Show} alt="Hide Password" className="password-icon" style={{ width: '25px' }} onClick={() => setShowPassword(false)} />
                                        ) : (
                                            <img src={Hide} alt="Show Password" className="password-icon" style={{ width: '25px' }} onClick={() => setShowPassword(true)} />
                                        )}
                                    </span> */}
                            </div>
                        </div>

                        <button className={styles.button_submit} onClick={handleSubmitSignup}>SIGN UP</button>

                        <p style={{ paddingTop: '10px', textAlign: 'center' }}>Already have an account? <Link id="signIn" onClick={handleSignInClick} style={{ fontWeight: 'bold', fontSize: '20px' }}>Sign In</Link></p>

                      {/*    <p style={{ opacity: '0.7', fontSize: '14px' }}>━━━━━━━━━━ OR ━━━━━━━━━━</p> */}

                    </form>
                 {/*    <div style={{justifyContent:'center', alignItems:'center', paddingLeft:'180px', paddingTop:'0px'}}><GoogleLoginButton /></div> */}
                </div>

                {/* Sign In */}
                <div className={styles.authForm__containerForm + ' ' + styles.authForm__containerSignin}>

                    <form className={styles.authForm__form} id="form2" >
                        <div style={{ fontWeight: 'bold', fontSize: '2rem', color: '#5c0532', textAlign: 'center', paddingTop: '40px' }}>Welcome Back!</div>
                        <div style={{ fontSize: '1rem', opacity: '0.7', color: '#5c0532', textAlign: 'center', paddingBottom: '10px' }}>Enter Your Credentials</div>
                        <div className={styles.flex_column}>
                            <label>Email</label>
                            <div className={styles.inputForm}>
                                <img src={Mail} alt="Email Icon" className={styles.input_icon} />
                                <input type="text" className={styles.input} placeholder="Enter your Email" value={email1} onChange={(e) => setEmail1(e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.flex_column}>
                            <label>Password</label>
                            <div className={styles.inputForm}>
                                <img src={Pw} alt="Password Icon" className={styles.input_icon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles.input}
                                    placeholder="Enter your Password"
                                    value={password1}
                                    onChange={(e) => setPassword1(e.target.value)}
                                />
                              
                            </div>
                        </div>
                        <Link to="/forgotpw" className={styles.authForm__link}>Forgot your password?</Link>

                        {/*   <button className={styles.authForm__btn}>Sign In</button> */}

                        <button className={styles.button_submit} onClick={handleSubmitLogin}>LOGIN</button>

                        <p style={{ paddingTop: '10px', textAlign: 'center' }}>Don't have an account? <Link id="signUp" style={{ fontWeight: 'bold', fontSize: '20px' }} onClick={handleSignUpClick} >Sign up</Link></p>

                         

                      {/*     <p style={{ opacity: '0.7', fontSize: '14px' }}>━━━━━━━━━━ OR ━━━━━━━━━━</p>   */}
                       
                    </form>
                   {/*    <div style={{justifyContent:'center', alignItems:'center', paddingLeft:'180px', paddingTop:'0px'}}><GoogleLoginButton />  </div> */}
                    
                   
                  
                </div>

                {/* Overlay */}
                <div className={styles.authForm__containerOverlay}>
                    <div className={styles.authForm__overlay}>
                        {/*  <div className={styles.authForm__overlayPanel + ' ' + styles.authForm__overlayLeft}>
                        
                    </div>
                    <div className={styles.authForm__overlayPanel + ' ' + styles.authForm__overlayRight}>
                       
                    </div>*/}
                    </div>
                </div>
            </div>
            <Footerr />

        </div>
    );
};

export default Sign_log;
