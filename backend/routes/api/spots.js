const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const {Op} = require('sequelize');

const router = express.Router();

//Average reviews and Images helper functions-------------------------------------------------------
async function updatedAvgRatings(spots) {
    const spotsArr = spots;
    for (const spot of spotsArr) {
      const reviews = await Review.findAll({
        where: { spotId: spot.id },
      });
      const total = reviews.reduce((sum, reviews) => sum + reviews.stars, 0);
      spot.dataValues.avgRating = total / reviews.length;
    }
}

async function updatedImages(spots) {
    for (const img of spots) {
      const images = await SpotImage.findAll({
        where: {
          spotId: img.dataValues.id,
          preview: true,
        },
      });
      if (images.length === 0) {
        img.dataValues.previewImage = null;
      } else {
        img.dataValues.previewImage = images[0].dataValues.url;
      }
    }
    return spots;
}


// //Get all spots------------------------------------------------------------------------------------------------
// Old code----------------------------------------------------------------
// router.get('/', async (req, res, next) => {
//     let {page, size} = req.query;

//     page = parseInt(page);
//     size = parseInt(size);

//     const err = new Error('Bad Request');
//     err.status = 400;
//     err.errors = {};
//     if(page < 1) err.errors.page = 'Page must be greater than or equal to 1';
//     if(size < 1) err.errors.size = 'Size must be greater than or equal to 1';
//     if(Object.keys(err.errors).length) throw err;

//     if(isNaN(page) || !page || page > 10) page = 1;
//     if(isNaN(size) || !size || size > 20) size = 20;

//     const allSpots = await Spot.findAll({
//         include: [
//             Review, 
//             SpotImage
//         ],
//         limit: size,
//         offset: size * (page - 1)
//     });

//     const arr = [];
//     allSpots.forEach(ele => {
//         const spotBody = ele.toJSON();

//         spotBody.lat = parseFloat(spotBody.lat);
//         spotBody.lng = parseFloat(spotBody.lng);
//         spotBody.price = parseFloat(spotBody.price);

//         const reviewsArr = spotBody.Reviews;

//         const cformat = spotBody.createdAt.toISOString().split('T').join(' ').slice(0, 19);
//         const uformat = spotBody.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
        
//         spotBody.createdAt = cformat;
//         spotBody.updatedAt = uformat;

//         let sum = 0;

//         if(reviewsArr && reviewsArr.length > 0){
//             for(let i = 0; i < reviewsArr.length; i++){
//                 sum += reviewsArr[i].stars;
//             }
//             const avg = sum / reviewsArr.length;
//             spotBody.avgRating = avg;
//         } else {
//             spotBody.avgRating = 'No ratings available';
//         }

//         //--------spotimages---------------------

//         if(spotBody.SpotImages[0]) spotBody.previewImage = spotBody.SpotImages[0].url;
//         if(!spotBody.SpotImages[0]) spotBody.previewImage = 'Does not exist';

//         delete spotBody.SpotImages;
//         delete spotBody.Reviews;

//         arr.push(spotBody);
//     });

//     res.json({Spots: arr, page, size});
// });
//End of old code---------------------------------------------------------------------------------------------------------------
//Get all spots new code---------------------------------------------------------------------------------------------------
router.get("/", async (req, res, next) => {
    let {page, size} = req.query;

    page = parseInt(page);
    size = parseInt(size);

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = {};
    if(page < 1) err.errors.page = 'Page must be greater than or equal to 1';
    if(size < 1) err.errors.size = 'Size must be greater than or equal to 1';
    if(Object.keys(err.errors).length) throw err;

    if(isNaN(page) || !page || page > 10) page = 1;
    if(isNaN(size) || !size || size > 20) size = 20;

  
    const spots = await Spot.findAll({
      limit: size,
      offset: size * (page - 1)
    });
    await updatedAvgRatings(spots);
    await updatedImages(spots);

    res.json({ Spots: spots, page, size });
});
//End of Get all spots new---------------------------------------------------------------------------------------------------------------------

//Get all spots owned by current user-----------------------------------------
//Old code--------------------------------------------------------------------
// router.get('/current', requireAuth, async (req, res, next) => {
//     const allSpots = await Spot.findAll({
//         where: {ownerId: req.user.id},
//         include: [Review, SpotImage]
//     });

//     const arr = [];

//     allSpots.forEach(ele => {
//         const spotBody = ele.toJSON();

//         spotBody.lat = parseFloat(spotBody.lat);
//         spotBody.lng = parseFloat(spotBody.lng);
//         spotBody.price = parseFloat(spotBody.price);


//         const reviewsArr = spotBody.Reviews;
        
//         const cformat = spotBody.createdAt.toISOString().split('T').join(' ').slice(0, 19);
//         const uformat = spotBody.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
        
//         spotBody.createdAt = cformat;
//         spotBody.updatedAt = uformat;

//         let sum = 0;

//         if(reviewsArr && reviewsArr.length > 0){
//             for(let i = 0; i < reviewsArr.length; i++){
//                 sum += reviewsArr[i].stars;
//             }
//             const avg = sum / reviewsArr.length;
//             spotBody.avgRating = avg;
//         } else {
//             spotBody.avgRating = 'No ratings available';
//         }

//         //--------spotimages---------------------

//         if(spotBody.SpotImages[0]) spotBody.previewImage = spotBody.SpotImages[0].url;

//         if(!spotBody.SpotImages[0]) spotBody.previewImage = 'Does not exist';

//         delete spotBody.SpotImages;
//         delete spotBody.Reviews;

//         arr.push(spotBody);
//     });

//     res.json({Spots: arr});
// });
//End of old code-------------------------------------------------------------------
//Get all spots owned by current user new-------------------------------------------
router.get("/current", requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
      where: {
        ownerId: req.user.id,
      },
    });
    await updatedAvgRatings(spots);
    await updatedImages(spots);
    res.json({ Spots: spots });
});
//End of Get all spots owned by current user new--------------------------------------
//Get details of spot from an id----------------------------------------------
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
            },
            {
                model: Review,
                attributes: ['stars']
            }
        ]
    });

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    }

    const spotObj = spot.toJSON();

    spotObj.lat = parseFloat(spotObj.lat);
    spotObj.lng = parseFloat(spotObj.lng);
    spotObj.price = parseFloat(spotObj.price);

    const reviewsArr = spotObj.Reviews;
    spotObj.numReviews = reviewsArr.length;

    const cformat = spotObj.createdAt.toISOString().split('T').join(' ').slice(0, 19);
    const uformat = spotObj.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
    
    spotObj.createdAt = cformat;
    spotObj.updatedAt = uformat;

    let sum = 0;

    reviewsArr.forEach(ele => {
        sum += ele.stars;
    });        
    
    spotObj.avgStarRating = sum / reviewsArr.length;

    delete spotObj.Reviews;

    res.json(spotObj);
});

//Create a spot-----------------------------------------------------------------
router.post('/', requireAuth, async (req, res, next) => {

    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = {};
    if(!address) err.errors.address = 'Street address is required';
    if(!city) err.errors.city = 'City is required';
    if(!state) err.errors.state = 'State is required';
    if(!country) err.errors.country = 'Country is required';
    if(lat < -90 || lat > 90) err.errors.lat = 'Latitude must be within -90 and 90';
    if(lng < -180 || lng > 180) err.errors.lng = 'Longitude must be within -180 and 180';
    if(name.length >= 50) err.errors.name = 'Name must be less than 50 characters';
    if(!description) err.errors.description = 'Description is required';
    if(price <= 0) err.errors.price = 'Price per day must be a positive number';
    if(Object.keys(err.errors).length) throw err;
    
    const newSpot = await Spot.create({
        ownerId, address, city, state, country, lat, lng, name, description, price
    });

    newSpotObj = newSpot.toJSON();

    newSpotObj.lat = parseFloat(newSpotObj.lat);
    newSpotObj.lng = parseFloat(newSpotObj.lng);
    newSpotObj.price = parseFloat(newSpotObj.price);

    const cformat = newSpotObj.createdAt.toISOString().split('T').join(' ').slice(0, 19);
    const uformat = newSpotObj.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
    
    newSpotObj.createdAt = cformat;
    newSpotObj.updatedAt = uformat;

    res.status(201).json(newSpotObj);
});

//Add image to spot based on spot's id------------------------------------------
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.spotId);
    const {url, preview} = req.body;
    
    const spot = await Spot.findByPk(id);

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };

    if(spot.ownerId !== req.user.id){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    const addedImg = await SpotImage.create({
        spotId: id, url: url, preview: preview
    });

    //Changes added-----------------------------------------
    if(!spot.previewImage || preview === 'true'){
        spot.previewImage = url
        await spot.save()
    }
    //------------------------------------------------------

    const payload = {id: addedImg.id, url: addedImg.url, preview: addedImg.preview};

    res.json(payload);
});

//Edit a spot-------------------------------------------------------------------
router.put('/:spotId', requireAuth, async (req, res, next) => {

    const id = parseInt(req.params.spotId);
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors ={};
    if(!address) err.errors.address = 'Street address is required';
    if(!city) err.errors.city = 'City is required';
    if(!state) err.errors.state = 'State is required';
    if(!country) err.errors.country = 'Country is required';
    if(lat < -90 || lat > 90) err.errors.lat = 'Latitude must be within -90 and 90';
    if(lng < -180 || lng > 180) err.errors.lng = 'Longitude must be within -180 and 180';
    if(name.length >= 50) err.errors.name = 'Name must be less than 50 characters';
    if(!description) err.errors.description = 'Description is required';
    if(price <= 0) err.errors.price = 'Price per day must be a positive number';
    if(Object.keys(err.errors).length) throw err;

    const spot = await Spot.findByPk(id);

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };

    if(spot.ownerId !== req.user.id){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

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
    });

    spotObj = spot.toJSON();

    const cformat = spotObj.createdAt.toISOString().split('T').join(' ').slice(0, 19);
    const uformat = spotObj.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
    
    spotObj.createdAt = cformat;
    spotObj.updatedAt = uformat;

    res.json(spotObj);
});

//Delete a spot-----------------------------------------------------------------
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.spotId);

    const spot = await Spot.findByPk(id);

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    }

    if(spot.ownerId !== req.user.id){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    spot.destroy();
    res.status(200).json({message: 'Successfully deleted'});
});

//Get all reviews by spot id----------------------------------------------------
router.get('/:spotId/reviews', async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId);

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    }

    const allReviews = await Review.findAll({
        where: {spotId: req.params.spotId},
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    arr = [];
    allReviews.forEach(ele => {
        const rev = ele.toJSON();

        const cformat = rev.createdAt.toISOString().split('T').join(' ').slice(0, 19);
        const uformat = rev.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
        
        rev.createdAt = cformat;
        rev.updatedAt = uformat;

        arr.push(rev);
    })

    res.json({Reviews: arr});
});

//Create review for spot based on spot id---------------------------------------
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.spotId);
    const {review, stars} = req.body;

    const spot = await Spot.findByPk(id);

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };

    const checkReview = await Review.findOne({
        where: {spotId: id, userId: req.user.id}
    });
    if(checkReview){
        const err = new Error('User already has a review for this spot');
        err.status = 500;
        throw err;
    };

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = {};
    if(!review) err.errors.review = 'Review text is required';
    if(stars < 1 || stars > 5) err.errors.stars = 'Stars must be an integer from 1 to 5';
    if(Object.keys(err.errors).length) throw err;

    const newReview = await Review.create({
        userId: req.user.id, spotId: id, review: review, stars: stars
    });

    const revObj = newReview.toJSON();

    const cformat = revObj.createdAt.toISOString().split('T').join(' ').slice(0, 19);
    const uformat = revObj.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
    
    revObj.createdAt = cformat;
    revObj.updatedAt = uformat;

    res.status(201).json(revObj);
});

//Get all bookings for a spot based on spot id-------------------------------
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.spotId);

    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    }

    const allBookings = await Booking.findAll({
        where: {spotId: id},
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    if(req.user.id !== spot.ownerId){
        const arr = [];
        allBookings.forEach(ele => {
            const bookingBody = ele.toJSON()
            
            const sformat = bookingBody.startDate.toISOString().split('T').join(' ').slice(0, 10);
            const eformat = bookingBody.endDate.toISOString().split('T').join(' ').slice(0, 10);
            bookingBody.startDate = sformat;
            bookingBody.endDate = eformat;

            const obj = {
                spotId: bookingBody.spotId,
                startDate: bookingBody.startDate,
                endDate: bookingBody.endDate
            }
            arr.push(obj);
        });
        res.status(200).json({Bookings: arr});
     }

     if(req.user.id === spot.ownerId){
        const arr = [];
        allBookings.forEach(ele => {
            const bookingBody = ele.toJSON()

            const sformat = bookingBody.startDate.toISOString().split('T').join(' ').slice(0, 10);
            const eformat = bookingBody.endDate.toISOString().split('T').join(' ').slice(0, 10);
            bookingBody.startDate = sformat;
            bookingBody.endDate = eformat;

            const cformat = bookingBody.createdAt.toISOString().split('T').join(' ').slice(0, 19);
            const uformat = bookingBody.updatedAt.toISOString().split('T').join(' ').slice(0, 19);
            bookingBody.createdAt = cformat;
            bookingBody.updatedAt = uformat;

            const obj = {
                User: bookingBody.User,
                id: bookingBody.id,
                spotId: bookingBody.spotId,
                userId: bookingBody.userId,
                startDate: bookingBody.startDate,
                endDate: bookingBody.endDate,
                createdAt: bookingBody.createdAt,
                updatedAt: bookingBody.updatedAt
            }
            arr.push(obj)
        });
        res.status(200).json({Bookings: arr});
     }
});

//Create booking from a spot based on spot id---------------------------------
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.spotId);
    const {startDate, endDate} = req.body;

    const myStartDate = startDate.split('-').join('');
    const myEndDate = endDate.split('-').join('');
    const currentDateArr = new Date().toISOString().split('T');
    const currentDate = currentDateArr[0].split('-').join('');

    const spot = await Spot.findByPk(id, {
        include: [
            {
                model: Booking,
                attributes: ['startDate', 'endDate']
            }
        ]
    });

    if(!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    }

    if(req.user.id === spot.ownerId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = {};
    if(myStartDate < currentDate) err.errors.startDate = 'startDate cannot be in the past';
    if(myEndDate <= myStartDate) err.errors.endDate = 'endDate cannot be on or before startDate';
    if(Object.keys(err.errors).length) throw err;

    spotBookings = spot.toJSON().Bookings;

    const err2 = new Error('Sorry, this spot is already booked for the specified dates');
    err2.status = 403;
    err2.errors = {};

    spotBookings.forEach(ele => {
        const exStartDate = (ele.startDate.toISOString().split('T'))[0].split('-').join('');
        const exEndDate = (ele.endDate.toISOString().split('T'))[0].split('-').join('');

        if(myStartDate === exStartDate) err2.errors.startDate = 'Start date conflicts with an existing booking';
        if(myEndDate === exEndDate) err2.errors.endDate = 'End date conflicts with an existing booking';
        if(myStartDate === exEndDate) err2.errors.startDate = 'Start date conflicts with an existing booking';
        if(myEndDate === exStartDate) err2.errors.startDate = 'End date conflicts with an existing booking';
        if(myStartDate > exStartDate && myStartDate < exEndDate) err2.errors.startDate = 'Start date conflicts with an existing booking';
        if(myEndDate > exStartDate && myEndDate < exEndDate) err2.errors.endDate = 'End date conflicts with an existing booking';
        if(myStartDate <= exStartDate && myEndDate >= exEndDate) err2.errors.startDate = 'Start and end dates conflict with existing booking';
        if(Object.keys(err2.errors).length) throw err2;
    });
    
    const newBooking = await Booking.create({
        spotId: id, userId: req.user.id, startDate, endDate
    });

    const bk = newBooking.toJSON();

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



module.exports = router;