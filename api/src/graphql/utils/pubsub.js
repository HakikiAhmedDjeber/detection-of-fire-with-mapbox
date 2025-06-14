const { RedisPubSub } = require("graphql-redis-subscriptions");

const pubsub = new RedisPubSub({
  connection: {
    password: "Kz8KdPbb2l2PRs1HKjN3BhzdH7lClwog",
    host: "redis-10970.c89.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 10970,
    // password: 'pass*',
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  },
});

module.exports = pubsub;
