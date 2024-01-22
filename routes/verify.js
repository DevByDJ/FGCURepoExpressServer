const express = require('express')
const {json} = require('express')
const controller = require('../tables/user/controller')

const router = express.Router()

router.use(json())


router.get('/', controller.verifyUser)

router.post('/email', controller.verifyEmail)


module.exports = router