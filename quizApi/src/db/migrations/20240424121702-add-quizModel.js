'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quizs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quizs');
  }
};