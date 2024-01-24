const getAppliedInternships = 'SELECT internships_applied FROM "user" WHERE id = $1'
const getFavoritedInternships = 'SELECT internships_favorited FROM "user" WHERE id = $1'
const insertFavoritedInternships = 'UPDATE "user" SET internships_favorited = array_append(internships_favorited, $1) WHERE id = $2';
const removeFavoritedInternships = 'UPDATE "user" SET internships_favorited = array_remove(internships_favorited, $1) WHERE id = $2';
const insertAppliedInternships = 'UPDATE "user" SET internships_applied = array_append(internships_applied, $1) WHERE id = $2';

module.exports = {
  getAppliedInternships,
  getFavoritedInternships,
  insertFavoritedInternships,
  removeFavoritedInternships,
  insertAppliedInternships,
}