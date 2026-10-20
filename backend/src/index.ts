import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env";
import cors from "cors";

const app = express();

//Middleware
app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  req.body;
  res.json({
    message: "Chao",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.listen(ENV.PORT, () => {
  console.log("Server is up", ENV.PORT);
});
