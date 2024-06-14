const express = require('express');
const app = express();
const { sequelize } = require('./config/db');
const { employee, timetracking } = require('./models/relations');
const { timeRouter } = require('./routers/timeEntryRouter');

require('dotenv').config();

app.use(express.json());
app.use('/', timeRouter);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been authenticated successfully.');
    await sequelize.sync({ alter: true, force: false });
    console.log('Database schema has been synchronized.');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  } catch (error) {
    console.error(
      'Error connecting to database or synchronizing schema:',
      error
    );
  }
}

startServer();
