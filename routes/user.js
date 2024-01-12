const express = require('express');
const { json } = require('express');
const controller = require('../tables/user/controller');

const router = express.Router();

router.use(json());

router.get('/:id', controller.getUser);

router.get('/all', controller.getUsers);

router.get('/:id/applied-internships', controller.getAppliedInternships);

router.post('/:id/applied-internships', controller.insertAppliedInternships);

router.get('/:id/favorited-internships', controller.getFavoritedInternships);

router.post('/:id/favorited-internships', controller.insertFavoritedInternships);

router.get('/:id/profile-photo', controller.getProfilePhoto)

router.post('/:id/upload-image', controller.uploadImage);

router.put('/:id', controller.updateUser);

router.delete('/:id', controller.deleteUser);

module.exports = router;
