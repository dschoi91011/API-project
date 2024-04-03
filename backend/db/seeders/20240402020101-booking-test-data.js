'use strict';

const {Booking} = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-05-10',
        endDate: '2024-05-13'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-05-12',
        endDate: '2024-05-14'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
  
    await queryInterface.bulkDelete(options, {}, {});
  }
};
