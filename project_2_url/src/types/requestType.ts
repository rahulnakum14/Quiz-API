declare namespace Express {
    /**
     * @namespace Express
     * @interface Request
     * @property {string} [user] - Represents the user associated with the request.
     * @property {string} [createdBy] - Represents the creator of the resource associated with the request.
     */
  
      export interface Request {
        user?: { id: number }; 
        createdBy?: number;
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
  