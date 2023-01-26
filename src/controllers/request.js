import { Router } from "express";

import {
  tokenExtractor,
  tokenValidator,
  validateToken,
} from "../../middlewares";
import { User, Header, Request } from "../models";

const requestRouter = Router();

requestRouter.get(
  "/",
  tokenExtractor,
  tokenValidator,
  async (req, res, next) => {
    try {
      const decodedToken = validateToken(req, res, next);
      if (res.headersSent) {
        return;
      }
      const requests = Request.findAll({
        where: {
          UserId: decodedToken.id,
        },
      });
      let reqs = requests
        .map((req) => req.toJSON())
        .map((req) => {
          req.headers = [];
          return req;
        });

      for (let req in reqs) {
        let headers = await Header.findAll({
          where: { Request: req.id },
        });
        req.headers = headers.map((header) => header.toJSON());
      }
      res.status(200).json(reqs);
    } catch (error) {}
  }
);

export default requestRouter;
