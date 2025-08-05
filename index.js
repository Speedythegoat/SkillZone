const express = require('express');
const bodyParser = require('body-parser');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use('/api/utilisateurs', utilisateurRoutes);

// ✅ Compatible Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend lancé sur http://localhost:${PORT}`));

