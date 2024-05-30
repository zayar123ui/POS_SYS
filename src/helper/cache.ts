const redis = require("redis");

import { Request, Response } from "express";
require("dotenv").config();
import { response } from "../helper/helper";
const client = redis.createClient(process.env.REDIS_PORT);


  export const set_cache_string = async (KEY: string, VALUE: string, TTL = 60) => {
    await client.connect();
    await client.setEx(KEY, TTL, VALUE);
    await client.quit();
  }

    export const get_cache_string = async (KEY: string) => {
    await client.connect();
    const value = await client.get(KEY);
    await client.quit();
    return JSON.parse(value);
  }

  // words_cache: async (req: Request, res: Response, next: any) => {
  //   const KEY = req.body.search;

  //   console.log(KEY);
  //   try {
  //     await client.connect();
  //     const data = await client.get(KEY);
  //     await client.quit();
  //     console.log(data);

  //     const cachedData = JSON.parse(data);
  //     console.log(cachedData);
  //     if (data !== null) {
  //       return response.success(res, 200, "Words Fetched Successfully", {
  //         words: cachedData,
  //       });
  //     } else {
  //       next();
  //     }
  //   } catch (error) {
  //     console.error("Error in retrieving data from Redis:", error);
  //   }
  // },

