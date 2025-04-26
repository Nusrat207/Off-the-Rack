import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seller_Menu from './Seller_nav_side'
import IconOrder from './img/oorderr.png'
import Navbar from './navbar';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [details, setDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
      const userMail = localStorage.getItem('user_mail');
  
      if (userMail) {
        axios
          .post('http://localhost:5000/api/orders', { user: userMail })
          .then((response) => {
            setOrders(response.data);
          })
          .catch((error) => {
            console.error('Error fetching orders:', error);
          });
      }
    }, []);
  
    const handleViewDetails = (order_id) => {
      axios
        .post('http://localhost:5000/api/myOrderDetails', { order_id })
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
  
 
    const formatDate = (dateString) => {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return new Date(dateString).toLocaleDateString("en-GB", options);
    };
  
    return (
      <div> <Navbar />
        <div style={{ paddingTop: '20px', paddingLeft:'60px' }}>
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
                 
                    <td style={cellStyle}>{formatDate(order.order_time)}</td>
  
                    <td style={cellStyle}>
                      <div style={{ position: 'relative' }}>
                        <button disbaled
                          style={{
                            backgroundColor: 'white',
                            color: order.status === 'pending' ? 'red' :
                              order.status === 'shipped' ? '#e6a902' :
                              order.status === 'cancelled' ? '#565657' :
                                'green',
                            border: `2px solid ${order.status === 'pending' ? 'red' :
                              order.status === 'shipped' ? '#e6a902' :
                              order.status === 'cancelled' ? '#565657' :
                                'green'}`,
                            borderRadius: '5px',
                            padding: '5px 10px',
                         
                            position: 'relative',
                            zIndex: 1,
                          }}
                         
                        >
                          {order.status}
                        </button>
  
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
        opacity: product.status === 'cancelled' ? 0.7 : 1
      }}
    >
      <td style={cellStyle}>
        <img src={product.img} alt="Product" width="50" />
      </td>
      <td style={cellStyle}>
        {product.product_name}
        {product.status === 'cancelled' && (
          <div style={{ fontSize: '12px', color: '#b30000', marginTop: '4px' }}>
            This item was cancelled by the seller due to unforeseen circumstances.
          </div>
        )}
      </td>
      <td style={cellStyle}>{product.sizee}</td>
      <td style={cellStyle}>{product.quantity}</td>
      <td style={cellStyle}>৳ {product.price}</td>
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
}
