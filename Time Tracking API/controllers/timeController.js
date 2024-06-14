const { employee } = require('../models/employee');
const { timetracking } = require('../models/timetracking');
const moment = require('moment');
const { Op } = require('sequelize');
const cron = require('cron').CronJob;

/**
 * Creating Time Entry For Users.
 *
 * @param {params} empId - The empID For Entries To be created.
 * @param {Object} req - The request object containing the Product ID to Delete.
 * @param {Object} res - The response object to send JSON format.
 * @returns {Object} - A JSON response indicating success or failure based on validation.
 */
const addTimeEntry = async (req, res) => {
  try {
    const empId = req.params.id;
    const isUserExist = await employee.findOne({
      where: {
        id: empId,
      },
    });

    if (!isUserExist) {
      return res.json({ msg: 'User Not Found' });
    }

    // Deleting The Null TimeOut Values Of A User..

    await timetracking.destroy({
      where: {
        empId: empId,
        timeOut: {
          [Op.eq]: null,
        },
      },
    });

    const result = await timetracking.create({
      empId: empId,
      date: moment().format('YYYY/MM/DD'),
      timeIn: moment().format('HH:mm:ss'),
    });

    return res.status(200).json({
      msg: 'Entry Is Created',
      result: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Exit Time Entry For Users.
 *
 * @param {params} empId - The empID For Entries To be Exited.
 * @returns {Object} - A JSON response indicating success or failure based on validation.
 */

const exitTimeEntry = async (req, res) => {
  const empId = req.params.id;
  const today = moment().format('YYYY/MM/DD');

  try {
    const result = await timetracking.findOne({
      where: {
        empId: empId,
        date: today,
      },
      order: [['id', 'DESC']],
    });

    if (!result) {
      return res.status(404).json({ msg: 'User Not Found' });
    }

    result.timeOut = moment().format('HH:mm:ss');
    await result.save();
    return res.status(200).json({
      msg: 'Entry Is Created For Exit',
      result: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Updates a Time Entries Of An Employee.
 *
 * @param {params} empId - empId To Entries Updates.
 * @param {params} date - Date Of the Time Entry to updates.
 * @param {params} timeIn - TimeIn Of the empId of the given date.
 * @param {params} newTimeIn - new TimeIn Value.
 * @param {params} newTimeOut - new TimeOut Value.
 * @returns {Object} - A JSON response indicating success or failure.
 */
const updateTimeEntry = async (req, res) => {
  try {
    const empId = req.params.id;
    const { date, timeIn, newTimeIn, newTimeOut } = req.body;

    if (!date || !timeIn) {
      return res.status(400).json({
        message: 'All fields are required',
        required_fields: ['date', 'timeIn'],
      });
    }

    if (!newTimeIn && !newTimeOut) {
      return res.status(400).json({
        message: 'Enter At least one field',
        required_fields: ['newTimeIn', 'newTimeOut'],
      });
    }

    const updatedTime = await timetracking.findOne({
      where: {
        empId: empId,
        date: date,
        timeIn: timeIn,
      },
    });

    if (!updatedTime) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (newTimeIn) {
      updatedTime.timeIn = newTimeIn;
    }

    if (newTimeOut) {
      updatedTime.timeOut = newTimeOut;
    }
    await updatedTime.save();
    return res.status(200).json({ msg: 'Entry Updated', updatedTime });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Internal Server Error while Updating a product' });
  }
};

/**
 * Calculate TotalWoking Hours Of Employee Based On Current Week And PreviousWeek.
 *
 * @param {params} empId - empId To Calculate Hours.
 * @param {params} data - Requesting Data based On CurrentWeek Or Previous Week.
 * @returns {Object} - A JSON response indicating success or failure.
 */
const totalWorkingHours = async (req, res) => {
  try {
    const empId = req.query.empId;
    const data = req.query.data;
    const finalResult = [];
    const calculateHours = {};
    let initialHours = '00:00:00';
    let totalTime = '00:00:00';

    const sevenDaysCurrent = moment().startOf('week').toDate();
    const sevenDaysPrevious = moment()
      .subtract(1, 'week')
      .startOf('week')
      .toDate();

    let result;

    if (data === 'previousWeek') {
      result = await timetracking.findAll({
        where: {
          empId: empId,
          date: {
            [Op.between]: [sevenDaysPrevious, sevenDaysCurrent],
          },
        },
      });
    }

    if (data === 'currentWeek') {
      result = await timetracking.findAll({
        where: {
          empId: empId,
          date: {
            [Op.gt]: sevenDaysCurrent,
          },
        },
      });
    }

    const userData = await employee.findOne({
      where: {
        id: empId,
      },
    });

    if (!result || !userData) {
      return res.status(404).json({ msg: 'User Not found' });
    }

    await Promise.all(
      result.map(async (item) => {
        const result = await timetracking.findAll({
          where: {
            empId: empId,
            date: item.date,
            timeIn: item.timeIn,
            timeOut: item.timeOut,
          },
        });

        const timeStart = moment.duration(item.timeIn);
        const timeEnd = moment(`${item.date} ${item.timeOut}`);
        const ans = timeEnd.subtract(timeStart).format('HH:mm:ss');

        initialHours = addTimes(initialHours, ans);
        totalTime = addTimes(totalTime, ans);

        if (!calculateHours[item.date]) {
          calculateHours[item.date] = initialHours;
        } else {
          calculateHours[item.date] = addTimes(
            calculateHours[item.date],
            initialHours
          );
        }
        initialHours = '00:00:00';
      })
    );

    const data_entries = Object.entries(calculateHours);
    for (const [date, value] of data_entries) {
      finalResult.push({ date: date, totalTime: value });
    }

    return res.status(200).json({
      name: userData.name,
      empId: userData.id,
      totalTime: totalTime,
      timetracking: finalResult,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Add a Two Timestamps Entries Of An Employee for calculating working hours.
 *
 * @param {params} startTime - Start Time Of Employee.
 * @param {params} startTime - End Time Of Employee.
 * @returns {Object} - A JSON response indicating success or failure.
 */
function addTimes(startTime, endTime) {
  const times = [0, 0, 0];
  const max = times.length;

  const a = (startTime || '').split(':');
  const b = (endTime || '').split(':');

  for (let i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  for (let i = 0; i < max; i++) {
    times[i] = a[i] + b[i];
  }

  let hours = times[0];
  let minutes = times[1];
  let seconds = times[2];

  if (seconds >= 60) {
    const m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    const h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(
    -2
  )}:${`0${seconds}`.slice(-2)}`;
}

/**
 * Cron Job Schedule To User Logout As the day Change..
 */
const cronjob = new cron(
  '0 0 * * *',
  async function () {
    const result = await timetracking.update(
      { timeOut: moment().format('HH:mm:ss') },
      {
        where: {
          timeOut: {
            [Op.eq]: null,
          },
        },
      }
    );
    result.timeOut = moment().format('HH:mm:ss');
  },
  null,
  true
);

module.exports = {
  addTimeEntry,
  exitTimeEntry,
  updateTimeEntry,
  totalWorkingHours,
};
