/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seller_Menu from './Seller_nav_side';

export default function Seller_review() {
  const [products, setProducts] = useState({});
  const [reply, setReply] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  useEffect(() => {
    const sellerName = localStorage.getItem('seller_name');
    if (sellerName) {
      axios.get(`http://localhost:5000/api/reviewsSeller?seller_name=${sellerName}`)
        .then((response) => {
          setProducts(response.data); // Set fetched product reviews data
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, []);

  const handleReply = (reviewId) => {
    axios.post('http://localhost:5000/api/reply', { review_id: reviewId, reply })
      .then(() => {
        alert('Reply added!');
        setReply('');
        setSelectedReviewId(null);
      })
      .catch((error) => {
        console.error('Error adding reply:', error);
      });
  };

  const handleDelete = (reviewId) => {
    axios.delete(`http://localhost:5000/api/reviewDlt?review_id=${reviewId}`)
      .then(() => {
        alert('Review deleted');
        // Remove the review from the state
        const updatedProducts = { ...products };
        Object.keys(updatedProducts).forEach((productId) => {
          updatedProducts[productId].reviews = updatedProducts[productId].reviews.filter(
            (review) => review.review_id !== reviewId
          );
        });
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
      });
  };

  const handleVerify = (reviewId) => {
    axios.post(`http://localhost:5000/api/updateVerify`, null, {
      params: { review_id: reviewId } // Send review_id as a query parameter
    })
      .then(() => {
        // Optionally, you can update the state or alert the user here.
        alert('Review verified!');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };


  const handleSelectReview = (reviewId) => {
    setSelectedReviewId(reviewId);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Seller_Menu />
      <div style={{ paddingTop: '100px', width: '95%' }}>
        <h3 style={{ textAlign: 'center' }}>Seller Reviews</h3>

        {Object.keys(products).map((productId) => {
          const product = products[productId];

          // Ensure average_rating is a number, and fallback to 0 if not
          const averageRating = typeof product.average_rating === 'number'
            ? product.average_rating
            : 0;

          return (
            <div key={productId} style={{ marginBottom: '40px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
              <h4
                className="sticky-header"
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#f7f7f7',
                  color: '#333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  position: 'sticky',
                  top: '0',
                  zIndex: '10', // Ensure it stays on top
                  width: '60%', // Narrow width (can be adjusted as needed)
                  maxWidth: '900px', // Optional: to ensure it doesn't get too wide
                  margin: '0 auto', // Center the header horizontally
                  borderTop: '2px solid #007bff',
                  borderBottom: '2px solid #e0e0e0',

                }}
              >
                {product.name}
              </h4>


              <div style={{ fontSize: '1rem', color: '#555', marginBottom: '10px' }}>
                <strong style={{ fontWeight: 'bold' }}>Average Rating:</strong> {product.average_rating} / 5
              </div>
              <div style={{ fontSize: '1rem', color: '#555', marginBottom: '20px' }}>
                <strong style={{ fontWeight: 'bold' }}>Total Reviews:</strong> {product.total_reviews}
              </div>

        
              <div style={{ marginTop: '20px', borderTop: '2px solid #f0f0f0', paddingTop: '20px' }}>
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div
                      key={review.review_id}
                      style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '15px',
                        backgroundColor: '#fafafa',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      }}
                    >
                      <h4 style={{ fontSize: '1rem', fontWeight: '650', marginBottom: '3px', fontStyle: 'italic' }}>
                        {review.userr}
                        <span style={{ paddingLeft: '1090px' }}>
                          {review.verified ? (
                            <button
                              style={{
                                backgroundColor: 'white',
                                border: '2px solid #edaa00',
                                color: '#b38002',
                                padding: '3px 8px',
                                fontWeight: '500',
                              }}
                              disabled
                            >
                              Verified
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerify(review.review_id)} // Pass the review_id here
                              style={{
                                backgroundColor: 'white',
                                border: '2px solid rgb(63, 61, 57)',
                                color: 'rgb(63, 61, 57)',
                                padding: '3px 8px',
                                fontWeight: '500',
                              }}
                            >
                              Verify
                            </button>
                          )}
                        </span>


                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '5px' }}>
                        {review.datee}
                      </p>

                      <p style={{ fontSize: '1rem', color: '#666', marginBottom: '15px' }}>{review.comment}
                        <label style={{ paddingLeft: '6px' }}>({review.stars} ★)</label>
                      </p>

                      {review.reply && (
                        <p style={{ fontSize: '0.9rem', color: '#333', fontStyle: 'italic', marginBottom: '10px' }}>
                          <strong>Seller's Reply:</strong> {review.reply}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleSelectReview(review.review_id)}
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.9rem',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                          }}
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(review.review_id)}
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.9rem',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {selectedReviewId === review.review_id && (
                        <div style={{ marginTop: '20px' }}>
                          <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write a reply..."
                            style={{
                              width: '100%',
                              height: '100px',
                              padding: '10px',
                              fontSize: '1rem',
                              borderRadius: '8px',
                              border: '1px solid #ccc',
                              marginBottom: '15px',
                              resize: 'vertical',
                              fontFamily: 'Arial, sans-serif',
                            }}
                          ></textarea>
                          <button
                            onClick={() => handleReply(review.review_id)}
                            style={{
                              padding: '8px 15px',
                              fontSize: '1rem',
                              backgroundColor: '#28a745',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              transition: 'background-color 0.3s ease',
                            }}
                          >
                            Submit Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '1rem', color: '#888', fontStyle: 'italic' }}>No reviews yet for this product.</p>
                )}
              </div>
            </div>
          );

        })}
      </div> </div>
  );
}; */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seller_Menu from './Seller_nav_side';

export default function Seller_review() {
  const [products, setProducts] = useState({});
  const [reply, setReply] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  useEffect(() => {
    const sellerName = localStorage.getItem('seller_name');
    if (sellerName) {
      axios.get(`http://localhost:5000/api/reviewsSeller?seller_name=${sellerName}`)
        .then((response) => {
          setProducts(response.data); // Set fetched product reviews data
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, []);

  const handleReply = (reviewId) => {
    axios.post('http://localhost:5000/api/reply', { review_id: reviewId, reply })
      .then(() => {
        alert('Reply added!');
        setReply('');
        setSelectedReviewId(null);
      })
      .catch((error) => {
        console.error('Error adding reply:', error);
      });
  };

  const handleDelete = (reviewId) => {
    axios.delete(`http://localhost:5000/api/reviewDlt?review_id=${reviewId}`)
      .then(() => {
        alert('Review deleted');
        // Remove the review from the state
        const updatedProducts = { ...products };
        Object.keys(updatedProducts).forEach((productId) => {
          updatedProducts[productId].reviews = updatedProducts[productId].reviews.filter(
            (review) => review.review_id !== reviewId
          );
        });
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
      });
  };

  const handleVerify = (reviewId) => {
    axios.post(`http://localhost:5000/api/updateVerify`, null, {
      params: { review_id: reviewId } // Send review_id as a query parameter
    })
      .then(() => {
        // Optionally, you can update the state or alert the user here.
        alert('Review verified!');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };


  const handleSelectReview = (reviewId) => {
    setSelectedReviewId(reviewId);
  };
  return (
    <div className="seller-reviews-page">
      <Seller_Menu />
      <div className="reviews-container">
        <h2 className="page-title">Customer Reviews</h2>

        {Object.keys(products).map((productId) => {
          const product = products[productId];
          const averageRating = typeof product.average_rating === 'number' ? product.average_rating : 0;

          return (
            <div key={productId} className="product-review-section">
              {/* Sticky Product Header */}
              <div className="sticky-product-header">
                <div className="product-header-content">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="rating-summary">
                      <div className="average-rating">
                      
                        <span className="rating-number">{product.average_rating}</span>
                        <span className="rating-out-of">/5</span>
                        <div className="stars">
                          {'★'.repeat(Math.round(averageRating))}
                          {'☆'.repeat(5 - Math.round(averageRating))}
                        </div>
                      </div>
                      <div className="total-reviews">
                        <span className="count">{product.total_reviews}</span>
                        <span className="label">reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list">
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.review_id} className="review-card">
                      <div className="review-header">
                        <div className="user-info">
                          <span className="user-name">{review.userr}</span>
                          <span className="review-date">{review.datee}</span>
                        </div>
                        <div className="review-rating">
                          {'★'.repeat(review.stars)}
                          {'☆'.repeat(5 - review.stars)}
                        </div>
                        <div className="review-actions">
                          {review.verified ? (
                            <button className="verified-badge">
                              Verified
                            </button>
                          ) : (
                            <button 
                              className="verify-btn"
                              onClick={() => handleVerify(review.review_id)}
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="review-content">
                        <p className="review-text">{review.comment}</p>
                   
                        {review.reply && (
                          <div className="seller-reply">
                            <span className="reply-label">Your Reply:</span>
                            <p className="reply-text">{review.reply}</p>
                          </div>
                        )}
                      </div>

                      <div className="action-buttons">
                        <button
                          className="reply-btn"
                          onClick={() => handleSelectReview(review.review_id)}
                        >
                          {selectedReviewId === review.review_id ? 'Cancel' : 'Reply'}
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(review.review_id)}
                        >
                          Delete
                        </button>
                      </div>

                      {selectedReviewId === review.review_id && (
                        <div className="reply-form">
                          <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write your reply..."
                            className="reply-textarea"
                          />
                          <button
                            className="submit-reply-btn"
                            onClick={() => handleReply(review.review_id)}
                          >
                            Submit Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-reviews">
                    <p>No reviews yet for this product</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .seller-reviews-page {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .reviews-container {
          flex: 1;
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title {
          text-align: center;
          color: #333;
          margin-bottom: 40px;
          font-size: 28px;
          font-weight: 600;
        }

        .product-review-section {
          margin-bottom: 60px;
          position: relative;
        }

        /* Sticky Product Header */
        .sticky-product-header {
          position: sticky;
          top: 80px;
          background: white;
          height:110px;
          padding: 5px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          
          margin-bottom: 20px;
          border-left: 4px solid #660640;
        }

        .product-header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .product-image-container {
          width: 70px;
          height: 70px;
          border-radius: 5px;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          margin: 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 0px;
        }

        .average-rating {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .rating-number {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }

        .rating-out-of {
          font-size: 14px;
          color: #777;
        }

        .stars {
          color: #ffc107;
          font-size: 16px;
          margin-left: 10px;
        }

        .total-reviews {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .count {
          font-weight: 600;
          color: #333;
        }

        .label {
          color: #777;
          font-size: 14px;
        }

        /* Reviews List */
        .reviews-list {
          margin-top: 20px;
        }

        .review-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border-left: 3px solid #e0e0e0;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .user-info {
          flex: 1;
          min-width: 200px;
        }

        .user-name {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 3px;
        }

        .review-date {
          font-size: 13px;
          color: #888;
        }

        .review-rating {
          color: #ffc107;
          font-size: 16px;
          min-width: 100px;
        }

        .review-actions {
          min-width: 100px;
          text-align: right;
        }

        .verified-badge {
          background: #f8f4e5;
          color: #b38b00;
          border: 1px solid #e6d78a;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: default;
        }

        .verify-btn {
          background: white;
          color: #5c4700;
          border: 1px solid #e6d78a;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .verify-btn:hover {
          background: #f8f4e5;
        }

        .review-content {
          margin-bottom: 15px;
        }

        .review-text {
          color: #333;
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .seller-reply {
          background: #f5f9ff;
          border-radius: 6px;
          padding: 12px;
          margin-top: 15px;
          border-left: 3px solid #007bff;
        }

        .reply-label {
          display: block;
          font-weight: 600;
          color: #007bff;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .reply-text {
          color: #333;
          margin: 0;
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .reply-btn, .delete-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reply-btn {
          background: #660640;
          color: white;
          border: none;
        }

        .reply-btn:hover {
          background: #4d0530;
        }

        .delete-btn {
          background: white;
          color: #dc3545;
          border: 1px solid #dc3545;
        }

        .delete-btn:hover {
          background: #f8d7da;
        }

        .reply-form {
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .reply-textarea {
          width: 100%;
          height: 100px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          margin-bottom: 10px;
          resize: vertical;
        }

        .submit-reply-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-reply-btn:hover {
          background: #218838;
        }

        .no-reviews {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
          color: #888;
          font-style: italic;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .reviews-container {
            padding: 20px;
          }
          
          .product-header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .rating-summary {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          
          .review-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .review-actions {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}