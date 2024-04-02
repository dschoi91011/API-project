'use strict';

const {Review} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'Some test review',
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'This is another review',
        stars: 5
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Reviews';
    await queryInterface.bulkDelete('Reviews', options, null, {});
  }
};
