const bcrypt = require('bcrypt');
const { json, req, res } = require('express');
const Student = require('../../models/student');
// replace with the actual path to your model file
const saltRounds = 10; // adjust based on your needs

async function createStudent(username, email, password, firstName, lastName, gradeLevel) {
  const hashedPassword = await bcrypt.hash(password, saltRounds); // hashes the password

  const student = new Student({
    username,
    email,
    password: hashedPassword, // store the hashed password
    firstName,
    lastName,
    gradeLevel,
  });

  try {
    const result = await student.save();
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createStudent,
};
