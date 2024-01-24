const express = require('express');
const { json } = require('express');
const postController = require('../tables/post/controller');

const router = express.Router();

router.use(json());

router.get('/', postController.getPosts);

router.post('/', postController.createPost);

router.put('/:id', postController.updatePost);

router.delete('/:id', postController.deletePost);


module.exports = router;
