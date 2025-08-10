// backend/models/ArticleModel.js
const supabase = require('../supabase/client');

const TABLE = 'article';

// Sélection par défaut avec jointures lisibles pour le front
const baseSelect = `
  id_article, contenue, datepluplication, imageprincipale,
  id_commentaire, id_club, id_categorie, id_auteur,
  categorie:id_categorie ( id_categorie, libelle ),
  club:id_club ( id_club, nom, logo ),
  auteur:id_auteur (
    id_auteur,
    utilisateur:id__utilisateur ( id__utilisateur, nom, prenom )
  )
`;

/**
 * Créer un article
 * @param {Object} payload
 * @returns {Promise<Object>} article créé
 */
async function CreerArticle(payload) {
  const row = {
    contenue: payload.contenue ?? null,
    datepluplication: payload.datepluplication || new Date().toISOString(), // garde l’orthographe de ta colonne !
    imageprincipale: payload.imageprincipale ?? null,
    id_commentaire: payload.id_commentaire ?? null, // si pas encore de fil de commentaires
    id_club: payload.id_club,
    id_categorie: payload.id_categorie,
    id_auteur: payload.id_auteur,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert([row])
    .select(baseSelect)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Lister les articles (récents d’abord) + recherche & filtres
 * @param {Object} opts
 * @param {number} opts.limit
 * @param {number} opts.page
 * @param {string} opts.search  (cherche dans `contenue`)
 * @param {number} opts.categorieId
 * @param {number} opts.clubId
 * @param {number} opts.auteurId
 * @returns {Promise<{items: Object[], count: number}>}
 */
async function RecupererArticles(opts = {}) {
  const {
    limit = 12,
    page = 1,
    search,
    categorieId,
    clubId,
    auteurId,
  } = opts;

  let query = supabase
    .from(TABLE)
    .select(baseSelect, { count: 'exact' })
    .order('datepluplication', { ascending: false });

  if (search) query = query.ilike('contenue', `%${search}%`);
  if (categorieId) query = query.eq('id_categorie', categorieId);
  if (clubId) query = query.eq('id_club', clubId);
  if (auteurId) query = query.eq('id_auteur', auteurId);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { items: data || [], count: count ?? 0 };
}

/**
 * Récupérer un article par id
 */
async function RecupererArticleParId(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(baseSelect)
    .eq('id_article', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Modifier un article
 * @param {number} id
 * @param {Object} updates
 */
async function ModifierArticle(id, updates) {
  // Whitelist des champs modifiables
  const allowed = [
    'contenue',
    'datepluplication',
    'imageprincipale',
    'id_commentaire',
    'id_club',
    'id_categorie',
    'id_auteur',
  ];

  const patch = {};
  for (const k of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, k)) {
      patch[k] = updates[k];
    }
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('id_article', id)
    .select(baseSelect)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Supprimer un article
 * @param {number} id
 */
async function SupprimerArticle(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id_article', id);
  if (error) throw new Error(error.message);
  return { success: true, message: 'Article supprimé' };
}

module.exports = {
  CreerArticle,
  RecupererArticles,
  RecupererArticleParId,
  ModifierArticle,
  SupprimerArticle,
};
