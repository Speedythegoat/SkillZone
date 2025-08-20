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
  try {
    const { email, motdepasse } = req.body;
    if (!email || !motdepasse) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // 1) trouver l'utilisateur
    const utilisateur = await TrouverUtilisateurParEmail(email); // doit renvoyer { id__utilisateur, nom, prenom, email, motdepasse }
    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // 2) vérifier le mdp
    const ok = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
    if (!ok) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // 3) vérifier si auteur
    // EstAuteur doit retourner soit { id_auteur } soit null
    const auteurRow = await EstAuteur(utilisateur.id__utilisateur);
    const id_auteur = auteurRow?.id_auteur ?? null;
    const role = id_auteur ? "auteur" : "utilisateur";

    // 4) réponse
    return res.status(200).json({
      message: "Connexion réussie",
      utilisateur: {
        id__utilisateur: utilisateur.id__utilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role,
        id_auteur, // null si non-auteur
      },
      // token: "...", // si tu ajoutes un JWT plus tard
    });
  } catch (err) {
    console.error("Erreur login :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  creerUtilisateur,
  getUtilisateurs,
  modifierUtilisateur,
  loginUtilisateur,
  supprimerUtilisateur
};
