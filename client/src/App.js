import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./App.css";
import Map from "./Map";
import Sidebar from "./Sidebar";
import { useSubscriptionContext } from "./Context/SubscriptionContext";
import Chart from "./Chart";

export default function App() {
  const [SensorData, setSensorData] = useState(null);
  const [regionName, setRegionName] = useState("");
  const [isChartOpen, setIsChartOpen] = useState(false);
  const { incomingData, loading, error } = useSubscriptionContext();

  function handleChartOpen() {
    setIsChartOpen(!isChartOpen);
  }
  function handleRegionName(name) {
    setRegionName(name);
  }

  // viewport
  const [viewport, setViewport] = useState({
    longitude: -0.41551,
    latitude: 35.20779,
    zoom: 12,
  });

  function handleViewport(view) {
    setViewport(view);
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
        <Sidebar region={regionName} selectSensor={handleViewport} />
        <Map
          sensorData={JSON.parse(SensorData)}
          regionName={regionName}
          setRegionName={handleRegionName}
          viewport={viewport}
          setViewport={setViewport}
          handleChart={handleChartOpen}
        />
        {isChartOpen && (
          <Chart chartOpen={isChartOpen} handleChart={handleChartOpen} />
        )}
      </main>
    </div>
  );
}
