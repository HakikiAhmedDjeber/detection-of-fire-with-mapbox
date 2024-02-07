import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./App.css";
import Map from "./Map/Map";
import Sidebar from "./Sidebar";
import { useSubscriptionContext } from "./Context/SubscriptionContext";

export default function App() {
  const [SensorData, setSensorData] = useState(null);
  const [regionName, setRegionName] = useState("");

  const { incomingData, loading, error } = useSubscriptionContext();

  function handleRegionName(name) {
    setRegionName(name);
  }
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
      <main className="main">
        <Sidebar region={regionName} />
        <Map
          sensorData={JSON.parse(SensorData)}
          regionName={regionName}
          setRegionName={handleRegionName}
        />
      </main>
    </div>
  );
}
