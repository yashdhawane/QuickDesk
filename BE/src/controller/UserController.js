
const logger = require('../utils/logger');
const { registerSchema ,loginSchema} = require('../utils/validation/auth.validation');
const User = require('../model/User');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    try {
        const data = registerSchema.safeParse(req.body);
        if (!data.success) {
            logger.error('Validation error:', data.error);
            return res.status(400).json({ success: false, error: data.error.errors });
        }
        console.log(data)
        const { email, password, interest, language, profilePic } = data.data;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already exists' });

        const newUser = await User.create({ email, password, interest, language, profilePic });

       return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        email: newUser.email,
        role: newUser.role,
        id: newUser._id,
      },
    });
    } catch (error) {
        logger.error('Error during registration:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const login = async (req, res) => {
    try {
        const data = loginSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ success: false, error: data.error.errors });
        }

        const { email, password } = data.data;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isValid = User.comparePassword(password, user.password);
        if (!isValid) return res.status(400).json({ message: 'Invalid email or password' });

        JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            logger.error('JWT_SECRET is not defined');
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
        const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            language: user.language,
            interest: user.interest,
            profilePic: user.profilePic
      }
    });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


const getAllUsers = (req, res) => {
  res.json({ success: true, users });
};

module.exports = { registerUser, getAllUsers,login };
