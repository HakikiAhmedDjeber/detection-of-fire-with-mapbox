const { RedisPubSub } = require("graphql-redis-subscriptions");

const pubsub = new RedisPubSub({
  connection: {
    password: "mCbs9TRAlzgUvx9zXEnJRqCAZXZCpEd6",
    host: "redis-15399.c73.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 15399,
    // password: 'pass*',
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  },
});

module.exports = pubsub;
