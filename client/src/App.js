import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./App.css";
import Map from "./Map";
import Sidebar from "./Sidebar";
import { useSubscriptionContext } from "./Context/SubscriptionContext";


export default function App() {
  const [SensorData, setSensorData] = useState(null)

  const { incomingData, loading, error } = useSubscriptionContext();


  useEffect(() => {
    if (incomingData) {
      let temp = incomingData?.data?.subscriptionTest
      setSensorData(temp)
      console.log(temp)
    }
  }, [incomingData])



  return (
    <div className="app">
      <Header />
      <main className="main">
        <Sidebar />
        <Map sensorData={SensorData} />
      </main>
    </div>
  );
}
