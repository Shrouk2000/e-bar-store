import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Store from './pages/Store';
import Cart from './pages/Cart';
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
