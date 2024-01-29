getEvents = `
  SELECT 
    event.*, 
    "user".full_name, 
    "user".photo_url 
  FROM 
    event 
  INNER JOIN 
    "user" 
  ON 
    event.fk_user_id = "user".id
`;
createEvent = 'INSERT INTO "event" (end_date, start_date, content, fk_user_id, header, type, organization, location, url, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING *';
updateEvent = 'UPDATE "event" SET content = $2 WHERE id = $1 RETURNING *';
deleteEvent = `
  DELETE FROM comment WHERE event_id = $1;
  DELETE FROM event WHERE id = $1 RETURNING *;
`;
isLiked = 'SELECT * FROM event WHERE $1 = ANY(liked_by_users) AND id = $2';
likeEvent = 'UPDATE event SET liked_by_users = array_append(liked_by_users, $1) WHERE id = $2 RETURNING *';
unlikeEvent = 'UPDATE event SET liked_by_users = array_remove(liked_by_users, $1) WHERE id = $2 RETURNING *';
getLikeCount = 'SELECT array_length(liked_by_users, 1) FROM event WHERE id = $1';

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  isLiked,
  likeEvent,
  unlikeEvent,
  getLikeCount,
}