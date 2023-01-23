const router = module.exports = require('express').Router();

router.use('/applications', require('./applications'));
router.use('/contacts', require('./contacts'));