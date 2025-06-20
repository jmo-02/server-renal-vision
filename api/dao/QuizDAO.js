const Quiz = require("../models/Quiz");

class QuizDAO {
  constructor() {
    this.model = Quiz;
  }

  // Crear un nuevo registro de quiz (progreso, calificación, usuario)
  async create(req, res) {
    try {
      const document = new this.model(req.body);
      await document.save();
      res.status(201).json(document);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error creating document: ${error.message}` });
    }
  }

  // Obtener todos los registros de quiz (para ranking/puestos)
  async getAll(req, res) {
    try {
      const items = await this.model.find();
      res.status(200).json(items);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error fetching documents: ${error.message}` });
    }
  }

  // Obtener el progreso/calificación de un usuario específico
  async getByUserId(req, res) {
    try {
      const { userID } = req.params;
      const items = await this.model.find({ userID });
      res.status(200).json(items);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error fetching user progress: ${error.message}` });
    }
  }

  // Actualizar el progreso/calificación de un quiz por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedItem) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error updating document: ${error.message}` });
    }
  }

  // Eliminar un registro de quiz por ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedItem = await this.model.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error deleting document: ${error.message}` });
    }
  }

  // Obtener ranking de usuarios por puntos (puestos)
  async getRanking(req, res) {
    try {
      // Agrupa por usuario y suma los puntos
      const ranking = await this.model.aggregate([
        {
          $group: {
            _id: "$userID",
            totalPoints: { $sum: "$points" },
          },
        },
        { $sort: { totalPoints: -1 } },
      ]);
      res.status(200).json(ranking);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error fetching ranking: ${error.message}` });
    }
  }

  async getRanking(req, res) {
    try {
      const ranking = await this.model.aggregate([
        {
          $group: {
            _id: "$userID",
            totalPoints: { $sum: "$points" },
          },
        },
        { $sort: { totalPoints: -1 } },
        {
          $addFields: { userObjId: { $toObjectId: "$_id" } },
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            userID: "$_id",
            totalPoints: 1,
            displayName: "$user.displayName",
            email: "$user.email",
          },
        },
      ]);
      res.status(200).json(ranking);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error getting ranking: ${error.message}` });
    }
  }
}

module.exports = QuizDAO;
