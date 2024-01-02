const deleteUser = 'DELETE FROM "user" WHERE id = $1'
const insertUser = 'INSERT INTO "user" (current_class, degree, email, full_name, internships_applied, internships_favorited, major, minor, password, photo_url, portfolio_link, profile_bio, role, social_media) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)'
const getAllUsers = 'SELECT * FROM "user"'
const getUserByEmail = 'SELECT * FROM "user" WHERE email = $1'
const checkEmailExists = 'SELECT email FROM "user" WHERE email = $1';
const loginUser = 'SELECT u FROM user u WHERE u.email = $1 AND u.password = $2'
const getAppliedInternships = 'SELECT internships_applied FROM "user" WHERE id = $1'
const getFavoritedInternships = 'SELECT internships_favorited FROM "user" WHERE id = $1'
const insertFavoritedInternships = 'UPDATE "user" SET internships_favorited = array_append(internships_favorited, $1) WHERE id = $2';

module.exports = {
  deleteUser,
  insertUser,
  getAllUsers,
  getUserByEmail,
  checkEmailExists,
  loginUser,
  getAppliedInternships,
  getFavoritedInternships,
  insertFavoritedInternships
}