import axios from 'axios';
import zlib from 'zlib';
import { parseString } from 'xml2js';
import mongoose from 'mongoose';
import Supermarket from '../models/Supermarket';
import Price from '../models/Price';
import { getCategory } from './getCategory';

// Shufersal's public file listing API
const FILE_LIST_URL = 'http://prices.shufersal.co.il/FileObject/UpdateCategory?catID=2&storeId=0&page=1';
const MONGO_URL = 'mongodb://localhost:27017/marketprices';


async function run() {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Create Shufersal supermarket if it doesn't exist yet    
    let supermarket = await Supermarket.findOne( {name: 'Shufersal'});
    if (!supermarket) {
        supermarket = await Supermarket.create( {name: 'Shufersal', city: 'Israel', address: 'N/A' });
    }
    console.log('Using supermarket:', supermarket.name);

    // Feth file list and extract first download URL
    const response = await axios.get(FILE_LIST_URL);
    const html: string = response.data;
    // Extract all download URLs from the HTML using regex
    const matches = html.match(/href="(https:\/\/pricesprodpublic\.blob\.core\.windows\.net[^"]+)"/g);
    
    if (!matches) {
        console.log('No files found!');
        return;
    }

    // Clean up the first URL — remove href=" from start and " from end
    const firstUrl = matches[0].replace('href="', '').replace('"', '').replace(/&amp;/g, '&');    

    // Decompress the gzip file
    console.log('Downloading file...');
    const fileResponse = await axios.get(firstUrl, { responseType: 'arraybuffer' });                
    const decompressed = zlib.gunzipSync(Buffer.from(fileResponse.data));

    // Parse XML into JavaScript object
    console.log('Parsing XML...');
    const parsed: any = await new Promise((resolve, reject) => {
        parseString(decompressed.toString(), (err, result) => {
            if (err) {
                reject(err);
            } else { 
                resolve(result);
            }
        });
    });
    
    const items = parsed.Root.Items[0].Item;
    console.log(`Found ${items.length} products. Saving all...`);

    // Clear old prices before seeding - prevents duplicate products
    await Price.deleteMany({supermarketId: supermarket._id });
    console.log('Old prices cleared.');

    // Save all products with their real Hebrew category from the XML
    for (const item of items) {
        await Price.create({
            productName: item.ItemName[0],
            price: parseFloat(item.ItemPrice[0]),
            category: getCategory(item.ItemName[0]), // use real category, fall back to General if missing
            supermarketId: supermarket._id,
        });
    }

    console.log(`Done! ${items.length} prices saved to MongoDB.`);
    await mongoose.disconnect();
}

run().catch(console.error);

