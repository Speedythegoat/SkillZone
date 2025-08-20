// backend/models/CategorieModel.js
const supabase = require('../supabase/client');

const TABLE = 'categorie';

// Liste (option de recherche)
async function RecupererCategories({ recherche } = {}) {
  let query = supabase
    .from(TABLE)
    .select('id_categorie, libelle, description')
    .order('libelle', { ascending: true });

  if (recherche && recherche.trim()) {
    query = query.ilike('libelle', `%${recherche}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

// Détail
async function RecupererCategorieParId(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id_categorie, libelle, description')
    .eq('id_categorie', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

module.exports = { RecupererCategories, RecupererCategorieParId };
