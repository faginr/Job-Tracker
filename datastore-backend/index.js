const express = require('express');
const applications = require('./routes/applications');
const contacts = require('./routes/contacts');
const users = require('./routes/users');
const generalSkills = require('./routes/skills')
const userSkills = require('./routes/userSkills')
const userAppSkills = require('./routes/userAppSkills')

const router = express.Router()

router.use('/', applications);
router.use('/', contacts);
router.use('/users', users, userSkills, userAppSkills)
router.use('/skills', generalSkills)

module.exports = {router}