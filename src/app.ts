import express, { Request, Response, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from './routes/auth.route'
import UserRoute from './routes/user.route'
import AdminRoute from './routes/admin.route'
import { seedProducts } from "./seeder/products.seeder";
import { seedUsers } from "./seeder/user.seeder";

const app = express();
const apiRouter = Router();
app.use(helmet());
app.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "Accept-Version",
      "Authorization",
      "Credentials",
      "Content-Type",
    ],
  })
);
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ limit: "300mb", extended: true }));
app.use(cookieParser());


const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  seedUsers();
  seedProducts();
  
}).catch((err:any) => {
  console.error('Error connecting to MongoDB', err);
});

apiRouter.get("/", (_req: Request, res: Response) => {
  res.send("Pos API Up and Running!!!");
});

apiRouter.use("/auth", AuthRoute);
apiRouter.use("/user", UserRoute);
apiRouter.use("/admin", AdminRoute);
app.use("/v1", apiRouter);

export default app;
