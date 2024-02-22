import React from "react";
import ReactDOM from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./App";

// import
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { SubscriptionProvider } from "./Context/SubscriptionContext";

const serverLink = "fireendpoint.astropiole.com/detector";
const httpLink = new HttpLink({
  uri: "https://" + serverLink,
  credentials: "same-origin",
});

const wsLink = new WebSocketLink(
  new SubscriptionClient("ws://" + serverLink, {
    reconnect: true,
    lazy: true,
    connectionParams: {
      authToken: "USER TOCKEN",
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SubscriptionProvider>
        <App />
      </SubscriptionProvider>
    </ApolloProvider>
  </React.StrictMode>
);
