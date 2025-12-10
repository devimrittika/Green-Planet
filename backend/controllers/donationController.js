import asyncHandler from 'express-async-handler';
import Donation from '../models/donationModel.js';
import User from '../models/userModel.js';

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private
const createDonation = asyncHandler(async (req, res) => {
  const { plantName, quantity } = req.body;

  // Validate required fields
  if (!plantName || !quantity) {
    res.status(400);
    throw new Error('Please provide plant name and quantity');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a plant image');
  }

  // Create the donation
  const donation = await Donation.create({
    user: req.user._id,
    plantName,
    quantity: Number(quantity),
    image: `/uploads/${req.file.filename}`,
  });

  if (donation) {
    // Add activity to user's activities array
    const user = await User.findById(req.user._id);
    const activityMessage = `${user.name} is willing to donate ${quantity} ${plantName} plant${quantity > 1 ? 's' : ''}`;

    user.activities.unshift({
      type: 'donation',
      message: activityMessage,
      createdAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      _id: donation._id,
      plantName: donation.plantName,
      quantity: donation.quantity,
      image: donation.image,
      status: donation.status,
      createdAt: donation.createdAt,
      activity: {
        type: 'donation',
        message: activityMessage,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid donation data');
  }
});

// @desc    Get user's donations
// @route   GET /api/donations/my
// @access  Private
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(donations);
});

// @desc    Get user's activities
// @route   GET /api/donations/activities
// @access  Private
const getMyActivities = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    // Return activities sorted by most recent first
    const activities = user.activities.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(activities);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all donations (for marketplace/community view)
// @route   GET /api/donations
// @access  Public
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ status: 'pending' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(donations);
});

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private
const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  // Check if user owns this donation
  if (donation.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this donation');
  }

  // Get user to remove activity
  const user = await User.findById(req.user._id);
  
  // Remove donation-related activities from user
  if (user && user.activities) {
    user.activities = user.activities.filter(
      activity => !(
        activity.type === 'donation' &&
        activity.message &&
        activity.message.includes(donation.plantName)
      )
    );
    await user.save();
  }

  await donation.deleteOne();
  res.json({ message: 'Donation removed' });
});

export { createDonation, getMyDonations, getMyActivities, getAllDonations, deleteDonation };

