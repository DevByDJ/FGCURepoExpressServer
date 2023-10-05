const Internship = require('../../models/internships'); // replace with the path to your Mongoose model

async function saveInternship(data) {

  // Check if a document with the same job_id already exists
  const existingInternship = await Internship.findOne({ job_id: data.job_id });

  if (existingInternship) {
    // If it does, do not save the new document
    console.log('Duplicate detected, not saving to database.');
    return null;
  } else {
    // If not, save the new document
    const newInternship = new Internship(data);
    const result = await newInternship.save();
    console.log('New Internship saved in the DB')
    return result;
  }
};

async function getAllInternships() {
  try {
    const internships = await Internship.find(); // Find all the internships in the collection.
    return internships;
  } catch (err) {
    throw err;
  }
};

async function deleteOldInternships() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 0);

  try {
    const result = await Internship.deleteMany({ job_posted_at_datetime_utc: { $lt: thirtyDaysAgo } });
    return result;
  } catch (err) {
    console.error('Error in deleteOldInternships: ', err);
    throw err;
  }
};

module.exports = {
  saveInternship,
  getAllInternships,
  deleteOldInternships, // Add this line to export the new function
};




