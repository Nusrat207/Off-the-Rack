import React, { useState, useEffect } from 'react';
import Navbar from './navbar'
import Bg from './img/bgpattern.svg'
import Propic from './img/propic.svg'
import './profile.css'
export default function Myprofile() {
    const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
      const fetchUserData = async () => {
        const email = localStorage.getItem('user_mail');
        console.log(email);
        if (email) {
          try {
            const response = await fetch('http://localhost:5000/getUserData', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            });
  
            const data = await response.json();
            if (response.ok) {
              setUserData({ name: data.name, email, phone: data.phone });
              console.log(userData.name);
            } else {
              console.error(data.message);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      };
  
      fetchUserData();
    }, []);



  return (
    <div >
        <Navbar/>
        <div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh' 
}}>
        <div  className="card">
      <div className="card__img">
        <img src={Bg} alt="Background" />
      </div>
      <div className="card__avatar">
        <img src={Propic} style={{height:'180px', width:'180px'}} alt="Profile" />
      </div>
      <div style={{marginTop:'120px', fontSize:'26px'}} className="card__title"></div>
      <div style={{fontSize:'27px', marginTop:'0'}}  className="card__label">{userData.name}</div>
      <div className="card__label">Email</div>
      <div className="card__info">{userData.email}</div>
      <div className="card__label">Phone No.</div>
      <div className="card__info">{userData.phone}</div>
      
    </div> </div>
    </div> 
  )
}
