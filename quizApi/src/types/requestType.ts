declare namespace Express {
    /**
     * @namespace Express
     * @interface Request
     * @property {string} [user] - Represents the user associated with the request.
     */
  
    export interface Request {
      user?: string;
    }
    /**
     * Augments the Express.Response interface to include additional properties.
     * @namespace Express
     * @interface Response
     * @property {any} [user] - Represents user-related data in the response.
     */
    export interface Response {
      user?: any;
    }
  }
  
  declare module "*.json" {
    const value: any;
    export default value;
  }