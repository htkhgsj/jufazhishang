import express from "express";
import poemRoutes from "./routes/poem.js";
import cors from "cors";

const app = express();

//允许跨域
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());



app.use(express.json());

app.use("/api", poemRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});