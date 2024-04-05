const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const {Op} = require('sequelize');

const router = express.Router();

//Get all the current user's bookings-----------------------------------------
//Clarify / fix previewImage and booking dates
router.get('/current', requireAuth, async (req, res, next) => {
    const allBookings = await Booking.findAll({
        where: {userId: req.user.id},
        include: [
            {
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price'
                ],
                include: SpotImage
            }
        ]
    });

    const arr = [];
    allBookings.forEach(ele => {
        const spotBody = ele.toJSON();
        const objArr = spotBody.Spot.SpotImages;

        if(objArr[0]) spotBody.Spot.previewImage = objArr[0].url
        if(!objArr[0]) spotBody.Spot.previewImage = 'Does not exist'

        delete spotBody.Spot.SpotImages;
        arr.push(spotBody);
    });

    res.json({Bookings: arr});
});

//Edit booking----------------------------------------------------------------
//NOT COMPLETE
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.bookingId);
    const {startDate, endDate} = req.body;

    const booking = await Booking.findByPk(id);

    await booking.update({

    })
});

//Delete booking--------------------------------------------------------------
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.bookingId);

    const booking = await Booking.findByPk(id);

    const startDateArr = booking.toJSON().startDate.toISOString().split('T');
    strStartDate = startDateArr[0].split('-').join('');

    const todayArr = new Date().toISOString().split('T');
    const strToday = todayArr[0].split('-').join('');

    if(!booking){
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        throw err;
    }

    if(strToday > strStartDate){
        const err = new Error("Bookings that have been started can't be deleted");
        err.status = 403;
        throw err;
    }

    booking.destroy();
    res.json({message: 'Successfully deleted'});
});



module.exports = router;