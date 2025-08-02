const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectToDatabase = async () => {
    try {
        const dbUrl = process.env.MONGO_URL;
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
    }
module.exports = connectToDatabase;