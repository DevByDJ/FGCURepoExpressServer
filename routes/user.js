const express = require('express');
const { json, request, response } = require('express');
const controller = require('../tables/user/controller');

const router = express.Router();

router.use(json());

router.get('/', controller.getUser);

router.get('/all', controller.getUsers);

router.get('/:id/applied-internships', controller.getAppliedInternships);

router.get('/:id/favorited-internships', controller.getFavoritedInternships);

router.post('/:id/favorited-internships', controller.insertFavoritedInternships);

router.put('/', controller.updateUser);

router.delete('/', controller.deleteUser);

module.exports = router;
