import React, { useState } from 'react';
import Seller_Home from './Seller_nav_side';
import Add from './img/add2.svg';
import './additem.css';
import axios from 'axios';

export default function Additem() {
    const [formData, setFormData] = useState({
        product_name: '',
        price: '',
        category: '',
        subcategory: '',
        sizee: [],
        color: '',
        quantity: [],
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
        setFormData({ ...formData, category: selectedCategory, sizee: [], quantity: [] }); // Reset size and quantity
        setSizeDisabled(selectedCategory === 'bags' || selectedCategory === 'jewellery');
        setSizes(selectedCategory === 'bags' || selectedCategory === 'jewellery' ? [] : []); // No sizes for bags or jewellery
    };

    const handleSubcategoryChange = (e) => {
        const selectedSubcategory = e.target.value;
        setSubcategory(selectedSubcategory);
        setFormData({ ...formData, subcategory: selectedSubcategory, sizee: [], quantity: [] }); // Reset size and quantity
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


    const handleAdd = async (e) => {
        e.preventDefault();

        const seller_email = localStorage.getItem('seller_mail');


        const productData = {
            product_name: formData.product_name,
            category: formData.category,
            subcategory: formData.subcategory,
            base_price: formData.price,
            img: formData.img,
            seller: seller_email,
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
            }
        } catch (error) {
            console.error('There was an error adding the product!', error);
            alert('Failed to add product. Please try again.');
        }
    };



    return (
        <div style={{ backgroundColor: 'white' }}>
            <Seller_Home />
            <div className="addcontainer">
                <div className="addimg-container">
                    <img src={Add} style={{ width: '500px' }} alt="..." />
                </div>
                <div className="addform-container">
                    <div className="addform_area">
                        <p className="addtitle">Add Product</p>

                        <form>
                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="product_name">Product Name</label>
                                <input placeholder="enter your product's name" className="addform_style"
                                    type="text" id="product_name" value={formData.product_name} onChange={handleChange} />
                            </div>
                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="price">Price</label>
                                <input placeholder="enter unit price (Tk)" className="addform_style" type="text" id="price" value={formData.price}
                                    onChange={handleChange} />
                            </div>
                            <div className="addform_group">
                                <label className='addsub_title' htmlFor="category">Category</label>

                                <select className="addform_style" id="category" value={category} onChange={handleCategoryChange}>
                                    <option value="">Select category</option>
                                    <option value="clothes">Clothes</option>
                                    <option value="footwear">Footwear</option>
                                    <option value="bags">Bags</option>
                                    <option value="jewellery">Jewellery</option>
                                </select>
                            </div>

                            <div className="addform_group">
                                <label className='addsub_title' htmlFor="subcategory">Subcategory</label>
                                <select className="addform_style" id="subcategory" disabled={!category} value={subcategory} onChange={handleSubcategoryChange}>
                                    <option value="">Select subcategory</option>
                                    {subcategories.map((subcategory, index) => (
                                        <option key={index} value={subcategory}>
                                            {subcategory}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {category !== 'bags' && category !== 'jewellery' && (
                                <div className="addform_group">
                                    <label className="addsub_title" htmlFor="sizee">Size</label>
                                    <div className="size-selector">
                                        {sizes.map((size, index) => (
                                            <div key={index} className="size-checkbox">
                                                <input
                                                    type="checkbox"
                                                    value={size}
                                                    checked={formData.sizee.includes(size)}
                                                    onChange={handleSizeChange}
                                                    id={`size-${size}`}
                                                />
                                                <label htmlFor={`size-${size}`}>{size}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.sizee.length > 0 && category !== 'bags' && category !== 'jewellery' && (
                                <div className="size-quantity">
                                    {formData.sizee.map((size, index) => (
                                        <div key={index} className="quantity-input">
                                            <label>{size} Quantity</label>
                                            <input
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


                            {(category === 'bags' || category === 'jewellery') && (
                                <div className="quantity-input">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={bagJewelryQuantity}
                                        onChange={handleBagJewelryQuantityChange}
                                    />
                                </div>
                            )}

                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="color">Color</label>
                                <select
                                    className="addform_style"
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
                                <label className="addsub_title" htmlFor="brand">Brand</label>
                                <input
                                    placeholder="Enter product brand"
                                    className="addform_style"
                                    type="text"
                                    id="brand"
                                    value={formData.brand || ''}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>


                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="desc">Description</label>
                                <input placeholder="product description or any specification you want to mention" className="addform_style" type="text" id="descrip" value={formData.descrip}
                                    onChange={handleChange} />
                            </div>
                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="img">Image URL</label>
                               
                                <input placeholder="paste the direct link of Image URL here" className="addform_style" type="text" id="img" value={formData.img} onChange={handleChange} />
                                <label style={{color:'gray', fontSize:'14px', paddingLeft:'6px'}}>u may use postimages.org to upload img</label>
                            </div>

                            <div style={{ marginLeft: '150px' }}>
                                <button className="addbtn" onClick={handleAdd}>Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
