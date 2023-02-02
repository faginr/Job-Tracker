const express = require('express');
const applications = require('./routes/applications');
const contacts = require('./routes/contacts');
const users = require('./routes/users');
const generalSkills = require('./routes/skills')
const userSkills = require('./routes/userSkills')
const userAppSkills = require('./routes/userAppSkills')

const router = express.Router()

router.use('/applications', applications);
router.use('/contacts', contacts);
router.use('/users', users)
router.use('/skills', generalSkills)

// TODO: change this to begin with /users/:user_id once user verification
// implemented
router.use('/skills', userSkills, userAppSkills)

module.exports = {router}