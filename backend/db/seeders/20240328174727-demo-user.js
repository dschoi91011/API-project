'use strict';

const {User} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA   //define schema in options obj

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        firstName: 'John',
        lastName: 'Doe',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'jane@home.io',
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'backttfuture@movie.io',
        firstName: 'Marty',
        lastName: 'Spencer',
        username: 'McFly',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'bass@lasd.io',
        username: 'deputy',
        firstName: 'Bass',
        lastName: 'Spartan',
        hashedPassword: bcrypt.hashSync('password4')
      }
    ], {validate: true});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {[Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2']}
    }, {});
  }
};
