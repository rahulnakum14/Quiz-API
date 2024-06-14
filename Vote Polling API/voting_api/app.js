require("dotenv").config();

/**Importing Required Modules. */
const express = require("express");
const app = express();
const cluster = require("cluster");
const os = require("os");
const { sequelize } = require("./config/db");
const passport = require("./utills/passport-config");
const cors = require("cors");
const { user, poll } = require("./models/associations");
const http = require("http");
const socketIo = require("socket.io");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { corsOptions } = require("./utills/cors-options");
const numCPUs = os.cpus().length;

/**Importing Different Routes For different Endpoint. */
const { userRouter } = require("./routers/userRouter");
const { pollRouter } = require("./routers/pollRouter");
const { voteRouter } = require("./routers/voteRouter");

/**Importing Middlewares. */
const { checkAuthenticated } = require("./middlewares/auth");

/**Importing Models. */
const { vote } = require("./models/voteModel");

const PORT = process.env.PORT || 3000;

/* Limit User To Access API */
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 10, //No. of request per minute
  handler: function (req, res /*next*/) {
    return res.status(429).json({
      error: "You sent too many requests. Please wait a while then try again",
    });
  },
});

/* Middewares */
app.use(express.json());
app.use(
  require("express-session")({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.disable("x-powered-by");
app.use(passport.initialize());
app.use(passport.session());

/** Security Standards */
app.use(helmet()); // Prevent Agains xss and clickjacking attacks.
app.use(cors()); // Prevent Against unauthorized cors origin.
app.use(limiter); // Minimize the user request for certain time.

/* Routes For User,Polling and voting */
app.use("/users/", userRouter);
app.use("/vote/", checkAuthenticated, cors(corsOptions), voteRouter);
app.use("/poll/", cors(corsOptions), pollRouter);
app.use("/result/", cors(corsOptions), voteRouter);

app.get("/unauthorized", (req, res) => {
  res.status(401).json({
    message:
      "You are not authorized to access this resource pass the header in request.",
  });
});

const server = http.createServer(app);
const io = socketIo(server);

/* Databse Synchronization and Connection */
// if (cluster.isPrimary) {
//   console.log(`Master process ${process.pid} is running`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker process ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {
//   /* Socket Io connection For vote Counting */
  
// }
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("livevote", async (data) => {
    const result = await vote.findAll({
      where: {
        pollId: data,
      },
    });
    const listVotes = result.map((data) => ({
      choice: data.choice,
      count: data.count,
    }));
    io.emit("countvotes", listVotes);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been authenticated successfully.");
    await sequelize.sync({ alter: true, force: false });
    console.log("Database schema has been synchronized.");
    server.listen(PORT, () => {
      console.log(`Server Started AT ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Error connecting to database or synchronizing schema:",
      error
    );
  }
}
startServer();