const express = require('express');
const index = require('./index')
const app = express();

app.use('/', index.router);
app.enable('trust proxy');

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});