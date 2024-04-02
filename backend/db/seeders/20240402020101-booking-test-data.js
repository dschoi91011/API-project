'use strict';

const {Booking} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-04-10',
        endDate: '2024-04-13'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Bookings';
    await queryInterface.bulkDelete('Bookings', options, null, {});
  }
};
