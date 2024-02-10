const { gql } = require('apollo-server');


module.exports = gql`

            type SenssedData {
                id: ID!
                deviceID: String!
                location: Location!
                data: [Data!]!
                createdAt: String!
                updatedAt: String!
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
                createdAt: String!
                updatedAt: String!
                }

            type Query {
                GetAll: [SenssedData]
                GetAllSenssedDataByDevice(deviceID: String): SenssedData!
                GetAllSenssedDataByDeviceInTimeRange(deviceID: String, from:String, until:String): SenssedData!
            }
  

            type Mutation {
                sayToUserX(userId: ID!, message: String! ): Boolean
            }

            type Subscription {
                subscriptionTest(topicName: String!): String
                        }

            schema {
                query: Query
                mutation: Mutation
                subscription:Subscription
            }

 
`