'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('quizHistorys',{
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quizId: {
      type: Sequelize.INTEGER,
      references: {
        model: "quizs",
        key: "id",
      },
    },
    questionId: {
      type: Sequelize.INTEGER,
      references: {
        model: "questions",
        key: "id",
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    answer: {
      type: Sequelize.STRING,
    },
    score: {
      type: Sequelize.INTEGER,
    },
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('quizHistorys');
  }
};
