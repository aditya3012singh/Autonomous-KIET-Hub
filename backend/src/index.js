import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/user.js";
import subjectRouter from "./routes/subject.js";
import notesRouter from "./routes/notes.js";
import tipRouter from "./routes/tip.js";
import feedbackRouter from "./routes/feedback.js";
import eventRouter from "./routes/event.js";
import announcementRouter from "./routes/announcement.js";
import overviewRoutes from './routes/overview.js'
import activityRoutes from './routes/activity.js'
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API running!");
});
app.use('/api/overview', overviewRoutes);
app.use('/activity',activityRoutes)
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/tips", tipRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/announcements", announcementRouter);

console.log("DATABASE_URL:", process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

