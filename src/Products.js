import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import "./Products.css";
import redTeeImage from "./img/red-tee.jpg";
import axios from "axios";
import Seller_Menu from "./Seller_nav_side";
const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [viewDetailsProduct, setViewDetailsProduct] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [products, setProducts] = useState([]);
  const [isAddNewSizeSelected, setIsAddNewSizeSelected] = useState(false);
  const [isUpdateStockSelected, setIsUpdateStockSelected] = useState(false);
  const [newSizes, setNewSizes] = useState([]);
  const [updatedDiscount, setUpdatedDiscount] = useState(0);

  const categories = {
    Clothes: ["T-shirt", "One Piece", "Three Piece", "Pant"],
    Jewellery: ["Ring", "Earring", "Necklace", "Bracelet"],
    Footwear: ["Sandal", "Heels", "Sneakers"],
    Bags: ["Backpack", "Handbag"],
  };

  const sizeOptions = {
    clothes: {
      'T-shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      'One Piece': ['30', '32', '34', '36', '38', '40', '42'],
      'Three Piece': ['30', '32', '34', '36', '38', '40', '42'],
      Pants: ['26', '28', '30', '32', '34', '36', '38', '40', '42']
    },
    footwear: ['34', '35', '36', '37', '38', '39', '40', '41', '42']
  };
  const handleRadioChange = (e) => {
    if (e.target.value === "addNewSize") {
      setIsAddNewSizeSelected(true);
      setIsUpdateStockSelected(false);
    } else if (e.target.value === "updateExistingStock") {
      setIsUpdateStockSelected(true);
      setIsAddNewSizeSelected(false);
    }
  };


  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory && selectedSubCategory) {
        try {
          /* const response = await axios.get(
             `/seller_products?category=${selectedCategory}&subcategory=${selectedSubCategory}`
           ); */
          const shop_name = localStorage.getItem('seller_name');
          const response = await axios.get('http://localhost:5000/seller_products', {
            params: {
              category: selectedCategory,
              subcategory: selectedSubCategory,
              shop_name: shop_name
            },
          });


          console.log("Fetched data:", response.data);
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setProducts([]); // Clear products when category changes
  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const handleViewDetails = (product) => {
    setViewDetailsProduct(product);
  };

  const closeDetailsModal = () => {
    setViewDetailsProduct(null);
  };

  const closeImageModal = () => {
    setImageModal(null);
  };

  const handleDiscountChange = (e) => {
    setUpdatedDiscount(e.target.value);
    const newDiscount = e.target.value;
  if (newDiscount === "" || newDiscount === undefined || newDiscount ===0) {
    setUpdatedDiscount(viewDetailsProduct.discount); 
  } else {
    setUpdatedDiscount(e.target.value);
  }
  };
  

  const updateStock = (size, newStock) => {
    if (viewDetailsProduct) {
      const updatedDetails = { ...viewDetailsProduct.details };
      updatedDetails.sizes[size].stock = newStock;

      setViewDetailsProduct({
        ...viewDetailsProduct,
        details: updatedDetails,
      });
    }
  };
  const handleSizeChange = (size, qty) => {
    // Update state with size and its corresponding quantity
    setNewSizes(prevSizes => {
      const updatedSizes = [...prevSizes];
      const existingSizeIndex = updatedSizes.findIndex(item => item.size === size);

      if (existingSizeIndex !== -1) {
        updatedSizes[existingSizeIndex].qty = qty; // Update quantity if size already exists
      } else {
        updatedSizes.push({ size, qty }); // Add new size and qty pair
      }

      return updatedSizes;
    });
  };

  let navigate = useNavigate();

  const [updatedStock, setUpdatedStock] = useState({}); 

  // Handle the change for stock updates
  const handleStockChange = (size, value) => {
    setUpdatedStock(prev => ({
      ...prev,
      [size]: value // Save the updated stock value for each size
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellerName = localStorage.getItem("seller_name");

    const productId = viewDetailsProduct.id;
   
    if (isAddNewSizeSelected) {
      const dataToSend = newSizes.map(sizeData => ({
        seller: sellerName,
        product_id: productId,
        product_name: viewDetailsProduct.product_name,
        sizee: sizeData.size,
        quantity: sizeData.qty
      }));
      if (updatedDiscount === "" || updatedDiscount=== undefined || updatedDiscount===0) {
        setUpdatedDiscount(viewDetailsProduct.discount); 
      }
      try {
        const response = await axios.post('http://localhost:5000/add-sizes', {
          sizes: dataToSend,
          discount: updatedDiscount
        });

        console.log('Successfully added sizes:', response.data);

        closeDetailsModal();
        navigate("/Products");
        window.location.reload();

      } catch (error) {
        console.error('Error adding sizes:', error);
        alert('Error adding sizes');
      }
    } 
    else if (isUpdateStockSelected) {
      const dataToSend = viewDetailsProduct.sizes.map(sizeObj => {
        
        const updatedQty = updatedStock[sizeObj.size];
        if (updatedQty && updatedQty !== sizeObj.stock) {
          return {
            seller: sellerName,
            product_id: productId,
            product_name: viewDetailsProduct.product_name,
            sizee: sizeObj.size,
            quantity: updatedQty
          };
        }
        return null;
      }).filter(item => item !== null);
      if (updatedDiscount === "" || updatedDiscount === undefined || updatedDiscount ===0) {
        setUpdatedDiscount(viewDetailsProduct.discount); 
      }
      try {
        const response = await axios.post('http://localhost:5000/update-stock', {
          sizes: dataToSend,
          discount: updatedDiscount
        });
    
        console.log('Successfully updated stock:', response.data);

        closeDetailsModal();
        navigate("/Products");
        window.location.reload();
      } catch (error) {
        console.error('Error updating stock:', error);
        alert('Error updating stock');
      }
    } 
    else{
  
      try {
        const response = await axios.post('http://localhost:5000/updateDiscount', {
          discount: updatedDiscount,
          product_id: productId
        });
    
        console.log('Successfully updated discount', response.data);

        closeDetailsModal();
        navigate("/Products");
        window.location.reload();
      } catch (error) {
        console.error('Error updating stock:', error);
        alert('Error updating stock');
      }
    }
  };

  return (
    <div> <Seller_Menu />
      <div className="products-container">
        <div className="category-tabs">
          {Object.keys(categories).map((category) => (
            <div
              key={category}
              className={`category-tab ${selectedCategory === category ? "active-tab" : ""
                }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="subcategory-menu">
            {categories[selectedCategory].map((subCategory) => (
              <span
                key={subCategory}
                className={`subcategory ${selectedSubCategory === subCategory ? "active-sub" : ""
                  }`}
                onClick={() => handleSubCategoryClick(subCategory)}
              >
                {subCategory}
              </span>
            ))}
          </div>
        )}

        <div className="product-table">
          {selectedSubCategory ? ( // Check if a subcategory is selected
            products.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    {/*      <th>Seller</th> */}
                    {/*      <th>Code</th> */}
                    <th>Description</th>
                    <th>Color</th>
                    <th>Brand</th>
                    <th>Discount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.img}
                          alt={product.product_name}
                          className="product-image"
                          onClick={() => setImageModal(product.img)}
                        />
                      </td>
                      <td>{product.product_name}</td>
                      <td>{product.base_price}</td>
                      {/*    <td>{product.seller}</td> */}
                      {/*   <td>{product.code}</td> */}
                      <td>{product.descrip}</td>
                      <td>{product.color}</td>
                      <td>{product.brand}</td>
                      <td>{product.discount}%</td>
                      <td>
                        <button
                          className="view-details"
                          onClick={() => handleViewDetails(product)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products available for this subcategory.</p>
            )
          ) : (
            <p>Select the subcategory you want to check.</p>
          )}
        </div>

        {viewDetailsProduct && (

          <div className="seller-product-details-modal" style={{ overflowY: "scroll", maxHeight: "80vh" }}>
            <h4> {viewDetailsProduct.product_name}
           <span style={{paddingLeft:'376px'}}> 
            
            <button style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer',

            }} className="seller-close-modal" onClick={closeDetailsModal}>
              X
            </button></span>

            </h4>
            <p>
              <strong>Price:</strong> {viewDetailsProduct.base_price}
            </p>
            <p>
              <strong>Color:</strong> {viewDetailsProduct.color}
            </p>
            <p>
              <strong>Sizes and Stock:</strong>
            </p>
            <table className="size-stock-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {viewDetailsProduct.sizes.map((sizeObj, index) => (
                  <tr key={index}>
                    <td>{sizeObj.size}</td>
                    <td>{sizeObj.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="update-product-info" style={{ paddingTop: '15px' }}>

              <h5 style={{ fontWeight: 'bold' }}>Update Product Information</h5>

              <div className="update-discount" style={{ marginTop: "20px" }}>
                <label htmlFor="discount" style={{ marginRight: "10px" }}>
                  Update Discount:
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  placeholder="new discount"
                  min="0"
                  max="100"
                  defaultValue={viewDetailsProduct.discount}
                  style={{ padding: "5px", width: "150px" }}
                   onChange={handleDiscountChange}
                />
              </div>

              <hr />
              <div className="update-options">
                <div>
                  <label>
                    <input
                      type="radio"
                      name="updateOption"
                      value="addNewSize"
                      onChange={handleRadioChange}
                    />
                    Add New Sizes (if applicable)
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="updateOption"
                      value="updateExistingStock"
                      onChange={handleRadioChange}
                    />
                    Update Stock
                  </label>
                </div>
              </div>
              <hr />

              {isAddNewSizeSelected && (
                <div className="add-new-sizes">
                  <h6 style={{ fontWeight: 'bold' }}>Add New Sizes</h6>

                  {selectedCategory === 'Clothes' && selectedSubCategory && (
                    <div className="sizes-options">
                      <p>Sizes:</p>
                      {sizeOptions.clothes[selectedSubCategory] ? (
                        sizeOptions.clothes[selectedSubCategory].map((size, index) => (
                          <div key={index} style={{ marginBottom: "10px" }}>
                            <label>
                              {size}:
                              <input
                                type="number"
                                min="0"
                                placeholder="Qty"
                                style={{ padding: "5px", width: "100px", marginLeft: "10px" }}
                                onChange={(e) => handleSizeChange(size, e.target.value)}
                              />
                            </label>
                          </div>
                        ))
                      ) : (
                        <p>No sizes available for this subcategory.</p>
                      )}
                    </div>
                  )}

                  {selectedCategory === 'Footwear' && (
                    <div className="sizes-options">
                      <p>Sizes:</p>
                      {sizeOptions.footwear.map((size, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                          <label>
                            {size}:
                            <input
                              type="number"
                              min="0"
                              placeholder="Qty"
                              style={{ padding: "5px", width: "100px", marginLeft: "10px" }}
                              onChange={(e) => handleSizeChange(size, e.target.value)}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {isUpdateStockSelected && (
                <div className="update-stock">
                  <h6 style={{ fontWeight: 'bold' }}>Update Stock for Existing Sizes</h6>
                  <div className="existing-sizes">
                    {viewDetailsProduct.sizes.map((sizeObj, index) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <label>
                          {sizeObj.size}:
                          <input
                            type="number"
                            min="0"
                            id={`stock-${sizeObj.size}`}
                            defaultValue={sizeObj.stock}
                            placeholder="New Qty"
                            style={{ padding: "5px", width: "100px", marginLeft: "10px" }}
                            onChange={(e) => handleStockChange(sizeObj.size, e.target.value)} 
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>

            <button className="close-modal" onClick={handleSubmit}>Save</button>

          
          </div>
        )}



        {imageModal && (
          <div className="image-modal">
            <img src={imageModal} alt="Product" className="large-image" />
            <button className="close-image-modal" onClick={closeImageModal}>
              Close
            </button>
          </div>
        )}
      </div> </div>
  );
};

export default Products;

