const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://2.tcp.eu.ngrok.io:18544'); // Use the correct broker address and port


client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('testTopic2', (err, granted) => {
    if (!err) {
      console.log('Subscribed to testTopic');
    }
  });

setInterval(() => {
  const ToSend = {
  id: "123",
  location: {
    longitude: 4.222554, 
    latitude: -62442221
  },
  data: {
    Temperature: Math.floor(Math.random() * (35 - 20 + 1)) + 20,
    Humidity: Math.floor(Math.random() * (35 - 20 + 1)) + 10,
    Gas:Math.floor(Math.random() * (35 - 20 + 1)) + 20,
    Air: 10.0,
    Fire: 0,
    Light: 240
  }
}


const jsonString = JSON.stringify(ToSend);
  client.publish('testTopic', jsonString);
}, 1000);
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
});




