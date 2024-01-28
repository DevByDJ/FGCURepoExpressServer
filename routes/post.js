const express = require('express');
const { json } = require('express');
const postController = require('../tables/post/controller');

const router = express.Router();

router.use(json());

router.get('/', postController.getPosts);

router.get('/:id/fetch-likes', postController.getLikesForPost);

router.post('/', postController.createPost);

router.post('/:id/like', postController.likePost);

router.put('/:id', postController.updatePost);

router.delete('/:id', postController.deletePost);


module.exports = router;
