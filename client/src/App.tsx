// We import useState to store data that can change on screen
import { useState, useEffect } from "react";

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
  supermarketId: {_id: string; name: string };
  updatedAt: string;
}

// This is our main component - the face of our app
function App() {
  // Stores the list of supermarkets fetched from the server
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);

  // Stores the list of prices fetched from the server
  const [prices, setPrices] = useState<Price[]>([]);

  // Stores the form input values
  const [form, setForm] = useState({ name: "", city: "", address: "" });

  // Stores the selected category filter - empty string means "show all"
  const [filterCategory, setFilterCategory] = useState('');

  // Stores the selected supermarket filter - empty string means "show all"
  const [filterSupermarket, setFilterSupermarket] = useState('');

  // Tracks which page of prices we are curently on
  const [currentPage, setCurrentPage] = useState(1);

  // Stores total number of products - need to calcualte how many pages exist
  const [totalPrices, setTotalPrices] = useState(0);

  // Stores the price form input values
  const [priceForm, setPriceForm] = useState({
    productName: "",
    price: 0,
    category: "",
    supermarketId: "",
  });

  // Runs automatically when the page loads — fetches all supermarkets
  useEffect(() => {
    fetch("http://localhost:3000/supermarkets")
      .then((res) => res.json())
      .then((data) => setSupermarkets(data));
  }, []);

  // Reset to page 1 whenever the category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterSupermarket]);

  // Re-runs whenever filterCategory or currentPage changes
  useEffect(() => {
    // Build url with all active filters
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', '20');
    
    if (filterCategory) {
      params.set('category', filterCategory);
    }

    if (filterSupermarket) {
      params.set('supermarketId', filterSupermarket);
    }

    const url = `http://localhost:3000/prices?${params.toString()}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPrices(data.prices); // server now returns { prices, total } not just an array
        setTotalPrices(data.total); // save total so we can calculate number of pages
      });
  }, [filterCategory, filterSupermarket ,currentPage]);

  // Sends a POST request to create a new supermarket
  const addSupermarket = () => {
    fetch("http://localhost:3000/supermarkets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newSupermarket) =>
        setSupermarkets([...supermarkets, newSupermarket]),
      );
  };

  // Sends a POST request to create a new price
  const addPrice = () => {
    fetch("http://localhost:3000/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(priceForm),
    })
      .then((res) => res.json())
      .then((newPrice) => setPrices([...prices, newPrice]));
  };

  // return is what gets displayed on the screen
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header — blue background, white text, centered */}
      <div className="bg-blue-700 text-white p-6 mb-8">
        <h1 className="text-3xl font-bold text-center">
          🛒 Market Price Tracker
        </h1>
      </div>

      {/* Main container — max width 2xl, centered horizontally with mx-auto */}
      <div className="max-w-2xl mx-auto px-4">
        {/* Card — white box with rounded corners, shadow, and padding */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {/* mb-4 = margin bottom to separate title from inputs */}
          <h2 className="text-xl font-semibold mb-4">Add Supermarket</h2>
          {/* flex + gap-2 = puts inputs side by side with space between them */}
          <div className="flex gap-2 flex-wrap">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            {/* hover:bg-blue-700 = darker blue when mouse hovers over button */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              onClick={addSupermarket}
            >
              Add
            </button>
          </div>
        </div>

        {/* Card for adding a new price */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Price</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Product Name"
              value={priceForm.productName}
              onChange={(e) =>
                setPriceForm({ ...priceForm, productName: e.target.value })
              }
            />
            {/* w-24 = fixed small width for the price number input */}
            <input
              className="border rounded px-3 py-2 w-24"
              placeholder="Price"
              type="number"
              value={priceForm.price}
              onChange={(e) =>
                setPriceForm({ ...priceForm, price: Number(e.target.value) })
              }
            />
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Category"
              value={priceForm.category}
              onChange={(e) =>
                setPriceForm({ ...priceForm, category: e.target.value })
              }
            />
            <select
              className="border rounded px-3 py-2 flex-1 cursor-pointer"
              value={priceForm.supermarketId}
              onChange={(e) =>
                setPriceForm({ ...priceForm, supermarketId: e.target.value })
              }
            >
              <option value="">Select Supermarket</option>
              {supermarkets.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} - {s.city}
                </option>
              ))}
            </select>
            {/* Green button for adding prices — different color to distinguish from supermarket button */}
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              onClick={addPrice}
            >
              Add
            </button>
          </div>
        </div>

        {/* Card for prices list + category filter */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* justify-between = title on left, dropdowns on right */}
          <div className="flex justify-between items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold">Prices</h2>
            {/* Supermarket filter — dynamically built from supermarkets we already fetched */}
            <select className="border rounded px-3 py-2 cursor-pointer" value={filterSupermarket} onChange={(e) => setFilterSupermarket(e.target.value)}>
              <option value="">כל הסופרים</option>
              {supermarkets.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            {/* Category filter dropdown */}
            <select className="border rounded px-3 py-2 cursor-pointer" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">כל הקטגוריות</option>
              <option value="מוצרי חלב">מוצרי חלב</option>
              <option value="בשר ועוף">בשר ועוף</option>
              <option value="לחם ומאפים">לחם ומאפים</option>
              <option value="פירות וירקות">פירות וירקות</option>
              <option value="משקאות">משקאות</option>
              <option value="מזווה">מזווה</option>
              <option value="חטיפים וממתקים">חטיפים וממתקים</option>
              <option value="ביצים">ביצים</option>
              <option value="דגים">דגים</option>
              <option value="טיפוח וניקיון">טיפוח וניקיון</option>
              <option value="כללי">כללי</option>
            </select>
          </div>
          {/* Each price row — border-b = line between rows, py-3 = vertical padding */}
          {prices.map((p) => (
            <div key={p._id} className="flex items-center border-b py-3">
              {/* w-2/5 = product name gets more space for long Hebrew names */}
              <span className="font-medium w-2/5">{p.productName}</span>
              {/* supermarket name */}
              <span className="text-green-700 text-sm w-1/5">{p.supermarketId.name}</span>
              {/* category */}
              <span className="text-gray-500 text-sm w-1/5">{p.category}</span>
              {/* price aligned right */}
              <span className="text-blue-700 font-bold w-1/5 text-right">{p.price}₪</span>
            </div>
          ))}

          {/* Pagination buttons — previous and next page */}
          <div className="flex justify-between items-center mt-4">
            {/* Disable Previous button when on first page */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Show current page out of total pages — Math.ceil rounds up e.g. 6563/20 = 329 pages */}
            <span className="text-gray-600">
              Page {currentPage} of {Math.ceil(totalPrices / 20)} ({totalPrices} products)
            </span>

            {/* Disable Next button when on last page */}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalPrices / 20)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default makes this component available to other files (like main.tsx)
export default App;
