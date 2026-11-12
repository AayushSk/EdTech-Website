const crypto = require("crypto");
const env = require("./env");

/**
 * Confluent Cloud Kafka REST Producer
 * 
 * Uses standard Node fetch (or native HTTPS) over REST Proxy.
 * Designed specifically for serverless/Vercel environments:
 * - 0 persistent TCP connections
 * - Stateless and lightweight (<25ms)
 * - Built-in graceful degradation: if Kafka is unconfigured or unavailable,
 *   logs warning and allows callers to fall back or proceed safely.
 */

const isConfigured = Boolean(
    env.KAFKA.REST_ENDPOINT &&
    env.KAFKA.CLUSTER_ID &&
    env.KAFKA.API_KEY &&
    env.KAFKA.API_SECRET
);

const authHeader = isConfigured
    ? `Basic ${Buffer.from(`${env.KAFKA.API_KEY}:${env.KAFKA.API_SECRET}`).toString("base64")}`
    : "";

/**
 * Publishes an event to a Confluent Cloud Kafka Topic via REST Proxy
 * @param {string} topic - Kafka topic name, e.g. "notifications.email"
 * @param {string} key - Partition key (e.g. user email or courseId)
 * @param {object} eventData - JSON payload
 * @returns {Promise<boolean>} true if published successfully, false otherwise
 */
async function publishEvent(topic, key, eventData) {
    if (!isConfigured) {
        console.warn(`[Kafka Producer] Skipped publishing to topic "${topic}": Confluent credentials not configured.`);
        return false;
    }

    const endpoint = `${env.KAFKA.REST_ENDPOINT.replace(/\/+$/, "")}/kafka/v3/clusters/${env.KAFKA.CLUSTER_ID}/topics/${topic}/records`;

    const body = {
        key: {
            type: "JSON",
            data: key,
        },
        value: {
            type: "JSON",
            data: {
                eventId: crypto.randomUUID(),
                timestamp: Date.now(),
                ...eventData,
            },
        },
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[Kafka Producer Error] Topic: ${topic}, Status: ${response.status}, Body: ${errText}`);
            return false;
        }

        return true;
    } catch (err) {
        console.error(`[Kafka Producer Network Error] Failed to publish to ${topic}:`, err.message);
        return false;
    }
}

module.exports = {
    publishEvent,
    isConfigured,
};
