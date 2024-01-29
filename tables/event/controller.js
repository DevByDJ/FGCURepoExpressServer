const queries = require('../event/queries');
const db = require('../../database');

const getEvents = async (req, res) => {
  try {
    const events = await db.query(queries.getEvents); 

    if(!events.rows) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'events not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'All events',
      payload: events.rows,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const createEvent = async (req, res) => {
  try {
    const { end_date, start_date, content, fk_user_id, header, type, organization, location, url } = req.body;

    const imageFile = req.files.image;
    let uniqueFilename
    let port
    let uploadUrl
    let directoryPath
    let uploadPath

    if (imageFile) {
      // Generate a unique filename
      uniqueFilename = generateUniqueFilename(imageFile.name);
      port = process.env.PORT || 8080; 
      uploadUrl = `http://localhost:${port}/uploads/events/${fk_user_id}/${uniqueFilename}`;
      directoryPath = path.join(__dirname, `../../uploads/events/${fk_user_id}`);
      uploadPath = path.join(__dirname, `../../uploads/events/${fk_user_id}`, uniqueFilename);

      // Create the directory if it doesn't exist
      await fs.mkdir(directoryPath, { recursive: true });

      // Check if a file already exists in the directory
      const files = await fs.readdir(directoryPath);

      // If a file exists, delete it
      if (files.length > 0) {
        await fs.unlink(path.join(directoryPath, files[0]));
      }

      // Move the file to the desired location
      await imageFile.mv(uploadPath);
    }


    const event = await db.query(queries.createEvent, [end_date, start_date, content, fk_user_id, header, type, organization, location, url, uploadUrl]);


    if(!event) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'event Could Not Be Created!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'event created',
      payload: event,
    });

  } catch (err) {
    console.log('error: ', err.message)
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const event = await db.query(queries.updateEvent, [id, content]);

    if(!event) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'event Could Not Be Updated!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'event updated',
      payload: event,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

const deleteEvent = async (req, res) => {
  const client = await db.pool.connect(); // Get a client from the pool

  try {
    const { id } = req.params;
    await client.query('BEGIN'); // Begin transaction
    
    // Perform the transaction operations
    await client.query('DELETE FROM comment WHERE event_id = $1', [id]);
    const result = await client.query('DELETE FROM event WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      throw new Error('event not found');
    }

    await client.query('COMMIT'); // Commit transaction
    res.status(200).json({
      status: 'success',
      message: 'Event Deleted',
      payload: result.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

const getLikesForEvent = async (req, res) => {
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

const likeEvent = async (req, res) => {
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

    // If the user has already liked the event, unlike it
    if(isLiked.rows.length > 0)
    {
      const event = await db.query(queries.unlikeEvent, [user_id, id]);

      if(!event){
          return res.status(404).json({
            status: 'error',
            message: 'event Could Not Be Unliked!',
          });
        }

      return res.status(200).json({
        status: 'success',
        message: 'event Unliked',
        payload: event,
      });
    }

    // If the user has not liked the event, like it
    const event = await db.query(queries.likeEvent, [user_id, id]);

    if(!event) 
    {
      return res.status(404).json({
        status: 'error',
        message: 'event Could Not Be Liked!',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'event Liked',
      payload: event,
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getLikesForEvent,
  likeEvent,
}