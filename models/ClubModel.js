// backend/models/ClubModel.js
const supabase = require('../supabase/client');

const TABLE = 'club';

// Liste (recherche nom/ville)
async function RecupererClubs({ recherche } = {}) {
  let query = supabase
    .from(TABLE)
    .select('id_club, nom, ville, niveau, logo')
    .order('nom', { ascending: true });

  if (recherche && recherche.trim()) {
    // nom OU ville
    query = query.or(`nom.ilike.%${recherche}%,ville.ilike.%${recherche}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

// Détail
async function RecupererClubParId(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id_club, nom, ville, niveau, logo')
    .eq('id_club', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

module.exports = { RecupererClubs, RecupererClubParId };
