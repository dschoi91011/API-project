const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//Get all spots----------------------------------------------------------
router.get('/', async (req, res, next) => {

    const allSpots = await Spot.findAll({
        include: [Review, SpotImage]
    });

    const arr = [];

    allSpots.forEach(ele => {
        const spotBody = ele.toJSON();
        const reviewsArr = spotBody.Reviews;

        if(reviewsArr.length === 0) spotBody.avgRating = 'No reviews available'

        let sum = 0;

        if(reviewsArr && reviewsArr.length > 0){
            for(let i = 0; i < reviewsArr.length; i++){
                sum += reviewsArr[i].stars
            }
        }

        const avg = sum / reviewsArr.length

        spotBody.avgRating = avg;

        //--------spotimages---------------------

        if(spotBody.SpotImages[0]){
            spotBody.previewImage = spotBody.SpotImages[0].url
        }

        if(!spotBody.SpotImages[0]){
            spotBody.previewImage = 'Does not exist'
        }

        delete spotBody.SpotImages
        delete spotBody.Reviews

        arr.push(spotBody)
    });

    res.status(200).json({Spots: arr});
});

//Get all spots owned by current user-----------------------------------------
//Review 'const {user} = req
//Still requires avgRating and spotImg
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req

    const allSpots = await Spot.findAll({
        where: {ownerId: user.id},
        include: [Review, SpotImage]
    });

    res.json(allSpots)
});

//Get details of spot from an id----------------------------------------------
//Still requires aliasing
router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,// as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })

    if(!spot){
        res.status(404).json({message: "Spot couldn't be found"});
        return
    }

    res.json(spot)
});

//Create a spot-----------------------------------------------------------------
router.post('/', requireAuth, async (req, res, next) => {

    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id

    const newSpot = await Spot.create({
        ownerId, address, city, state, country, lat, lng, name, description, price
    });

    if(!address ||
       !city ||
       !state ||
       !country ||
       (lat < -90 || lat > 90) ||
       (lng < -180 || lng > 180) ||
       name.length >= 50 ||
       !description ||
       price <= 0     
    ){
        res.status(400).json({message: 'Bad Request'});
        return;
    }

    res.status(201).json(newSpot);
});

//Add image to spot based on spot's id------------------------------------------
router.post('/:spotId/images', requireAuth, async (req, res, next) => {

});


module.exports = router;