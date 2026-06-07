import express from 'express';
import Price from '../models/Price';

const router = express.Router();

// GET /prices → returns all prices, or filter by category (?category=Dairy)
router.get('/', async (req, res) => {
    // Build filter from query params - both category and supermarkertId are optional
    const filter: any = {};
    if (req.query.category) {
        filter.category = req.query.category as string;
    }
    
    if (req.query.supermarketId) {
        filter.supermarketId = req.query.supermarketId as string;
    }

    // Which page to show - default is page 1
    const page = parseInt(req.query.page as string) || 1;

    // How many products per page - default is 20
    const limit = parseInt(req.query.limit as string) || 20;

    // How many products to skip - page 1 skips 0, page 2 skips 20, etc.
    const skip = (page - 1) * limit;

    // Fetch only the products for this page + total count for React to calculate pages
    const [prices, total] = await Promise.all([
        Price.find(filter).populate('supermarketId').skip(skip).limit(limit),
        Price.countDocuments(filter)
    ]);
    
    // Send prices + total so React knows hot many pages exist    
    res.json({prices, total, page, limit });
});

// POST /prices → creates a new price in MongoDB
router.post('/', async(req, res) => {
    const price = new Price(req.body);
    await price.save();
    res.json(price);    
});

export default router;