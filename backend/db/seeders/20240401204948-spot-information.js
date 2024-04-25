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
        description: 'Da hood',
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
        city: 'Houston',
        state: 'Texas',
        country: 'United States of America',
        lat: 44.7645358,
        lng: -102.4730327,
        name: 'Rockets away',
        description: 'We have crazy weather here',
        price: 200
      },
      {
        ownerId: 2,
        address: '1 Pacific Coast Hwy',
        city: 'Malibu',
        state: 'California',
        country: 'United States of America',
        lat: 70.7645358,
        lng: -108.4730327,
        name: 'Oceanside',
        description: 'Come and relax by the ocean',
        price: 1000
      },
      {
        ownerId: 2,
        address: '246 Cherry Chase Ln',
        city: 'Raleigh',
        state: 'North Carolina',
        country: 'United States of America',
        lat: 57.7645358,
        lng: -121.4730327,
        name: 'Quaint neighborhood',
        description: 'Get some rest and relaxation',
        price: 850
      },
      {
        ownerId: 2,
        address: 'Zzyxx Rd',
        city: 'Who knows',
        state: 'Nevada',
        country: 'United States of America',
        lat: 100.7645358,
        lng: -101.4730327,
        name: 'Somewhere only we know',
        description: 'Lonely desert place',
        price: 220
      }
    ])
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
  
    await queryInterface.bulkDelete(options, {}, {});
  }
};
