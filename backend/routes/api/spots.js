const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();


router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll();
    res.status(200).json({Spots: allSpots});
});



module.exports = router;