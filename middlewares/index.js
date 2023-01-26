import { response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECERT = "secert";

export const tokenExtractor = (req, res, next) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer")) {
    req.token = auth.substring(7);
  }
  next();
};

export const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "ValidationError":
      return res.status(400).json({ err: err.message });

    case "JsonWebTokenError":
      return res.status(401).json({ err: "Invaild Token" });

    case "TokenExpiredError":
      return res.status(401).json({ err: "Token Expired" });
    case "SequalizeUniqueContrainError":
      return res.status(401).json({ err: "Token Expired" });
    default:
      return res.status(500).json({ error: "Something went wrong" });
  }

  next(err);
};

export const tokenValidator = (req, res, next) => {
  const token = request.token;
  if (!token) {
    return res.status(401).json({ error: "TOken Missing" });
  }
  const decodedToken = jwt.verify(token, JWT_SECERT);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "Invalid Token login again" });
  }
  next();
};

export const unknowEndpoint = (req, res) => {
  res.status(404).send({ error: "unknow endpoint" });
};

export const validateToken = (req, res, next) => {
  const decodedToken = jwt.verify(token, JWT_SECERT);
  if (!req.token || !decodedToken?.id) {
    return res.status(401).json({ error: "Token missing or invaild" });
  }
  return decodedToken;
};
