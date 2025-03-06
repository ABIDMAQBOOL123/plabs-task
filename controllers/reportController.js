const Todo = require("../models/Todo");

exports.generateReport = async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. No user found in request." });
    }

    console.log("Generating report for user:", req.user.id);

    
    const todos = await Todo.find({ user: req.user.id });

    
    if (!todos || todos.length === 0) {
      return res.status(404).json({ error: "No todos found for this user." });
    }

    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    const report = {
      totalTodos,
      completedTodos,
      pendingTodos,
      todos: todos.map(todo => ({
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      })),
    };

    res.status(200).json({ message: "Report generated successfully", report });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Error generating report", details: err.message });
  }
};
