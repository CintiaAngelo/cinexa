function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Acesso não autorizado. Chave de API inválida ou ausente.' });
    }
}

module.exports = apiKeyAuth;