import { Express } from "express";
import { RequestHandler } from "express";
import multer from "multer";
declare global {
  namespace Express {
    export interface Request {
      user: any;
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[]
        | undefined;
    }
    export interface Response {
      user: any;
    }
  }
}
declare module "express-serve-static-core" {
  interface Request {
    files?: Express.Multer.File[];
  }
}
