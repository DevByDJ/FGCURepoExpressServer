const queries = require('../analytics/queries');
const db = require('../../database');
const axios = require('axios');

const getAllUserAnalytics = async (request, response) => {
  try {

    const results = await db.transaction([
      queries.totalUsers,
      queries.totalFreshmen,
      queries.totalSophomores,
      queries.totalJuniors,
      queries.totalSeniors,
      queries.totalGraduates,
      queries.totalAlumni,
      queries.totalFaculty,
      queries.totalLikes,
      queries.totalApplied,
      queries.totalPosts,
      queries.totalComments,
      queries.totalEvents,
    ]);

    if (results.rowCount === 0) {
      return response.status(400).send('No User Analytics found!');
    }

    const analytics = {
      total_users: results[0].rows[0].count,
      total_freshmen: results[1].rows[0].count,
      total_sophomores: results[2].rows[0].count,
      total_juniors: results[3].rows[0].count,
      total_seniors: results[4].rows[0].count,
      total_graduates: results[5].rows[0].count,
      total_alumni: results[6].rows[0].count,
      total_faculty: results[7].rows[0].count,
      total_likes: results[8].rows[0].count,
      total_applied: results[9].rows[0].count,
      total_posts: results[10].rows[0].count,
      total_comments: results[11].rows[0].count,
      total_events: results[12].rows[0].count,
    };
    
    response.status(200).json(analytics);
    
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to get the user analytics');
  }
}

const saveAllUserAnalytics = async (request, response) => {
  try {
    const res = await axios.get('https://api.cache-it.com/api/analytics/all/user');
    console.log('res: ', res);
    if (res.status !== 200) {
      console.error(`HTTP error! status: ${res.status}`);
      throw new Error('Failed to Fetch User Analytics');
    }

    const json = res.data;

    const {
      total_users,
      total_freshmen,
      total_sophomores,
      total_juniors,
      total_seniors,
      total_graduates,
      total_alumni,
      total_faculty,
      total_likes,
      total_applied,
      total_posts,
      total_comments,
      total_events
    } = json;

    const result = await db.query(queries.insertUserAnalytics, [
      total_users,
      total_freshmen,
      total_sophomores,
      total_juniors,
      total_seniors,
      total_graduates,
      total_alumni,
      total_faculty,
      total_likes,
      total_applied,
      total_posts,
      total_comments,
      total_events
    ]);

    if (result.rowCount === 0) {
      return response.status(400).send('User Analytics were not saved!');
    }

    return response.status(200).send('User Analytics were saved successfully!');
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to save the user analytics');
  }
};


const saveAllCompanyAnalytics = async (request, response) => {
  try {
    const { company_id, company_type, company_action, company_action_type, company_action_value } = request.body;

    const result = await db.query(queries.saveAllCompanyAnalytics, [company_id, company_type, company_action, company_action_type, company_action_value]);

    if (result.rowCount === 0) {
      return response.status(400).send('No Company Analytics found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to save the company analytics');
  }
}

const saveAllInternshipAnalytics = async (request, response) => {
  try {
    const { internship_id, internship_type, internship_action, internship_action_type, internship_action_value } = request.body;

    const result = await db.query(queries.saveAllInternshipAnalytics, [internship_id, internship_type, internship_action, internship_action_type, internship_action_value]);

    if (result.rowCount === 0) {
      return response.status(400).send('No Internship Analytics found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to save the internship analytics');
  }
}

const saveAllAnalytics = async (request, response) => {
  try {
    const { user_id, user_type, user_action, user_action_type, user_action_value, company_id, company_type, company_action, company_action_type, company_action_value, internship_id, internship_type, internship_action, internship_action_type, internship_action_value } = request.body;

    const result = await db.query(queries.saveAllAnalytics, [user_id, user_type, user_action, user_action_type, user_action_value, company_id, company_type, company_action, company_action_type, company_action_value, internship_id, internship_type, internship_action, internship_action_type, internship_action_value]);

    if (result.rowCount === 0) {
      return response.status(400).send('No Analytics found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to save the analytics');
  }
}

module.exports = {
  getAllUserAnalytics,
  saveAllUserAnalytics,
  saveAllCompanyAnalytics,
  saveAllInternshipAnalytics,
  saveAllAnalytics,
}