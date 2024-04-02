'use strict';

const {SpotImage} = require('../models');

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
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
