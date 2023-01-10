// to connect with cloudinary for storing meme images on cloud 
const cloudinary = require('cloudinary')
const dotenv = require('dotenv')
dotenv.config()
cloudinary.config({ 
    cloud_name: 'dcccp4imz', 
    api_key: '123373931675447', 
    api_secret: process.env.CLOUD_SECRET 
  });

  module.exports = cloudinary