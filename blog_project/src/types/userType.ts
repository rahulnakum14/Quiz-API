/**
 * Interface representing attributes of a user.
 * @interface UserAttributes
 * @property {number} id - The unique identifier of the user.
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {any} password - The password of the user (might be hashed or encrypted).
 */

interface UserAttributes {
    id: number;
    username:string,
    email: string;
    password: any;
  }

  export default UserAttributes;