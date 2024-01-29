const queries = require('../comment/queries');
const db = require('../../database');

const getComments = async (req, res) => {
  try {
    const post_id = req.query.post_id;
    const event_id = req.query.event_id;

    if(!post_id && !event_id) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Post ID or Event ID Not Found!',
      });
    }

    // If the request is for an post
    if(post_id) {

      const comments = await db.query(queries.getPostComments, [post_id]); 

      if(!comments.rows) 
      {
        return res.status(404).json({
          status: 'error',
          message: 'Comments not found',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'All Comments',
        payload: comments.rows,
      });

    }

    // If the request is for an event
    if(event_id) {

      const comments = await db.query(queries.getEventComments, [event_id]); 

      if(!comments.rows) 
      {
        return res.status(404).json({
          status: 'error',
          message: 'Comments not found',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'All Comments',
        payload: comments.rows,
      });

    } 

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const createComment = async (req, res) => {
  try {
    const { content, user_id } = req.body;
    const post_id = req.query.post_id;
    const event_id = req.query.event_id;

    if(!post_id && !event_id){
      return res.status(404).json({
        status: 'error',
        message: 'Post ID or Event ID Not Found!',
      });
    }

    if(post_id){
      const comment = await db.query(queries.createPostComment, [content, user_id, post_id]);

      if(!comment) 
      {
        return res.status(404).json({
          status: 'error',
          message: 'Comment Could Not Be Created!',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Comment created',
        payload: comment,
      });

    }

    if(event_id){
      const comment = await db.query(queries.createEventComment, [content, user_id, event_id]);

      if(!comment) 
      {
        return res.status(404).json({
          status: 'error',
          message: 'Comment Could Not Be Created!',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Comment created',
        payload: comment,
      });

    }


  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await db.query(queries.updateComment, [id, content]);

    if(!comment) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Comment Could Not Be Updated!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Comment updated',
      payload: comment,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await db.query(queries.deleteComment, [id]);

    if(!comment) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Comment Could Not Be Deleted!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Comment Deleted',
      payload: comment,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const getLikesForComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.query.user_id;
    const likes = await db.query(queries.getLikeCount, [id]);
    const isLikedResult = await db.query(queries.isLiked, [user_id, id]);

    let isLiked = false;

    if(isLikedResult.rows.length > 0) 
    {
      isLiked = true;
    }

    if(likes.rows[0].array_length === null){
      likes.rows[0].array_length = 0;
    }

    res.status(200).json({
      status: 'success',
      message: 'Likes Found',
      payload: likes.rows[0].array_length,
      isLiked: isLiked,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if(!user_id) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'User ID Not Found!',
      });
    }

    const isLiked = await db.query(queries.isLiked, [user_id, id]);

    // If the user has already liked the Comment, unlike it
    if(isLiked.rows.length > 0)
    {
      const comment = await db.query(queries.unlikeComment, [user_id, id]);

      if(!comment){
          return res.status(404).json({
            status: 'error',
            message: 'Comment Could Not Be Unliked!',
          });
        }

      return res.status(200).json({
        status: 'success',
        message: 'Comment Unliked',
        payload: comment,
      });
    }

    // If the user has not liked the Comment, like it
    const comment = await db.query(queries.likeComment, [user_id, id]);

    if(!comment) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Comment Could Not Be Liked!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Comment Liked',
      payload: comment,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getLikesForComment,
  likeComment,
}