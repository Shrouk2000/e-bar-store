import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Store from './pages/storePage/StorePage';
import Cart from './pages/cartPage/CartPage';
function App() {
  return (

     <Router>
      <Routes>
        <Route path="/" element={<Store/>}/>
        <Route path="/cart" element={<Cart/>}/>

      </Routes>
     </Router>
      

  )
}

export default App
