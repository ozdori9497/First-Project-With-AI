// We import useState to store data that can change on screen
import { useState} from 'react';

// This is our main component - the face of our app
function App(){
  // This will store the message we get back from server empty string "" no message yet
  const [message, setMessage] = useState('');

  // This function runs when the user clicks the button
  // Why a function? So we control WHEN the fetch happens  
  const fetchMessage = () => {
    // fetch() is a built-in browser function to make HTTP requests
    // Why? This is how React talks to our server
    // .then() runs when the server responds
    // We convert the response to text so we can read it
    fetch('http://localhost:3000')
      .then((response) => response.text())
      .then((text) => setMessage(text))
  };

  // return is what gets displayed on the screen
  return (
    <div>
      {/* This shows the message we got from the server */}
      <h1>{message}</h1>
      {/* When clicked, calls our fetchMessage function */}
      <button onClick={fetchMessage}>Get Message from server</button>
    </div>
  )
}

// export default makes this component available to other files (like main.tsx)
export default App;