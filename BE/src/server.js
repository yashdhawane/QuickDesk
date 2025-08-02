const express = require('express');
const logger = require('./utils/logger');
const userRoutes = require('./routes/UserRoute');
const adminRoutes = require('./routes/adminRoute');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);


app.get('/', (req, res) => {
  logger.info('GET / hit');
  res.send('Hello, Winston!');
});



const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
