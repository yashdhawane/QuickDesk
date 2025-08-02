const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const logger = require("./utils/logger");
const userRoutes = require("./routes/UserRoute");
const adminRoutes = require("./routes/adminRoute");
const connectToDatabase = require("./config/config");
const cors = require("cors");
const User = require("./model/User");

dotenv.config();
const app = express();
app.use(helmet()); // Security middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  logger.info("GET / hit");
  res.send("Hello, Winston!");
});

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectToDatabase();
    const { ADMIN, ADMIN_PASSWORD } = process.env;

    User.findOne({ role: "admin" })
      .then((existingUser) => {
        if (existingUser) {
          logger.info("Admin user already exists");
        } else {
          User.create({
            name: "RootAdmin",
            email: ADMIN,
            password: ADMIN_PASSWORD,
            role: "admin",
          })
            .then(() => {
              logger.info("Admin user created");
            })
            .catch((err) => {
              logger.error("Error creating admin user:", err);
            });
        }
      })
      .catch((err) => {
        logger.error("Error checking admin existence:", err);
      });

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    console.error("Error starting server:", error);
  }
};
startServer();
