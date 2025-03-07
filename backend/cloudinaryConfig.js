const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dvles1v12',
  api_key: '846384787959373',
  api_secret: '4ZrKqDmFv-UPLPPXxuAcM0Q7Xl0'
});

module.exports = cloudinary;
