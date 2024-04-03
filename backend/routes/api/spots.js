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

        let sum = 0;

        if(reviewsArr && reviewsArr.length > 0){
            for(let i = 0; i < reviewsArr.length; i++){
                sum += reviewsArr[i].stars;
            }
            const avg = sum / reviewsArr.length;
            spotBody.avgRating = avg;
        } else {
            spotBody.avgRating = 'No ratings available';
        }

        //--------spotimages---------------------

        if(spotBody.SpotImages[0]){
            spotBody.previewImage = spotBody.SpotImages[0].url;
        }

        if(!spotBody.SpotImages[0]){
            spotBody.previewImage = 'Does not exist';
        }

        delete spotBody.SpotImages;
        delete spotBody.Reviews;

        arr.push(spotBody);
    });

    res.json({Spots: arr});
});

//Get all spots owned by current user-----------------------------------------
//Review 'const {user} = req
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req

    const allSpots = await Spot.findAll({
        where: {ownerId: user.id},
        include: [Review, SpotImage]
    });

    const arr = [];

    allSpots.forEach(ele => {
        const spotBody = ele.toJSON();
        const reviewsArr = spotBody.Reviews;

        let sum = 0;

        if(reviewsArr && reviewsArr.length > 0){
            for(let i = 0; i < reviewsArr.length; i++){
                sum += reviewsArr[i].stars;
            }
            const avg = sum / reviewsArr.length;
            spotBody.avgRating = avg;
        } else {
            spotBody.avgRating = 'No ratings available';
        }

        //--------spotimages---------------------

        if(spotBody.SpotImages[0]){
            spotBody.previewImage = spotBody.SpotImages[0].url;
        }

        if(!spotBody.SpotImages[0]){
            spotBody.previewImage = 'Does not exist';
        }

        delete spotBody.SpotImages;
        delete spotBody.Reviews;

        arr.push(spotBody);
    });

    res.json({Spots: arr})
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
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })

    if(!spot){
       return res.status(404).json({message: "Spot couldn't be found"});
    }

    res.json(spot)
});

//Create a spot-----------------------------------------------------------------
//where is req.user coming from?
router.post('/', requireAuth, async (req, res, next) => {

    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors ={};
    if(!address){
        err.errors.address = 'Street address is required';
        throw err;
    }
    if(!city){
        err.errors.city = 'City is required';
        throw err;
    }
    if(!state){
        err.errors.state = 'State is required';
        throw err;
    }
    if(!country){
        err.errors.country = 'Country is required';
    }
    if(lat < -90 || lat > 90){
        err.errors.lat = 'Latitude must be within -90 and 90';
        throw err;
    }
    if(lng < -180 || lng > 180){
        err.errors.lng = 'Longitude must be within -180 and 180';
        throw err;
    }
    if(name.length >= 50){
        err.errors.name = 'Name must be less than 50 characters';
        throw err;
    }
    if(!description){
        err.errors.description = 'Description is required';
        throw err;
    }
    if(price <= 0){
        err.errors.price = 'Price per day must be a positive number';
        throw err;
    }

    const newSpot = await Spot.create({
        ownerId, address, city, state, country, lat, lng, name, description, price
    });

    res.status(201).json(newSpot);
});

//Add image to spot based on spot's id------------------------------------------
//Check authorization
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const {url, preview} = req.body;
    
    const spot = await Spot.findOne(req.user.spotId)
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})  
    };

    //if spot owner id === current user id
    //else error 403 w/ message
    const addedImg = await SpotImage.create({
        url, preview
    });

    await spot.addSpotImages(addedImg)

    res.json(addedImg);
});

//Edit a spot-------------------------------------------------------------------
//add ownerId
router.put('/:spotId', requireAuth, async (req, res, next) => {

    const id = req.params.spotId;
    const ownerId = req.user.id;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors ={};
    if(!address){
        err.errors.address = 'Street address is required';
        throw err;
    }
    if(!city){
        err.errors.city = 'City is required';
        throw err;
    }
    if(!state){
        err.errors.state = 'State is required';
        throw err;
    }
    if(!country){
        err.errors.country = 'Country is required';
        throw err;
    }
    if(lat < -90 || lat > 90){
        err.errors.lat = 'Latitude must be within -90 and 90';
        throw err;
    }
    if(lng < -180 || lng > 180){
        err.errors.lng = 'Longitude must be within -180 and 180';
        throw err;
    }
    if(name.length >= 50){
        err.errors.name = 'Name must be less than 50 characters';
        throw err;
    }
    if(!description){
        err.errors.description = 'Description is required';
        throw err;
    }
    if(price <= 0){
        err.errors.price = 'Price per day must be a positive number';
        throw err;
    }

    const spot = await Spot.findByPk(id);

    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"});
    }

    await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.json(spot)
});

//Delete a spot-----------------------------------------------------------------
router.delete('/:spotId', requireAuth, async (req, res, next) => {

});

module.exports = router;