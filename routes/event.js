const express = require('express');
const { json } = require('express');
const eventController = require('../tables/event/controller');

const router = express.Router();

router.use(json());

router.get('/', eventController.getEvents);

router.get('/:id/fetch-likes', eventController.getLikesForEvent);

router.post('/', eventController.createEvent);

router.post('/:id/like', eventController.likeEvent);

router.put('/:id', eventController.updateEvent);

router.delete('/:id', eventController.deleteEvent);


module.exports = router;
