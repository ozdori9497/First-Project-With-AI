import express from 'express';
// cors package allows our React app to talk to this server
// Without this, the browser blocks all requests from different ports
import cors from 'cors';

const app = express();
const PORT = 3000;
app.use(express.json());

//This tells Express to accept requests from our React app on port 5173
app.use(cors());


app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});