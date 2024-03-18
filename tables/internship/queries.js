const getAppliedInternships = 'SELECT internships_applied FROM "user" WHERE id = $1'
const getFavoritedInternships = 'SELECT internships_favorited FROM "user" WHERE id = $1'
const insertFavoritedInternships = 'UPDATE "user" SET internships_favorited = array_append(internships_favorited, $1) WHERE id = $2';
const removeFavoritedInternships = 'UPDATE "user" SET internships_favorited = array_remove(internships_favorited, $1) WHERE id = $2';
const insertAppliedInternships = 'UPDATE "user" SET internships_applied = array_append(internships_applied, $1) WHERE id = $2';
const insertInternship = `
  INSERT INTO internships (
    id, employer_name, employer_logo, employer_company_type, employer_website, 
    job_id, job_apply_quality_score, job_publisher, job_employment_type, 
    job_title, job_apply_link, job_description, job_is_remote, 
    job_required_skills, job_posted_at_timestamp, job_posted_at_datetime_utc, 
    job_city, job_state, job_country, job_benefits, job_highlights, 
    job_job_title, job_min_salary, job_max_salary
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
    $16, $17, $18, $19, $20, $21, $22, $23, $24
  )
`;
const deleteOldInternships = `
  DELETE FROM internships 
  WHERE job_posted_at_datetime_utc < $1;
`;

const getAllInternships = `
  SELECT * FROM internships;
`;

const insertInternshipViewed = 'UPDATE "user" SET internships_viewed = array_append(internships_viewed, $1) WHERE id = $2';
const insertUserView = 'UPDATE internships SET user_views = array_append(user_views, $1) WHERE id = $2';


module.exports = {
  getAppliedInternships,
  getFavoritedInternships,
  insertFavoritedInternships,
  removeFavoritedInternships,
  insertAppliedInternships,
  insertInternship,
  deleteOldInternships,
  getAllInternships,
  insertInternshipViewed,
  insertUserView,
}