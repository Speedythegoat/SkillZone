const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const articleRoutes = require('./routes/articleRoutes');

require('dotenv').config();

const app = express();


app.use(cors({
  origin: ["http://localhost:5173", "https://skillzone-frontend.onrender.com","https://skillzone-frontend.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());


app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/articles', articleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend lancé sur http://localhost:${PORT}`));
