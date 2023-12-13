const axios = require('axios');

async function deleteOldInternships(){
  try {
    //const url = 'https://fgcu-sec.com/api/internship/old';
    const url = 'http://localhost:8080/api/internship/old';
    const response = await axios.delete(url);
    const data = response.data;
    console.log('Succesfully Removed Old Internships: ', data)
  } catch (error) {
    console.log(error)
  }
}

async function getNewInternships(){
  console.log('Retrieved new internships!');
}

async function getNewGradPositions(){
  console.log('Retrieved New Grad Positions');
}

module.exports = {
  deleteOldInternships,
  getNewInternships,
  getNewGradPositions,
}