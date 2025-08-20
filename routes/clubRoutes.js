// backend/routes/clubRoutes.js
const express = require('express');
const { getClubs, getClubParId } = require('../controllers/ClubController');
const router = express.Router();

router.get('/', getClubs);          // GET /api/clubs?q=bar
router.get('/:id', getClubParId);

module.exports = router;
