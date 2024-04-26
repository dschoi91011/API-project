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
        stars: 3
      },
      {
        spotId: 2,
        userId: 3,
        review: 'The hood be way too gangster for me',
        stars: 2
      },
      {
        spotId: 5,
        userId: 3,
        review: 'This was the perfect getaway',
        stars: 5
      },
      {
        spotId: 5,
        userId: 1,
        review: 'This place is great for the summers!',
        stars: 4
      },
      {
        spotId: 4,
        userId: 4,
        review: 'Not bad',
        stars: 4
      },
      {
        spotId: 6,
        userId: 1,
        review: 'Not bad 2',
        stars: 4
      },
      {
        spotId: 7,
        userId: 1,
        review: 'Not bad 3',
        stars: 4
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Not bad 3',
        stars: 4
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
  
    await queryInterface.bulkDelete(options, {}, {});
  }
};
