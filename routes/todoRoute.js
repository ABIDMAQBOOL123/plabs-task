const express = require('express');
const todoController = require('../controllers/todoController');
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/',authMiddleware, todoController.createTodo);
router.get('/',authMiddleware, todoController.getTodos);
router.put('/:id',authMiddleware, todoController.updateTodo);
router.delete('/:id',authMiddleware, todoController.deleteTodo);

module.exports = router;

