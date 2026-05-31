import mongoose from "mongoose";

// Schema defines the shape of each supermarket document in MongoDB
const SupermarketSchema  = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    address: {type: String, required: true}
});

// Model is what we use in our routes to read/write to the database
// 'Supermarket' → MongoDB will create a collection called 'supermarkets' automatically
const Supermarket = mongoose.model('Supermarket', SupermarketSchema);

export default Supermarket;