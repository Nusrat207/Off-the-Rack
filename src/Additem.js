import React, { useState } from 'react';
import Seller_Home from './Seller_nav_side';
import Add from './img/add2.svg';
import './additem.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImgUpload';

export default function Additem() {
    const [formData, setFormData] = useState({
        product_name: '',
        price: '',
        category: '',
        subcategory: '',
        sizee: [],
        color: '',
        quantity: [],
        discount: '',
        descrip: '',
        img: '',
        brand: ''
    });

    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [sizeDisabled, setSizeDisabled] = useState(false);

    const categories = {
        clothes: ['T-shirt', 'One Piece', 'Three Piece', 'Pants'],
        footwear: ['Sandal', 'Heels', 'Sneakers'],
        bags: ['Handbag', 'Backpack'],
        jewellery: ['Necklace', 'Ring', 'Earring', 'Bracelet']
    };

    const colors = [
        'Black', 'Blue', 'Brown', 'Cyan', 'Golden', 'Green', 'Grey', 'Maroon', 'Olive', 'Orange', 'Pink', 'Purple', 'Red', 'White', 'Yellow', 'Magenta', 'Silver'
    ];

    const sizeOptions = {
        clothes: {
            'T-shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            'One Piece': ['30', '32', '34', '36', '38', '40', '42'],
            'Three Piece': ['30', '32', '34', '36', '38', '40', '42'],
            Pants: ['26', '28', '30', '32', '34', '36', '38', '40', '42']
        },
        footwear: ['34', '35', '36', '37', '38', '39', '40', '41', '42']
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        setSubcategories(categories[selectedCategory] || []);
        setFormData({ ...formData, category: selectedCategory, sizee: [], quantity: [] });
        setSizeDisabled(selectedCategory === 'bags' || selectedCategory === 'jewellery');
        setSizes(selectedCategory === 'bags' || selectedCategory === 'jewellery' ? [] : []);
    };

    const handleSubcategoryChange = (e) => {
        const selectedSubcategory = e.target.value;
        setSubcategory(selectedSubcategory);
        setFormData({ ...formData, subcategory: selectedSubcategory, sizee: [], quantity: [] });
        setSizes(sizeOptions[category]?.[selectedSubcategory] || sizeOptions[category] || []);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };


    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;

        if (category === 'bags' || category === 'jewellery') {
            setFormData({ ...formData, sizee: [selectedSize] });
            return;
        }

        const updatedSizes = formData.sizee.includes(selectedSize)
            ? formData.sizee.filter(size => size !== selectedSize)
            : [...formData.sizee, selectedSize];


        const updatedQuantity = updatedSizes.map(size => {
            if (!formData.quantity.find(q => q.size === size)) {
                return { size, quantity: '' };
            }
            return formData.quantity.find(q => q.size === size);
        });

        setFormData({ ...formData, sizee: updatedSizes, quantity: updatedQuantity });
    };
    const [bagJewelryQuantity, setBagJewelryQuantity] = useState('');


    const handleBagJewelryQuantityChange = (e) => {
        setBagJewelryQuantity(e.target.value);
    };


    const handleQuantityChange = (e) => {
        const size = e.target.id;
        const quantity = e.target.value;

        const updatedQuantities = formData.quantity.map(item =>
            item.size === size ? { ...item, quantity: quantity } : item
        );

        setFormData({ ...formData, quantity: updatedQuantities });
    };


    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        //handleUpload();
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:5000/uploadimg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.imageUrl);
            console.log('Image uploaded:', response.data.imageUrl);
            localStorage.setItem('imgURL', response.data.imageUrl);
            //alert("img uploaded!");
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };


    const navigate = useNavigate();
    /*
    const handleAdd = async (e) => {
        e.preventDefault();

        const seller_email = localStorage.getItem('seller_mail');
        const img = localStorage.getItem('imgURL');

        const productData = {
            product_name: formData.product_name,
            category: formData.category,
            subcategory: formData.subcategory,
            base_price: formData.price,
            img: img,
            seller: seller_email,
            discount: formData.discount,
            descrip: formData.descrip,
            color: formData.color,
            sizee: formData.sizee,
            quantity: formData.quantity,
            brand: formData.brand,
            bagJewelryQuantity: category === 'bags' || category === 'jewellery' ? bagJewelryQuantity : undefined
        };

        try {
            const response = await axios.post('http://localhost:5000/addproductz', productData);

            if (response.status === 200) {
                alert('Product and sizes added successfully!');
                navigate('/Products')
            }
        } catch (error) {
            console.error('There was an error adding the product!', error);
            alert('Failed to add product. Please try again.');
        }
    }; */
    const handleAdd = async (e) => {
        e.preventDefault();
    
        const seller_email = localStorage.getItem('seller_mail');
        const img = localStorage.getItem('imgURL');
    
        const requiredFields = [
            formData.product_name,
            formData.category,
            formData.subcategory,
            formData.price,
            formData.discount,
            formData.descrip,
            formData.color,
            formData.sizee,
            formData.quantity,
            formData.brand,
            seller_email,
            img
        ];
    
        // Additional check for bags or jewellery
        if ((formData.category === 'bags' || formData.category === 'jewellery') && !bagJewelryQuantity) {
            alert("Please enter the quantity for Bags or Jewellery.");
            return;
        }
    
        // Check if any field is empty
        const isEmpty = requiredFields.some(field => field === undefined || field === null || field === '');
    
        if (isEmpty) {
            alert("All fields are required. Please fill in every input.");
            return;
        }
    
        const productData = {
            product_name: formData.product_name,
            category: formData.category,
            subcategory: formData.subcategory,
            base_price: formData.price,
            img: img,
            seller: seller_email,
            discount: formData.discount,
            descrip: formData.descrip,
            color: formData.color,
            sizee: formData.sizee,
            quantity: formData.quantity,
            brand: formData.brand,
            bagJewelryQuantity: (formData.category === 'bags' || formData.category === 'jewellery') ? bagJewelryQuantity : undefined
        };
    
        try {
            const response = await axios.post('http://localhost:5000/addproductz', productData);
    
            if (response.status === 200) {
                alert('Product and sizes added successfully!');
                navigate('/Products');
            }
        } catch (error) {
            console.error('There was an error adding the product!', error);
            alert('Failed to add product. Please try again.');
        }
    };
    


    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            <Seller_Home />
            <div className="addcontainer" style={{ 
                paddingTop:'90px',
                display: 'flex', 
                maxWidth: '1200px', 
                margin: '20px auto',
                padding: '20px',
                gap: '30px',
                alignItems: 'flex-start'
            }}>
                {/* Left Image Section */}
                <div className="addimg-container" style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <img src={Add} style={{ 
                            width: '100%', 
                            maxWidth: '350px',
                            objectFit: 'contain',
                            marginBottom: '20px'
                        }} alt="Add product illustration" />
                        <h3 style={{
                            color: '#2d3748',
                            marginBottom: '10px',
                            fontSize: '18px'
                        }}>Add New Product</h3>
                        <p style={{
                            color: '#718096',
                            fontSize: '14px',
                            lineHeight: '1.5'
                        }}>Fill out the form to add a new product to your inventory. Make sure to provide accurate details for better visibility.</p>
                    </div>
                </div>
                
                {/* Right Form Section */}
                <div className="addform-container" style={{
                    flex: 2,
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                    <div className="addform_area">
                        <h2 style={{
                            fontSize: '22px',
                            fontWeight: '600',
                            color: '#2d3748',
                            marginBottom: '25px',
                            paddingBottom: '15px',
                            borderBottom: '1px solid #edf2f7'
                        }}>Product Details</h2>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {/* First Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="addform_group">
                                    <label className="addsub_title" style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }} htmlFor="product_name">Product Name*</label>
                                    <input style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        transition: 'all 0.2s',
                                        backgroundColor: '#f8fafc',
                                        ':focus': {
                                            borderColor: '#4299e1',
                                            outline: 'none',
                                            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                            backgroundColor: '#fff'
                                        }
                                    }} placeholder="Enter product name" type="text" id="product_name" value={formData.product_name} onChange={handleChange} />
                                </div>

                                <div className="addform_group">
                                    <label className="addsub_title" style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }} htmlFor="price">Price (Tk)*</label>
                                    <input style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        backgroundColor: '#f8fafc',
                                        ':focus': {
                                            borderColor: '#4299e1',
                                            outline: 'none',
                                            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                            backgroundColor: '#fff'
                                        }
                                    }} placeholder="Enter unit price" type="text" id="price" value={formData.price} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Second Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="addform_group">
                                    <label className='addsub_title' style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }} htmlFor="category">Category*</label>
                                    <select style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        backgroundColor: '#f8fafc',
                                        cursor: 'pointer',
                                        ':focus': {
                                            borderColor: '#4299e1',
                                            outline: 'none',
                                            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                            backgroundColor: '#fff'
                                        }
                                    }} id="category" value={category} onChange={handleCategoryChange}>
                                        <option value="">Select category</option>
                                        <option value="clothes">Clothes</option>
                                        <option value="footwear">Footwear</option>
                                        <option value="bags">Bags</option>
                                        <option value="jewellery">Jewellery</option>
                                    </select>
                                </div>

                                <div className="addform_group">
                                    <label className='addsub_title' style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }} htmlFor="subcategory">Subcategory*</label>
                                    <select style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        backgroundColor: category ? '#f8fafc' : '#edf2f7',
                                        cursor: category ? 'pointer' : 'not-allowed',
                                        ':focus': {
                                            borderColor: '#4299e1',
                                            outline: 'none',
                                            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                            backgroundColor: '#fff'
                                        }
                                    }} id="subcategory" disabled={!category} value={subcategory} onChange={handleSubcategoryChange}>
                                        <option value="">Select subcategory</option>
                                        {subcategories.map((subcategory, index) => (
                                            <option key={index} value={subcategory}>
                                                {subcategory}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Sizes Section */}
                            {category !== 'bags' && category !== 'jewellery' && (
                                <div className="addform_group">
                                    <label className="addsub_title" style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }}>Available Sizes*</label>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '12px'
                                    }}>
                                        {sizes.map((size, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                backgroundColor: formData.sizee.includes(size) ? '#ebf8ff' : '#f8fafc',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                border: `1px solid ${formData.sizee.includes(size) ? '#4299e1' : '#e2e8f0'}`,
                                                transition: 'all 0.2s'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    value={size}
                                                    checked={formData.sizee.includes(size)}
                                                    onChange={handleSizeChange}
                                                    id={`size-${size}`}
                                                    style={{ 
                                                        cursor: 'pointer',
                                                        accentColor: '#4299e1'
                                                    }}
                                                />
                                                <label htmlFor={`size-${size}`} style={{
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    color: '#4a5568'
                                                }}>{size}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Inputs */}
                            {formData.sizee.length > 0 && category !== 'bags' && category !== 'jewellery' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                    gap: '15px',
                                    marginTop: '5px'
                                }}>
                                    {formData.sizee.map((size, index) => (
                                        <div key={index} style={{ marginBottom: '5px' }}>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '6px',
                                                fontSize: '13px',
                                                color: '#718096'
                                            }}>{size} Quantity*</label>
                                            <input
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    backgroundColor: '#f8fafc',
                                                    ':focus': {
                                                        borderColor: '#4299e1',
                                                        outline: 'none',
                                                        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                                        backgroundColor: '#fff'
                                                    }
                                                }}
                                                type="number"
                                                min="1"
                                                id={size}
                                                value={formData.quantity.find(q => q.size === size)?.quantity || ''}
                                                onChange={(e) => handleQuantityChange(e)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Bags/Jewelry Quantity */}
                            {(category === 'bags' || category === 'jewellery') && (
                                <div className="addform_group">
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }}>Quantity*</label>
                                    <input
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            backgroundColor: '#f8fafc',
                                            ':focus': {
                                                borderColor: '#4299e1',
                                                outline: 'none',
                                                boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                                backgroundColor: '#fff'
                                            }
                                        }}
                                        type="number"
                                        min="1"
                                        value={bagJewelryQuantity}
                                        onChange={handleBagJewelryQuantityChange}
                                    />
                                </div>
                            )}

                            {/* Third Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="addform_group">
                                    <label className="addsub_title" style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }} htmlFor="color">Color*</label>
                                    <select
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            backgroundColor: '#f8fafc',
                                            cursor: 'pointer',
                                            ':focus': {
                                                borderColor: '#4299e1',
                                                outline: 'none',
                                                boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                                backgroundColor: '#fff'
                                            }
                                        }}
                                        id="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select color</option>
                                        {colors.map((color, index) => (
                                            <option key={index} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="addform_group">
                                    <label className="addsub_title" style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }} htmlFor="brand">Brand*</label>
                                    <input
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            backgroundColor: '#f8fafc',
                                            ':focus': {
                                                borderColor: '#4299e1',
                                                outline: 'none',
                                                boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                                backgroundColor: '#fff'
                                            }
                                        }}
                                        placeholder="Enter brand name"
                                        type="text"
                                        id="brand"
                                        value={formData.brand || ''}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Fourth Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="addform_group">
                                    <label className="addsub_title" style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }} htmlFor="discount">Discount (%)*</label>
                                    <input
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            backgroundColor: '#f8fafc',
                                            ':focus': {
                                                borderColor: '#4299e1',
                                                outline: 'none',
                                                boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                                backgroundColor: '#fff'
                                            }
                                        }}
                                        placeholder="0-100%"
                                        type="number"
                                        id="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                <div className="addform_group">
                                    <label className="addsub_title" style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#4a5568',
                                        fontSize: '14px'
                                    }}>Product Image*</label>
                                    <div style={{
                                        border: '1px dashed #cbd5e0',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        backgroundColor: '#f8fafc',
                                        transition: 'all 0.2s',
                                        ':hover': {
                                            borderColor: '#4299e1',
                                            backgroundColor: '#ebf8ff'
                                        }
                                    }}>
                                        <input 
                                            type="file" 
                                            onChange={handleImageChange} 
                                            style={{ 
                                                fontSize: '14px',
                                                width: '100%',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button 
                                                style={{ 
                                                    padding: '8px 16px',
                                                    backgroundColor: '#4299e1',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    transition: 'background-color 0.2s',
                                                    ':hover': {
                                                        backgroundColor: '#3182ce'
                                                    }
                                                }} 
                                                onClick={handleUpload}
                                            >
                                                Upload Image
                                            </button>
                                            <span style={{ fontSize: '13px', color: '#718096' }}>
                                                {image ? 'Ready to upload' : 'No file selected'}
                                            </span>
                                        </div>
                                        {imageUrl && (
                                            <div style={{ 
                                                marginTop: '15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '15px'
                                            }}>
                                                <img src={imageUrl} alt="Uploaded preview" style={{ 
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: '1px solid #e2e8f0'
                                                }} />
                                                <span style={{ fontSize: '13px', color: '#38a169' }}>
                                                    Image uploaded successfully!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="addform_group">
                                <label className="addsub_title" style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#4a5568',
                                    fontSize: '14px'
                                }} htmlFor="descrip">Description*</label>
                                <textarea
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        minHeight: '100px',
                                        resize: 'vertical',
                                        backgroundColor: '#f8fafc',
                                        ':focus': {
                                            borderColor: '#4299e1',
                                            outline: 'none',
                                            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                            backgroundColor: '#fff'
                                        }
                                    }}
                                    placeholder="Enter product description (max 250 characters)"
                                    id="descrip"
                                    value={formData.descrip}
                                    maxLength={250}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 250) {
                                            setFormData({ ...formData, descrip: e.target.value });
                                        }
                                    }}
                                    rows={3}
                                />
                                <div style={{ 
                                    fontSize: '12px', 
                                    color: formData.descrip.length === 250 ? '#e53e3e' : '#718096', 
                                    textAlign: 'right',
                                    marginTop: '4px'
                                }}>
                                    {formData.descrip.length}/250 characters
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end',
                                marginTop: '20px'
                            }}>
                                <button 
                                    style={{
                                        padding: '12px 30px',
                                        backgroundColor: '#4299e1',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        ':hover': {
                                            backgroundColor: '#3182ce',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                        },
                                        ':active': {
                                            transform: 'translateY(0)'
                                        }
                                    }} 
                                    onClick={handleAdd}
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
