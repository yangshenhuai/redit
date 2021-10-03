import session from 'express-session';

session.name;

declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}