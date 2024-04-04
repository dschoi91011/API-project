const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//Delete existing image for a review-----------------------------------------
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.imageId);

    const revImg = await ReviewImage.findByPk(id);

    if(!revImg){
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        throw err;
    }

    if(revImg.reviewId !== req.user.id){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    revImg.destroy();
    res.status(200).json({message: 'Successfully deleted'});
})


module.exports = router;