import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import classRouter from "./routes/classRoutes.js";
import assignmentRouter from "./routes/assignmentRoutes.js";
import submissionRouter from "./routes/submissionRoutes.js";
import assignmentDeadlineCron from "./cron/assignmentDeadlineCron.js";

dotenv.config();

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);

const app = express();
app.use(cors({
    origin : [process.env.CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
await connectDB();
app.use("/api/auth",authRouter);
app.use("/api/class",classRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/submission", submissionRouter);
assignmentDeadlineCron();

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server running on Port : ${port}`);
    
})