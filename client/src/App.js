import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./App.css";
import Map from "./Map/Map";
import Sidebar from "./Sidebar";
import { useSubscriptionContext } from "./Context/SubscriptionContext";

export default function App() {
  const [SensorData, setSensorData] = useState(null);

  const { incomingData, loading, error } = useSubscriptionContext();

  useEffect(() => {
    if (incomingData) {
      let temp = incomingData?.data?.subscriptionTest;
      setSensorData(temp);
      console.log(temp);
      console.log(typeof temp);
    }
  }, [incomingData]);

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Header />
        <Map sensorData={JSON.parse(SensorData)} />
      </main>
    </div>
  );
}
