const dotenv = require('dotenv');
const log = require('./logger');


dotenv.config();

const app = require('./index');

const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});



