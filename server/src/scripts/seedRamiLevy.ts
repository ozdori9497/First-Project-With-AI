import * as ftp from 'basic-ftp';
import zlib from 'zlib';
import { parseString } from 'xml2js';
import mongoose from 'mongoose';
import Supermarket from '../models/Supermarket';
import Price from '../models/Price';
import { getCategory } from './getCategory';

const MONGO_URL = 'mongodb://localhost:27017/marketprices';

async function run() {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    // Create Rami Levy supermarket if it doesn't exist yet
    let supermarket = await Supermarket.findOne({ name: 'Rami Levy' });
    if (!supermarket) {
        supermarket = await Supermarket.create({ name: 'Rami Levy', city: 'Israel', address: 'N/A' });
    }
    console.log('Using supermarket:', supermarket.name);

    // Connect to Rami Levy FTP server
    const client = new ftp.Client(30000);
    console.log('Connecting to FTP...');
    await client.access({
        host: 'url.retail.publishedprices.co.il',
        user: 'RamiLevi',
        password: '',
        secure: false
    });

    // Get list of PriceFull files and pick the first one
    const list = await client.list('/');
    const priceFull = list.filter(f => f.name.startsWith('PriceFull'));
    console.log(`Found ${priceFull.length} PriceFull files. Downloading first...`);

    // Download the file into memory as a buffer
    const chunks: Buffer[] = [];
    await client.downloadTo(
        require('stream').Writable({
            write(chunk: Buffer, _: string, cb: () => void) {
                chunks.push(chunk);
                cb();
            }
        }),
        priceFull[0].name
    );
    client.close();

    // Decompress gzip and parse XML
    const buffer = Buffer.concat(chunks);
    const decompressed = zlib.gunzipSync(buffer);
    console.log('Parsing XML...');
    const parsed: any = await new Promise((resolve, reject) => {
        parseString(decompressed.toString(), (err, result) => {
            if (err) reject(err); else resolve(result);
        });
    });

    const items = parsed.Root.Items[0].Item;
    console.log(`Found ${items.length} products. Saving all...`);

    // Clear old Rami Levy prices before saving new ones
    await Price.deleteMany({ supermarketId: supermarket._id });
    console.log('Old prices cleared.');

    // Save all products with Hebrew categories
    for (const item of items) {
        await Price.create({
            productName: item.ItemName[0],
            price: parseFloat(item.ItemPrice[0]),
            category: getCategory(item.ItemName[0]),
            supermarketId: supermarket._id,
        });
    }

    console.log(`Done! ${items.length} Rami Levy prices saved to MongoDB.`);
    await mongoose.disconnect();
}

run().catch(console.error);
