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

requestRouter.get("/:id", async (req, res, next) => {
  try {
    const requestId = req.params.id;
    let foundRequest = await Request.findByPk(requestId);

    if (!foundRequest) {
      return res.status(404).json({ error: "Not found" });
    }
    const savedHeaders = await Header.findAll({
      where: { requestId: requestId },
    });
    //toJSON() is a SQL func
    foundRequest = foundRequest.toJSON();
    foundRequest.headers = savedHeaders.toJSON();
    return res.status(200).json(foundRequest);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

requestRouter.post(
  "/:id",
  tokenExtractor,
  tokenValidator,
  async (req, res, next) => {
    try {
      const decodedToken = validateToken(req, res, next);
      const user = User.findByPk(decodedToken.id);

      if (!user) {
        return res.status(404).json({ error: "INvalid user" });
      }
      const requestId = req.params.id;

      if (requestId === "0") {
        const newRequest = await Request.create({
          url: "",
          type: "",
          body: "",
          UserId: decodedToken.id,
        });
        const savedReq = await newRequest.save();
        return res.status(201).json(savedReq);
      }
      let foundReq = await Request.findByPk(requestId);

      if (!foundReq) {
        return res.status(500).json({ err: err });
      }
      //setting default value of body if req are provided
      let { url = "", type = "", body = "", headers = "" } = req.body;

      foundReq.url = url;
      foundReq.type = type;
      foundReq.body = body;

      let savedReq = await foundReq.save();

      for (let header of headers) {
        await Header.update(
          {
            key: header.key || "",
            value: header.value || "",
            checked: header.checked || false,
          },
          {
            where: {
              id: header.id,
            },
          }
        );
      }
      savedReq = savedReq.toJSON();
      let savedHeaders = await Header.findAll({
        where: {
          requestId: savedReq.id,
        },
      });
      savedHeaders.headers = savedHeaders;

      return res.status(200).json(savedReq);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

requestRouter.delete(
  "/:id/header/:headerId",
  tokenExtractor,
  tokenValidator,
  async (req, res, next) => {
    const decodedToken = validateToken(req, res, next);
    const user = User.findByPk(decodedToken.id);

    const headerId = req.params.headerId;
    const savedHeaders = await Header.findByPk(headerId);
    await savedHeaders.destroy();
    return res.status(204).end();
  }
);

export default requestRouter;
