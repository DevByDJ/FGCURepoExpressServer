getPosts = `
  SELECT 
    post.*, 
    "user".full_name, 
    "user".photo_url 
  FROM 
    post 
  INNER JOIN 
    "user" 
  ON 
    post.fk_user_id = "user".id
`;
createPost = 'INSERT INTO "post" (text, fk_user_id) VALUES ($1, $2)  RETURNING *';
updatePost = 'UPDATE "post" SET content = $2 WHERE id = $1 RETURNING *';
deletePost = 'DELETE FROM "post" WHERE id = $1 RETURNING *';
isLiked = 'SELECT * FROM post WHERE $1 = ANY(liked_by_users) AND id = $2';
likePost = 'UPDATE post SET liked_by_users = array_append(liked_by_users, $1) WHERE id = $2 RETURNING *';
unlikePost = 'UPDATE post SET liked_by_users = array_remove(liked_by_users, $1) WHERE id = $2 RETURNING *';
getLikeCount = 'SELECT array_length(liked_by_users, 1) FROM post WHERE id = $1';

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  isLiked,
  likePost,
  unlikePost,
  getLikeCount,
}