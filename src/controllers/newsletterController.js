const database = require('../services/database');
const { sendWhatsAppMessage } = require('../services/whatsappService');

async function sendNewsletter(req, res) {
    const newsletterId = req.params.id;
    try {
        const newsletterSql = `SELECT titulo, conteudo_clob FROM NEWSLETTERS WHERE id_newsletter = ?`;
        const newsletterResult = await database.simpleExecute(newsletterSql, [newsletterId]);

        if (newsletterResult.rows.length === 0) {
            return res.status(404).json({ error: 'Newsletter não encontrada.' });
        }
        const newsletter = newsletterResult.rows[0];
        const mensagemNewsletter = `${newsletter.titulo}\n\n${newsletter.conteudo_clob}`;

        const colaboradoresSql = `SELECT telefone_whatsapp FROM COLABORADORES WHERE telefone_whatsapp IS NOT NULL`;
        const colaboradoresResult = await database.simpleExecute(colaboradoresSql);

        if (colaboradoresResult.rows.length === 0) {
            return res.status(404).json({ error: 'Nenhum colaborador com WhatsApp cadastrado.' });
        }
        
        const sendPromises = colaboradoresResult.rows.map(colaborador => 
            sendWhatsAppMessage(colaborador.telefone_whatsapp, mensagemNewsletter)
        );
        await Promise.all(sendPromises);

        res.status(200).json({ message: `Envio da newsletter iniciado para ${colaboradoresResult.rows.length} colaborador(es).` });

    } catch (err) {
        console.error('Erro ao enviar newsletter:', err);
        res.status(500).json({ error: 'Erro interno ao enviar newsletter.' });
    }
}

// NOVA FUNÇÃO para listar newsletters
async function listNewsletters(req, res) {
    try {
        const sql = `SELECT id_newsletter, titulo, conteudo_clob, status_envio, data_envio_programada 
                     FROM NEWSLETTERS ORDER BY id_newsletter DESC LIMIT 20`;
        const result = await database.simpleExecute(sql);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar newsletters:', err);
        res.status(500).json({ error: 'Erro interno ao buscar newsletters.' });
    }
}

// NOVA FUNÇÃO para criar uma nova newsletter
async function createNewsletter(req, res) {
    const { titulo, conteudo_clob } = req.body;
    if (!titulo || !conteudo_clob) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
    }

    try {
        const sql = `INSERT INTO NEWSLETTERS (titulo, conteudo_clob, status_envio) VALUES (?, ?, ?)`;
        const result = await database.simpleExecute(sql, [titulo, conteudo_clob, 'Pendente']);
        const newNewsletterId = result.rows.insertId;
        res.status(201).json({ message: 'Newsletter criada com sucesso!', id_newsletter: newNewsletterId });
    } catch (err) {
        console.error('Erro ao criar newsletter:', err);
        res.status(500).json({ error: 'Erro interno ao criar newsletter.' });
    }
}

module.exports = {
    sendNewsletter,
    listNewsletters, 
    createNewsletter
};
