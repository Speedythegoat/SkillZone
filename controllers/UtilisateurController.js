const {
  CreerUtilisateurs,
  RecupererUtilisateurs,
  ModifierUtilisateurs,
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
    // 1. On cherche l’utilisateur + jointure pour savoir s'il est auteur
    const { data: utilisateur, error } = await supabase
      .from('_utilisateur')
      .select(`
        *,
        auteur:id__utilisateur (id__utilisateur)
      `)
      .eq('email', email)
      .single();

    if (error || !utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // 2. Vérif du mot de passe
    const passwordMatch = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // 3. Vérifie si c’est un auteur ou pas
    const estAuteur = utilisateur.auteur !== null;

    // 4. Réponse avec rôle calculé
    return res.status(200).json({
      message: "Connexion réussie",
      utilisateur: {
        id: utilisateur.id__utilisateur,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: estAuteur ? "auteur" : "utilisateur"
      }
    });

  } catch (err) {
    console.error("Erreur login :", err.message);
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
