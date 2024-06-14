const express = require('express');
const timeRouter = express.Router();

const {
  addTimeEntry,
  exitTimeEntry,
  updateTimeEntry,
  totalWorkingHours,
} = require('../controllers/timeController');

timeRouter.get('/add_entry/:id', addTimeEntry);
timeRouter.get('/exit_entry/:id', exitTimeEntry);
timeRouter.post('/update_entry/:id', updateTimeEntry);
timeRouter.get('/api/path/', totalWorkingHours);

module.exports = {
  timeRouter,
};
