import React from 'react'
import {Browser as Router,Routes,Route} from "react-router-dom";
import Store from './pages/Store';
import { fromJSON } from 'postcss'
import Cart from './pages/Cart';
function App() {
  return (
    <div>
     <Router>
      <Routes>
        <Route path="/" element={<Store/>}/>
        <Route path="/cart" element={<Cart/>}/>

      </Routes>
     </Router>
      
    </div>
  )
}

export default App
