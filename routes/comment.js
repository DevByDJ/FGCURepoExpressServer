const express = require('express');
const { json } = require('express');
const commentController = require('../tables/comment/controller');

const router = express.Router();

router.use(json());

router.get('/', commentController.getComments);

router.get('/:id/fetch-likes', commentController.getLikesForComment);

router.post('/', commentController.createComment);

router.post('/:id/like', commentController.likeComment);

router.put('/:id', commentController.updateComment);

router.delete('/:id', commentController.deleteComment);


module.exports = router;
