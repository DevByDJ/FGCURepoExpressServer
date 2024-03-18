const express = require('express');
const { json } = require('express');
const controller = require('../tables/analytics/controller');

const router = express.Router();

router.use(json());

//router.get('/all', controller.getAllAnalytics);

router.get('/all/user', controller.getAllUserAnalytics);

//router.get('/all/company', controller.getAllCompanyAnalytics);

//router.get('/all/internship', controller.getAllInternshipAnalytics);

router.post('/all', controller.saveAllAnalytics);

router.post('/all/user', controller.saveAllUserAnalytics);

router.post('/all/company', controller.saveAllCompanyAnalytics);

router.post('/all/internship', controller.saveAllInternshipAnalytics);



module.exports = router;