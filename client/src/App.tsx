// We import useState to store data that can change on screen
import {useState, useEffect} from 'react';

// This describes the shape of a supermarket object we get from the server
interface Supermarket {
  _id: string;
  name: string;
  city: string;
  address: string;
}

interface Price {
  _id: string;
  productName: string;
  price: number;
  category: string;
  supermarketId: string;
  updatedAt: string;
};

// This is our main component - the face of our app
function App(){
  // Stores the list of supermarkets fetched from the server
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);

  // Stores the list of prices fetched from the server
  const [prices, setPrices] = useState<Price[]>([]);

  // Stores the form input values
  const [form, setForm] = useState({name: '', city: '', address: ''});

  // Stores the price form input values
  const [priceForm, setPriceForm] = useState({
    productName: '',
    price: 0,
    category: '',
    supermarketId: ''
  });
  
  // Runs automatically when the page loads — fetches all supermarkets
  useEffect(() => {
    fetch('http://localhost:3000/supermarkets')
      .then((res) => res.json())
      .then((data) => setSupermarkets(data));
  }, []);

  // Sends a POST request to create a new supermarket
  const addSupermarket = () => {
    fetch('http://localhost:3000/supermarkets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then((newSupermarket) => setSupermarkets([...supermarkets, newSupermarket]));
  };

  // Sends a POST request to create a new price
  const addPrice = () => {
    fetch('http://localhost:3000/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(priceForm),
    })
      .then((res) => res.json())
      .then((newPrice) => setPrices([...prices, newPrice]));
  };


  // return is what gets displayed on the screen
  return (
    <div>
      {/* This shows the message we got from the server */}
      <h1>Supermarkets</h1>
      {/* Form to add a new supermarket */}
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <button onClick={addSupermarket}>Add Supermarket</button>

      <h2>Add Price</h2>
      <input placeholder="Product Name" value={priceForm.productName} onChange={(e) => setPriceForm({ ...priceForm, productName: e.target.value })} />
      <input placeholder="Price" type="number" value={priceForm.price} onChange={(e) => setPriceForm({ ...priceForm, price: Number(e.target.value) })} />
      <input placeholder="Category (Dairy, Meat...)" value={priceForm.category} onChange={(e) => setPriceForm({ ...priceForm, category: e.target.value })} />
      
      {/* Dropdown reuses the supermarkets we already fetched */}
      <select value={priceForm.supermarketId} onChange={(e) => setPriceForm({ ...priceForm, supermarketId: e.target.value })}>
        <option value="">Select Supermarket</option>        
        {/* List of supermarkets from the database */}
        {supermarkets.map((s) => (
          <option key={s._id} value={s._id}> {s.name} - {s.city}</option>          
        ))}
        </select>
        <button onClick={addPrice}>Add Price</button>

        <h2>Prices</h2>
        {prices.map((p) => (
          <div key={p._id}>
            <p>{p.productName} - {p.price}₪ - {p.category}</p>
          </div>
        ))}      
    </div>
  );
}

// export default makes this component available to other files (like main.tsx)
export default App;