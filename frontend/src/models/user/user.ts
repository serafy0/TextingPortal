export interface UserProfileToken {
    username: string;
    email: string;
    token: string;
    role:string
  };
  
  export interface UserProfile  {
    username: string;
    email: string;
    role?:string
  };