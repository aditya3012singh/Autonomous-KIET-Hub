import express from "express";
import userRouter from "./routes/user.js";
import subjectRouter from "./routes/subject.js"
import notesRouter from "./routes/notes.js"
import dotenv from "dotenv";

dotenv.config();
import cors from "cors"


const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON bodies
app.use(cors())
app.get("/", (req, res) => {
  res.send("API running!")
});

app.use("/api/v1", userRouter);
app.use("/api/v1",subjectRouter)
app.use("/api/v1",notesRouter)
console.log('DATABASE_URL:', process.env.DATABASE_URL);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

