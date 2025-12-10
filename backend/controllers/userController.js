import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    // Don't set username - let it be undefined (sparse unique index allows multiple null/undefined)
    // Don't set empty strings for optional fields to avoid duplicate key errors
    // activities and recommendedPlants will default to empty arrays automatically
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // TODO: Replace with actual order count from Order model when implemented
    const totalOrders = 0;
    
    console.log('Fetching profile for user:', user._id); // Debug log
    
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username || '',
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      profilePicture: user.profilePicture || '',
      totalOrders: totalOrders,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    console.log('Updating profile for user:', user._id); // Debug log
    console.log('Request body:', req.body); // Debug log
    console.log('File uploaded:', req.file ? req.file.filename : 'None'); // Debug log
    
    // Update name (required field)
    if (req.body.name && req.body.name.trim()) {
      user.name = req.body.name.trim();
    }
    
    // Email should not be editable - ignore any changes
    // user.email remains unchanged
    
    // Check if username is being changed and if it's unique
    if (req.body.username !== undefined) {
      const newUsername = req.body.username.trim();
      
      if (newUsername && newUsername !== user.username) {
        const usernameExists = await User.findOne({ username: newUsername });
        if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
          res.status(400);
          throw new Error('Username already taken');
        }
        user.username = newUsername;
        console.log('Username updated to:', newUsername); // Debug log
      } else if (!newUsername) {
        // Allow clearing username - set to undefined (not empty string) to avoid duplicate key errors
        user.username = undefined;
      }
    }
    
    // Update optional fields (allow empty strings to clear fields)
    if (req.body.phone !== undefined) {
      user.phone = req.body.phone.trim();
      console.log('Phone updated to:', user.phone); // Debug log
    }
    
    if (req.body.address !== undefined) {
      user.address = req.body.address.trim();
      console.log('Address updated to:', user.address); // Debug log
    }
    
    // Update profile picture if file is uploaded
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
      console.log('Profile picture updated to:', user.profilePicture); // Debug log
    }
    
    // Update password if provided (not used in profile edit, but kept for completeness)
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log('User saved to database successfully'); // Debug log

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username || '',
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      address: updatedUser.address || '',
      profilePicture: updatedUser.profilePicture || '',
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user's complete profile with all posts
// @route   GET /api/users/my-profile
// @access  Private
const getUserMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Import models dynamically to avoid circular dependencies
  const Blog = (await import('../models/blogModel.js')).default;
  const Donation = (await import('../models/donationModel.js')).default;
  const Swap = (await import('../models/swapModel.js')).default;
  const SellPlant = (await import('../models/sellPlantModel.js')).default;

  // Fetch all user's posts
  const [blogs, donations, swaps, listings] = await Promise.all([
    Blog.find({ user: req.user._id }).sort({ createdAt: -1 }),
    Donation.find({ user: req.user._id }).sort({ createdAt: -1 }),
    Swap.find({ user: req.user._id }).sort({ createdAt: -1 }),
    SellPlant.find({ user: req.user._id }).sort({ createdAt: -1 }),
  ]);

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      username: user.username || '',
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      profilePicture: user.profilePicture || '',
      isAdmin: user.isAdmin,
    },
    summary: {
      totalBlogs: blogs.length,
      totalDonations: donations.length,
      totalSwaps: swaps.length,
      totalListings: listings.length,
    },
    posts: {
      blogs,
      donations,
      swaps,
      listings,
    },
  });
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUserMyProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
