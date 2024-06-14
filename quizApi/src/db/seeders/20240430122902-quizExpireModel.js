'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const quizExpirationsData = [
      {
        quizId: 1,
        quizExpirationTime: '5', 
      },
      {
        quizId: 2,
        quizExpirationTime: '4', 
      }
    ];
    await queryInterface.bulkInsert('quizExpirations', quizExpirationsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('quizExpirations', null, {});
  }
};
