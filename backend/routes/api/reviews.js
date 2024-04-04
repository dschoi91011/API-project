const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//Get all reviews of current user-------------------------------------------
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req;
    const allReviews = await Review.findAll({
        where: {userId: user.id},
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
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
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const arr = [];
    allReviews.forEach(ele => {
        const spotBody = ele.toJSON();
        // console.log(spotBody.Spot.SpotImages)
        const objArr = spotBody.Spot.SpotImages;

        if(objArr[0]) spotBody.Spot.previewImage = objArr[0].url
        if(!objArr[0]) spotBody.Spot.previewImage = 'Does not exist'

        delete spotBody.Spot.SpotImages;
        arr.push(spotBody);
    });

    console.log(arr);
    res.json({Reviews: arr});
});


module.exports = router;