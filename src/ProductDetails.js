import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ProductDetails.css'; // Add a CSS file for styling
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";



export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);

   // Extract product details
 
   useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);  // Set the product data
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProductDetails();
  }, [id]);
  



  return (
    <div className="product-details-container">
      <div className="product-header">
        <h1>{product.product_name}</h1>
      </div>
      <div className="product-image">
        <img src={product.img} alt={product.product_name} />
      </div>
      <div className="product-info">
        <h3>Price: Tk {product.base_price}</h3>
        <p><strong>Ratings:</strong> {product.ratings}</p>
        
        <p><strong>Subcategory:</strong> {product.subcategory}</p>
        <p><strong>Product Code:</strong> {product.code}</p>
        <p><strong>Color:</strong> {product.color}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Description:</strong> {product.descrip}</p>
      </div>
      <div className="button-group">
  <button onClick={() => navigate(-1)}>Back to Shop</button>
  <button>Add to Cart</button>
</div>


    </div>
  );
}
