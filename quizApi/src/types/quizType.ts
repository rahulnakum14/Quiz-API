/**
 * Interface representing attributes of a Quiz.
 * @interface QuizAttributes
 * @property {number} [id] - The unique identifier of the quiz.
 * @property {string} question - The question of the quiz.
 * @property {string} ans - The ans of the quiz.
 */

interface quizAttributes {
  time?: Date;
  id?: number;
  quizId?: number;
  question?: string;
  quizExpirationTime?: string;
  ans?: string;
  expirationTime?: string;
  userId?: string;
  answer?: string;
  score?: number;
  questionId?:number;
}

export default quizAttributes;
