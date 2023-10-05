const mongoose = require('mongoose');

const schema = mongoose.Schema;

const internshipSchema = new schema({
  employer_name: { type: String, require: true },
  employer_logo: { type: String, required: false },
  employer_company_type: { type: String, required: false },
  employer_website: { type: String, required: false },
  job_id: { type: String, required: true },
  job_apply_quality_score: {type: Number, required: false},
  job_publisher: { type: String, required: false },
  job_employment_type: { type: String, required: false },
  job_title: { type: String, required: false },
  job_apply_link: { type: String, required: false },
  job_description: { type: String, required: false },
  job_is_remote: { type: Boolean, required: false },
  job_required_skills: { type: Object, required: false },
  job_posted_at_timestamp: { type: Number, required: false },
  job_posted_at_datetime_utc: { type: Date, required: false },
  job_city: { type: String, required: false },
  job_state: { type: String, required: false },
  job_country: { type: String, required: false },
  job_benefits: { type: Object, required: false },
  job_highlights: { type: Object, required: false },
  job_job_title: { type: String, required: false },
  job_min_salary: { type: Number, required: false },
  job_max_salary: { type: Number, required: false },
});

const Internship = mongoose.model('internship', internshipSchema, 'internship');

module.exports = Internship;
