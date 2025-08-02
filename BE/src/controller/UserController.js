
const logger = require('../utils/logger');
const { registerSchema ,loginSchema} = require('../utils/validation/auth.validation');
const { createTicketSchema } = require('../utils/validation/ticket.validation');
const User = require('../model/User');
const Ticket = require('../model/Ticket');
const TagCategory = require('../model/TagCategory');
const RoleRequest = require('../model/RoleRequest');
const notifyAdmins = require('../utils/SSE'); // Assuming this is a utility to notify admins
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


const createTicket = async (req, res) => {
  try {
    const validatedData = createTicketSchema.parse(req.body);
    const { tag } = validatedData;

    if (tag && tag.length > 0) {
      const existingTags = await TagCategory.find({ categoryName: { $in: tag } });
      const existingTagNames = existingTags.map(tag => tag.categoryName);

      const invalidTags = tag.filter(t => !existingTagNames.includes(t));
      if (invalidTags.length > 0) {
        return res.status(400).json({
          message: 'Some tags are invalid',
          invalidTags,
        });
      }
    }
    
    const newTicket = await Ticket.create({
      ...validatedData,
      createdBy: req.user.userId, // from JWT middleware
    });

    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const requestRoleChange = async (req, res) => {
  const { requestedRole } = req.body;
  const userId = req.user.userId; // from JWT middleware

  const existing = await RoleRequest.findOne({ userId, status: 'pending' });
  if (existing) return res.status(400).json({ message: 'Pending request already exists.' });

  const request = await RoleRequest.create({ userId, requestedRole });
  notifyAdmins({ type: 'new-request', request });
  res.status(201).json({ message: 'Role change request submitted', request });
};




const createTagCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const exists = await TagCategory.findOne({ categoryName });
    if (exists) {
      return res.status(409).json({ message: 'Tag already exists' });
    }

    const newTag = await TagCategory.create({ categoryName });

    res.status(201).json({ message: 'Tag created successfully', tag: newTag });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const getAllUsers = (req, res) => {
  res.json({ success: true, users });
};




const RoleRequest = require('../model/RoleRequest');
const User = require('../model/User');

const updateRoleRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  const request = await RoleRequest.findById(id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  request.status = action === 'accept' ? 'accepted' : 'rejected';
  await request.save();

  if (action === 'accept') {
    await User.findByIdAndUpdate(request.userId, { role: request.requestedRole });
  }

  res.json({ message: `Request ${action}ed successfully.` });
};



const clients = [];

const sseRoleRequest = (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
};

// Helper to notify admins
const notifyAdmins = (data) => {
  clients.forEach(res => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

module.exports = { sseRoleRequest, notifyAdmins , updateRoleRequest };





module.exports = { registerUser, getAllUsers,login ,createTicket ,createTagCategory };
