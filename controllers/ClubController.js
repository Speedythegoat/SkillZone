// backend/controllers/ClubController.js
const {
  RecupererClubs,
  RecupererClubParId,
} = require('../models/ClubModel');

const toInt = (v) =>
  v === undefined || v === null || v === '' ? undefined : parseInt(v, 10);

async function getClubs(req, res) {
  try {
    const { q } = req.query; // ?q=texte
    const list = await RecupererClubs({ recherche: q });
    return res.status(200).json(list);
  } catch (err) {
    console.error('getClubs ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

async function getClubParId(req, res) {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id invalide' });
    const club = await RecupererClubParId(id);
    return res.status(200).json(club);
  } catch (err) {
    console.error('getClubParId ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

module.exports = { getClubs, getClubParId };
