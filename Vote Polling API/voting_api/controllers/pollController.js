const { poll } = require("../models/pollModel");
const { cache } = require("../utills/cache");
const { Op } = require("sequelize");
const { pollValidator,pollChoicesValidator } = require("../validators/pollValidator");

/**
 * Getpolls details.
 *
 * @param {Object} req -  The Request Object
 * @param {Object} res - A JSON response indicating success or failure based on validation.
 * @return {Object}  - Get poll details created by user.
 */
const getPoll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "id",
      sortOrder = "ASC",
      search = "",
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (search) {
      whereClause.pollName = { [Op.like]: `%${search}%` };
    }

    // Caching Data.
    const cacheKey = `poll_page_${page}_limit_${limit}_searchQuery_${search}_sortBy_${sortBy}_sortOrder_${sortOrder}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      res.setHeader("Cache-Control", "public, max-age=30");
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json({
        Total: cachedData.length,
        allPolls: cachedData,
      });
    }

    const results = await poll.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: offset,
    });

    if (results.length === 0) {
      return res.status(404).json({ error: "No polls found." });
    }

    const listPoll = results.map((poll) => ({
      id: poll.id,
      pollName: poll.pollName,
      pollChoices: poll.pollChoices,
    }));

    res.setHeader("X-Cache", "MISS");
    cache.set(cacheKey, listPoll, 30);

    return res.status(200).json({
      Total: listPoll.length,
      data: listPoll,
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * createpoll.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollName - The pollName of the poll to create.
 * @param {string} req.body.pollChoices - The choice the poll user wants to create.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the request.
 */
const createPoll = async (req, res) => {
  const { pollName, pollChoices } = req.body;
  const {
    limit = 10,
    sortBy = "id",
    sortOrder = "ASC",
    search = "",
  } = req.query;

  try {
    const pollValue = pollName.trim();
    const pollExist = await poll.findOne({
      where: {
        pollName: pollValue,
      },
    });

    if (!pollExist) {
      await poll.create({
        pollName: pollValue,
        pollChoices: pollChoices,
        createdBy: req.createdBy,
      });

      const pollData = {
        pollName: pollValue,
        pollChoices: pollChoices,
      };

      const totalCount = await poll.count();
      const affectedPage = Math.ceil(totalCount / limit);

      cache.del(
        `poll_page_${affectedPage}_limit_${limit}_searchQuery_${search}_sortBy_${sortBy}_sortOrder_${sortOrder}`
      );

      return res.status(200).json({
        msg: "Poll Is Created",
        pollData,
      });
    } else {
      return res.json({ msg: "Poll is Already Created" });
    }
  } catch (error) {
    return res.status(400).json({
      msg: "Something Went Wrong While Creating A Poll",
      error: error.message,
    });
  }
};

/**
 * updatepoll.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollName - The pollName of the poll to create.
 * @param {string} req.body.pollChoices - The choice the poll user wants to create.
 * @param {string} req.body.pollNameToUpdate - The name of the poll which want to update.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the request.
 */
const updatePoll = async (req, res) => {
  const { pollName, pollChoices } = req.body;
  const pollNameToUpdate = req.query.name;
  const {
    limit = 10,
    sortBy = "id",
    sortOrder = "ASC",
    search = "",
  } = req.query;

  try {
    const updatePoll = await poll.findOne({
      where: {
        pollName: pollNameToUpdate,
        createdBy: req.createdBy,
      },
    });

    if (!updatePoll) {
      return res.status(403).json({
        message: "Unauthorized Or Poll does not exist..",
      });
    }
    if (pollName) {
      const updatePollNameExists = await poll.findOne({
        where: {
          pollName: pollNameToUpdate,
          createdBy: req.createdBy,
        },
      });
      if (!updatePollNameExists) {
        pollValidator(req, res, () => {
          updatePoll.pollName = pollName.trim();
        });
      } else {
        return res.json({
          msg: "Poll Name is Already Exist choose another one.",
        });
      }
    }
    if (pollChoices) {
      pollChoicesValidator(pollChoices);
      updatePoll.pollChoices = pollChoices;
    }

    const totalCount = await poll.count();
    const affectedPage = Math.ceil(totalCount / limit);

    cache.del(
      `poll_page_${affectedPage}_limit_${limit}_searchQuery_${search}_sortBy_${sortBy}_sortOrder_${sortOrder}`
    );

    await updatePoll.save();

    const resPoll = {
      id: updatePoll.id,
      pollName: updatePoll.pollName,
      pollChoices: updatePoll.pollChoices,
    };

    return res.status(200).json({
      message: "Poll Updated",
      updatedPoll: resPoll,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something Went Wrong While Updating A Todo",
      error: error.message,
    });
  }
};

/**
 * deletepoll.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollNameToDelete - The name of the poll which want to delete.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the request.
 */
const deletePoll = async (req, res) => {
  const pollNameToDelete = req.query.name;
  const {
    limit = 10,
    sortBy = "id",
    sortOrder = "ASC",
    search = "",
  } = req.query;

  try {
    const pollDelete = await poll.findOne({
      where: {
        pollName: pollNameToDelete,
        createdBy: req.createdBy,
      },
    });

    if (!pollDelete) {
      return res.json({ msg: "Poll is deleted or not exist" });
    }

    const totalCount = await poll.count();
    const affectedPage = Math.ceil(totalCount / limit);

    cache.del(
      `poll_page_${affectedPage}_limit_${limit}_searchQuery_${search}_sortBy_${sortBy}_sortOrder_${sortOrder}`
    );

    await pollDelete.destroy();

    const deletedPoll = {
      id: pollDelete.id,
      pollName: pollDelete.pollName,
      pollChoices: pollDelete.pollChoices,
    };
    return res.status(200).json({
      message: "Poll deleted successfully",
      Deletedpoll: deletedPoll,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while deleting the poll",
      error: error.message,
    });
  }
};

module.exports = {
  createPoll,
  getPoll,
  updatePoll,
  deletePoll,
};
