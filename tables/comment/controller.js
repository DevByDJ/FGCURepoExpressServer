const queries = require('../comment/queries');
const db = require('../../database');

const getComments = async (req, res) => {
  try {
    const comments = await db.query(queries.getComments); 

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
    const comment = await db.query(queries.createComment, [content, user_id]);

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

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
}