'use strict';

const {Spot} = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123
      },
      {
        ownerId: 2,
        address: '1212 Crenshaw Blvd',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 40.7643388,
        lng: -102.4250321,
        name: 'Some place',
        description: 'Test data 2',
        price: 100
      },
      {
        ownerId: 3,
        address: '4562 Pico Blvd',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 41.1645778,
        lng: -122.9730003,
        name: 'Yet another place',
        description: 'Test data 3',
        price: 200
      },
      {
        ownerId: 1,
        address: '1111 Test Ln',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 44.7645358,
        lng: -102.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 200
      },
    ])
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
  
    await queryInterface.bulkDelete(options, {}, {});
  }
};
