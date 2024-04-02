'use strict';

const {SpotImage} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'spotimage.com',
        preview: true
      },
      {
        spotId: 1,
        url: 'spotimage2.com',
        preview: false
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete('SpotImages', options, null, {});
  }
};
