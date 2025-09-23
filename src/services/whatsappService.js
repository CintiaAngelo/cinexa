const axios = require('axios');

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_URL = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
const API_HEADERS = {
    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
    'Content-Type': 'application/json'
};

async function sendWhatsAppMessage(to, text) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.error('Credenciais do WhatsApp não configuradas.');
        return;
    }
    const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text }
    };
    try {
        await axios.post(API_URL, payload, { headers: API_HEADERS });
        console.log(`Mensagem de texto enviada para ${to}`);
    } catch (error) {
        console.error('Erro ao enviar mensagem de texto:', error.response ? error.response.data : error.message);
    }
}

async function sendReplyButtons(to, bodyText, buttons) {
    const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
            type: 'button',
            body: { text: bodyText },
            action: {
                buttons: buttons.map(btn => ({
                    type: 'reply',
                    reply: { id: btn.id, title: btn.title }
                }))
            }
        }
    };
    try {
        await axios.post(API_URL, payload, { headers: API_HEADERS });
        console.log(`Mensagem com botões enviada para ${to}`);
    } catch (error) {
        console.error('Erro ao enviar botões de resposta:', error.response ? error.response.data : error.message);
    }
}

async function sendListMessage(to) {
    const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
            type: 'list',
            header: { type: 'text', text: 'Menu Principal' },
            body: { text: 'Olá! 👋 Sou o assistente da Cinexa. Por favor, selecione uma das opções abaixo para começar.' },
            footer: { text: 'Cinexa Inovação' },
            action: {
                button: 'Ver Opções',
                sections: [{
                    title: 'Funcionalidades',
                    rows: [
                        { id: 'nova_ideia', title: '💡 Submeter Nova Ideia' },
                        { id: 'minhas_ideias', title: '📂 Ver Minhas Ideias' },
                        { id: 'meus_pontos', title: '⭐ Consultar Pontos' },
                        { id: 'ranking', title: '🏆 Ver Ranking' }
                    ]
                }]
            }
        }
    };
    try {
        await axios.post(API_URL, payload, { headers: API_HEADERS });
        console.log(`Mensagem de lista enviada para ${to}`);
    } catch (error) {
        console.error('Erro ao enviar mensagem de lista:', error.response ? error.response.data : error.message);
    }
}

module.exports = { sendWhatsAppMessage, sendReplyButtons, sendListMessage };