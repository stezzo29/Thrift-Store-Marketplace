//const e = require("express");
//const { v4: uuidv4 } = require('uuid');
//const { upload } = require('./middleware/fileUpload');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({ 
    condition: {type: String, required: [true, 'condition is required']},
    title: {type: String, required: [true, 'title is required']},
    size: {type: String, required: [true, 'size is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'seller is required'] },
    price: {type: Number, required: [true, 'price is required'], min: [0.01, 'Price must be at least 0.01']},
    details: {type: String, required: [true, 'details is required'], 
        minLength: [10, 'details should have at least 10 characters ']},
    image: {type: String, required: [true, 'image path is required']},
    active: {type: Boolean, default: true},
    offers: {type: Number, default: 0},  
    highestOffer: {type: Number, default: 0}
},
{timestamps: true}
);

module.exports = mongoose.model('Sale', saleSchema);