const axios = require('axios');

async function deleteOldInternships(){
  try {
    const url = 'https://fgcu-sec.com/api/internship/old';
    const response = await axios.delete(url);
    const data = response.data;
    console.log('Succesfully Removed Old Internships: ', data)
  } catch (error) {
    console.log(error)
  }
}

async function getNewInternships(){
  try {
    const url = 'https://fgcu-sec.com/api/internship/search?query=software engineer internship&page=1&num_pages=30&date_posted=week';
    const response = await axios.post(url);
    const data = response.data;
    console.log('Retrieved new internships! ', data);
  } catch (error) {
    console.log(error)
  }
}

async function getNewGradPositions(){
  try {
    const url = 'https://fgcu-sec.com/api/internship/search?query=software engineer new grad&page=1&num_pages=30&date_posted=week';
    const response = await axios.post(url);
    const data = response.data;
    console.log('Retrieved new grad positions! ', data);
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  deleteOldInternships,
  getNewInternships,
  getNewGradPositions,
}