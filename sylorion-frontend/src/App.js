import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OCRComponent from "./components/OCR/OCRComponent.js";
import Login from "./components/form/Login.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/factures" element={<OCRComponent />}></Route>
          <Route exact path="/" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
