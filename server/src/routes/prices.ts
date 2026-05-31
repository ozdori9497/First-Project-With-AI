import express from 'express';
import Price from '../models/Price';

const router = express.Router();

// GET /prices → returns all prices, or filter by category (?category=Dairy)
router.get('/', async (req, res) => {
    // If ?category=Dairy is in the URL, filter by it — otherwise return all
    const filter = req.query.category ? {category: req.query.category as string} : {};
    const prices = await Price.find(filter).populate('supermarketId');
    res.json(prices);
});

// POST /prices → creates a new price in MongoDB
router.post('/', async(req, res) => {
    const price = new Price(req.body);
    await price.save();
    res.json(price);    
});

export default router;