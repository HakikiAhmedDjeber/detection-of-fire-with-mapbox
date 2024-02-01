import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./App.css";
import Map from "./Map";
import Sidebar from "./Sidebar";
import mqtt from "mqtt";
export default function App() {
  const [mqttData, setMqttData] = useState("");
  useEffect(() => {
    const client = mqtt.connect("mqtt://2.tcp.eu.ngrok.io:12754");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("testTopic");
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      setMqttData(message.toString());
    });

    return () => {
      client.end();
    };
  }, []);
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Sidebar />
        <Map mqttMsg={mqttData} />
      </main>
    </div>
  );
}
