const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//Delete existing image for a spot-----------------------------------------
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const id = parseInt(req.params.imageId);

    const spotImg = await SpotImage.findByPk(id, {
        include: Spot
    });

    if(!spotImg){
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        throw err;
    }

    //if(req.user.id === spotImg.Spot.ownerId)

    if(req.user.id !== spotImg.Spot.ownerId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    // await spotImg.destroy();
    spotImg.destroy();
    res.status(200).json({message: 'Successfully deleted'});
});


module.exports = router;