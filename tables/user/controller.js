const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');
const { json, req, res } = require('express');
const saltRounds = 10; // adjust based on your needs
const queries = require('../user/queries');
const db = require('../../database');
const nodemailer = require("nodemailer");
const log = require('../../logger');
const fs = require('fs').promises;
require('dotenv').config()




const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});


const registerUser = async (request, response) => {
  try {
    let {
      current_class, 
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
      social_media,  
    } = request.body;

    // Only lowercase emails for simplicity and consistency
    email = email.toLowerCase();
    let companies_viewed = [];
    let internships_viewed = [];
  
    // Check if the email is already be used..
    const emailExists = await db.query(queries.checkEmailExists, [email]);
    if (emailExists.rowCount > 0) {
      return response.status(400).json({ error: 'Email already exists' });
    }

    // In your server-side registration code
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Save this token in your database alongside the user record

    // Send an email with a verification link
    const verificationLink = `https://api.cache-it.com/api/verify?token=${verificationToken}`;

    const info = await transporter.sendMail({
      from: '"fgcu.sec@gmail.com', // sender address
      to: email, // list of receivers
      subject: "FGCU Job Board Account Verification ✔", // Subject line
      text: "Please click the link below to verify your account: " + verificationLink, // plain text body
      html: `<b>Please click the link below to verify your account: </b> <a href="${verificationLink}">Verify Account</a>`, // html body
    });
     
    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);
  
    result = await db.query(queries.insertUser, [current_class, email, full_name, internships_applied, internships_favorited, major, minor, hash, photo_url, portfolio_link, profile_bio, social_media, verificationToken, internships_viewed, companies_viewed]);
    
    if (result.rowCount === 0 || !result) {
      return response.status(400).json({ error: 'User Not Registered!' });

    }
    
    response.status(200).json({ message: 'User Registered!' });


  } catch (error) {
  console.error(error);
  response.status(500).json({ error: 'Server error: Failed to Register the User'});
}};

//getting all students in db
const getUsers = async (request, response) => {

  try{

    const allUsers = await db.query(queries.getAllUsers);

    if(!allUsers.rows.length) 
    return response.status(404).json({ error: 'No users found'});

    // Remove the password from each user
    const users = allUsers.rows.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    response.status(200).json({users: users});

  } catch (error) {
    console.error(error);
    response.status(500).json({error: 'Server error: Could not get users'});

  }
  
};

const loginUser = async (request, response) => {
  let { email, password } = request.body;
  try{

    if(!email || !password) {
      return response.status(400).json({ message: 'LOG IN FAILED!'});
    }

    email = email.toLowerCase();

    const results = await db.query(queries.getUserByEmail, [email]);

    if (results.rowCount > 0) {
      const user = results.rows[0];
      log('found user: ', user);
      const passwordMatch = await bcrypt.compare(password, user.password);

      // Now check if the user has verified their email
      if (user.email_verified === false) {
        log('EMAIL NOT VERIFIED')
        return response.status(400).json({ message: 'Please verify your email before logging in'});
      } else {
        // Verify the password
        if (passwordMatch) {
          // Update the last login time
          const lastLogin = new Date().toISOString();
          await db.query(queries.updateLastLogin, [lastLogin, email]);
          return response.status(200).json(user);
        } else {
          return response.status(400).json({ message: 'LOG IN FAILED!'});
        }

      }

      
    } else {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

  }catch(error){
    console.error(error);
    return response.status(500).json({ message: 'LOG IN FAILED!'});
  }
};

//looking for a single user
const getUser = async (request, response) => {
  const { id } = request.params;
  try{
    if(!id) {
      return response.status(400).send('User is required to sign in');
    }

    const results = await db.query(queries.getUserById, [id]);

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
    const { id } = request.params; 
    const validFields = Object.fromEntries(
      Object.entries(request.body).filter(([_, value]) => 
        typeof value === 'string' ? value != null && value.trim() !== '' : value != null
      )
    );

    // Initialize the query parameters array
    const queryParams = [];
    let queryText = 'UPDATE "user" SET ';

    // Dynamically build the query with non-blank values
    Object.entries(validFields).forEach(([key, value], index) => {
      queryText += `${key} = $${index + 1}, `;
      queryParams.push(value);
    });

    // Remove the last comma and space
    queryText = queryText.slice(0, -2);

    // Add the WHERE clause
    queryText += ' WHERE id = $' + (queryParams.length + 1);
    queryParams.push(id); // use id in the WHERE clause

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

    console.log(req.params); // Should show { id: 'some-value' }

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

    log('Uploaded File: ', imageFile);

    if (!imageFile) {
      return res.status(400).send('No file uploaded');
    }

    // Generate a unique filename
    const uniqueFilename = generateUniqueFilename(imageFile.name);
    const uploadUrl = `https://api.cache-it.com/uploads/${id}/${uniqueFilename}`;
    const directoryPath = path.join(__dirname, `../../uploads/${id}`);
    const uploadPath = path.join(__dirname, `../../uploads/${id}`, uniqueFilename);

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

const verifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already be used..
    const emailExists = await db.query(queries.checkEmailExists, [email]);

    if (!emailExists.rowCount) {
      return response.status(400).json({ error: 'Email does not exist!' });
    }

  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Server error: Failed to verify email'});
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const result = await db.query(queries.insertVerificationToken, [verificationToken, email]);

  if (result.rowCount === 0 || !result) {
    return res.status(400).json({ error: 'Invalid or expired token.'});
  }

  // Send an email with a verification link
  const verificationLink = `https://api.cache-it.com/api/verify?token=${verificationToken}`;

  try {
    const info = await transporter.sendMail({
      from: '"fgcu.sec@gmail.com', // sender address
      to: email, // list of receivers
      subject: "FGCU Job Board Account Verification ✔", // Subject line
      text: "Please click the link below to verify your account: " + verificationLink, // plain text body
      html: `<b>Please click the link below to verify your account: </b> <a href="${verificationLink}">Verify Account</a>`, // html body
    });

    res.status(200).json({ message: 'Email Verification has been sent!' });

  }catch (error){
    console.error(error);
    res.status(500).json({ error: 'Server error: Failed to send verification email'});
  }

}

const verifyUser = async (req, res) => {
  const { token } = req.query;

  try {
    const result = await db.query(queries.verifyUser, [token]);

    if (result.rowCount === 0 || !result) {
      return res.status(400).json({ error: 'Invalid or expired token.'});
    }

    res.status(200).json({ message: 'Email verified successfully.'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error: Failed to verify the user'});
  }

}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already be used..
    const emailExists = await db.query(queries.checkEmailExists, [email]);

    if (!emailExists.rowCount) {
      return response.status(400).json({ error: 'Email does not exist!' });
    }

    // In your server-side registration code
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Save this token in your database alongside the user record

    // Send an email with a verification link
    const resetPasswordLink = `https://cache-it.com/reset-password?token=${verificationToken}`;

    const result = await db.query(queries.insertVerificationToken, [verificationToken, email]);

    if (result.rowCount === 0 || !result) {
      return res.status(400).json({ error: 'Invalid or expired token.'});
    }

    const info = await transporter.sendMail({
      from: '"fgcu.sec@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Reset Password -- SEC Job Board", // Subject line
      text: "Please click the link below to reset your password: " + resetPasswordLink, // plain text body
      html: `<b>Please click the link below to reset your password: </b> <a href="${resetPasswordLink}">Reset Password</a>`, // html body
    });

    res.status(200).json({ message: 'Password Reset Email has been sent!'});

  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Server error: Failed to Send Password Email'});
  }

}

const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  try {
    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(queries.updateUserPassword, [hash, token]);

    if (result.rowCount === 0 || !result) {
      return res.status(400).json({ error: 'Invalid or expired token.'});
    }

    res.status(200).json({ message: 'Password Reset Successfully.'});
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error: Failed to Reset Password!'});
  }
}

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
  verifyEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
};
