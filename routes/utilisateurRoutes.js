const express = require('express');
const router = express.Router();
const {
  creerUtilisateur,
  getUtilisateurs,
  modifierUtilisateur,
  loginUtilisateur,  
  supprimerUtilisateur
} = require('../controllers/UtilisateurController');

router.post('/', creerUtilisateur);
router.get('/', getUtilisateurs);
router.put('/:id', modifierUtilisateur);
router.delete('/:id', supprimerUtilisateur);

router.post('/login', loginUtilisateur);   

module.exports = router;