const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const userRoutes = require('./routes/UserRoute');
const adminRoutes = require('./routes/adminRoute');
const connectToDatabase = require('./config/config');

dotenv.config();

const app = express();
app.use(helmet()); // Security middleware
app.use(express.json());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);


app.get('/', (req, res) => {
  logger.info('GET / hit');
  res.send('Hello, Winston!');
});


const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    console.error('Error starting server:', error);
  }
};
startServer();