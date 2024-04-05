'use strict';

const {Booking} = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-05-10',
        endDate: '2024-05-13'
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2024-05-12',
        endDate: '2024-05-14'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2024-06-19',
        endDate: '2024-06-20'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2022-01-02',
        endDate:'2023-03-23'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
  
    await queryInterface.bulkDelete(options, {}, {});
  }
};
