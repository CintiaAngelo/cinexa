const database = require('../services/database'); 

async function submitIdea(req, res) {
    const { id_colaborador, titulo_ideia, descricao_ideia_clob } = req.body;
    if (!id_colaborador || !descricao_ideia_clob) {
        return res.status(400).json({ error: 'id_colaborador e descricao_ideia_clob são obrigatórios.' });
    }
    const sql = `INSERT INTO IDEIAS (id_colaborador, titulo_ideia, descricao_ideia_clob) VALUES (?, ?, ?)`;
    const binds = [id_colaborador, titulo_ideia || 'Ideia sem título', descricao_ideia_clob];
    try {
        const result = await database.simpleExecute(sql, binds);
        const newIdeaId = result.rows.insertId;
        res.status(201).json({ message: 'Ideia submetida com sucesso!', id_ideia: newIdeaId });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno ao processar a submissão da ideia.' });
    }
}

async function getAllIdeas(req, res) {
    const sql = `SELECT id_ideia, id_colaborador, titulo_ideia, status_ideia, data_submissao FROM IDEIAS ORDER BY data_submissao DESC`;
    try {
        const result = await database.simpleExecute(sql);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno ao buscar ideias.' });
    }
}

async function getIdeaById(req, res) {
    const id = parseInt(req.params.id, 10);
    const sql = `SELECT * FROM IDEIAS WHERE id_ideia = ?`;
    try {
        const result = await database.simpleExecute(sql, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ideia não encontrada.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno ao buscar a ideia.' });
    }
}

module.exports = { submitIdea, getAllIdeas, getIdeaById };