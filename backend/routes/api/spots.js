const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User, Spot, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();


router.get('/', async (req, res, next) => {

    const allSpots = await Spot.findAll({
        include: [
            Review,
            SpotImage
        ]
    })

    const arr = [];
    allSpots.forEach(ele => {
        const spotBody = ele.toJSON();
        const reviewsArr = spotBody.Reviews;

        let sum = 0;
        let avg = 0;

        for(let i = 0; i < reviewsArr.length; i++){
            if(reviewsArr.length > 0){
                sum += reviewsArr[i].stars
            }
        }

        if(reviewsArr.length) avg = sum / reviewsArr.length;


        //-------------------------------------------------------

        const imgArr = spotBody.SpotImages;
        // console.log(imgArr)
        
        let previewimg;

        for(let i = 0; i < imgArr.length; i++){
            if(imgArr.length > 0 && imgArr[i].preview === true){
                previewimg = imgArr[i].url
            }
        }
        
        ele.previewImage = previewimg
        // console.log(previewimg)
    })

    res.status(200).json({Spots: allSpots});
});


router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req

    const allSpots = await Spot.findAll({
        where: {ownerId: user.id}
    })

    res.json(allSpots)
})


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
})


module.exports = router;