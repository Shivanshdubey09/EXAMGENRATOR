const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const examRoutes = require('./routes/examRoutes')

const app = express()

// Unit III: Custom Middleware (Syllabus Requirement)
// Logs every request made to the server
app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] ${req.method} to ${req.url}`
  )
  next()
})

// Unit II: Middleware Setup
app.use(cors())
app.use(bodyParser.json()) // Essential for handling POST data

// Unit IV: Mongoose/MongoDB Connection
// Connects to a local database named 'exam_generator'
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Unit II: Implementing Routes
app.use('/api/exams', examRoutes);
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/papers', require('./routes/paperRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));

const PORT = 5000
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
