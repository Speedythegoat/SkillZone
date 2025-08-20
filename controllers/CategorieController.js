// backend/controllers/CategorieController.js
const {
  RecupererCategories,
  RecupererCategorieParId,
} = require('../models/CategorieModel');

const toInt = (v) =>
  v === undefined || v === null || v === '' ? undefined : parseInt(v, 10);

async function getCategories(req, res) {
  try {
    const { q } = req.query; // ?q=texte
    const list = await RecupererCategories({ recherche: q });
    return res.status(200).json(list);
  } catch (err) {
    console.error('getCategories ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

async function getCategorieParId(req, res) {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id invalide' });
    const cat = await RecupererCategorieParId(id);
    return res.status(200).json(cat);
  } catch (err) {
    console.error('getCategorieParId ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

module.exports = { getCategories, getCategorieParId };
