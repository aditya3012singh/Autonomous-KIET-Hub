import express from "express";
import userRouter from "./routes/user.js";
import dotenv from "dotenv";

dotenv.config();
import cors from "cors"


const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON bodies
app.use(cors())
app.get("/", (req, res) => {
  res.send("API running!");
});

app.use("/api/v1/", userRouter);
console.log('DATABASE_URL:', process.env.DATABASE_URL);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

