'use strict';

const {SpotImage} = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'url image',
        preview: true
      },
      {
        spotId: 1,
        url: 'spotimage2.com',
        preview: false
      },
      {
        spotId: 1,
        url: 'url image2'
      },
      {
        spotId: 2,
        url: 'spotimage3.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'url image 3',
        preview: true
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
  
    await queryInterface.bulkDelete(options, {}, {});
  }
};
