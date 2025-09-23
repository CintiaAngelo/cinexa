const chatbotService = require('../services/chatbotService');

function verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token && mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
}

async function handleWebhook(req, res) {
    res.sendStatus(200);
    try {
        const body = req.body;
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry[0];
            if (entry.changes && entry.changes[0].value.messages) {
                const messageData = entry.changes[0].value.messages[0];
                let messageText = '';
                if (messageData.type === 'text') {
                    messageText = messageData.text.body;
                } else if (messageData.type === 'interactive') {
                    const interactive = messageData.interactive;
                    if (interactive.type === 'list_reply') {
                        messageText = interactive.list_reply.title;
                    } else if (interactive.type === 'button_reply') {
                        messageText = interactive.button_reply.title;
                    }
                }
                if (messageText) {
                    const from = messageData.from;
                    await chatbotService.handleIncomingMessage(from, messageText);
                }
            }
        }
    } catch (error) {
        console.error("Erro ao processar webhook:", error);
    }
}

module.exports = { verifyWebhook, handleWebhook };