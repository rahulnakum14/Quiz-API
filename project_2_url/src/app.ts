import "dotenv/config";
import express from "express";
import cluster, { Worker } from "cluster";
import os from "os";
import path from "path";
import cookieParser from "cookie-parser";
// import sequelize from "./config/db";
const app = express();
const PORT = process.env.PORT || 3000;

/* Importing Routes */
import { userRouter } from "./routes/userRouter";
import { fileRouter } from "./routes/fileRouter";
import checkForAuthentication from "./middleware/auth";

/* Middleware */
app.use(express.json());
// app.use(express.static(path.resolve("./uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Setting up the Ejs View Engine. */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Routes For User and Blogs */
app.use("/user", userRouter);
app.use("/upload", checkForAuthentication("token"), fileRouter);
app.use("/uploads", express.static("./src/uploads"));

/* Database Synchronization and Connection */
if (cluster.isPrimary) {
  const cores = os.cpus().length;
  for (let i = 0; i < cores; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker: Worker, code) => {
    cluster.fork();
  });
} else {
  (async () => {
    try {
      // await sequelize.authenticate();
      // await sequelize.sync({ alter: false, force: false });
      app.listen(PORT, () => {
        console.log(`Server Started AT ${PORT}`);
      });
    } catch (error) {
      console.error(
        "Error connecting to database or synchronizing schema:",
        error
      );
    }
  })();
}
