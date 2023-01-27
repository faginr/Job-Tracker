const express = require('express');
const applications = require('./applications');
const contacts = require('./contacts');
const users = require('./users');

const router = express.Router()

router.use('/applications', applications);
router.use('/contacts', contacts);
router.use('/users', users)

module.exports = {router}