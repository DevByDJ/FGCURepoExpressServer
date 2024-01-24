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

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
}