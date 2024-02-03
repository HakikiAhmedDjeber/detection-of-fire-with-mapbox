

// this is new 
const pubsub = require("./utils/pubsub");


module.exports = {

    Query: {
        quoteOfTheDay: () => {
            return 'Take it easy';
        },

    },


    Mutation: {


        async sayToUserX(_, { userId, message }) {
            await pubsub.publish(userId, { message });
            return true;
        },

    },
    Subscription: {
        subscriptionTest: {
            subscribe: (_parent, { topicName }, _context, _info) => {
                const asyncIterator = pubsub.asyncIterator(topicName);
                return asyncIterator;
            },
            resolve: (payload) => {
                // This function is called whenever a new event is published
                return payload.payload; // Assuming message is the field you want to return
            },
        },
    },
}