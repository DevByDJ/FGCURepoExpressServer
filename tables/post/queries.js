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

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
}