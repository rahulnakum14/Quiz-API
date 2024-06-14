import { Server } from "socket.io";
import { CronJob } from "cron";
import Question from "../db/models/quesTionModel";
import QuizExpiration from "../db/models/quizExpireModel";
import { sequelize } from "../db/db";
import QuizHistory from "../db/models/quizHistoryModel";

export class QuizController {
  io: Server;
  score: number = 0;
  cronJob: CronJob;
  finalResult: number;
  tmp: number;
  test: number;
  isQuestionChecked: number;
  isQuizExpire: boolean = false;

  /**
   * Creates a new QuizController instance.
   * @param {Server} io - The Socket.IO server instance.
   */

  constructor(io: Server) {
    this.io = io;
    this.tmp = 0;
  }

  /**
   * Asynchronously retrieves questions from the database and emits them to all connected clients.
   *
   * @async
   * @returns {Promise<void>} Resolves after emitting questions or rejecting on error.
   * @throws {Error} If no questions are found in the database.
   * @memberof QuizController
   */
  async sendQuestions(): Promise<void> {
    try {
      const questions = await Question.findAll({
        order: sequelize.literal("rand()"),
        limit: 1,
        attributes: ["id", "question"],
      });

      if (!questions) {
        this.emitMessage("questions_controller", "Question not found.");
      }
      this.emitMessage("questions_controller", questions);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sends the answer for a question identified by its ID.
   * @param {Object} data - The data object containing the ID of the question, the answer, and the user ID.
   * @param {number} data.id - The ID of the question.
   * @param {string} data.answer - The answer submitted by the user.
   * @param {number} data.userId - The ID of the user submitting the answer.
   * @returns {Promise<void>} - A Promise that resolves once the answer is processed.
   */
  async sendAnsById(data: {
    id: number;
    answer: string;
    userId: number;
  }): Promise<void> {
    try {
      const { id, answer, userId } = data;

      const result = await Question.findOne({ where: { id } });

      if (this.isQuizExpire) {
        this.emitMessage("quiz_time_over", "Quiz Time is Over.");
      }

      if (result.id === this.isQuestionChecked) {
        this.emitMessage(
          "questions_controller",
          "Submission Time For this question is over or user already submitted the answer."
        );
      } else {
        this.tmp = 0;
        this.finalResult = undefined;
      }
      if (!result) {
        this.emitMessage("questions_controller", "Question not found.");
      }

      const quizId = result.quizId;
      const expirationTime = result.expirationTime;

      if (!this.cronJob || !this.cronJob.running) {
        await this.startCronJob(id, answer, quizId, expirationTime, userId);
      } else {
        await this.checkAnswers(id, answer, quizId, userId);
      }
    } catch (error) {
      console.error("Error while sending questions:", error);
      throw error;
    }
  }

  /**
   * Check the Answer of the questions.
   *
   * @async
   * @param {number} id - Id of the questions.
   * @param {string} answer - Answer Of the Question supplied by the user.
   * @returns {Promise<void>} Resolves after emitting questions or rejecting on error.
   * @throws {Error} If no questions are found in the database.
   * @memberof QuizController
   */
  async checkAnswers(
    id: number,
    answer: string,
    quizId: number,
    userId: number
  ): Promise<void> {
    try {
      //Check if quiz is expires or not.
      const isQuizExpired = await this.quizExpirationTime(quizId);

      if (isQuizExpired) {
        this.emitMessage("quiz_time_over", "Quiz Time is Over.");

        if (this.cronJob.running) {
          this.cronJob.stop();
          return;
        }
      }

      const result = await Question.findOne({ where: { id } });

      if (!result) {
        this.emitMessage("questions_controller", "Question not found.");
      }

      if (!this.cronJob.running) {
        this.emitMessage(
          "question_time_over",
          "Time is Over For this Question."
        );
      }

      this.calculateExpiration(parseInt(result.expirationTime));
      this.isQuestionChecked = result.id;

      if (this.isExpired(this.tmp)) {
        this.emitMessage(
          "questions_controller",
          "Submission Time For this question is over. from check answer"
        );
        if (this.cronJob.running) {
          this.cronJob.stop();
          this.tmp = 0;
        }
        return;
      }
      await this.processAnswer(result, id, answer, userId);
    } catch (error) {
      console.error(" Something went wrong while checking answers:", error);
      throw error;
    }
  }

  /**
   * Calcuting the Quiz Expirations Time.
   *
   * @param {number} id
   * @returns {Promise<void>} Resolves after emitting quizExpirationTime or rejecting on error.
   * @memberof QuizController
   */
  async quizExpirationTime(id: number): Promise<Boolean> {
    try {
      //Check if quiz is expires or not.
      const result = await QuizExpiration.findOne({
        where: {
          quizId: id,
        },
      });

      if (this.isExpired(parseInt(result.quizExpirationTime))) {
        this.isQuizExpire = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error while Displaying quizExpirationTime:", error);
      throw error;
    }
  }

  /**
   *Start a Cron Job For a Expiration Time.
   *
   * @param {number} id - Id of the questions.
   * @param {string} answer - Answer Of the Question supplied by the user.
   * @param {string} expirationTime - ExpirationTime of the given Questions.
   * @returns {Promise<void>} Resolves after starting a cron job or rejecting on error.
   * @memberof QuizController
   */
  async startCronJob(
    id: number,
    answer: string,
    quizId: number,
    expirationTime: string,
    userId: number
  ): Promise<void> {
    try {
      const expirationMinutes = parseInt(expirationTime);
      const cronExpression = `*/${expirationMinutes} * * * *`;

      this.cronJob = new CronJob(cronExpression, async () => {
        try {
          await this.checkAnswers(id, answer, quizId, userId);
        } catch (error) {
          console.error("Error in cron job callback:", error);
        }
      });

      if (!this.cronJob.running) {
        this.cronJob.start();
        await this.checkAnswers(id, answer, quizId, userId);
      }
    } catch (error) {
      console.error("Error starting cron job:", error);
      throw error;
    }
  }

  /**
   * Displays the Score Of the Quiz
   *
   * @returns {Promise<void>} Resolves after Displays the Score Of the Quiz or rejecting on error.
   * @memberof QuizController
   */
  async scoreOfQuiz(): Promise<void> {
    try {
      this.emitMessage("score", this.score);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process the answer submitted by the user.
   * @param {any} result - The result object containing the correct answer.
   * @param {number} id - The ID of the question.
   * @param {string} answer - The answer submitted by the user.
   * @param {number} userId - The ID of the user submitting the answer.
   * @returns {Promise<void>} - A Promise that resolves once the answer is processed.
   */

  private async processAnswer(
    result: any,
    id: number,
    answer: string,
    userId: number
  ) {
    const quizHistoryDetails = await QuizHistory.findOne({ where: { userId } });
    quizHistoryDetails.answer = answer;
    quizHistoryDetails.questionId = id;

    if (result.ans === answer) {
      this.score += 1;
      quizHistoryDetails.score = this.score;
      this.cronJob.stop();
      this.io.emit("questions_controller", "Your answer is correct!");
    } else {
      this.io.emit("questions_controller", "Your answer is wrong.");
    }
    await quizHistoryDetails.save();
  }

  /**
   * Calculates the expiration time for a quiz based on the provided expiration time.
   * @param {number} expireTime - The expiration time for the quiz.
   * @returns {number} - The calculated expiration time.
   */
  private calculateExpiration(expireTime: number) {
    this.tmp = expireTime + this.currentMinutesResult;

    if (this.tmp > 60) {
      this.tmp = this.tmp % 60;
    }
    return this.tmp;
  }

  /**
   * Emits a message to the specified event using Socket.IO.
   * @param {string} event - The event to emit the message to.
   * @param {string | number | any[]} message - The message to emit.
   * @returns {void}
   */
  private emitMessage(event: string, message: string | number | any[]): void {
    this.io.emit(event, message);
    return;
  }

  /**
   * Checks if the expiration time has been reached.
   * @param {number} expirationTime - The expiration time to compare against the current time.
   * @returns {boolean} - `true` if the expiration time has been reached, `false` otherwise.
   */
  private isExpired(expirationTime: number): boolean {
    return expirationTime === this.currentMinutesResult;
  }

  get currentMinutesResult(): number {
    return new Date().getMinutes();
  }
}
