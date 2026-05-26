import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { ProductPage } from "./pages/ProductPage"

function App(){
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/products" element={<ProductPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App