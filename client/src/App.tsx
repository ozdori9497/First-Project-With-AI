// We import useState to store data that can change on screen
import {useState, useEffect} from 'react';

// This describes the shape of a supermarket object we get from the server
interface Supermarket {
  _id: string;
  name: string;
  city: string;
  address: string;
}

// This is our main component - the face of our app
function App(){
 // Stores the list of supermarkets fetched from the server
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);

  // Stores the form input values
  const [form, setForm] = useState({name: '', city: '', address: ''});
  
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

      {/* List of supermarkets from the database */}
      {supermarkets.map((s) => (
        <div key={s._id}>
          <p>{s.name} - {s.city} - {s.address}</p>        
        </div>
      ))}
    </div>
  );
}

// export default makes this component available to other files (like main.tsx)
export default App;