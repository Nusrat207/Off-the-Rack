import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ProductDetails.css';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Shop_header from './Shop_header';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import Footerr from './Footerr';
import './shopp.css';
import './nav.css';

import Bag from './img/bag.png';
import Cart from './img/cartt.png';
import Home from './img/homee.png';
import Wish from './img/wishh.png';
import Order from './img/orderr.png';
import SignupIcon from './img/regis.png';
import Review from './img/revieww.png';
import Write from './img/write.gif';

import Modal from './Modal';
import User from './img/user.png';
import Logoo from './img/logo1.jpg';
import Logout from './img/logout.png';
import Edit from './img/edit.png';
import Setting from './img/profile_settings.png';
import Heart1 from './img/fav.png'
import Heart2 from './img/notFav.png'

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const authToken = localStorage.getItem('authToken');
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };



  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoginPromptVisible, setLoginPromptVisible] = useState(false);

  const isSizeRequired = !['Jewellery', 'Bags'].includes(product.category);

  const availableSizes = product.size_qty || [];
  const totalAvailableQuantity = availableSizes.reduce((total, item) => total + parseInt(item.quantity), 0);

  const availableQuantities = selectedSize
    ? availableSizes.find(item => item.size === selectedSize)?.quantity || 0
    : totalAvailableQuantity;

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);

    setSelectedQuantity(1);
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
  };
  const handleAddToFav = async () => {
    if (!authToken) {
      setLoginPromptVisible(true);
      return;
    }
    const userMail = localStorage.getItem('user_mail');
    if (!userMail) {
      alert("User email not found in local storage!");
      return;
    }
   
    const seller = localStorage.getItem('seller_name');
    const favItem = {
      user_mail: userMail,
      product_id: product.id,
      product_name: product.product_name,
      img: product.img,
      price: product.base_price,
      seller: seller,
    };

    try {
      const response = await axios.post('http://localhost:5000/add-to-fav', favItem);
   
      alert("item added to favs!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding to fav:", error);
    }
  };
  const handleLoginRedirect = () => {
    navigate('/');
  };

  const handleAddToCart = async () => {
    if (!authToken) {
      setLoginPromptVisible(true);
      return;
    }
    const userMail = localStorage.getItem('user_mail');
    if (!userMail) {
      alert("User email not found in local storage!");
      return;
    }
    const price = selectedQuantity * parseFloat(product.base_price);
    const seller = localStorage.getItem('seller_name');
    const cartItem = {
      user_mail: userMail,
      product_id: product.id,
      product_name: product.product_name,
      size: selectedSize || "N/A",
      quantity: selectedQuantity,
      img: product.img,
      price: price,
      seller: seller,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post('http://localhost:5000/add-to-cart', cartItem);
      console.log("Item added to cart:", response.data);
      alert("item added to cart!");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const checkIfFavorite = async () => {
      const userMail = localStorage.getItem('user_mail');

      if (userMail && product.id) {
        try {
          const response = await axios.post('http://localhost:5000/api/checkFavorite', {
            user_mail: userMail,
            product_id: product.id,
          });

          // Check if product is in the favorites table
          setIsFavorite(response.data.isFavorite);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkIfFavorite();
  }, [product.id]);

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    console.log(product.id);
    const fetchReviews = axios.get('http://localhost:5000/api/getReviews', { params: { product_id: product.id } });
    fetchReviews
      .then(response => {
        const reviewsData = response.data;
        setReviews(reviewsData);
      })
      .catch(error => {
        console.error("Error fetching reviews:", error);
      });
  }, [product.id]);
  

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmitReview = () => {
  
    const User=localStorage.getItem('user_mail');
    const reviewData = {
      product_id: product.id,
      seller: product.seller,
      user_mail: User,
      comment: reviewText,
      stars: rating,
      datee: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    axios.post('http://localhost:5000/api/postReviews', reviewData)
      .then(response => {
        alert('Review submitted successfully!');
        // Optionally, refresh the reviews list
        setReviews([...reviews, response.data]);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
        alert('There was an error submitting your review. Please try again.');
      });
  };

  const [ratingData, setRatingData] = useState(null);
  const [ratingTotal, setRatingTotal] = useState(0);
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ratings/${product.id}`);

        const data = response.data;

       
        data.avg_stars = data.avg_stars || 0;

        setRatingData(response.data);
        //const total = ratingData.star_1_count + ratingData.star_2_count + ratingData.star_3_count+ratingData.star_4_count+ratingData.star_5_count;
        const total = 
  parseInt(data.star_1_count, 10) +
  parseInt(data.star_2_count, 10) +
  parseInt(data.star_3_count, 10) +
  parseInt(data.star_4_count, 10) +
  parseInt(data.star_5_count, 10);

        setRatingTotal(total);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
    
   
  }, [product.id]); 

  return (
    <div>
      <div className="navbar-container">
        <div className="logo" style={{ paddingRight: '0px' }}>
          <img src={Logoo} style={{ height: '40px' }} alt="settings" />
        </div>


        <div className="nav-links">
          <Link to="/home">
            <img src={Home} style={{ width: '22px' }} alt="home" /> Home
          </Link>
          <Link to="/shop">
            <img src={Bag} style={{ width: '22px' }} alt="Shopping Bag" />
            Shop
          </Link>
          <Link to="/cart">
            <img src={Cart} style={{ width: '23px' }} alt="cart" /> Cart
          </Link>
          {authToken ? (
            <>
              <div className="dropdown">
                <button onClick={toggleDropdown} className="dropbtn" data-toggle="tooltip" data-placement="top" title="ACCOUNT">
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

        {authToken ? (<></>) : (
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
        )}
      </div>

      <div className="product-details-container">
        <div className="product-header">
          <h2>{product.product_name}
          <button
  style={{ border: 'none', backgroundColor: 'transparent' }}
  onClick={isFavorite ? null : handleAddToFav}  // Disable the click handler if already favorited
  disabled={isFavorite}  // Disable the button if the product is favorited
>
  <img
    src={isFavorite ? Heart1 : Heart2}  // Show Heart1 if isFavorite is true, else Heart2
    style={{ width: '65px', paddingLeft: '30px', paddingBottom: '5px' }}
    alt="Favorite"
  />
</button>

          </h2>
          
            
         
        </div>
        <div className="product-details-content">
          <div className="product-image">
            <img src={product.img} alt={product.product_name} />
          </div>
          <div className="product-info">
            <h3>Price: Tk {product.base_price}</h3>
      
            <p><strong>Subcategory:</strong> {product.subcategory}</p>
            <p><strong>Color:</strong> {product.color}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.descrip}</p>
          </div>
        </div>
        <div className="button-group">
          <button onClick={() => navigate(-1)}>Back to Shop</button>
          <button onClick={() => setModalVisible(true)}>Add to Cart</button>
        </div>

        {/* Review Section */}
      <div className="review-section">
        <h5 className="reviews-header"  style={{textShadow: '0.2px 0.2px 0.2pxrgb(177, 166, 166)', fontSize:'18px' }}>
        <img src={Write} style={{width:'35px', paddingRight:'5px'}} />
          Write a Review</h5>
        <textarea
          placeholder="Write your review here"
          value={reviewText}
          onChange={handleReviewChange}
        ></textarea>
        <div className="rating">
          <span style={{fontWeight:'bold'}}>Rate this product: </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? 'filled' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleSubmitReview} className="submit-review">
          Submit 
        </button>
      </div>


      <div className="reviews-section">
  <h5 className="reviews-header">
    <img src={Review} alt="Review Icon" className="review-icon" />
    Reviews
  </h5>
      <div style={styles.container}>
      {ratingData ? (
        <>
         
          <div style={styles.ratingRow}>
            <div style={styles.avgRating}>
              <h1 style={styles.ratingNumber}>{ratingData.avg_stars}/5</h1>
              <p style={{fontSize:'19px', fontWeight:'bold', paddingTop:'10px'}}>{ratingTotal} Ratings</p>
            </div>
            <div style={styles.ratingBreakdown}>
              <div style={styles.breakdownRow}>
                <span style={{color:'#fdcc0d', fontSize:'20px'}}>★★★★★
                  <label style={{fontSize:'20px'}}>
                    </label></span>
                <span style={styles.count}> ({ratingData.star_5_count})</span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={{color:'#fdcc0d', fontSize:'20px'}} >★★★★ 
                  <label style={{color:'gray'}}>☆ </label>
                    </span>
                <span style={styles.count}>({ratingData.star_4_count})</span>
              </div>
              <div style={styles.breakdownRow}>
              <span style={{color:'#fdcc0d', fontSize:'20px'}} >★★★ 
              <label style={{color:'gray'}}>☆☆ </label>
                  
                 </span>
                <span style={styles.count}>({ratingData.star_3_count})</span>
              </div>
              <div style={styles.breakdownRow}>
              <span style={{color:'#fdcc0d', fontSize:'20px'}} >★★ 
              <label style={{color:'gray'}}>☆☆☆ </label>
                  
                  </span>
                <span style={styles.count}>({ratingData.star_2_count})</span>
              </div>
              <div style={styles.breakdownRow}>
              <span style={{color:'#fdcc0d', fontSize:'20px'}} >★ 
              <label style={{color:'gray'}}>☆☆☆☆ </label>
                  
                  
               </span>
                <span style={styles.count}>({ratingData.star_1_count})</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>

      
      {/* REVIEWs SECTION */}
   
  {reviews.map((review) => (
    <div className="review" key={review.id}>
      <h4 className="review-user">{review.userr}</h4>
      <p className="review-date">{review.datee}</p>
      <div className="review-rating">
        <span className="star-rating">{'★'.repeat(Number(review.stars))}</span>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  ))}
</div>

  

        {modalVisible && (
          <div className="product-details-modal">
            <div className="product-details-modal-content">
              <h2>Select Size and Quantity</h2>
              {isSizeRequired ? (
                <div className="size-selection">
                  <label>Size:</label>
                  <select value={selectedSize} onChange={handleSizeChange}>
                    <option value="">Select Size</option>
                    {availableSizes.map((item, index) => (
                      <option key={index} value={item.size}>
                        {item.size}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="no-size-selection">
                  <p>No size options for this product.</p>
                </div>
              )}
              <div>
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={availableQuantities}
                  value={selectedQuantity}
                  onChange={handleQuantityChange}
                />
              </div>
              <div className="modal-buttons">
                <button onClick={() => setModalVisible(false)}>Cancel</button>
                <button onClick={handleAddToCart}>Add</button>
              </div>
            </div>
          </div>
        )}
        {isLoginPromptVisible && (
          <div className="login-prompt-modal">
            <div className="login-prompt-modal-content">
              <h2>Please Log in to Add Items to Cart!</h2>
              <div className="modal-buttons">
                <button onClick={() => setLoginPromptVisible(false)}>Close</button>
                <button onClick={handleLoginRedirect}>Log in</button>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}


const styles = {
  container: {
    width: "50%",
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  ratingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avgRating: {
    flex: 1,
    textAlign: "center",
  },
  ratingNumber: {
    fontSize: "36px",
    margin: "0",
    color: "#f5a623",
  },
  ratingBreakdown: {
    flex: 1,
    textAlign: "left",
    marginLeft: "20px",
  },
  breakdownRow: {
    display: "flex",
    
    marginBottom: "10px",
  },
  count: {
    fontWeight: "500",
    fontSize:'17px',
    paddingTop:'3px',
    paddingLeft:'20px'
   
  },
}; 
/*
  
{/* ratings 
<div style={styles.container}>
      {ratingData ? (
        <>
          <h2 style={styles.heading}>Product Rating</h2>
          <div style={styles.ratingRow}>
            <div style={styles.avgRating}>
              <h1 style={styles.ratingNumber}>{ratingData.avg_stars}/5</h1>
              <p>{ratingData.total_ratings} Ratings</p>
            </div>
            <div style={styles.ratingBreakdown}>
              <div style={styles.breakdownRow}>
                <span>5 Stars</span>
                <span style={styles.count}>{ratingData.star_5_count}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>4 Stars</span>
                <span style={styles.count}>{ratingData.star_4_count}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>3 Stars</span>
                <span style={styles.count}>{ratingData.star_3_count}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>2 Stars</span>
                <span style={styles.count}>{ratingData.star_2_count}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>1 Star</span>
                <span style={styles.count}>{ratingData.star_1_count}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>

    */