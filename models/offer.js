const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    buyer: {type: Schema.Types.ObjectId, ref: 'User'},
    sale: {type: Schema.Types.ObjectId, ref: 'Sale'},
    amount: {type: Number, minimum: 0.01, required: [true, 'amount is required']},
    status: {type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending'},
    saleTitle: {type: String}
},
{timestamps: true}
);


module.exports = mongoose.model('Offer', offerSchema);