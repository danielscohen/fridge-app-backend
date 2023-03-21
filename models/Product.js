const mongoose = require('mongoose');

const requiredText = field => `A ${field} is required`;

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, requiredText("name")],
        maxlength: 30,
    },
    category: {
        type: String,
        enum: ['produce', 'dairy', 'meat', 'cooked', 'other'],
        default: 'other',
    },
    barcode: {
        type: Number
    },
    expDate: {
        type: Date,
        required: [true, requiredText("date")],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Account',
        required: [true, requiredText("Account")],
    }
},
  { timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema);