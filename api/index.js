const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./database/database");
const UserDAO = require("./dao/UserDAO");
const QuizDAO = require("./dao/QuizDAO");

connectDB();

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middlewares
app.use(express.json()); // Parse JSON requests

const allowedOrigins = process.env.FRONTEND_URL.split(",");
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});



// Instantiate DAOs
const userDAO = new UserDAO();
const quizDAO = new QuizDAO();

// User routes
app.get("/api/v1/users/", (req, res) => userDAO.getAll(req, res));  
app.post("/api/v1/users/", (req, res) => userDAO.create(req, res));
app.get("/api/v1/users/:id", (req, res) => userDAO.getById(req, res));
app.put("/api/v1/users/:id", (req, res) => userDAO.update(req, res));
app.delete("/api/v1/users/:id", (req, res) => userDAO.delete(req, res));

// Quiz routes
app.post("/api/v1/quizzes/", (req, res) => quizDAO.create(req, res));
app.get("/api/v1/quizzes/", (req, res) => quizDAO.getAll(req, res));
app.get("/api/v1/quizzes/user/:userID", (req, res) => quizDAO.getByUserId(req, res));
app.get("/api/v1/users/email/:email", (req, res) => userDAO.getByEmail(req, res)); // <-- NUEVO ENDPOINT
app.put("/api/v1/quizzes/:id", (req, res) => quizDAO.update(req, res));
app.get("/api/v1/quizzes/ranking", (req, res) => quizDAO.getRanking(req, res)); // Endpoint para ranking
app.delete("/api/v1/quizzes/:id", (req, res) => quizDAO.delete(req, res));


// Configure port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
