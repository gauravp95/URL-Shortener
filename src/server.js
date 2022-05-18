const redis = require('redis');

//connect to redis

const redisClient = redis.createClient(
    19798,
    "redis-19798.c232.us-east-1-2.ec2.cloud.redislabs.com",{no_ready_check: true},
);


redisClient.auth("eHGaNqXdPVUeZtEat7On87XUA8eoZthD", function(err) {
    if (err) throw err;
});

redisClient.on("connect", async function() {
    console.log("Connected to Redis..");
});

module.exports = {redisClient};