const express = require('express');
const { json } = require('express');
// const controller = require('../tables/internship/controller');

const router = express.Router();

router.use(json());

// router.get('/', controller.getInternship);

// router.get('/all', controller.allInternships);

// router.post('/', controller.createInternsip);

// router.delete('/', controller.deleteInternship);

module.exports = router;
