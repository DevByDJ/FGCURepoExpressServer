const queries = require('../internship/queries');
const db = require('../../database');
const cuid = require('cuid');


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

const transferInternshipsFromMongoToPostgres = async (request, response) => {
  try {
    // Fetch data from MongoDB
    const mongoResponse = await fetch('https://fgcu-sec.com/api/internship/all');
    const internships = await mongoResponse.json();

    // Process each internship and insert into PostgreSQL
    for (const internship of internships) {
      const query = queries.insertInternship; // Assuming you have a query for inserting internships
      
      // Serialize JSON fields
      const jobRequiredSkills = JSON.stringify(internship.job_required_skills || {});
      const jobBenefits = JSON.stringify(internship.job_benefits || {});
      const jobHighlights = JSON.stringify(internship.job_highlights || {});

      const values = [
        internship._id, // Or generate a new ID
        internship.employer_name,
        internship.employer_logo,
        internship.employer_company_type,
        internship.employer_website,
        internship.job_id,
        internship.job_apply_quality_score,
        internship.job_publisher,
        internship.job_employment_type,
        internship.job_title,
        internship.job_apply_link,
        internship.job_description,
        internship.job_is_remote,
        jobRequiredSkills,
        internship.job_posted_at_timestamp,
        internship.job_posted_at_datetime_utc,
        internship.job_city,
        internship.job_state,
        internship.job_country,
        jobBenefits,
        jobHighlights,
        internship.job_job_title,
        internship.job_min_salary,
        internship.job_max_salary,
      ];

      const result = await db.query(query, values);

      if (result.rowCount === 0) {
        // Handle the case where the insertion failed
        console.error('Failed to insert:', internship);
      }
    }

    response.status(200).send('Internships transferred successfully');
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to transfer internships');
  }
};

const deleteOldInternships = async (request, response) => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - 6); // for example, 6 months ago

    const result = await db.query(queries.deleteOldInternships, [thresholdDate.toISOString()]);

    response.status(200).json({ message: `Deleted ${result.rowCount} old internships.` });
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to delete old internships');
  }
};

const saveInternship = async (internship) => {
  try {
    const id = cuid();

    // Serialize JSON fields
    const jobRequiredSkills = JSON.stringify(internship.job_required_skills || {});
    const jobBenefits = JSON.stringify(internship.job_benefits || {});
    const jobHighlights = JSON.stringify(internship.job_highlights || {});

    const values = [
      id,
      internship.employer_name,
      internship.employer_logo,
      internship.employer_company_type,
      internship.employer_website,
      internship.job_id,
      internship.job_apply_quality_score,
      internship.job_publisher,
      internship.job_employment_type,
      internship.job_title,
      internship.job_apply_link,
      internship.job_description,
      internship.job_is_remote,
      jobRequiredSkills,
      internship.job_posted_at_timestamp,
      internship.job_posted_at_datetime_utc,
      internship.job_city,
      internship.job_state,
      internship.job_country,
      jobBenefits,
      jobHighlights,
      internship.job_job_title,
      internship.job_min_salary,
      internship.job_max_salary,
    ];

    await db.query(queries.insertInternship, values);
  } catch (error) {
    console.error('Failed to save internship:', error);
    throw error; // rethrow the error for the caller to handle
  }
};

const getAllInternships = async (request, response) => {
  try {
    const result = await db.query(queries.getAllInternships);
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to get all internships');
  }
};


module.exports = {
  getAppliedInternships,
  getFavoritedInternships,
  insertFavoritedInternships,
  insertAppliedInternships,
  transferInternshipsFromMongoToPostgres,
  deleteOldInternships,
  saveInternship,
  getAllInternships,
};
