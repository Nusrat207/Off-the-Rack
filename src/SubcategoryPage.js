
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './shopp.css';
import Footerr from './Footerr';
import Shop_header from './Shop_header';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import Banner1 from './img/banner1.jpg'
import './nav.css'
import Bag from './img/bag.png'
import Cart from './img/cartt.png'
import Home from './img/homee.png'
import Wish from './img/wishh.png'
import Order from './img/orderr.png'
import SignupIcon from './img/regis.png'

import Modal from './Modal';
import User from './img/user.png'
import Logoo from './img/logo1.jpg'
import Logout from './img/logout.png'
import Edit from './img/edit.png'
import Setting from './img/profile_settings.png'

function SubcategoryPage() {
    const { subCategory } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasReloaded, setHasReloaded] = useState(false);
    const location = useLocation();

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
    useEffect(() => {
      
      const fetchAllProducts = async () => {
        try {
          // Use subCategory as is without replacing hyphens to preserve correct subcategory names like "T-shirt"
          const normalizedSubCategory = subCategory ? subCategory : '';
          const response = await axios.get(`http://localhost:5000/productByCat?subcategory=${normalizedSubCategory}`);
  
          const productsData = response.data.products;
          const productSizeData = response.data.product_size_qty;
  
          const updatedProducts = productsData.map(product => {
  
            const sizeQty = productSizeData
              .filter(item => {
  
                return parseInt(item.product_id) === product.id;
              })
              .map(item => ({ size: item.sizee, quantity: item.quantity }));
            return {
              ...product,
              size_qty: sizeQty,
            };
          });
  
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          console.log("Fetched Products:", updatedProducts);
         
        } catch (error) {
          console.error('Error fetching all products:', error);
        }
      };
      fetchAllProducts();
    }, [subCategory]);

    useEffect(() => {
      const fetchAllProducts = async () => {
        try {
          // Use subCategory as is without replacing hyphens to preserve correct subcategory names like "T-shirt"
          const normalizedSubCategory = subCategory ? subCategory : '';
          const response = await axios.get(`http://localhost:5000/productByCat?subcategory=${normalizedSubCategory}`);

          const productsData = response.data.products;
          const productSizeData = response.data.product_size_qty;

          const updatedProducts = productsData.map(product => {

            const sizeQty = productSizeData
              .filter(item => {

                return parseInt(item.product_id) === product.id;
              })
              .map(item => ({ size: item.sizee, quantity: item.quantity }));
            return {
              ...product,
              size_qty: sizeQty,
            };
          });

          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          console.log("Fetched Products on location change:", updatedProducts);

        } catch (error) {
          console.error('Error fetching all products on location change:', error);
        }
      };
      fetchAllProducts();
    }, [location.pathname]);
  
    useEffect(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      console.log("Search Query:", searchQuery);
  
      const filtered = products.filter(product => {
        return (
          product.product_name.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery) ||
          product.subcategory.toLowerCase().includes(lowerCaseQuery) ||
          product.color.toLowerCase().includes(lowerCaseQuery) ||
          product.descrip.toLowerCase().includes(lowerCaseQuery)
        );
      });
  
      setFilteredProducts(filtered); // Update filtered products
      console.log(filteredProducts);
    }, [searchQuery, products]);
  
    const navigate = useNavigate();
  
    const handleProductClick = (id) => {
      navigate(`/product/${id}`);
    };
    const authToken = localStorage.getItem('authToken');
  
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      navigate("/");
    };
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const categories = {
      Clothes: ['T-shirt', 'One Piece', 'Three Piece', 'Pant'],
      Jewellery: ['Ring', 'Earring', 'Necklace', 'Bracelet'],
      Footwear: ['Sandal', 'Heels', 'Sneakers'],
      Bags: ['Backpack', 'Handbag'],
    };
  
    const categoryImages = {
      Clothes: require('./img/dress.png'),
      Jewellery: require('./img/jewel.png'),
      Bags: require('./img/bagg.png'),
      Footwear: require('./img/shoe.png'),
  
    };
  
    const handleMouseEnter = (category) => {
      setHoveredCategory(category);
    };
  
    const handleMouseLeave = () => {
      setHoveredCategory(null);
    };

    
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const brands = ['brandA', 'brandB', 'brandC'];
  const colors = [
    'Black', 'Blue', 'Brown', 'Cyan', 'Golden', 'Green', 'Grey',
    'Maroon', 'Olive', 'Orange', 'Pink', 'Purple', 'Red', 'White',
    'Yellow', 'Magenta', 'Silver'
  ];

  const handleBrandChange = (brand) => {
    setSelectedBrands(prevState =>
      prevState.includes(brand) ? prevState.filter(b => b !== brand) : [...prevState, brand]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors(prevState =>
      prevState.includes(color) ? prevState.filter(c => c !== color) : [...prevState, color]
    );
  };

  const handleApplyPrice = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min) && !isNaN(max)) {
        const filtered = filteredProducts.filter(item => item.base_price >= min && item.base_price <= max);
        setFilteredProducts(filtered);
    }
   };
  
   useEffect(() => {
     setFilteredData();
   }, [selectedBrands, selectedColors, minPrice, maxPrice]);
 
   const setFilteredData = () => {
     let filteredData = products.filter(product => {
       const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
       const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
       return matchesBrand && matchesColor ;
     });
     setFilteredProducts(filteredData);
   }; 
 
 
   const handleReset = () => {
       setFilteredProducts(products);
       setSelectedBrands([]);
       setSelectedColors([]);
       setMinPrice('');
       setMaxPrice('');
     
       navigate(`/shop/${subCategory}`);
   }
 
  
    return (
      <div>
        {/*  <Shop_header /> */}
        <div>
          <div className="navbar-container">
  
            <div className="logo" style={{ paddingRight: '0px' }}>
              <img src={Logoo} style={{ height: '40px' }} alt="settings" />
            </div>
            <div style={{
              paddingRight: '20px', paddingLeft: '130px',
            }}>
  
              <div className="searchbar">
                <input placeholder="⌕  Search.."
                  id="input" className="searchbar_in"
                  name="text"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange} />
              </div>
            </div>
  
            <div className="nav-links">
              <Link to="/home">  <img src={Home} style={{ width: '22px' }} alt="home" />  Home</Link>
              <Link to="/shop"> <img src={Bag} style={{ width: '22px' }} alt="Shopping Bag" />
                Shop</Link>
              <Link to="/cart"><img src={Cart} style={{ width: '23px' }} alt="cart" /> Cart</Link>
              {authToken ? (
                <>
                  <div className="dropdown">
                    <button onClick={toggleDropdown} className="dropbtn"
                      data-toggle="tooltip" data-placement="top" title="ACCOUNT" >
  
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
            {authToken ? (<>
            </>) : (<>
  
  
  
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
            </>)}
          </div>
  
  
          <div style={{ display: 'flex', position: 'relative', padding: '40px' }}>
  
            <div style={{ width: '20%', height: '500px', border: '1px solid #ccc', padding: '10px', alignContent: 'center', alignItems: 'center', backgroundColor: '#ffedf6', borderRadius: '20px', justifyContent: 'center' }}>
              <h3 style={{ alignItems: 'center' }}>Categories</h3>
              <ul style={{ listStyleType: 'none', padding: '10px' }}>
                {Object.keys(categories).map((category) => (
  
                  <li
                    key={category}
                    className="main-category"
                    onMouseEnter={() => handleMouseEnter(category)}
                    onMouseLeave={handleMouseLeave}
                    style={{ position: 'relative', padding: '10px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                  >
                    <div style={{ paddingTop: '10px', paddingBottom: '10px', fontWeight: 'bold', alignContent: 'center' }}>
                      <img src={categoryImages[category]} style={{ width: '34px', paddingRight: '10px' }} />
                      {category}  </div>
                    {hoveredCategory === category && (
                      <ul style={{
                        listStyleType: 'none',
                        padding: '10px',
                        margin: '0',
                        position: 'absolute',
                        top: '0',
                        left: '95%',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        zIndex: '1000', // Ensure it stays on top
                        width: '150px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
  
                    
                        {categories[category].map((subCategory) => (
                          <li key={subCategory} className="sub" style={{ padding: '5px 10px', borderBottom: '0.5px solid #e6e6e6' }}>
                            <Link
                              className="lilink"
                              to={`/shop/${subCategory}`} 
                              onClick={() => localStorage.setItem('current_subcat', subCategory)}
                            >
                              {subCategory}
                            </Link>
                          </li>
                        ))}
  
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ width: '80%', padding: '10px' }}>
              <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img className="d-block w-100" src={Banner1} alt="First slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block w-100"  src={Banner1} alt="Second slide" />
                  </div>
                  <div className="carousel-item">
                    <img className="d-block w-100"  src={Banner1}  alt="Third slide" />
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>
  
        </div>
  
     {/*    <div className="container" style={{ backgroundColor: 'transparent', marginTop: '20px', position: 'relative', zIndex: 1 }}>
          <div className="row" style={{ display: 'flex', gap: '35px', flexWrap: 'wrap' }}>
            {filteredProducts.map((product) => (
              <div className="col-12 col-md-6 col-lg-2" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div> */}

<div
        className="container-fluid"
        style={{
          backgroundColor: 'white',
          margin: '0',
          padding: '0',
          minHeight: '100vh', 
          display: 'flex',    
          flexDirection: 'row', 
        }}
      >
        {/* Left Sidebar for Filters */}
        <div
          className="col-12 col-md-3"
          style={{
            padding: '0px',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh', 
            position: 'sticky', 
            width: '260px',
            paddingLeft: '80px'
          }}
        >
          <h4></h4>

          {/* Brand Filter */}
          <div>
            <h6 style={{ fontWeight: 'bold' }}>Brand</h6>
            {brands.map(brand => (
              <div key={brand} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <label className="form-check-label" style={{ fontSize: '14px' }} htmlFor={brand}>{brand}</label>
              </div>
            ))}
          </div>
          <hr />
          {/* Color Filter */}
          <div>
            <h6 style={{ fontWeight: 'bold' }}>Colors</h6>
            {colors.map(color => (
              <div key={color} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={color}
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                />
                <label className="form-check-label" style={{ fontSize: '14px' }} htmlFor={color}>{color}</label>
              </div>
            ))}
          </div>
          <hr />
          {/* Price Filter */}
          <div>
            <h6 style={{ fontWeight: 'bold' }}>Price</h6>
            <div className="form-group">
             
              <input
                 type="number"
                 placeholder="Min Price"
                 value={minPrice}
                 onChange={(e) => setMinPrice(e.target.value)}
                style={{ width: '160px', height: '30px',fontSize:'14px'}}
              />
            </div>
            <div className="form-group">
           
              <input
                 type="number"
                 placeholder="Max Price"
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '160px', height: '30px', fontSize:'14px'}}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleApplyPrice}
              style={{ fontSize: '14px', fontWeight: 'bold', padding:'3px 6px', marginRight: '10px' }}
            >
              Apply
            </button>

            <button
              className="btn btn-primary"
              onClick={handleReset}
              style={{  fontSize: '14px', fontWeight: 'bold',  padding:'3px 8px' }}
            >
              Reset
            </button>

          </div>
        </div>

        {/* Right Side for Products */}
        <div className="col-12 col-md-9" style={{ padding: '20px', minHeight: '100vh' }}>
          <div className="row" style={{ display: 'flex', gap: '35px', flexWrap: 'wrap' }}>
            {filteredProducts.map((product) => (
              <div className="col-12 col-md-6 col-lg-2" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
        <Footerr />
      </div>
    );
  }
  
  
  function ProductCard({ product }) {
    const navigate = useNavigate();
  
    const handleProductClick = () => {
      navigate(`/product/${product.id}`, { state: { product } });
      // Pass the product details as state
    };
  
    return (
      <div
        onClick={handleProductClick}
        style={{
          paddingRight: '50px',
          width: '230px',
          height: '322px',
          borderRadius: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          justifyContent: 'center',
          boxShadow: '10px 10px 30px #e6e6e6, -10px -10px 30px #ffffff',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        <img
          src={product.img}
          className="card-img-top"
          alt={product.product_name}
          style={{ height: '79%', objectFit: 'cover' }}
        />
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card-title" style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {product.product_name}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#ab0965', fontWeight: 'bold' }}>
            Tk {product.base_price}
          </div>
        </div>
      </div>
    );
}

export default SubcategoryPage;
