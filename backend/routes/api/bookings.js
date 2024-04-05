const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const {Op} = require('sequelize');

const router = express.Router();

//Get all the current user's bookings-----------------------------------------
//Clarify / fix previewImage
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

        const sformat = spotBody.startDate.toISOString().split('T').join(' ').slice(0, 10);
        const eformat = spotBody.endDate.toISOString().split('T').join(' ').slice(0, 10);
        spotBody.startDate = sformat;
        spotBody.endDate = eformat;
    
        const cformat = spotBody.createdAt.toISOString().split('T').join(' ').slice(0, 19);
        const uformat = spotBody.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
        spotBody.createdAt = cformat;
        spotBody.updatedAt = uformat;

        const objArr = spotBody.Spot.SpotImages;

        for(let i = 0; i < objArr.length; i++){
            if(objArr[i].url !== null) spotBody.Spot.previewImage = objArr[i].url
            else spotBody.Spot.previewImage = 'Preview does not exist'
        }

        delete spotBody.Spot.SpotImages;
        arr.push(spotBody);
    });

    res.json({Bookings: arr});
});

//Edit booking----------------------------------------------------------------
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.bookingId);
    const {startDate, endDate} = req.body;

    const myStartDate = startDate.split('-').join('');
    const myEndDate = endDate.split('-').join('');
    const currentDate = new Date().toISOString().split('T')[0].split('-').join('');
    
    const booking = await Booking.findByPk(id);
    const allBookings = await Booking.findAll();


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

    const bookingObj = booking.toJSON();
    
    const err = new Error("Sorry, this spot is already booked for the specified dates");
    err.status = 403;
    err.errors = {};

    allBookings.forEach(ele => {

        const exStartDate = (ele.startDate.toISOString().split('T'))[0].split('-').join('');
        const exEndDate = (ele.endDate.toISOString().split('T'))[0].split('-').join('');

        if(ele.id !== bookingObj.id){
            if(myStartDate === exStartDate) err.errors.startDate = "Start date conflicts with an existing booking";
            if(myStartDate === exEndDate) err.errors.startDate = "Start date conflicts with an existing booking";
            if(myEndDate === exStartDate) err.errors.endDate = "End date conflicts with an existing booking";
            if(myEndDate === exEndDate) err.errors.endDate = "End date conflicts with an existing booking";
            if(myStartDate > exStartDate && myStartDate < exEndDate) err.errors.startDate = "Start date conflicts with an existing booking";
            if(myEndDate > exStartDate && myEndDate < exEndDate) err.errors.endDate = "End date conflicts with an existing booking";
            if(myStartDate > exStartDate && myEndDate < exEndDate) err.errors.startDate = "Start and end dates conflict with existing booking";
            if(myStartDate < exStartDate && myEndDate > exEndDate) err.errors.startDaet = "Start and end dates conflict with existing booking";
            if(Object.keys(err.errors).length) throw err;
        }
    });

    if(currentDate > myStartDate){
        const err = new Error("startDate cannot be in the past");
        err.status = 400;
        throw err;
    }

    if(myEndDate <= myStartDate){
        const err = new Error("endDate cannot be on or before startDate");
        err.status = 400;
        throw err;
    }

    await booking.update({
        spotId: Spot.id, userId: req.user.id, startDate, endDate
    });

    const bk = booking.toJSON();
    const sformat = bk.startDate.toISOString().split('T').join(' ').slice(0, 10);
    const eformat = bk.endDate.toISOString().split('T').join(' ').slice(0, 10);
    bk.startDate = sformat;
    bk.endDate = eformat;

    const cformat = bk.createdAt.toISOString().split('T').join(' ').slice(0, 19);
    const uformat = bk.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
    bk.createdAt = cformat;
    bk.updatedAt = uformat;

    res.status(200).json(bk);
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

    if(req.user.id !== booking.userId){
        const err = new Error('Forbidden');
        err.status = 403;
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