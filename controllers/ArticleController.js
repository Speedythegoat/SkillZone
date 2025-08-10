// controllers/ArticleController.js
const {
  CreerArticle,
  RecupererArticles,
  RecupererArticleParId,
  ModifierArticle,
  SupprimerArticle,
} = require('../models/ArticleModel');

// Helpers
const toInt = (v) => (v === undefined || v === null || v === '' ? undefined : parseInt(v, 10));

/**
 * POST /api/articles
 * body: { contenue, datepluplication?, imageprincipale?, id_commentaire?, id_club, id_categorie, id_auteur }
 */
async function creerArticle(req, res) {
  try {
    const {
      contenue,
      datepluplication,
      imageprincipale,
      id_commentaire,
      id_club,
      id_categorie,
      id_auteur,
    } = req.body;

    // Validations minimales
    if (!contenue || !id_club || !id_categorie || !id_auteur) {
      return res.status(400).json({
        message:
          'Champs requis manquants: contenue, id_club, id_categorie, id_auteur.',
      });
    }

    const article = await CreerArticle({
      contenue,
      datepluplication,
      imageprincipale,
      id_commentaire: toInt(id_commentaire),
      id_club: toInt(id_club),
      id_categorie: toInt(id_categorie),
      id_auteur: toInt(id_auteur),
    });

    return res.status(201).json(article);
  } catch (err) {
    console.error('creerArticle ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

/**
 * GET /api/articles
 * query: ?page=1&limit=12&search=...&categorieId=...&clubId=...&auteurId=...
 */
async function getArticles(req, res) {
  try {
    const { page, limit, search, categorieId, clubId, auteurId } = req.query;

    const result = await RecupererArticles({
      page: toInt(page) || 1,
      limit: toInt(limit) || 12,
      search: search || undefined,
      categorieId: toInt(categorieId),
      clubId: toInt(clubId),
      auteurId: toInt(auteurId),
    });

    return res.status(200).json(result); // { items, count }
  } catch (err) {
    console.error('getArticles ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

/**
 * GET /api/articles/:id
 */
async function getArticleParId(req, res) {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id invalide' });

    const article = await RecupererArticleParId(id);
    return res.status(200).json(article);
  } catch (err) {
    console.error('getArticleParId ->', err);
    // Supabase renvoie une erreur si non trouvé → on peut renvoyer 404
    if (String(err.message).toLowerCase().includes('row')) {
      return res.status(404).json({ message: 'Article introuvable' });
    }
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

/**
 * PUT /api/articles/:id
 * body: { contenue?, datepluplication?, imageprincipale?, id_commentaire?, id_club?, id_categorie?, id_auteur? }
 */
async function modifierArticle(req, res) {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id invalide' });

    const updates = { ...req.body };

    // normalisation de quelques champs numériques
    if (updates.id_commentaire !== undefined) updates.id_commentaire = toInt(updates.id_commentaire);
    if (updates.id_club !== undefined) updates.id_club = toInt(updates.id_club);
    if (updates.id_categorie !== undefined) updates.id_categorie = toInt(updates.id_categorie);
    if (updates.id_auteur !== undefined) updates.id_auteur = toInt(updates.id_auteur);

    const updated = await ModifierArticle(id, updates);
    return res.status(200).json(updated);
  } catch (err) {
    console.error('modifierArticle ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

/**
 * DELETE /api/articles/:id
 */
async function supprimerArticle(req, res) {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'id invalide' });

    const result = await SupprimerArticle(id);
    return res.status(200).json(result); // { success: true, message: 'Article supprimé' }
  } catch (err) {
    console.error('supprimerArticle ->', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}

module.exports = {
  creerArticle,
  getArticles,
  getArticleParId,
  modifierArticle,
  supprimerArticle,
};
