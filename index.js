import app from "./src/app";
import http from "http";

const PORT = 3001;

http.createServer(app).listen(PORT, () => {
  console.log("Server is Running");
});
