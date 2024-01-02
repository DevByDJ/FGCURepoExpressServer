const dotenv = require('dotenv');

dotenv.config();

const app = require('./index');

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});



