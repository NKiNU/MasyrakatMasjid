// Backend Route (routes/islamicVideos.js)
const express = require('express');
const router = express.Router();
const islamicVideoController = require('../controllers/islamicVideoController');

router.post('/', islamicVideoController.createVideo);
router.get('/', islamicVideoController.getAllVideos);
router.get('/:id', islamicVideoController.getVideo);
router.put('/:id', islamicVideoController.updateVideo);
router.delete('/:id', islamicVideoController.deleteVideo);
router.get('/category/:category', islamicVideoController.getVideosByCategory);
// router.get('/recent',islamicVideoController.getRecentVideos)


module.exports = router;