
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ProductDetails.css';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Navbar from './navbar';
import Footerr from './Footerr';

// Import your images
import Bag from './img/bag.png';
import Cart from './img/cartt.png';
import Home from './img/homee.png';
import Wish from './img/wishh.png';
import Order from './img/orderr.png';
import SignupIcon from './img/regis.png';
import Review from './img/revieww.png';
import Write from './img/write.gif';
import User from './img/user.png';
import Logoo from './img/logo1.jpg';
import Logout from './img/logout.png';
import Edit from './img/edit.png';
import Setting from './img/profile_settings.png';
import Heart1 from './img/fav.png';
import Heart2 from './img/notFav.png';

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);


  useEffect(() => {
    window.scrollTo(0, 0);

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
    ? Number(availableSizes.find(item => item.size === selectedSize)?.quantity) || 0
    : Number(totalAvailableQuantity);


  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);

    setSelectedQuantity(1);
  };

  //const handleQuantityChange = (event) => {
  //  setSelectedQuantity(event.target.value);
  // };
  const [quantityValid, setQuantityValid] = useState(true);
  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (value > availableQuantities) {
      setQuantityValid(false);
    } else {
      setQuantityValid(true);
    }

    setSelectedQuantity(value < 1 ? 1 : value);
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


  const handleRemoveFromFav = async (productId) => {
    const user_mail = localStorage.getItem('user_mail');

    try {
      await axios.post('http://localhost:5000/api/remove-from-favorites', {
        user_mail,
        product_id: productId,
      });
      alert("item removed from favs!");
      window.location.reload();
    } catch (err) {
      console.error('Error removing from favorites:', err);
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
    //const seller = localStorage.getItem('seller_name');
    const cartItem = {
      user_mail: userMail,
      product_id: product.id,
      product_name: product.product_name,
      size: selectedSize || "N/A",
      quantity: selectedQuantity,
      img: product.img,
      price: price,
      seller: product.seller,
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

    const User = localStorage.getItem('user_mail');
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

  const isSoldOut = isSizeRequired
    ? availableSizes.every(item => Number(item.quantity) === 0)
    : Number(availableQuantities) === 0;


  return (
    <div className="product-details-page">
      {/* Navigation - kept exactly the same */}
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
          <Link to="/sellerAcc" className="seller-link">
            Join as Seller
          </Link>
        )}
      </div>

      {/* Product Details Section */}
      <div className="product-container">
        <div className="product-grid">
          {/* Product Image */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.img} alt={product.product_name} />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h2 className="product-title">{product.product_name}</h2>
              <button
                className="favorite-button"
                onClick={isFavorite ? () => handleRemoveFromFav(product.id) : handleAddToFav}
              >
                <img
                  src={isFavorite ? Heart1 : Heart2}
                  alt="Favorite"
                  className="heart-icon"
                />
              </button>
            </div>

            <div className="price-section">
              {product.discount > 0 ? (
                <>
                  <span className="discounted-price">৳{(product.base_price) -(product.base_price*(product.discount/100)).toFixed(2) } </span>
                  <span className="original-price">৳{product.base_price}</span>
                  <span className="discount-badge">{product.discount}% OFF</span>
                </>
              ) : (
                <span className="current-price">৳{product.base_price}</span>
              )}
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Subcategory:</span>
                <span className="meta-value">{product.subcategory}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Color:</span>
                <span className="meta-value">{product.color}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Brand:</span>
                <span className="meta-value">{product.brand}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Seller:</span>
                <span className="meta-value">{product.seller}</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.descrip}</p>
            </div>

            <div className="product-actions">
              {isSoldOut ? (
                <div className="sold-out-badge">
                  SOLD OUT
                </div>
              ) : (
                <button
                  className="add-to-cart-btn"
                  onClick={() => setModalVisible(true)}
                >
                  Add to Cart
                </button>
              )}
              <button
                className="back-to-shop-btn"
                onClick={() => navigate(-1)}
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-container">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
          </div>

          {/* Rating Summary */}
          <div className="rating-summary">
            <div className="rating-overview">
              <div className="average-rating">
                <span className="rating-number">{ratingData?.avg_stars || 0}</span>
                <span className="rating-out-of">/5</span>
                <div className="stars">
                  {'★'.repeat(Math.round(ratingData?.avg_stars || 0))}
                  {'☆'.repeat(5 - Math.round(ratingData?.avg_stars || 0))}
                </div>
                <span className="total-ratings">{ratingTotal} ratings</span>
              </div>
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div className="rating-bar" key={star}>
                    <span className="star-label">{star} star</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(ratingData ? ratingData[`star_${star}_count`] / ratingTotal : 0) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="count">({ratingData ? ratingData[`star_${star}_count`] : 0})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Write Review */}
          <div className="write-review">
            <h3>
              <img src={Write} alt="Write review" className="write-icon" />
              Write a Review
            </h3>
            <textarea
              placeholder="Share your thoughts about this product..."
              value={reviewText}
              onChange={handleReviewChange}
            ></textarea>
            <div className="rating-input">
              <span>Your Rating:</span>
              <div className="star-rating">
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
            </div>
            <button
              className="submit-review-btn"
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
          </div>

          {/* Reviews List */}
       {/* Reviews List */}
<div className="reviews-list">
  {reviews.map((review) => (
    <div className="review-card" key={review.id}>
      <div className="review-header">
        <span className="reviewer-name">{review.userr}</span>
        <span className="review-date">{review.datee}</span>
      </div>
      {review.verified && <div className="verified-badge">✔ Verified</div>}
      <div className="review-rating">
        {'★'.repeat(Number(review.stars))}
        {'☆'.repeat(5 - Number(review.stars))}
      </div>
      <p className="review-text">{review.comment}</p>

      {review.reply && review.reply.trim() !== '' && (
  <div className="review-reply">
    <strong>Reply:</strong>
    <p>{review.reply}</p>
  </div>
)}

    </div>
  ))}
</div>

        </div>
      </div>

      {/* Modals - kept exactly the same */}
      {modalVisible && (
        <div className="product-details-modal">
          <div className="product-details-modal-content">
            <h2>Select Size and Quantity</h2>
            {isSizeRequired ? (
              <div className="size-selection">
                <label>Size:</label>
                <select value={selectedSize} onChange={handleSizeChange}>
                  <option value="">Select Size</option>
                  {availableSizes
                    .filter(item => Number(item.quantity) > 0)  // Filter out sizes with 0 qty
                    .map((item, index) => (
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
              <button onClick={handleAddToCart}
                disabled={!quantityValid || selectedQuantity < 1}
                style={
                  !quantityValid ? { opacity: 0.5, cursor: 'not-allowed' } : {}
                }

              >Add</button>
            </div> {!quantityValid && (
              <p style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
                Only {availableQuantities} item(s) in stock for the selected size.
              </p>
            )}
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

      {/* CSS Styles */}
      <style jsx>{`
        .product-details-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          max-width: 100%;
          margin: 0 auto;
      
          
          
        }

        /* Navigation - kept your styles but made responsive */
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 30px;
  
        }

        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-links a {
          display: flex;
          align-items: center;
          gap: 5px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
        }

        .seller-link {
          color: black;
          text-decoration: none;
          border: 1px solid black;
          padding: 5px 10px;
          border-radius: 3px;
          transition: all 0.2s;
        }

        .seller-link:hover {
          color: blue;
          text-decoration: underline;
        }

        /* Product Container */
        .product-container {
          margin-top: 30px;
          max-width: 90%;
          padding-left: 100px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        /* Product Gallery */
        .product-gallery {
          position: relative;
        }

        .main-image {
          border: 1px solid #eee;
          border-radius: 8px;
          overflow: hidden;
          background: #f9f9f9;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 500px;
        }

        .main-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        /* Product Info */
        .product-info {
          padding: 20px;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .product-title {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
          color: #222;
        }

        .favorite-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        .heart-icon {
          width: 30px;
          height: 30px;
        }

        .price-section {
  margin: 25px 0;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-price {
  font-size: 28px;
  font-weight: 700;
  color: #e63946;
}

.discounted-price {
  font-size: 28px;
  font-weight: 700;
  color: #e63946;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background-color: #e63946;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

        .product-meta {
          margin: 20px 0;
        }

        .meta-item {
          display: flex;
          margin-bottom: 10px;
        }

        .meta-label {
          font-weight: 600;
          min-width: 120px;
          color: #666;
        }

        .meta-value {
          color: #333;
        }

        .product-description {
          margin: 30px 0;
        }

        .product-description h3 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #444;
        }

        .product-description p {
          line-height: 1.6;
          color: #555;
        }

        /* Product Actions */
        .product-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .add-to-cart-btn, .back-to-shop-btn {
          padding: 12px 25px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-to-cart-btn {
          background-color: #660640;
          color: white;
          border: none;
        }

        .add-to-cart-btn:hover {
          background-color: #4d0530;
        }

        .back-to-shop-btn {
          background-color: white;
          color: #660640;
          border: 1px solid #660640;
        }

        .back-to-shop-btn:hover {
          background-color: #f9f0f5;
        }

        .sold-out-badge {
          padding: 12px 25px;
          background-color: #f8f9fa;
          color: #d14343;
          border: 2px solid #d14343;
          border-radius: 4px;
          font-weight: 600;
          font-size: 16px;
        }

        /* Reviews Section */
        .reviews-container {
          margin-top: 60px;
          border-top: 1px solid #eee;
          padding-top: 40px;
        }

        .reviews-header h2 {
          font-size: 24px;
          margin-bottom: 30px;
          color: #333;
        }

        /* Rating Summary */
        .rating-summary {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .rating-overview {
          display: flex;
          gap: 50px;
        }

        .average-rating {
          text-align: center;
          min-width: 150px;
        }

        .rating-number {
          font-size: 42px;
          font-weight: 700;
          color: #333;
        }

        .rating-out-of {
          font-size: 24px;
          color: #777;
        }

        .stars {
          font-size: 24px;
          color: #ffc107;
          margin: 5px 0;
        }

        .total-ratings {
          color: #777;
          font-size: 14px;
        }

        .rating-distribution {
          flex: 1;
        }

        .rating-bar {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .star-label {
          min-width: 70px;
          font-size: 14px;
          color: #555;
        }

        .bar-container {
          flex: 1;
          height: 10px;
          background: #e0e0e0;
          border-radius: 5px;
          margin: 0 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #ffc107;
        }

        .count {
          min-width: 50px;
          text-align: right;
          font-size: 14px;
          color: #777;
        }

        /* Write Review */
        .write-review {
          background: white;
          border-radius: 8px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          margin-bottom: 30px;
        }

        .write-review h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          margin-bottom: 20px;
          color: #333;
        }

        .write-icon {
          width: 25px;
        }

        .write-review textarea {
          width: 100%;
          min-height: 120px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          margin-bottom: 20px;
          resize: vertical;
        }

        .rating-input {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .star-rating {
          font-size: 24px;
        }

        .star-rating .star {
          color: #ddd;
          cursor: pointer;
          transition: color 0.2s;
        }

        .star-rating .filled {
          color: #ffc107;
        }

        .submit-review-btn {
          background-color: #660640;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-review-btn:hover {
          background-color: #4d0530;
        }

       .reviews-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.review-card {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-date {
  color: #777;
  font-size: 14px;
}

.verified-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #e0f7e9;
  color: #2e7d32;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
}

.review-rating {
  color: #ffc107;
  font-size: 16px;
  margin-bottom: 10px;
}

.review-text {
  line-height: 1.6;
  color: #555;
}

.review-reply {
  margin-top: 15px;
  padding: 12px 16px;
  background: #f9f9f9;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  color: #333;
}


        /* Responsive Design */
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
          
          .rating-overview {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}