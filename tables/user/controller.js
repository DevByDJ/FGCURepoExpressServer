const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { json, req, res } = require('express');
const saltRounds = 10; // adjust based on your needs
const queries = require('../user/queries');
const db = require('../../database');
const { get } = require('http');

const registerUser = async (request, response) => {
  try {

    const {
      current_class, 
      degree, 
      email,
      full_name, 
      internships_applied, 
      internships_favorited, 
      major, 
      minor, 
      password, 
      photo_url, 
      portfolio_link, 
      profile_bio, 
      role, 
      social_media,  
    } = request.body;
  
    // Check if the email is already be used..
    const emailExists = await db.query(queries.checkEmailExists, [email]);
    if (emailExists.rowCount > 0) {
      return response.status(400).send('Email already exists');
    }
  
    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);
  
    result = await db.query(queries.insertUser, [current_class, degree, email, full_name, internships_applied, internships_favorited, major, minor, hash, photo_url, portfolio_link, profile_bio, role, social_media]);
    
    if (result.rowCount === 0 || !result) {
      return response.status(400).send('User not Registered!');
    }

    
    response.status(200).json({ message: 'User Registered!' });


  } catch (error) {
  console.error(error);
  response.status(500).send('Server error: Failed to Register the User');
}};

//getting all students in db
const getUsers = async (request, response) => {

  try{

    const allUsers = await db.query(queries.getAllUsers);

    if(!allUsers.rows.length) 
    return response.status(404).send('No users found');

    response.status(200).json({users: allUsers.rows});

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');

  }
  
};

const loginUser = async (request, response) => {
  const { email, password } = request.body;
  try{

    if(!email || !password) {
      return response.status(400).send('Email and password required');
    }

    const results = await db.query(queries.getUserByEmail, [email]);

    if (results.rowCount > 0) {
      const user = results.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        response.status(200).json(user);
      } else {
        response.status(400).send('LOG IN FAILED!');
      }
    } else {
      response.status(400).send('LOG IN FAILED!');
    }

  }catch(error){
    console.error(error);
    response.status(500).send('Server error');
  }
};

//looking for a single user
const getUser = async (request, response) => {
  const { email } = request.body;
  try{
    if(!email) {
      return response.status(400).send('Email required');
    }

    const results = await db.query(queries.getUserByEmail, [email]);

    if(results.rowCount > 0) {
      response.status(200).json(results.rows[0]);
    } else {
      response.send('User not found').status(404);
    }

  }catch(error){
    console.error(error);
    response.status(500).send('Server error');
  }
};

const updateUser = async (request, response) => {
  try {
    const { email, current_class, degree, full_name, internships_applied, internships_favorited, major, minor, photo_url, portfolio_link, profile_bio, role, social_media } = request.body;

    // Initialize the query parameters array
    const queryParams = [];
    let queryText = 'UPDATE "user" SET ';

    // Dynamically build the query
    for (let key in request.body) {
      if (request.body.hasOwnProperty(key)) {
        queryText += `${key} = $${queryParams.length + 1}, `;
        queryParams.push(request.body[key]);
      }
    }

    // Remove the last comma and space
    queryText = queryText.slice(0, -2);

    // Add the WHERE clause
    queryText += ' WHERE email = $' + (queryParams.length + 1);
    queryParams.push(email);

    // Execute the query
    const result = await db.query(queryText, queryParams);

    if (result.rowCount === 0 || !result) {
      return response.status(400).send('User not updated!');
    }

    response.status(200).json({ message: 'User updated!' });

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to update the user');
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.body;

    const result = await db.query(queries.deleteUser, [id]);

    if (result.rowCount === 0 || !result) {
      return response.status(400).send('User not deleted!');
    }

    response.status(200).json({ message: 'User deleted!' });

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to delete the user');
  }
};

const getAppliedInternships = async (request, response) => {
  try {
    // Store the id from the request parameters
    const { id } = request.params;

    const result = await db.query(queries.getAppliedInternships, [id]);

    if (result.rowCount === 0 || !result) {
      return response.status(400).send('No Applied Internships found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to get the user');
  }
};

const getFavoritedInternships = async (request, response) => {
  try {
    // Store the id from the request parameters
    const { id } = request.params;

    const result = await db.query(queries.getFavoritedInternships, [id]);

    if (result.rowCount === 0 || !result) {
      return response.status(400).send('No Favorited Internships found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to get the user');
  }
};

const insertFavoritedInternships = async (request, response) => {
  try {
    const { id } = request.params;
    const { internships_favorited, isFavorited } = request.body; // single value

    let result;
    if (isFavorited) {
      result = await db.query(queries.insertFavoritedInternships, [internships_favorited, id]);
    } else {
      result = await db.query(queries.removeFavoritedInternships, [internships_favorited, id]);
    }

    if (result.rowCount === 0) {
      return response.status(400).send('No Favorited Internships found!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to update the user');
  } 
};

const insertAppliedInternships = async (request, response) => {
  try {
    const { id } = request.params;
    const { internships_applied } = request.body; 

    const result = await db.query(queries.insertAppliedInternships, [internships_applied, id]);

    if (result.rowCount === 0) {
      return response.status(400).send('Applied Internship was not Added!');
    }

    response.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    response.status(500).send('Server error: Failed to update the user');
  } 
};

const generateUniqueFilename = (originalName) => {
  const fileExtension = path.extname(originalName);
  const hash = crypto.randomBytes(16).toString('hex');
  return `${Date.now()}-${hash}${fileExtension}`;
};

const getProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(queries.getProfilePhoto, [id]);

    if (result.rowCount === 0 || !result) {
      return res.status(400).send('No profile photo found!');
    }

    // Get url
    const photoUrl = result.rows[0].photo_url;
    res.status(200).json({ photoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error: Failed to get the profile photo');
  }
}

const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageFile = req.files.image; // Access the file from req.files

    console.log('Uploaded File: ', imageFile);

    if (!imageFile) {
      return res.status(400).send('No file uploaded');
    }

    // Generate a unique filename
    const uniqueFilename = generateUniqueFilename(imageFile.name);
    const port = process.env.PORT || 8080; 
    const uploadUrl = `http://localhost:${port}/uploads/${uniqueFilename}`;
    const uploadPath = path.join(__dirname, '../../uploads', uniqueFilename);

    // Move the file to the desired location
    await imageFile.mv(uploadPath);

    // Check if the file exists and handle accordingly
    // (Your existing logic here, if needed)

    // Save the path to the database
    const result = await db.query(queries.uploadImage, [uploadUrl, id]);

    if (result.rowCount === 0) {
      return res.status(400).send('Failed to save image path in the database');
    }

    res.status(200).json({ message: 'File Uploaded Successfully', filePath: uploadPath });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error: Failed to upload the image');
  }
};



module.exports = {
  registerUser,
  getUsers,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getAppliedInternships,
  getFavoritedInternships,
  insertFavoritedInternships,
  insertAppliedInternships,
  getProfilePhoto,
  uploadImage,
};
