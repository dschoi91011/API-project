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
        url: '/house1.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: '/house1-inside.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: '/house1-inside2.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: '/house1-inside3.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: '/house1-inside4.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: '/house2.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: '/house3.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: '/house4.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: '/house5.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: '/house6.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: '/house7.jpg',
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
