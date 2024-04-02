'use strict';

const {Review} = require('../models');

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
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
