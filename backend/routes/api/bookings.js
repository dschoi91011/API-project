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

    const myStartDate = startDate.split('-').join('');
    const myEndDate = endDate.split('-').join('');
    const currentDate = new Date().toISOString().split('T')[0].split('-').join('');
    
    const booking = await Booking.findByPk(id);

    if(!booking){
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        throw err;
    }

    if(req.user.id !== booking.userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    if (myStartDate < currentDate &&
        myStartDate < myEndDate &&
        myEndDate <= currentDate){
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        throw err;
    }

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = {};
    if(myEndDate <= myStartDate){
        err.errors.endDate = 'endDate cannot be on or before startDate';
        throw err;
    }
    if(myStartDate < currentDate){
        err.errors.startDate = 'startDate cannot be in the past';
        throw err;
    }

    const err2 = new Error('Sorry, this spot is already booked for the specified dates');
    err2.status = 403;
    err2.errors = {};

    bookingObj = booking.toJSON();
    const exStartDate = (bookingObj.startDate.toISOString().split('T'))[0].split('-').join('');
    const exEndDate = (bookingObj.endDate.toISOString().split('T'))[0].split('-').join('');
    console.log('----------------------', exStartDate, exEndDate)

    if(myStartDate === exStartDate){
        err2.errors.startDate = 'Start date conflicts with an existing booking';
        throw err2;
    }
    if(myEndDate === exEndDate){
        err2.errors.endDate = 'End date conflicts with an existing booking';
        throw err2;
    }
    if(myStartDate > exStartDate && myStartDate < exEndDate){
        err2.errors.startDate = 'Start date conflicts with an existing booking';
        throw err2;
    }
    if(myEndDate > exStartDate && myEndDate < exEndDate){
        err2.errors.endDate = 'End date conflicts with an existing booking';
        throw err2;
    }
    if(myStartDate <= exStartDate && myEndDate >= exEndDate){
        err2.errors.dateRange = 'Date range overlaps existing one';
        throw err2;
    }

    await booking.update({
        spotId: Spot.id, userId: req.user.id, startDate, endDate
    });
    res.status(200).json(booking);
});

//Delete booking--------------------------------------------------------------
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.bookingId);

    const booking = await Booking.findByPk(id);

    if(!booking){
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        throw err;
    }

    const startDateArr = booking.toJSON().startDate.toISOString().split('T');
    myStartDate = startDateArr[0].split('-').join('');

    const todayArr = new Date().toISOString().split('T');
    const currentDate = todayArr[0].split('-').join('');

    if(currentDate > myStartDate){
        const err = new Error("Bookings that have been started can't be deleted");
        err.status = 403;
        throw err;
    }

    booking.destroy();
    res.json({message: 'Successfully deleted'});
});



module.exports = router;