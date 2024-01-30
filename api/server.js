// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const mqtt = require("mqtt");
const PORT = process.env.PORT || 5001;

app.use(cors());

// MQTT Broker connection
const mqttClient = mqtt.connect("tcp://6.tcp.eu.ngrok.io:14946");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  // Subscribe to a specific topic
  mqttClient.subscribe("test/sensor1");
});

let mqttData = ""; // Variable to store MQTT data

// Handle incoming MQTT messages
mqttClient.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  // Update the variable with the received message
  mqttData = message.toString();
});

// API endpoint to get MQTT data
app.get("/api/mqttdata", (req, res) => {
  res.json({ mqttData });
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
