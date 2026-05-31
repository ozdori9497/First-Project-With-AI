import express  from "express";

// Import our SuperMarket model to interact with MongoDB
import Supermarket from "../models/Supermarket";

const router = express.Router();

// GET /supermarkets -> returns all supermarkets from MongoDB
router.get('/', async (req, res) => {
    const supermarkets = await Supermarket.find();
    res.json(supermarkets);
});

// POST /supermarkets -> creates a new supermarket in MongoDB
router.post('/', async(req, res) =>{
    // req.body contains the data sent from the client
    const supermarket = new Supermarket(req.body);
    await supermarket.save();
    res.json(supermarket);
});

export default router;