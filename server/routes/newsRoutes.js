// newsRoutes.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getAllNews);
router.get('/featured', newsController.getFeaturedNews);
router.get('/range', newsController.getNewsByDateRange);
router.get('/:id', newsController.getNews);
router.post('/', newsController.createNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;