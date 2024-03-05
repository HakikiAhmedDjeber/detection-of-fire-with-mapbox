import React, { useState, useEffect } from "react";
// import for routes
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import History from "./components/History/History";

export default function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/history/:id" element={<History />} />
        </Routes>
      </Router>
    </div>
  );
}
