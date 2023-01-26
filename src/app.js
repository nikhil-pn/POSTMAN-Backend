import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;