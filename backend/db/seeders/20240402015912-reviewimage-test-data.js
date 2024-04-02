'use strict';

const {ReviewImage} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'someimage.com'
      }
    ])
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete('ReviewImages', options, null, {});
  }
};
