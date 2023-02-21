const express = require('express');
const applications = require('./routes/applications');
const contacts = require('./routes/contacts');
const users = require('./routes/users');
const generalSkills = require('./routes/skills')
const userSkills = require('./routes/userSkills')
const userAppSkills = require('./routes/userAppSkills')

const router = express.Router()

router.use('/users/:user_id/applications', applications);
router.use('/users/:user_id/contacts', contacts);
//router.use('/applications', applications);
//router.use('/contacts', contacts);
router.use('/users', users, userSkills, userAppSkills)
router.use('/skills', generalSkills)

module.exports = {router}