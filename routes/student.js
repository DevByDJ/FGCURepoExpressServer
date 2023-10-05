const express = require('express');
const { json, request, response } = require('express');
const controller = require('../tables/student/controller');

const router = express.Router();

router.use(json());

// router.get('/', controller.getStudent);

// router.get('/all', controller.getAllStudents);

router.post('/', (request, response) => {
  const {
    username, email, password, firstName, lastName, gradeLevel,
  } = request.body;

  controller.createStudent(username, email, password, firstName, lastName, gradeLevel)
    .then((student) => {
      response.status(201).json(student);
    })
    .catch((error) => {
      console.error('Error creating student:', error);
      response.status(500).send('Error creating student.');
    });
});

// router.put('/', controller.updateStudent)

// router.delete('/', controller.deleteStudent);

module.exports = router;
