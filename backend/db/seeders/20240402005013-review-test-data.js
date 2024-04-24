'use strict';

const {Review} = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        review: 'This was the vacation I needed.',
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'This frontend project is ruining my sanity',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: 'This is yet another review',
        stars: 3
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
  
    await queryInterface.bulkDelete(options, {}, {});
  }
};
