import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import "./App.css";
import Map from "./Map";
import Sidebar from "./Sidebar";

export default function App() {
  const [mqttData, setMqttData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/mqttdata");
        setMqttData(response.data.mqttData);
      } catch (error) {
        console.error("Error fetching MQTT data:", error.message);
      }
    };

    fetchData();
  }, []);

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
