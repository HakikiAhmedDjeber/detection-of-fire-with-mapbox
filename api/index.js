const express = require("express");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./src/graphql/typeDef.js");
const resolvers = require("./src/graphql/resolvers.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const aedes = require("aedes")();

// new import for sub server setup
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");

const dotenv = require("dotenv");
const pubsub = require("./src/graphql/utils/pubsub.js");
const {
  saveReceivedData,
} = require("./src/graphql/functions/HelperFunctions.js");
dotenv.config();

const corsConfig = {
  credentials: true,
  allowedHeaders: ["Authorization"],
  exposedHeaders: ["Authorization"],
};
const path = "/detector";

const { DB_URI, DB_NAME } = process.env;

(async function () {
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // MQTT broker setup
  const mqttServer = require("net").createServer(aedes.handle);
  const mqttPort = 1884;

  // Listen for the 'client' event
  aedes.on("client", (client) => {
    console.log(`Client connected: ${client.id}`);
  });

  // Start MQTT broker
  mqttServer.listen(mqttPort, () => {
    console.log(`MQTT broker started and listening on port ${mqttPort}`);
  });

  // Listen for the 'publish' event to capture publish events
  aedes.on("publish", async (packet, client) => {
    const topic = packet.topic.toString();
    const payload = packet.payload.toString("utf8");
    const clientId = client ? client.id : null;
    console.log(typeof payload);

    try {
      await pubsub.publish(topic, { payload });
      console.log(
        `Client ${clientId} published to topic '${topic}' with payload: ${payload}`
      );
      if (topic === "NEW_DATA") {
        saveReceivedData(payload); /// save received data from device to database based on its topic
      }
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  });

  // new lines for subserver setup
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,

      onConnect: (connectionParams, webSocket, context) => {
        webSocket.on("close", () => {}); // this will excute when user dissconnect
      },
    },
    { server: httpServer, path: path }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async frainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],

    context: ({ req }) => {
      return {
        req,
      };
    },
  });

  app.get("/", (req, res) => {
    //console.log(req)
    res.send("hello This is a test");
  });

  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(cors());

  app.post("/newdata", async (req, res) => {
    const newData = req.body; // Accessing the JSON object from the request body
    console.log("received ", newData); // Logging the received JSON object to the console
    try {
      let dataToPublish = JSON.stringify(newData);

      await pubsub.publish("NEW_DATA", dataToPublish);
      await saveReceivedData(dataToPublish); // Assuming saveReceivedData is an asynchronous function
      console.log("Data saved successfully!");
      res.send("Data saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/newdata2", async (req, res) => {
    const temp = req.query.temp;
    //const name = req.query.name;
    console.log("temp:", temp);
    //console.log("Name:", name);
    res.send("Data received successfully!");
  });

  app.get("/gps", async (req, res) => {
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    console.log("longitude:", longitude);
    console.log("latitude:", latitude);
    res.send("Data received successfully!");
  });

  await server.start();

  server.applyMiddleware({ app, path, cors: corsConfig });
  mongoose.connect(DB_URI, { useNewUrlParser: true });

  const PORT = 5050;
  httpServer.listen(PORT, () => {
    console.log("HTTP server is running on port " + PORT);
  });
})();
