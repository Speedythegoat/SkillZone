const supabase = require('../supabase/client');
const bcrypt = require('bcrypt');


const CreerUtilisateurs = async (userData) => {
  if (userData.motdepasse) {
    const saltRounds = 10;
    userData.motdepasse = await bcrypt.hash(userData.motdepasse, saltRounds);
  }

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
    .eq('id__utilisateur', id)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

 const SupprimerUtilisateurs = async (id) => {
  const { error } = await supabase
    .from("_utilisateur")
    .delete()
    .eq("id__utilisateur", id);

  if (error) throw new Error(error.message);
  return { success: true, message: "Utilisateur Supprimmer" };
};




module.exports = { CreerUtilisateurs,RecupererUtilisateurs,ModifierUtilisateurs,SupprimerUtilisateurs };
