import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

import { errorHandler, unknowEndpoint } from "./middlewares";
import requestRouter from "./controllers/request";

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/request", requestRouter);

app.use(unknowEndpoint);
app.use(errorHandler);
export default app;
