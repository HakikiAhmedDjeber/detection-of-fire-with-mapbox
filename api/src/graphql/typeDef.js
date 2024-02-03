const { gql } = require('apollo-server');


module.exports = gql`
          
            type Query {
                quoteOfTheDay: String
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