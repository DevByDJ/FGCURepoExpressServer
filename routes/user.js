const express = require('express');
const { json } = require('express');
const userController = require('../tables/user/controller');
const internshipController = require('../tables/internship/controller');

const router = express.Router();

router.use(json());

router.get('/:id', userController.getUser);

router.get('/', userController.getUsers);

router.get('/:id/applied-internships', internshipController.getAppliedInternships);

router.post('/:id/applied-internships', internshipController.insertAppliedInternships);

router.get('/:id/favorited-internships', internshipController.getFavoritedInternships);

router.post('/:id/favorited-internships', internshipController.insertFavoritedInternships);

router.get('/:id/profile-photo', userController.getProfilePhoto)

router.post('/:id/upload-image', userController.uploadImage);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
