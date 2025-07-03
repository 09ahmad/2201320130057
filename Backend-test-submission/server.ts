import express, { type Request, type Response } from "express";
import cors from "cors";
import logger from "../Logging-middleware/middleware/loggingMiddleware"

import mainRouter from "./route";
const app = express();
app.use(cors())
app.use(logger)
app.use(express.json());
app.use("/api",mainRouter);


app.listen(3000);