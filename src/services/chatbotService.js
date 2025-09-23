const db = require('./database');
const whatsapp = require('./whatsappService');

const backToMenuButton = [{ id: 'menu', title: '⬅️ Voltar ao Menu' }];

async function handleIncomingMessage(from, messageText) {
    const text = messageText.trim();
    const colaborador = await findOrCreateCollaborator(from);
    await logInteraction(colaborador.id_colaborador, text);
    
    if (colaborador.chatbot_state) {
        await handleStatefulConversation(colaborador, text);
    } else {
        await handleStatelessConversation(colaborador, text);
    }
}

async function handleStatelessConversation(colaborador, text) {
    const command = text.toLowerCase();

    if (command === 'nova ideia' || command === '💡 submeter nova ideia') {
        const replyText = "Ótima iniciativa! ✨ Por favor, descreva sua ideia em uma única mensagem.";
        await updateUserState(colaborador.id_colaborador, 'AWAITING_IDEA');
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, replyText, backToMenuButton);
    }
    else if (command === 'minhas ideias' || command === '📂 ver minhas ideias') {
        await handleListMyIdeas(colaborador);
    }
    else if (command.startsWith('editar ')) {
        await handleSelectIdeaToEdit(colaborador, text);
    }
    else if (command === 'meus pontos' || command === '⭐ consultar pontos') {
        const replyText = `Você tem *${colaborador.pontos_gamificacao}* pontos! 🚀`;
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, replyText, backToMenuButton);
    }
    else if (command === 'ranking' || command === '🏆 ver ranking') {
        const ranking = await getRanking();
        const replyText = "🏆 Top 5 Inovadores:\n" + ranking;
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, replyText, backToMenuButton);
    }
    else {
        await whatsapp.sendListMessage(colaborador.telefone_whatsapp);
    }
}

async function handleStatefulConversation(colaborador, text) {
    const lowerCaseText = text.toLowerCase();
    if (lowerCaseText === '⬅️ voltar ao menu' || lowerCaseText === 'sair' || lowerCaseText === 'cancelar') {
        await clearUserState(colaborador.id_colaborador);
        await whatsapp.sendListMessage(colaborador.telefone_whatsapp);
        return;
    }
    if (colaborador.chatbot_state === 'AWAITING_IDEA') {
        await saveIdea(colaborador.id_colaborador, text);
        await addPoints(colaborador.id_colaborador, 10, 'ideia_submetida');
        const replyText = "Sua ideia foi registrada com sucesso! ✅ Você ganhou 10 pontos. Obrigado por contribuir!";
        await clearUserState(colaborador.id_colaborador);
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, replyText, backToMenuButton);
    }
    else if (colaborador.chatbot_state === 'AWAITING_IDEA_EDIT') {
        await handleUpdateIdea(colaborador, text);
        const replyText = "Sua ideia foi atualizada com sucesso! 📝";
        await clearUserState(colaborador.id_colaborador);
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, replyText, backToMenuButton);
    }
}

async function handleListMyIdeas(colaborador) {
    const query = `SELECT id_ideia, titulo_ideia, status_ideia FROM IDEIAS WHERE id_colaborador = ? ORDER BY id_ideia DESC LIMIT 5`;
    const result = await db.simpleExecute(query, [colaborador.id_colaborador]);

    if (result.rows.length === 0) {
        const replyText = "Você ainda não enviou nenhuma ideia. Selecione uma opção no menu para começar!";
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, replyText, backToMenuButton);
        return;
    }
    let message = "*Suas últimas ideias enviadas:*\n\n";
    result.rows.forEach(idea => {
        message += `*ID:* ${idea.id_ideia}\n*Título:* ${idea.titulo_ideia || 'Sem título'}\n*Status:* ${idea.status_ideia}\n\n`;
    });
    message += "Para editar uma ideia, digite `editar` seguido do número do ID (ex: `editar 123`).";
    await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, message, backToMenuButton);
}

async function handleSelectIdeaToEdit(colaborador, text) {
    const ideaId = parseInt(text.replace(/editar /i, ''), 10);
    if (isNaN(ideaId)) {
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, "ID inválido. Por favor, digite no formato `editar <número>`.", backToMenuButton);
        return;
    }
    const query = `SELECT id_ideia FROM IDEIAS WHERE id_ideia = ? AND id_colaborador = ?`;
    const result = await db.simpleExecute(query, [ideaId, colaborador.id_colaborador]);
    if (result.rows.length === 0) {
        await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, "Não encontrei uma ideia com este ID ou ela não pertence a você.", backToMenuButton);
        return;
    }
    await updateUserState(colaborador.id_colaborador, 'AWAITING_IDEA_EDIT', ideaId.toString());
    await whatsapp.sendReplyButtons(colaborador.telefone_whatsapp, "Ok, entendi. Por favor, envie agora a nova descrição completa para a sua ideia.", backToMenuButton);
}

async function handleUpdateIdea(colaborador, newDescription) {
    const ideaId = parseInt(colaborador.chatbot_context, 10);
    const newTitle = newDescription.substring(0, 40) + (newDescription.length > 40 ? '...' : '');
    const query = `UPDATE IDEIAS SET descricao_ideia_clob = ?, titulo_ideia = ? WHERE id_ideia = ?`;
    await db.simpleExecute(query, [newDescription, newTitle, ideaId]);
}

async function findOrCreateCollaborator(whatsappNumber) {
    const query = 'SELECT * FROM COLABORADORES WHERE telefone_whatsapp = ?';
    let result = await db.simpleExecute(query, [whatsappNumber]);
    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        const nomeGenerico = `Usuário ${whatsappNumber.slice(-4)}`;
        await db.simpleExecute('INSERT INTO COLABORADORES (nome, telefone_whatsapp) VALUES (?, ?)', [nomeGenerico, whatsappNumber]);
        const newResult = await db.simpleExecute(query, [whatsappNumber]);
        return newResult.rows[0];
    }
}

async function logInteraction(collaboratorId, message) {
    const query = 'INSERT INTO INTERACOES (id_colaborador, tipo_interacao, mensagem_clob) VALUES (?, ?, ?)';
    await db.simpleExecute(query, [collaboratorId, 'mensagem_chatbot', message]);
}

async function updateUserState(collaboratorId, state, context = null) {
    const query = 'UPDATE COLABORADORES SET chatbot_state = ?, chatbot_context = ? WHERE id_colaborador = ?';
    await db.simpleExecute(query, [state, context, collaboratorId]);
}

async function clearUserState(collaboratorId) {
    await updateUserState(collaboratorId, null, null);
}

async function saveIdea(collaboratorId, description) {
    const titulo = description.substring(0, 40) + (description.length > 40 ? '...' : '');
    const query = 'INSERT INTO IDEIAS (id_colaborador, titulo_ideia, descricao_ideia_clob) VALUES (?, ?, ?)';
    await db.simpleExecute(query, [collaboratorId, titulo, description]);
}

async function addPoints(collaboratorId, points, reason) {
    const updatePointsQuery = 'UPDATE COLABORADORES SET pontos_gamificacao = pontos_gamificacao + ? WHERE id_colaborador = ?';
    await db.simpleExecute(updatePointsQuery, [points, collaboratorId]);
    const logQuery = 'INSERT INTO GAMIFICACAO_LOG (id_colaborador, pontos_ganhos, descricao_motivo, tipo_referencia) VALUES (?, ?, ?, ?)';
    await db.simpleExecute(logQuery, [collaboratorId, points, `Pontos por: ${reason}`, reason]);
}

async function getRanking() {
    const query = 'SELECT nome, pontos_gamificacao FROM COLABORADORES ORDER BY pontos_gamificacao DESC LIMIT 5';
    const result = await db.simpleExecute(query);
    if (result.rows.length === 0) return "Ainda não há um ranking.";
    
    return result.rows.map((row, index) => 
        `${index + 1}. ${row.nome} - ${row.pontos_gamificacao} pontos`
    ).join('\n');
}

module.exports = { handleIncomingMessage };