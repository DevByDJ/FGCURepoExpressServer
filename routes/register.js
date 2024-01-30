const express = require('express')
const {json} = require('express')
const controller = require('../tables/user/controller')

const router = express.Router()

router.use(json())


router.post('/', controller.registerUser)


module.exports = router