import React, { useState } from 'react';
import ProductList from './components/ProductList';
import CreateOrder from './components/CreateOrder';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>E-commerce Platform</h1>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <h2>Products</h2>
          <ProductList />
          <h2>Create Order</h2>
          <CreateOrder />
        </>
      ) : (
        <>
          <Login setIsLoggedIn={setIsLoggedIn} />
          <Register setIsLoggedIn={setIsLoggedIn} />
        </>
      )}
    </div>
  );
}

export default App;