// models/Image.js
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    image: { type: String, required: true },
    text: { type: String, required: true },
    boldWords: { type: [String], required: true },
});

module.exports = mongoose.model('Image', ImageSchema);
