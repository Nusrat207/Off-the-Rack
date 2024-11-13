import React, { useState } from 'react';
import Seller_Home from './Seller_nav_side'
import Add from './img/add2.svg'
import './additem.css'
import axios from 'axios';

export default function Additem() {

    const [formData, setFormData] = useState({
        product_name: '',
        price: '',
        category: '',
        subcategory: '',
        sizee: '',
        color: '',
        quantity: '',
        descrip: '',
        img: ''
    });

    const [category, setCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const categories = {
        clothes: ['T-shirt', 'One Piece', 'Three Piece', 'Pants'],
        footwear: ['Sandal', 'Heels', 'Sneakers'],
        bags: ['Handbag', 'Backpack'],
        jewellery: ['Necklace', 'Ring', 'Earring', 'Bracelet']
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        setSubcategories(categories[selectedCategory] || []);
        setFormData({ ...formData, category: selectedCategory });
    };

    const colors = [
        'Black', 'Blue', 'Brown', 'Cyan', 'Golden', 'Green', 'Grey',  'Maroon', 'Olive', 'Orange', 'Pink', 'Purple', 'Red', 'White','Yellow', 'Magenta', 'Silver'
    ];

    const colorHexCodes = {
        Black: '#000000',  Blue: '#0000FF',  Brown: '#A52A2A',  Cyan: '#00FFFF', Golden: '#FFD700',  Green: '#008000', Grey: '#808080',
        Maroon: '#800000',  Olive: '#808000', Orange: '#FFA500',  Pink: '#FFC0CB',  Purple: '#800080', Red: '#FF0000',  White: '#FFFFFF', Yellow: '#FFFF00', Magenta: '#FF00FF'
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const seller_email = localStorage.getItem('seller_mail');

        try {
            const response = await axios.post('http://localhost:5000/addproduct', 
                { ...formData, seller_email });
            console.log(response.data);
            
            if (response.data.success){
                alert('Product added successfully!');
            }else{
                alert('error adding the product');
            }
        } catch (error) {
            console.error('There was an error adding the product!', error);
        }
    };

    return (
        <div style={{ backgroundColor: 'whitesmoke' }}>
            <Seller_Home />
            <div className="addcontainer">
                <div className="addimg-container">
                    <img src={Add} style={{ width: '500px' }} alt="..." />
                </div>
                <div className="addform-container">
                    <div className="addform_area">
                        <p className="addtitle">Add Product</p>

                        <form >
                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="product_name">Product Name</label>
                                <input placeholder="enter your product's name" className="addform_style" 
                                type="text" id="product_name"  value={formData.product_name} onChange={handleChange} />
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
                                <select className="addform_style" id="subcategory" disabled={!category} value={formData.subcategory}
                                    onChange={handleChange}>
                                    <option value="">Select subcategory</option>
                                    {subcategories.map((subcategory, index) => (
                                        <option key={index} value={subcategory}>
                                            {subcategory}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="size">Size</label>
                                <input placeholder="list the sizes separated by commas (e.g.- S, M, L or 30, 32, 34)"  value={formData.sizee}
                                    onChange={handleChange} className="addform_style" type="text" id="sizee" />
                            </div>

                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="color">Color</label>
                                <select className="addform_style" id="color" value={formData.color}
                                    onChange={handleChange}>
                                    <option value="">Select color</option>
                                    {colors.map((color, index) => (
                                        <option key={index} value={color}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                
                                                {color}

                                                <span
                                                    style={{
                                                        width: '5px',
                                                        height: '5px',
                                                        backgroundColor: colorHexCodes[color],
                                                        borderRadius: '50%',
                                                        marginRight: '1px'
                                                    }}
                                                ></span>
                                            </div>
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="qty">Quantity</label>
                                <input placeholder="quantity available" className="addform_style" type="text"  id="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange} />
                            </div>
                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="desc">Description</label>
                                <input placeholder="product desciption or any specification you want to mention" className="addform_style" type="text" id="descrip" value={formData.descrip}
                                    onChange={handleChange}/>
                            </div>
                            <div className="addform_group">
                                <label className="addsub_title" htmlFor="img">Image URL</label>
                                <input placeholder="u may use postimages.org to upload img and paste the direct link here" className="addform_style" type="text" id="img" value={formData.img}
                                    onChange={handleChange} />
                            </div>
                            <div style={{marginLeft:'170px'}}>
                                <button className="addbtn" onClick={handleAdd} >Add</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

        </div>
    )
}
