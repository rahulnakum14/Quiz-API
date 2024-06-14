"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const questions = [
      {
        quizId: 1,
        question: "What is the capital of France?",
        ans: "Paris",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },  
      {
        quizId: 1,
        question: "What is the largest planet in our solar system?",
        ans: "Jupiter",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the chemical symbol for water?",
        ans: "H2O",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "In which year did World War II begin?",
        ans: "1939",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },

      {
        quizId: 1,
        question: "What is the smallest country in the world?",
        ans: "Vatican City",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question:
          "What is the most abundant element in the Earth's atmosphere?",
        ans: "Nitrogen",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the first book of the New Testament in the Bible?",
        ans: "Matthew",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the capital of Australia?",
        ans: "Canberra",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the largest living organism by mass?",
        ans: "Blue whale",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the Mona Lisa a painting of?",
        ans: "A woman (possibly Lisa Gherardini)",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "How many hearts does an octopus have?",
        ans: "Three (one main and two branchial)",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the name of the search engine developed by Google?",
        ans: "Google Search",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the currency of Switzerland?",
        ans: "Swiss franc",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 1,
        question: "What is the largest continent on Earth?",
        ans: "Asia",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },

      {
        quizId: 2,
        question: "What is the fear of heights called?",
        ans: "Acrophobia",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "What is the capital of Germany?",
        ans: "Berlin",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "What is the chemical element used in pencil lead?",
        ans: "Graphite",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "On what continent is the Amazon rainforest located?",
        ans: "South America",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "What is the largest internal organ in the human body?",
        ans: "Liver",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "What is the name of the world's driest desert?",
        ans: "Atacama Desert",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "How many colors are there in the rainbow?",
        ans: "7 (traditionally)",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "What is the chemical formula for table salt?",
        ans: "NaCl (Sodium chloride)",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "What is the tallest building in the world?",
        ans: "Burj Khalifa",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
      {
        quizId: 2,
        question: "What is the name of the world's largest ocean by volume?",
        ans: "Pacific Ocean",
        expirationTime: Math.floor(Math.random() * 2) + 1,
      },
    ];

    return queryInterface.bulkInsert("questions", questions);
  },
};

down: async (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete("questions", null, {});
};
