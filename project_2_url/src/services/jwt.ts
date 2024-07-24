import jwt from "jsonwebtoken";
import logger from "./logger";

const secretKey: string = process.env.secret_key || "jwtsecretkey";

interface User {
  id: number;
  username: string;
  email: string;
}

type Token = string;

/**
 * Generates a JWT token for the given user.
 * @param {User} user The user object for which to generate the token.
 * @returns {Token | false} Returns the generated JWT token , or false if an error occurs.
 */
function generateToken(user: User): Token | false {
  try {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return jwt.sign(payload, secretKey, { expiresIn: "24h" }) as Token;
  } catch (error) {
    logger.fatal("Internal Server Error.");
    return false;
  }
}

/**
 * Validates a JWT token.
 * @param {Token} token The JWT token to validate.
 * @returns {any | false} Returns the decoded payload of the token if validation , or false if an error occurs.
 */
function validateToken(token: Token): any | false {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    logger.fatal("Internal Server Error.");
    console.error("Error validating token:", error);
    return false;
  }
}

export { generateToken, validateToken };
