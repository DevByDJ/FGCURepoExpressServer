const express = require('express');
const { json } = require('express');
const commentController = require('../tables/comment/controller');

const router = express.Router();

router.use(json());

router.get('/', commentController.getComments);

router.post('/', commentController.createComment);

router.put('/:id', commentController.updateComment);

router.delete('/:id', commentController.deleteComment);


module.exports = router;