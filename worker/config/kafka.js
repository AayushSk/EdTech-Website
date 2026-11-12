const { Kafka } = require("kafkajs");
const env = require("./env");

/**
 * Confluent Cloud Kafka Client configuration
 * Uses SASL_SSL with PLAIN authentication (Industry Standard for Confluent)
 */
const kafka = new Kafka({
    clientId: "edtech-consumer-worker",
    brokers: [env.KAFKA.BOOTSTRAP_SERVER],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: env.KAFKA.API_KEY,
        password: env.KAFKA.API_SECRET,
    },
    connectionTimeout: 10000,
    retry: {
        initialRetryTime: 300,
        retries: 8,
    },
});

module.exports = kafka;

