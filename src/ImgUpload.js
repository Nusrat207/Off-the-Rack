import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImage(file);

    // Generate a preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result); // Store the image preview in state
    };
    if (file) {
      reader.readAsDataURL(file); // Read the file as a data URL
    }
    handleUpload();
  };

  const handleUpload = async () => {
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
      alert("img uploaded!");
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleImageChange} />
      
      {/* Show image preview if available 
      {previewUrl && (
        <div>
          <h3>Image Preview:</h3>
          <img
            src={previewUrl}
            alt="Image Preview"
            style={{ width: '200px', height: 'auto', marginBottom: '20px' }}
          />
        </div>
      )}*/}

      {/* Display the uploaded image URL */}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ width: '200px' }} />
        </div>
      )} 
    </div>
  );
};

export default ImageUpload;
