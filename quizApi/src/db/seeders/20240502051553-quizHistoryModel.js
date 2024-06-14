"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        quizId:1,
        userId:1,
      },
      {

        quizId:2,
        userId:2,
      },
    ];

    await queryInterface.bulkInsert("quizHistorys", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("quizHistorys", null, {});
  },
};