const express = require('express');
const { json } = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const controller = require('../tables/internship/controller');

dotenv.config();

const router = express.Router();

router.use(json());


router.post('/search', async (req, res) => {
  try {
    // Extract the 'query', 'page' and 'num_pages' parameters from the request's query string
    const { query, page, num_pages } = req.query;

    // Set up the options for the axios request
    const options = {
      method: 'GET',
      url: process.env.API_URL,
      params: {
        query: query || 'software engineer internship', // Use the provided query, or default to 'Python developer in Texas, USA'
        page: page || '1', // Use the provided page, or default to '1'
        num_pages: num_pages || '10' // Gets 3 pages full of Internships
      },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': process.env.API_HOST
      }
    };

    const results = await axios.request(options); // returns 30 results!

    // Save each job to the database
    for (let internship of results.data.data) {
      await controller.saveInternship(internship);
    }

    
    res.status(200).json({ message: 'SUCCESS!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

router.get('/all', async (req, res) => {
  
  controller.getAllInternships()
    .then((internships) => {
      res.status(201).json(internships);
    })
    .catch((error) => {
      console.error('Error retrieving all internships: ', error);
      res.status(500).send('Error retrieving all internships');
    });

});

// router.post('/', controller.createInternsip);

router.delete('/old', async (req, res) => {

  controller.deleteOldInternships()
  .then((internships) => {
    res.status(201).json(internships);
  })
  .catch((error) => {
    console.error('Error Deleting Old Internships:', error);
    res.status(500).send('Error Deleting Old Internships');
  });

});

module.exports = router;
