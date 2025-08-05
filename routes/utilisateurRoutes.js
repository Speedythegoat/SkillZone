const express = require('express');
const router = express.Router();
const {
  creerUtilisateur,
  getUtilisateurs,
  modifierUtilisateur,
  supprimerUtilisateur
} = require('../controllers/UtilisateurController');

router.post('/', creerUtilisateur);
router.get('/', getUtilisateurs);
router.put('/:id', modifierUtilisateur);
router.delete('/:id', supprimerUtilisateur);

module.exports = router;