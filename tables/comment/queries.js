getComments = `
  SELECT 
    comment.*, 
    "user".full_name, 
    "user".photo_url 
  FROM 
    comment 
  INNER JOIN 
    "user" 
  ON 
    comment.fk_user_id = "user".id
`;
createComment = 'INSERT INTO "comment" (text, fk_user_id) VALUES ($1, $2)  RETURNING *';
updateComment = 'UPDATE "comment" SET content = $2 WHERE id = $1 RETURNING *';
deleteComment = 'DELETE FROM "comment" WHERE id = $1 RETURNING *';

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
}