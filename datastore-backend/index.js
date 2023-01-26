const express = require('express');
const applications = require('./routes/applications');
const contacts = require('./routes/contacts');
const users = require('./routes/users');

const router = express.Router()

router.use('/applications', applications);
router.use('/contacts', contacts);
router.use('/users', users)

module.exports = {router}