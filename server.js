const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { deleteOldInternships, getNewInternships, getNewGradPositions } = require('./handlers')

dotenv.config();

const uri = process.env.DB_CONNECTION_STRING;
const app = require('./index');

// Async function to connect to MongoDB
async function connect() {
  try {
    // Set strictQuery to false
    mongoose.set('strictQuery', false);
    // Connect to MongoDB using the URL stored in uri
    await mongoose.connect(uri);
    // Print success message to console if connection is successfull
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }
}

connect();

cron.schedule(`0 3 * * *`, async () => {
  await deleteOldInternships();
  console.log('deleteOldInternships() task was called!')
});

cron.schedule(`0 0 * * *`, async () => {
  await getNewInternships();
  console.log('getNewInternships() task was called!')
});

cron.schedule(`0 0 * * 1,4,7`, async () => {
  await getNewGradPositions();
  console.log('getNewGradPositions() task was called!')
})

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});



