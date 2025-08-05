const supabase = require('../supabase/client');

const CreerUtilisateurs = async (userData) => {
  const { data, error } = await supabase
    .from('_utilisateur')
    .insert([userData])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

 const RecupererUtilisateurs = async () => {
  const { data, error } = await supabase.from("_utilisateur").select("*");

  if (error) throw new Error(error.message);
  return data;
};

const ModifierUtilisateurs = async (id, updates) => {
  const { data, error } = await supabase
    .from('_utilisateur')
    .update(updates)
    .eq('_utilisateur', id)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

 const SupprimerUtilisateurs = async (id) => {
  const { error } = await supabase
    .from("_utilisateur")
    .delete()
    .eq("_utilisateur", id);

  if (error) throw new Error(error.message);
  return { success: true, message: "Utilisateur Supprimmer" };
};




module.exports = { CreerUtilisateurs,RecupererUtilisateurs,ModifierUtilisateurs,SupprimerUtilisateurs };
