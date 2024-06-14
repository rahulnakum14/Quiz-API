import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { QuizController } from "./controllers/quizController";

const app = express();
const port = 3000;

const server = createServer(app);
const io = new Server(server);
const quizController = new QuizController(io);

// Socket.IO connection event handling
io.on("connection", async (socket) => {
  console.log("A user connected");

  try {
    // Event listener for starting the quiz
    socket.on("startQuiz", () => {
      quizController.sendQuestions();
    });

    // Event listener for submitting answers
    socket.on("questionsId", (data) => {
      quizController.sendAnsById(data);
    });

    // Event listener for requesting quiz score
    socket.on("score", () => {
      quizController.scoreOfQuiz();
    });

  } catch (error) {
    // Emit error to the client if any occurs
    socket.emit("error", { message: error.message });
  }

  // Event listener for user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server listening on port 3000
server.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
