const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date

  type SenssedData {
    id: ID!
    deviceID: String!
    location: Location!
    data: [Data!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type Location {
    longitude: Float
    latitude: Float
  }

  type Data {
    id: ID!
    Temperature: Float
    Humidity: Float
    Gas: Float
    Air: Float
    Fire: Boolean
    Light: Float
    createdAt: Date!
    updatedAt: Date!
  }
  type DataAvg {
    Count: Int
    TemperatureAvg: Float
    HumidityAvg: Float
    GasAvg: Float
    AirAvg: Float
    LightAvg: Float
  }
  type Query {
    GetAll: [SenssedData]
    GetAllSenssedDataByDevice(deviceID: String): SenssedData!
    GetAllSenssedDataByDeviceInTimeRange(
      deviceID: String
      from: String
      until: String
    ): SenssedData!
    GetDataAverage(SecondsValue: Int): DataAvg
  }

  type Mutation {
    sayToUserX(userId: ID!, message: String!): Boolean
  }

  type Subscription {
    subscriptionTest(topicName: String!): String
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
