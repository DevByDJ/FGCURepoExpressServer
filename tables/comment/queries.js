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
  WHERE 
    comment.post_id = $1
`;
createComment = 'INSERT INTO "comment" (text, fk_user_id, post_id) VALUES ($1, $2, $3)  RETURNING *';
updateComment = 'UPDATE "comment" SET content = $2 WHERE id = $1 RETURNING *';
deleteComment = 'DELETE FROM "comment" WHERE id = $1 RETURNING *';
isLiked = 'SELECT * FROM comment WHERE $1 = ANY(liked_by_users) AND id = $2';
likeComment = 'UPDATE comment SET liked_by_users = array_append(liked_by_users, $1) WHERE id = $2 RETURNING *';
unlikeComment = 'UPDATE comment SET liked_by_users = array_remove(liked_by_users, $1) WHERE id = $2 RETURNING *';
getLikeCount = 'SELECT array_length(liked_by_users, 1) FROM comment WHERE id = $1';

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  isLiked,
  likeComment,
  unlikeComment,
  getLikeCount,
}