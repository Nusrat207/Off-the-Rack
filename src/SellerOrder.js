import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seller_Menu from './Seller_nav_side'
import IconOrder from './img/oorderr.png'
export default function SellerOrder() {
  const [orders, setOrders] = useState([]);
  const [details, setDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    
    const sellerName = localStorage.getItem('seller_name');
    if (sellerName) {
      axios
        .post('http://localhost:5000/api/sellerOrders', { seller: sellerName })
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error('Error fetching seller orders:', error);
        });
    }
  }, []);

  const handleViewDetails = (order_id) => {
    const sellerName = localStorage.getItem('seller_name');
    axios
      .post('http://localhost:5000/api/orderDetails', { order_id, sellerName  })
      .then((response) => {
        setDetails(response.data);
        setShowModal(true);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
      });
  };

  const closeModal = () => {
    setDetails(null);
    setShowModal(false);
  };

  const tableContainerStyle = {
    width: '90%',
    margin: '0 auto',
    paddingTop: '10px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',

  };

  const cellStyle = {
    padding: '10px',
    textAlign: 'left',

  };

  const rowStyle = {
    borderBottom: '1px solid #ddd',
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
    overflowY:'scroll'

  };

  const modalContentStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '70%',
  };

  const closeButtonStyle = {
    float: 'right',
    background: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  };

  const summaryStyle = {
    margin: '10px 0',
  };
  const [dropdownVisible, setDropdownVisible] = React.useState(null); // Tracks visible dropdown for a specific order

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.post('http://localhost:5000/api/update-order-status', {
        orderId: orderId,
        newStatus: newStatus
      });
      setDropdownVisible(null); // Close dropdown after updating
      alert('Status updated successfully');
      //fetchOrders(); // Refresh orders list (assuming this function exists)
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleCancelProduct = async (product) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel "${product.product_name}"?`);
    if (!confirmCancel) return;
  
    console.log(product);
    try {
      const response = await axios.post('http://localhost:5000/api/cancel-product', {
        product_id: product.product_id,
        order_id: product.order_id,
        seller: product.seller,
        order_time: product.order_time,
      });

      
  
      alert('Product cancelled successfully!');
      // Optionally refresh the modal data or reload
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling product:', error);
      alert('Failed to cancel product.');
    }
  };
  

  return (
    <div> <Seller_Menu />
      <div style={{ paddingTop: '90px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <h4 style={{ color:'#660640',paddingLeft: '10px', fontWeight: 'bold', textShadow: '0.5px 0.5px 0.5px #000000' }}>Orders
            <img src={IconOrder} style={{ width: '40px', paddingLeft: '9px' }} />
          </h4></div>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ textShadow: '0.2px 0.2px 0.2px #000000', padding: '8px', textAlign: 'left', }} ></th>
                <th style={{ textShadow: '0.2px 0.2px 0.2px #000000', padding: '8px', textAlign: 'left', }} >Order ID</th>
                <th style={{ textShadow: '0.2px 0.2px 0.2px #000000', padding: '8px', textAlign: 'left', }}>Customer Name</th>
                <th style={{ textShadow: '0.2px 0.2px 0.2px #000000', padding: '8px', textAlign: 'left', }}>Date</th>
                <th style={{ textShadow: '0.2px 0.2px 0.2px #000000', padding: '8px', textAlign: 'left', }}>Status</th>
                <th style={{ textShadow: '0.2px 0.2px 0.2px #000000', padding: '8px', textAlign: 'left', }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.order_id} style={rowStyle}>
                  <td style={cellStyle}>{index + 1}</td>
                  <td style={cellStyle}>{order.order_id}</td>
                  <td style={cellStyle}>{order.fullname}</td>
                  <td style={cellStyle}>{formatDate(order.order_time)}</td>

                  <td style={cellStyle}>
                    <div style={{ position: 'relative' }}>
                      <button
                        style={{
                          backgroundColor: 'white',
                          color: order.status === 'pending' ? 'red' :
                            order.status === 'shipped' ? '#e6a902' :
                            order.status === 'cancelled' ? '#6a6a6b' :
                              'green',
                          border: `2px solid ${order.status === 'pending' ? 'red' :
                            order.status === 'shipped' ? '#e6a902' :
                            order.status === 'cancelled' ? '#6a6a6b':
                              'green'}`,
                          borderRadius: '5px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 1,
                        }}
                        onClick={() => setDropdownVisible(dropdownVisible === order.order_id ? null : order.order_id)} // Toggle dropdown
                      >
                        {order.status}
                      </button>

                      {dropdownVisible === order.order_id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: '#ffffff',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            zIndex: 2,
                            width: '100%',
                            overflow: 'hidden',
                          }}
                        >
                          {['pending', 'shipped', 'completed', 'cancelled']
                            .filter((statusOption) => statusOption !== order.status)
                            .map((statusOption) => (
                              <div
                                key={statusOption}
                                onClick={() => handleStatusUpdate(order.order_id, statusOption)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: 'white',
                                  color: statusOption === 'pending' ? 'red' :
                                    statusOption === 'shipped' ? '#e6a902' :
                                    statusOption === 'cancelled' ? '#565657' :
                                      'green',
                                  border: `2px solid ${statusOption === 'pending' ? 'red' :
                                    statusOption === 'shipped' ? '#e6a902' :
                                    statusOption === 'cancelled' ? '#565657' :
                                      'green'}`,
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                  zIndex: 3,
                                }}
                              >
                                {statusOption}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td style={cellStyle}>
                    <button style={{ backgroundColor: 'white', color: '#028ee6', border: '1px solid #028ee6', padding: '2px 4px', borderRadius: '3px' }} onClick={() => handleViewDetails(order.order_id)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> </div>

        {showModal && details && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <button style={closeButtonStyle} onClick={closeModal}>
                X
              </button>
              <h4 style={{ textShadow: '0.5px 0.5px 0.5px #000000' }}>Order Details</h4>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={cellStyle}>Image</th>
                    <th style={cellStyle}>Product Name</th>
                    <th style={cellStyle}>Size</th>
                    <th style={cellStyle}>Quantity</th>
                    <th style={cellStyle}>Price</th>
                  </tr>
                </thead>
     


                <tbody>
  {details.products.map((product, index) => (
    <tr 
      key={index}
      style={{
        ...rowStyle,
        opacity: product.status === 'cancelled' ? 0.5 : 1,
        pointerEvents: product.status === 'cancelled' ? 'none' : 'auto'
      }}
    >
      <td style={cellStyle}>
        <img src={product.img} alt="Product" width="50" />
      </td>
      <td style={cellStyle}>{product.product_name}</td>
      <td style={cellStyle}>{product.sizee}</td>
      <td style={cellStyle}>{product.quantity}</td>
      <td style={cellStyle}>৳ {product.price}</td>
      <td style={cellStyle}>
        {product.status === 'cancelled' ? (
          <span style={{ color: 'gray' }}>Cancelled</span>
        ) : (
          <button 
          onClick={() => handleCancelProduct(product)}
          style={{ padding: '2px 7px', backgroundColor: 'white', color: 'red', border: '1px solid red', fontSize:'12px' }}
        >
          Cancel
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

              </table>
              <div style={summaryStyle}>
                <p><strong>Total Price:</strong>৳ {details.totalPrice}</p>
                <p><strong>Payment Method:</strong> {details.delivery.payment}</p>
                <p><strong>Customer Name:</strong> {details.delivery.fullname}</p>
                <p><strong>Phone No.:</strong> {details.delivery.phone}</p>
                <p><strong>Address:</strong> {details.delivery.address}</p>
              </div>
            </div>
          </div>
        )}
      </div></div>
  );
};