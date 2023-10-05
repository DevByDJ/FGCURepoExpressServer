const mongoose = require('mongoose');

const schema = mongoose.Schema;

const studentSchema = new schema({
  username: { type: String, require: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gradeLevel: { type: String, required: false },
}, { timestamps: true });

const Student = mongoose.model('student', studentSchema, 'student');

module.exports = Student;
