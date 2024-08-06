// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config(); // Load environment variables from .env

// const goalRoutes = require('./routes/goalRoutes'); // Adjust the path as needed

// const app = express();
// app.use(cors());
// app.use(express.json()); // For parsing application/json

// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// console.log(`Serving file from: ${path.join(__dirname, 'uploads', 'your-file.pdf')}`);

// // Use the routes defined in goals.js
// app.use('/api/goals', goalRoutes);

// // MongoDB connection
// const mongoURI = process.env.MONGO_URI;
// if (!mongoURI) {
//   console.error('MONGO_URI is not defined in the environment variables.');
//   process.exit(1); // Exit if MongoDB URI is not defined
// }

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB connection error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const goalRoutes = require('./routes/goalRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
app.use('/uploads', express.static(path.join(__dirname, 'controllers/uploads')));
// Log file serving requests and serve static files from the uploads directory


// Use the routes defined in goals.js
app.use('/api/goals', goalRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
