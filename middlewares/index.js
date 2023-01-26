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

  next(err)
};
