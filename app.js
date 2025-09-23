require('dotenv').config();
const express = require('express');
const cors = require('cors');

const whatsappRoutes = require('./src/routes/whatsappRoutes');
const ideaRoutes = require('./src/routes/ideaRoutes'); 
const newsletterRoutes = require('./src/routes/newsletterRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Para rodar localmente, usará a porta 3000

app.use(cors());
app.use(express.json());

app.use('/api/whatsapp/webhook', whatsappRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/newsletters', newsletterRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'API is healthy and running!' });
});

app.listen(PORT, () => {
    console.log(`Cinexa API server listening on port ${PORT}`);
});