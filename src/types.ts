export interface User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
  }
  
  export interface ValidationResult {
    valid: boolean;
    errors: string[];
  }
  
  export interface HttpResponse {
    statusCode: number;
    body: any;
  }