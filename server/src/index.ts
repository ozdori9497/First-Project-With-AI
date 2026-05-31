import express from 'express';
// cors package allows our React app to talk to this server
// Without this, the browser blocks all requests from different ports
import cors from 'cors';

// mongoose lets Node.js talk to MongoDB
import mongoose from 'mongoose';

import supermarketsRouter from './routes/supermarkets';
import pricesRouter from './routes/prices';

const app = express();
const PORT = 3000;

// Address of our local MongoDB - 'marketprices' is our database name (auto-created)
const MONGO_URL = 'mongodb://localhost:27017/marketprices';
app.use(express.json());

//This tells Express to accept requests from our React app on port 5173
app.use(cors());

// Requests to /supermarkets go to supermarketsRouter
app.use('/supermarkets', supermarketsRouter);

// Requests to /prices go to pricesRouter
app.use('/prices', pricesRouter);


app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});


// Connect to MongoDB FIRST, then start the server
// We don't want requests coming in before the database is ready
mongoose.connect(MONGO_URL)
    .then(() => {
       console.log('Connected to MongoDB!');
       app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);        
       });
    })
    .catch((error) => {
        // MongoDB not running? We see this instead of a crash
        console.log('Failed to connect to MongoDB:', error);
    }
);
    