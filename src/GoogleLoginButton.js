import React, { useEffect, useState } from 'react';
 import axios from 'axios';
 import Google from './img/goo.png'
const GoogleLoginButton = () => {
  const clientId="601204470956-doo7001rvumc3bt76j6o0ifnr7obiu0a.apps.googleusercontent.com"
  const redirectUri="http://localhost:3000/home"
  const handleLogin = () => {
    const authUrl=`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&prompt=consent`
    window.location.href = authUrl;
   //window.open( authUrl, "_self");
    //window.location.href = 'http://localhost:5000/auth/google/callback';
  // window.open( `http://localhost:5000/auth/google/callback`, "_self");
  };

const [accessToken, setAccessToken] = useState(null);

useEffect( ()=>{
     console.log("Effect triggered");

     const handleredirect = async()=>{
         console.log("Handling redirect...");
         const params = new URLSearchParams(window.location.search)
         const code=params.get('code')
         if(code){
             console.log("Code received:", code);
             const clientId="601204470956-doo7001rvumc3bt76j6o0ifnr7obiu0a.apps.googleusercontent.com"
             const clientSecret = "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"
             const redirectUri="http://localhost:3000/home"
             try{
                 const response=await axios.post(
                     "https://oauth2.googleapis.com/token",
                     { 
                         client_id: clientId,
                         client_secret:clientSecret,
                         code:code,
                         grant_type:'authorization_code',
                         redirect_uri:redirectUri
                     }
                 )
                 console.log("access token got", response.data.access_token)
                 setAccessToken(response.data.access_token)
                 window.history.replaceState(
                     {}, document.title, window.location.pathname
                 )
                 console.log("History state replaced");

             }catch(error){
                 console.log(error);
             }
         }
         else{
             console.log("code not got")
         }
     }

     handleredirect()
 },[]
 ) 
  return (
    <button className='goobtn' onClick={handleLogin} style={{width:'60%'}} >  <img src={Google} style={{ width: '24px' }} /> 
      Continue with Google 
    </button>
  );
};

export default GoogleLoginButton; 
