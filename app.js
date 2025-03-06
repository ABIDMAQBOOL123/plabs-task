const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const todoRoutes = require('./routes/todoRoute');
const reportRoutes = require('./routes/reportRoute');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');

dotenv.config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/reports', reportRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));