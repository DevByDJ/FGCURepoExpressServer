const queries = require('../internship/queries');
const db = require('../../database');


const getAppliedInternships = async (request, response) => {
  try {
    // Store the id from the request parameters
    const { id } = request.params;

    const result = await db.query(queries.getAppliedInternships, [id]);

    if (result.rowCount === 0 || !result) {
      return response.status(400).send('No Applied Internships found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to get the user');
  }
};

const getFavoritedInternships = async (request, response) => {
  try {
    // Store the id from the request parameters
    const { id } = request.params;

    const result = await db.query(queries.getFavoritedInternships, [id]);

    if (result.rowCount === 0 || !result) {
      return response.status(400).send('No Favorited Internships found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to get the user');
  }
};

const insertFavoritedInternships = async (request, response) => {
  try {
    const { id } = request.params;
    const { internships_favorited, isFavorited } = request.body; // single value

    let result;
    if (isFavorited) {
      result = await db.query(queries.insertFavoritedInternships, [internships_favorited, id]);
    } else {
      result = await db.query(queries.removeFavoritedInternships, [internships_favorited, id]);
    }

    if (result.rowCount === 0) {
      return response.status(400).send('No Favorited Internships found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to update the user');
  } 
};

const insertAppliedInternships = async (request, response) => {
  try {
    const { id } = request.params;
    const { internships_applied } = request.body; 

    const result = await db.query(queries.insertAppliedInternships, [internships_applied, id]);

    if (result.rowCount === 0) {
      return response.status(400).send('Applied Internship was not Added!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to update the user');
  } 
};

module.exports = {
  getAppliedInternships,
  getFavoritedInternships,
  insertFavoritedInternships,
  insertAppliedInternships,
};
