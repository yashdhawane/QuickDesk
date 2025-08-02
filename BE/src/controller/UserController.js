
const logger = require('../utils/logger');

// Simulating a DB
let users = [];

const registerUser = (req, res) => {
    const { name, email } = req.body;

    logger.info("Registering user");
    res.send(`User registered: ${name}, Email: ${email}`);
};

const getAllUsers = (req, res) => {
  res.json({ success: true, users });
};

module.exports = { registerUser, getAllUsers };
