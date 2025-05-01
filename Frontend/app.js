const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const CalorieEntry = require('./models/CalorieEntry'); // You'll need to create this model

const app = express();

// ======================
// Middleware Setupmodels/Pin.js should contain:

javascript
const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pin', PinSchema);
// ======================
app.use(cors({
  origin: 'http://localhost:5501',
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// ======================
// Database Connection
// ======================
const MONGODB_URI = 'mongodb+srv://siddhi_user:sidd2510@calorietracker.rzu51b2.mongodb.net/CalorieTracker?retryWrites=true&w=majority&ssl=true';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ======================
// Routes
// ======================
const apiRouter = express.Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', dbState: mongoose.connection.readyState });
});

// Authentication
apiRouter.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Username is required' 
      });
    }

    const user = await User.findOne({ username }) || 
                 await new User({ username }).save();

    res.status(user.isNew ? 201 : 200).json({
      success: true,
      message: user.isNew ? 'User created successfully' : 'Welcome back!',
      user: { username: user.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Calorie Tracking
apiRouter.route('/calories')
  .get(async (req, res) => {
    try {
      const entries = await CalorieEntry.find();
      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const entry = await CalorieEntry.create(req.body);
      res.status(201).json(entry);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

app.use('/api', apiRouter);

// ======================
// Error Handling
// ======================
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

// ======================
// Server Start
// ======================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});