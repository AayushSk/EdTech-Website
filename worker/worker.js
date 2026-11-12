const kafka = require("./config/kafka");
const env = require("./config/env");
const { processEmailEvent } = require("./handlers/emailHandler");

const TOPIC_EMAIL = "notifications.email";
const TOPIC_DLQ = "notifications.email.dlq";

const consumer = kafka.consumer({
    groupId: env.KAFKA.GROUP_ID,
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
});

const producer = kafka.producer();

/**
 * Routes failed events to the Dead Letter Queue after max retries
 */
async function sendToDLQ(topic, partition, message, errorMsg) {
    await producer.send({
        topic: TOPIC_DLQ,
        messages: [
            {
                key: message.key || "unknown",
                value: JSON.stringify({
                    sourceTopic: topic,
                    sourcePartition: partition,
                    sourceOffset: message.offset,
                    originalPayload: message.value ? message.value.toString() : null,
                    failedAt: new Date().toISOString(),
                    error: errorMsg,
                }),
            },
        ],
    });
    console.warn(`[DLQ] Message moved to ${TOPIC_DLQ}.`);
}

async function start() {
    console.log("==================================================");
    console.log("🚀 Starting StudyNotion Apache Kafka Consumer Worker");
    console.log(`Connecting to Confluent Cloud: ${env.KAFKA.BOOTSTRAP_SERVER}`);
    console.log(`Consumer Group: ${env.KAFKA.GROUP_ID}`);
    console.log("==================================================");

    await consumer.connect();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_EMAIL, fromBeginning: false });
    console.log(`[Worker] Listening for events on topic: "${TOPIC_EMAIL}"...`);

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            const offset = message.offset;
            const rawValue = message.value ? message.value.toString() : null;

            console.log(`\n[Kafka Message Received] Topic: ${topic} | Partition: ${partition} | Offset: ${offset}`);

            let event;
            try {
                if (!rawValue) {
                    throw new Error("Empty message payload.");
                }
                event = JSON.parse(rawValue);
            } catch (error) {
                console.error(`[Worker] Invalid JSON message at offset ${offset}:`, error.message);
                await sendToDLQ(topic, partition, message, error.message);
                await consumer.commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);
                return;
            }

            const MAX_RETRIES = 3;
            let attempt = 0;
            let success = false;

            while (attempt < MAX_RETRIES && !success) {
                attempt++;
                try {
                    await processEmailEvent(event);
                    success = true;
                } catch (err) {
                    console.error(`[Worker] Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
                    if (attempt < MAX_RETRIES) {
                        const backoffMs = attempt * 2000;
                        console.log(`[Worker] Retrying in ${backoffMs / 1000}s...`);
                        await new Promise((r) => setTimeout(r, backoffMs));
                    } else {
                        console.error(`[Worker] All ${MAX_RETRIES} attempts exhausted.`);
                        await sendToDLQ(topic, partition, message, err.message);
                    }
                }
            }

            await consumer.commitOffsets([
                {
                    topic,
                    partition,
                    offset: (Number(offset) + 1).toString(),
                },
            ]);
            console.log(`[Worker] Offset ${offset} successfully committed.`);
        },
    });
}

// Graceful shutdown handling
const shutdown = async () => {
    console.log("\n[Worker] Gracefully disconnecting Kafka consumer and producer...");
    try {
        await consumer.disconnect();
        await producer.disconnect();
        console.log("[Worker] Disconnected. Exiting process.");
        process.exit(0);
    } catch (err) {
        console.error("[Worker] Error during shutdown:", err);
        process.exit(1);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start().catch((err) => {
    console.error("[Fatal Worker Startup Error]:", err);
    process.exit(1);
});
