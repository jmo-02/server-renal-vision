const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    points: { type: Number, required: true },           // Calificación obtenida
    correctAnswers: { type: Number, required: true },   // Respuestas correctas
    incorrectAnswers: { type: Number, required: true }, // Respuestas incorrectas
    userID: { type: String, required: true }            // ID del usuario que hizo el quiz
  },
  { timestamps: true } // Guarda fecha de creación y actualización
);

module.exports = mongoose.model("Quiz", QuizSchema);