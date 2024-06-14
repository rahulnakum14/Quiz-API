const { poll } = require("../models/pollModel");
const { vote } = require("../models/voteModel");
const { cache } = require("../utills/cache");

/**
 * votechoices..
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.pollId - The ID of the poll to vote in.
 * @param {string} req.body.choice - The choice the user wants to vote for.
 * @param {Object} req.user - The authenticated user object (assumed to have an ID property).
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while processing the vote request.
 */
// const voteChoices = async (req, res) => {
//   const { pollId, choice } = req.body;
  
//   try {
//     const pollExists = await poll.findByPk(pollId);

//     if (!pollExists) {
//       return res.status(404).json({ error: "Poll not found" });
//     }

//     if (!pollExists.pollChoices.includes(choice)) {
//       return res.status(400).json({ error: "Invalid choice" });
//     }
    
//     const isExistVote = await vote.findOne({ where: { pollId, choice } });

//     if (isExistVote) {
//       let votedByArray = isExistVote.votedBy ? JSON.parse(isExistVote.votedBy) : [];
//       if (!votedByArray.includes(req.user.id)) {
//         votedByArray.push(req.user.id);
//         isExistVote.count += 1;
//         isExistVote.votedBy = JSON.stringify(votedByArray);
//         await isExistVote.save();
//       } else {
//         return res.json({ msg: "User already voted for this choice." });
//       }
//     } else {
//       await vote.create({
//         pollId,
//         choice,
//         count: 1,
//         votedBy: JSON.stringify([req.user.id]),
//       });
//     }
//     return res.json({ msg: "Voted" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

const voteChoices = async (req, res) => {
  const { pollId, choice } = req.body;
  const userId = req.user.id;

  try {
    const pollExist = await poll.findByPk(pollId);

    if (!pollExist) {
      return res.status(404).json({ error: "Poll not found" });
    }

    if (!pollExist.pollChoices.includes(choice)) {
      return res.status(400).json({ error: "Invalid choice" });
    }

    let voteExit = await vote.findOne({ where: { pollId, choice } });

    if (voteExit) {
      const votedBy = JSON.parse(vote.votedBy || "[]");

      if (votedBy.includes(userId)) {
        return res.json({ msg: "User already voted for this choice." });
      }

      votedBy.push(userId);
      vote.count += 1;
      vote.votedBy = JSON.stringify(votedBy);

      await voteExit.save();
    } else {
      await vote.create({
        pollId,
        choice,
        count: 1,
        votedBy: JSON.stringify([userId]),
      });
    }

    return res.json({ msg: "Voted" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * get votes result..
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters object.
 * @param {string} req.params.id - The ID of the poll to retrieve votes for.
 * @param {Object} res - The Express response object.
 * @throws {Error} - If an error occurs while retrieving or formatting the vote data.
 */
const getVotes = async (req, res) => {
  try {

    const { page = 1, limit = 10, sortBy="id", sortOrder="ASC", search= ""} = req.query;
    const offset = (page - 1) * limit;

    // //Pagination
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const offset = (page - 1) * limit;

    // //Sorting
    // const sortBy = req.query.sortBy || "id";
    // const sortOrder = req.query.sortOrder || "ASC";

    // //searching
    // const searchQuery = req.query.search;

    const cachedData = cache.get(`vote_pollId${search}`);
    if (cachedData) {
      res.setHeader("Cache-Control", "no-cache, must-revalidate, max-age=30");
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json({
        Total: cachedData.length,
        votes: cachedData,
      });
    }

    //Set Defaults Values If poll is not voted by anyone.
    const pollExists = await poll.findByPk(search);
    if(!pollExists){
      return res.json({msg:'Poll Does Not Exist'})
    }
    if (!pollExists.choicesInitialized) {
      const initializeChoices = pollExists.pollChoices;

      await Promise.all(initializeChoices.map(async (choice) =>{
        await vote.findOrCreate({
          where:{pollId: search,choice},
          defaults:{pollId:search,choice,count:0} 
        });
      }))

      pollExists.choicesInitialized = true;
      await pollExists.save();
    }

    const result = await vote.findAll({
      where: { pollId: search },
      order: [[sortBy, sortOrder]],
      limit: limit,
      offset: offset,
      attributes: ["choice", "count"],
    });

    const listVotes = result.map((data) => ({
      Total: data.length,
      choice: data.choice,
      count: data.count,
    }));

    res.set({
      "Cache-Control": "no-cache, must-revalidate, max-age=30",
      "X-Cache": "MISS",
    });
    cache.set(`vote_pollId${search}`, listVotes, 30);
    return res.json({ Total: listVotes.length, votes: listVotes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


module.exports = {
  voteChoices,
  getVotes,
};
