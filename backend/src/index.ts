import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";
import productRoutes from "./routes/productRoutes";

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

app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/products", productRoutes);

app.listen(ENV.PORT, () => {
  console.log("Server is up", ENV.PORT);
});
