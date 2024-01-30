const express = require('express')
const {json} = require('express') 
const controller = require('../tables/user/controller')

const router = express.Router()

router.use(json())

router.post('/', controller.loginUser)

// Exports this module as a router to be called by the main router.
module.exports = router