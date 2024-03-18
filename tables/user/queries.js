const deleteUser = 'DELETE FROM "user" WHERE id = $1'
const insertUser = 'INSERT INTO "user" (current_class, email, full_name, internships_applied, internships_favorited, major, minor, password, photo_url, portfolio_link, profile_bio, social_media, verification_token, internships_viewed, companies_viewed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)'
const getAllUsers = 'SELECT * FROM "user"'
const getVerificationToken = 'SELECT verification_token FROM "user" WHERE email = $1'
const getUserByEmail = 'SELECT * FROM "user" WHERE email = $1'
const getUserById = 'SELECT * FROM "user" WHERE id = $1'
const checkEmailExists = 'SELECT email FROM "user" WHERE email = $1';
const loginUser = 'SELECT u FROM user u WHERE u.email = $1 AND u.password = $2'
const getAppliedInternships = 'SELECT internships_applied FROM "user" WHERE id = $1'
const getFavoritedInternships = 'SELECT internships_favorited FROM "user" WHERE id = $1'
const insertFavoritedInternships = 'UPDATE "user" SET internships_favorited = array_append(internships_favorited, $1) WHERE id = $2';
const removeFavoritedInternships = 'UPDATE "user" SET internships_favorited = array_remove(internships_favorited, $1) WHERE id = $2';
const insertAppliedInternships = 'UPDATE "user" SET internships_applied = array_append(internships_applied, $1) WHERE id = $2';
const getProfilePhoto = 'SELECT photo_url FROM "user" WHERE id = $1';
const uploadImage = 'UPDATE "user" SET photo_url = $1 WHERE id = $2';
const verifyUser = 'UPDATE "user" SET email_verified = true WHERE verification_token = $1';
const insertVerificationToken = 'UPDATE "user" SET verification_token = $1 WHERE email = $2';
const updateUserPassword = 'UPDATE "user" SET password = $1 WHERE verification_token = $2';
const updateLastLogin = 'UPDATE "user" SET last_login = $1 WHERE email = $2';

module.exports = {
  deleteUser,
  insertUser,
  getAllUsers,
  getVerificationToken,
  getUserByEmail,
  getUserById,
  checkEmailExists,
  loginUser,
  getAppliedInternships,
  getFavoritedInternships,
  insertFavoritedInternships,
  removeFavoritedInternships,
  insertAppliedInternships,
  getProfilePhoto,
  uploadImage,
  verifyUser,
  insertVerificationToken,
  updateUserPassword,
  updateLastLogin
}