const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//Get all the current user's bookings-----------------------------------------
router.get('/current', requireAuth, async (req, res, next) => {

});

//Edit booking----------------------------------------------------------------
router.put('/:bookingId', requireAuth, async (req, res, next) => {

});

//Delete booking--------------------------------------------------------------
router.delete('/:bookingId', requireAuth, async (req, res, next) => {

});

module.exports = router;