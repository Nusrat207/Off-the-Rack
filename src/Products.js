import React, { useState, useEffect } from "react";
import "./Products.css";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const categories = {
    Clothes: ["T-shirt", "One Piece", "Three Piece", "Pant"],
    Jewellery: ["Ring", "Earring", "Necklace", "Bracelet"],
    Footwear: ["Sandal", "Heels", "Sneakers"],
    Bags: ["Bagpack", "Handbag"],
  };

  // useEffect to fetch products based on selected category and subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory && selectedSubCategory) {
        try {
          const response = await fetch(
            `/products?category=${selectedCategory}&subcategory=${selectedSubCategory}`
          );
          const data = await response.json();
          console.log("Fetched data:", data); // Log the fetched data
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubCategory]);

  return (
    <div className="products-container">
      {/* Category Selection */}
      <div className="category-tabs">
        {Object.keys(categories).map((category) => (
          <div
            key={category}
            className={`category-tab ${
              selectedCategory === category ? "active-tab" : ""
            }`}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedSubCategory(null);
              setProducts([]); // Clear products when category changes
            }}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <div className="subcategory-menu">
          {categories[selectedCategory].map((subCategory) => (
            <span
              key={subCategory}
              className={`subcategory ${
                selectedSubCategory === subCategory ? "active-sub" : ""
              }`}
              onClick={() => setSelectedSubCategory(subCategory)}
            >
              {subCategory}
            </span>
          ))}
        </div>
      )}

      {/* Product Table */}
      <div className="product-table">
        {selectedSubCategory ? ( // Check if a subcategory is selected
          products.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Color</th>
                  <th>Brand</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.code}>
                    <td>
                      <img
                        src={product.img}
                        alt={product.product_name}
                        className="product-image"
                      />
                    </td>
                    <td>{product.product_name}</td>
                    <td>{product.base_price}</td>
                    <td>{product.seller}</td>
                    <td>{product.code}</td>
                    <td>{product.descrip}</td>
                    <td>{product.color}</td>
                    <td>{product.brand}</td>
                    <td>{product.discount}%</td>
                    <td>
                      <button className="view-details">
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
          <p>Select the type you want to check.</p> // Show this message only if no subcategory is selected
        )}
      </div>
    </div>
  );
};

export default Products;




/*
import React, { useState } from "react";
import "./Products.css";
import redTeeImage from "./img/red-tee.jpg";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [viewDetailsProduct, setViewDetailsProduct] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  const categories = {
    Clothes: ["T-shirt", "One Piece", "Three Piece", "Pant"],
    Jewellery: ["Ring", "Earring", "Necklace", "Bracelet"],
    Footwear: ["Sandal", "Heels", "Sneakers"],
    Bags: ["Bagpack", "Handbag"],
  };

  const products = [
    {
      id: 1,
      product_name: "Red Tee",
      category: "Clothes",
      subcategory: "T-shirt",
      base_price: "500 tk",
      img: redTeeImage,
      seller: "Seller A",
      code: "RT-001",
      descrip: "Stylish red t-shirt for casual wear.",
      color: "Red",
      brand: "Brand X",
      discount: 10,
      details: { sizes: { S: { stock: 10 }, M: { stock: 5 }, L: { stock: 5 } } },
    },
    {
      id: 2,
      product_name: "Blue One Piece",
      category: "Clothes",
      subcategory: "One Piece",
      base_price: "1000 tk",
      img: "/path/to/onepiece-image.jpg",
      seller: "Seller B",
      code: "OP-002",
      descrip: "Elegant blue one-piece dress.",
      color: "Blue",
      brand: "Brand Y",
      discount: 15,
      details: { sizes: { S: { stock: 5 }, M: { stock: 0 }, L: { stock: 5 } } },
    },
    // Add more products here...
  ];

  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === product.category &&
      selectedSubCategory === product.subcategory
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
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

  return (
    <div className="products-container">
      <div className="category-tabs">
        {Object.keys(categories).map((category) => (
          <div
            key={category}
            className={`category-tab ${
              selectedCategory === category ? "active-tab" : ""
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
              className={`subcategory ${
                selectedSubCategory === subCategory ? "active-sub" : ""
              }`}
              onClick={() => handleSubCategoryClick(subCategory)}
            >
              {subCategory}
            </span>
          ))}
        </div>
      )}

      <div className="product-table">
        {filteredProducts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Code</th>
                <th>Description</th>
                <th>Color</th>
                <th>Brand</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
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
                  <td>{product.seller}</td>
                  <td>{product.code}</td>
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
          <p>SELECT THE SUBCATEGORY YOU WANT TO CHECK.</p>
        )}
      </div>

      {viewDetailsProduct && (
        <div className="product-details-modal">
          <h2>{viewDetailsProduct.product_name} - Details</h2>
          <p>
            <strong>Price:</strong> {viewDetailsProduct.base_price}
          </p>
          <p>
            <strong>Description:</strong> {viewDetailsProduct.descrip}
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
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(viewDetailsProduct.details.sizes).map((size) => (
                <tr key={size}>
                  <td>{size}</td>
                  <td>{viewDetailsProduct.details.sizes[size].stock}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      placeholder="New stock"
                      onChange={(e) =>
                        updateStock(size, parseInt(e.target.value, 10))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="close-modal" onClick={closeDetailsModal}>
            Close
          </button>
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
    </div>
  );
};

export default Products;*/