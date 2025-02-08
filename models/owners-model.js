const mongoose = require('mongoose');
const ownerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    products: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        default: [],
    },
    contact: Number,
    picture: String,
    gstin: String,
});

module.exports = mongoose.model('owner', ownerSchema);