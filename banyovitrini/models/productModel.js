//Product Information
const mongoose = require('mongoose'); // Erase if already required
const { type } = require('server/reply');

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        require: true,
    },
    brand: {
        type: String,
        require: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: [],
    color: [],
    tags: [],

    ratings: [{
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    ],
    totalrating: {
        type: String,
        default: 0,
    },
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('product', productSchema); 