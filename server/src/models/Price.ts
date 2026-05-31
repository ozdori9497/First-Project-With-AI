import mongoose from "mongoose";

// Schema defines the shape of each price document in MongoDB
const PriceSchema = new mongoose.Schema({
    // ObjectId points to a Supermarket document — this is the relationship
    supermarketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supermarket', required: true },    
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    
    // Date.now runs automatically when a new price is saved
    updatedAt: { type: Date, default: Date.now }
});

const Price = mongoose.model('Price', PriceSchema);

export default Price;