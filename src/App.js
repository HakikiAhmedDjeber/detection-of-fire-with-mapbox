import React from "react";
import Header from "./Header";
import "./App.css";
import Map from "./Map";
import Sidebar from "./Sidebar";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Sidebar />
        <Map />
      </main>
    </div>
  );
}
