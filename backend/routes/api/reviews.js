const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//Get all reviews of current user-------------------------------------------
//clarify spotimage, fix if necessary
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

    res.json({Reviews: arr});
});

//Add image to review based on review id-----------------------------------------
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.reviewId);
    const {url} = req.body;

    //if current req.user.id !== review.userId
    const review = await Review.findByPk(id);

    if(!review){
        const err = new Error("Review couldn't be found")
        err.status = 404;
        throw err;
    };

    if(review.userId !== req.user.id){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    const reviewImg = await ReviewImage.count({
        where: {reviewId: review.id}
    });
    if(reviewImg === 10){
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 403;
        throw err;
    }

    const newImg = await ReviewImage.create({reviewId: review.id, url: url});
    res.status(200).json(newImg);
});

//Edit a review-------------------------------------------------------------
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.reviewId);
    const {review, stars} = req.body;

    const rev = await Review.findByPk(id);

    if(!rev){
        const err = new Error("Review couldn't be found");
        err.status = 404;
        throw err;
    }

    if(rev.userId !== req.user.id){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = {};
    if(!review){
        err.errors.review = 'Review text is required';
        throw err;
    }
    if(stars < 1 || stars > 5){
        err.errors.stars = 'Stars must be an integer from 1 to 5';
        throw err;
    }

    await rev.update({review, stars});
    res.json(rev);
});

//Delete a review---------------------------------------------------------------
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.reviewId);

    const rev = await Review.findByPk(id);

    if(!rev){
        const err = new Error("Review couldn't be found");
        err.status = 404;
        throw err;
    }

    if(rev.userId !== req.user.id){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    rev.destroy();
    res.status(200).json({message: 'Successfully deleted'});
});



module.exports = router;