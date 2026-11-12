const { sendMail } = require("../utils/mailSender");

/**
 * Handles incoming email notification events
 * @param {object} event - Parsed Kafka event payload
 */
async function processEmailEvent(event) {
    const { eventType, recipient, subject, html } = event;

    if (!recipient || !html) {
        throw new Error(`Invalid event payload: missing recipient or html content.`);
    }

    console.log(`[Worker] Dispatching ${eventType} to ${recipient}...`);
    const result = await sendMail(recipient, subject || "StudyNotion Notification", html);
    console.log(`[Worker] Email delivered successfully to ${recipient} (MessageId: ${result.messageId})`);
    return result;
}

module.exports = {
    processEmailEvent,
};

