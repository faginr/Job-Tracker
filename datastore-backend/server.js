const express = require('express');
const bodyParser = require('body-parser')
const index = require('./index')
const app = express();

// manage CORS policy
const cors = require('cors');
const constants = require('./routes/constants');
const FRONTEND_URL = constants.frontend_url;

app.use(
  cors({
    // origin: `${FRONTEND_URL}`   // to be used when deployed on Google Cloud
    origin: "*"               // to be used when deployed locally
  })
);

// tell express to parse all incoming bodies as JSON, send custom error message if not JSON
app.use(bodyParser.json())
app.use((err, req, res, next) => {
  if (err) {
      console.error(err)
      res.status(400).send({"Error": "Problem with JSON format in body"})
  } else {
      next()
  }
})

// log every request coming in to the console
app.use((req, res, next) => {
  const reqUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  console.log(`${req.method}: ${reqUrl}`)
  next()
})

app.use('/', index.router);
app.enable('trust proxy');

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});