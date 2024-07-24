import express from "express";
import cluster, { Worker } from "cluster";
import os from "os";
// import sequelize from "./db/db";
const app = express();
const PORT = 3000;

/* Importing Routes */
import { userRouter } from "./routes/userRouter";
import { blogRouter } from "./routes/blogRouter";
import { imageRouter } from "./routes/imageRouter";

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes For User and Blogs */
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/upload", imageRouter);

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
