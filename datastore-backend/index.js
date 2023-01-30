const express = require('express');
const applications = require('./applications');
const contacts = require('./contacts');
const users = require('./users');
const userAppSkills = require('./userAppSkills')
const userSkills = require('./userSkills')
const generalSkills = require('./skills')

const router = express.Router()

router.use('/applications', applications);
router.use('/contacts', contacts);
router.use('/users', users)
router.use('/skills', generalSkills)
router.use('/users/:user_id/', userSkills, userAppSkills)

module.exports = {router}