const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();


router.get('/', async (req, res, next) => {

    const allSpots = await Spot.findAll({
        include: [Review, SpotImage]
    })
    console.log(allSpots)
    // console.log(allSpots[0].dataValues.Reviews)
    res.status(200).json({Spots: allSpots});
});

//loop through query (await spot.findall)

module.exports = router;