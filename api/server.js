// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const mqtt = require("mqtt");
const PORT = process.env.PORT || 5001;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  next();
});

const client = mqtt.connect("mqtt://2.tcp.eu.ngrok.io:12754"); // Use the correct broker address and port

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to the topic when connected
  client.subscribe("testTopic", (err, granted) => {
    if (!err) {
      console.log("connect to the testTopic");
    }
  });

  // Set up the message event listener
  client.subscribe("testTopic", (err, granted) => {
    if (!err) {
      console.log("Subscribed to test/sensor1");
    }
  });

  // Set up the message event listener
  client.on("message", (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message}`);

    // Assuming `app` is an Express app
    app.get("/api/mqttdata", (req, res) => {
      res.json({ topic, message });
    });
  });

  // Periodic task (e.g., publishing or other logic) every second
  setInterval(() => {
    // Your code inside the interval
  }, 1000);
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
