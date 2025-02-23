import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import cors from "cors";
import path from "path";
import express from 'express'

import morgan from "morgan";
// import routes from "./src/routes";
// import errorGlobalHandler from "./src/controllers/error.controller";

const app = express();
// const router = express.Router();

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
// app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/api/v1/", (req, res) =>{
    res.send("server is running!")
})
// routes(router);

// app.use(
//   "/api/v1",
//   (req, res) => {
//     next();
//   },
//   router
// );


// app.use(errorGlobalHandler);

export default app;
