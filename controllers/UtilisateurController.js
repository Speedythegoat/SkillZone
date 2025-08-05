const {
  CreerUtilisateurs,
  RecupererUtilisateurs,
  ModifierUtilisateurs,
  SupprimerUtilisateurs // ✅ corrigé ici
} = require('../models/UtilisateurModel');

const creerUtilisateur = async (req, res) => {
  try {
    const newUser = await CreerUtilisateurs(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getUtilisateurs = async (_req, res) => {
  try {
    const users = await RecupererUtilisateurs();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const modifierUtilisateur = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await ModifierUtilisateurs(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const supprimerUtilisateur = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await SupprimerUtilisateurs(id); 
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  creerUtilisateur,
  getUtilisateurs,
  modifierUtilisateur,
  supprimerUtilisateur
};
