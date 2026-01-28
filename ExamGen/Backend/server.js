const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const examRoutes = require('./routes/examRoutes')

const app = express()

// Unit III: Custom Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} to ${req.url}`)
  next()
})

// Unit II: Middleware Setup
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://frontend-xi-six-34.vercel.app',
      'https://frontend-ey3rsjqje-shivanshdubey09s-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)

app.use(bodyParser.json())

// Unit IV: MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err))

// Routes
app.use('/api/exams', examRoutes)
app.use('/api/teachers', require('./routes/teacherRoutes'))
app.use('/api/papers', require('./routes/paperRoutes'))
app.use('/api/questions', require('./routes/questionRoutes'))

// Root route (optional but recommended)
app.get('/', (req, res) => {
  res.send('ExamGen Backend API is running 🚀')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
