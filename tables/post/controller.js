const queries = require('../post/queries');
const db = require('../../database');

const getPosts = async (req, res) => {
  try {
    const posts = await db.query(queries.getPosts); 

    if(!posts.rows) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Posts not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'All posts',
      payload: posts.rows,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const createPost = async (req, res) => {
  try {
    const { content, user_id } = req.body;
    const post = await db.query(queries.createPost, [content, user_id]);

    if(!post) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Post Could Not Be Created!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post created',
      payload: post,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const post = await db.query(queries.updatePost, [id, content]);

    if(!post) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Post Could Not Be Updated!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post updated',
      payload: post,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.query(queries.deletePost, [id]);

    if(!post) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Post Could Not Be Deleted!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post Deleted',
      payload: post,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const getLikesForPost = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.query.user_id;
    console.log('GETTING LIKES!')
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

const likePost = async (req, res) => {
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

    // If the user has already liked the post, unlike it
    if(isLiked.rows.length > 0)
    {
      const post = await db.query(queries.unlikePost, [user_id, id]);

      if(!post){
          return res.status(404).json({
            status: 'error',
            message: 'Post Could Not Be Unliked!',
          });
        }

      return res.status(200).json({
        status: 'success',
        message: 'Post Unliked',
        payload: post,
      });
    }

    // If the user has not liked the post, like it
    const post = await db.query(queries.likePost, [user_id, id]);

    if(!post) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'Post Could Not Be Liked!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post Liked',
      payload: post,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getLikesForPost,
  likePost,
}