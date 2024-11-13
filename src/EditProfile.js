import React, { useEffect, useState } from 'react';
import Navbar from './navbar'
import './edit.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function EditProfile() {

    const navigate=useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        return re.test(phone);
    };

    const [formData, setFormData] = useState({
        current_password: '',
        new_username: '',
        new_email: '',
        new_phone: '',
        new_password: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!formData.current_password) {
            alert('Current password is required');
            return;
        }

        const updates = {};
        if (formData.new_username) updates.username = formData.new_username;
        if (formData.new_email) {
            if (!validateEmail(formData.new_email)) {
                alert('Please enter a valid email address');
                return;
            }
            updates.email = formData.new_email;
        }
        if (formData.new_phone) {
            if (!validatePhone(formData.new_phone)) {
                alert('Please enter a valid phone number');
                return;
            }
            updates.phone = formData.new_phone;
        }
        if (formData.new_password) {
            if (formData.new_password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            updates.password = formData.new_password;
        }

        try {
            const response = await axios.post('http://localhost:5000/updateProfile', {
                user_email: localStorage.getItem('user_mail'),
                current_password: formData.current_password,
                updates
            });

            if (response.data.success) {
                alert('Profile updated successfully');
                navigate("/myProfile");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile', error);
            alert('An error occurred while updating your profile');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="editcontainer">
                <div className="editform_area">
                    <p className="edittitle">Edit Profile</p>
                    <p style={{ opacity: '0.7', fontStyle: 'italic' }}>Update one or more fields below as needed</p>
                    <form >
                        <div className="editform_group">
                            <label className="editsub_title" htmlFor="current_password">Current Password <label style={{ color: 'red' }}> *</label></label>
                            <input placeholder="Enter your current password" className="editform_style" type="password" id="current_password" onChange={handleChange} />
                        </div>
                        <div className="editform_group">
                            <label className="editsub_title" htmlFor="new_username">New Username</label>
                            <input placeholder="Enter your new username" className="editform_style" type="text" id="new_username" onChange={handleChange} />
                        </div>
                        <div className="editform_group">
                            <label className="editsub_title" htmlFor="new_email">New Email</label>
                            <input placeholder="Enter your new email" className="editform_style" type="email" id="new_email" onChange={handleChange} />
                        </div>
                        <div className="editform_group">
                            <label className="editsub_title" htmlFor="new_phone">New Phone No.</label>
                            <input placeholder="Enter your phone no." className="editform_style" type="tel" id="new_phone" onChange={handleChange} />
                        </div>
                        <div className="editform_group">
                            <label className="editsub_title" htmlFor="new_password">New Password</label>
                            <input placeholder="Enter your new password" className="editform_style" type="password" id="new_password" onChange={handleChange} />
                        </div>
                        <div>
                            <button className="editbtn" onClick={handleUpdate}>Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
