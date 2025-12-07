/**
 * redis client
 */
const redis = require("redis");
const redisConfig = require("../configs/redis");

module.exports = () => {
    const client = redis.createClient(redisConfig);

    client.on("error", console.error);

    return client;
};
