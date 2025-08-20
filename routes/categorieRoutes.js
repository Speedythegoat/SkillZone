// backend/routes/categorieRoutes.js
const express = require('express');
const { getCategories, getCategorieParId } = require('../controllers/CategorieController');
const router = express.Router();

router.get('/', getCategories);     // GET /api/categories?q=foo
router.get('/:id', getCategorieParId);

module.exports = router;
