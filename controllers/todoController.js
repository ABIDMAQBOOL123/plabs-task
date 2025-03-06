const Todo = require("../models/Todo");


exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

    const todo = new Todo({ title, description, user: req.user.id });
    await todo.save();

    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Error creating todo" });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });

    res.status(200).json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Error fetching todos" });
  }
};


exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!title && !description && completed === undefined) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }


    const todo = await Todo.findOne({ _id: id, user: req.user.id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Error updating todo" });
  }
};


exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    
    const todo = await Todo.findOne({ _id: id, user: req.user.id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    await Todo.findByIdAndDelete(id);

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Error deleting todo" });
  }
};
