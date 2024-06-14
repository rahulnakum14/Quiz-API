"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const quizIDS = [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ];

    await queryInterface.bulkInsert("quizs", quizIDS, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("quizs", null, {});
  },
};
