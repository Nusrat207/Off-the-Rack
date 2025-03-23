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

              {/* Reviews Section */}
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
};