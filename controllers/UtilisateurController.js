const bcrypt = require('bcrypt');

const {
  CreerUtilisateurs,
  RecupererUtilisateurs,
  ModifierUtilisateurs,
  TrouverUtilisateurParEmail,
  EstAuteur,
  SupprimerUtilisateurs
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

const loginUtilisateur = async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    // 1) utilisateur par email
    const utilisateur = await TrouverUtilisateurParEmail(email);
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    // 2) check mot de passe
    const ok = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
    if (!ok) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    // 3) est-ce un auteur ?
    const idAuteur = await EstAuteur(utilisateur.id__utilisateur);

    // 4) réponse
    return res.status(200).json({
      message: 'Connexion réussie',
      utilisateur: {
        id: utilisateur.id__utilisateur,
        nom: utilisateur.nom,
        email: utilisateur.email,
        id_auteur: idAuteur,                       // ← défini ici
        role: idAuteur ? 'auteur' : 'utilisateur', // ← dépend de idAuteur
      },
    });
  } catch (err) {
    console.error('Erreur login :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  creerUtilisateur,
  getUtilisateurs,
  modifierUtilisateur,
  loginUtilisateur,
  supprimerUtilisateur
};
