const express = require("express");
const dotenv = require("dotenv");
const cors = require ("cors");
const connectDB = require("./database/database");
const UserDAO = require("/dao/UserDAO");

connectDB();
// load environment variables

const app = express();

// Middlewares
app.use(express.json()); // parseo JSON request
app.use(cors({           // Enable CORS wit configuration
    origin: true,        // Allow all origins (restrict in production)
    credentials: true    // Allow credentials (cookies, authorization headers)
}));

// Healt check endopoint

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Instantiate UserDAO
const userDAO = new UserDAO();

// Routes for User
app.get("/api/v1/users/", (req, res) => userDAO.getAll(req, res));  
app.post("/api/v1/users/", (req, res) => userDAO.create(req, res));
app.get("/api/v1/users/:id", (req, res) => userDAO.getById(req, res));
app.put("/api/v1/users/:id", (req, res) => userDAO.update(req, res));
app.delete("/api/v1/users/:id", (req, res) => userDAO.delete(req, res));


//configure port
const PORT = process.env.PORT || 3000;

// start server

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

