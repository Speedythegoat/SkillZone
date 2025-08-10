const express = require('express');
const {
  creerArticle,
  getArticles,
  getArticleParId,
  modifierArticle,
  supprimerArticle,
} = require('../controllers/ArticleController');

const router = express.Router();

router.post('/', creerArticle);
router.get('/', getArticles);
router.get('/:id', getArticleParId);
router.put('/:id', modifierArticle);
router.delete('/:id', supprimerArticle);

module.exports = router;
