const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const articleRoutes = require('./routes/articleRoutes');

require('dotenv').config();

const app = express();


const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://skillzone-frontend.onrender.com',      // if you still use Render for front
  'https://skillzone-frontend.vercel.app',        // your Vercel production URL
];

app.use(cors({
  origin(origin, cb) {
    // allow no origin (curl/healthchecks) or any *.vercel.app preview
    if (!origin || ALLOWED_ORIGINS.includes(origin) || /\.vercel\.app$/.test(new URL(origin).host)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // set to true only if you’ll use cookies
}));

// Preflight (optional but nice)
app.options('*', cors());

// Use Express’ built-in JSON parser
app.use(express.json());

app.use(bodyParser.json());


app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/articles', articleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend lancé sur http://localhost:${PORT}`));
