import asyncHandler from 'express-async-handler';
import Swap from '../models/swapModel.js';
import User from '../models/userModel.js';

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
const createSwap = asyncHandler(async (req, res) => {
  const { havePlantName, haveQuantity, needPlantName, needQuantity } = req.body;

  // Validate required fields
  if (!havePlantName || !haveQuantity || !needPlantName || !needQuantity) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create the swap request
  const swap = await Swap.create({
    user: req.user._id,
    havePlantName,
    haveQuantity: Number(haveQuantity),
    haveImage: req.file ? `/uploads/${req.file.filename}` : '',
    needPlantName,
    needQuantity: Number(needQuantity),
  });

  if (swap) {
    // Get user and update their activities and recommendedPlants
    const user = await User.findById(req.user._id);
    
    // Create activity message
    const activityMessage = `${user.name} wants ${needQuantity} ${needPlantName} plant${needQuantity > 1 ? 's' : ''} in exchange for ${haveQuantity} ${havePlantName} plant${haveQuantity > 1 ? 's' : ''}`;

    // Add to user's activities
    user.activities.unshift({
      type: 'swap',
      message: activityMessage,
      createdAt: new Date(),
    });

    // Add the requested plant to recommendedPlants (avoid duplicates)
    const existingPlant = user.recommendedPlants.find(
      p => p.plantName.toLowerCase() === needPlantName.toLowerCase()
    );
    
    if (!existingPlant) {
      user.recommendedPlants.unshift({
        plantName: needPlantName,
        fromSwap: swap._id,
        createdAt: new Date(),
      });
    }

    await user.save();

    res.status(201).json({
      _id: swap._id,
      havePlantName: swap.havePlantName,
      haveQuantity: swap.haveQuantity,
      haveImage: swap.haveImage,
      needPlantName: swap.needPlantName,
      needQuantity: swap.needQuantity,
      status: swap.status,
      createdAt: swap.createdAt,
      activity: {
        type: 'swap',
        message: activityMessage,
      },
      recommendedPlant: {
        plantName: needPlantName,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid swap data');
  }
});

// @desc    Get user's swap requests
// @route   GET /api/swaps/my
// @access  Private
const getMySwaps = asyncHandler(async (req, res) => {
  const swaps = await Swap.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(swaps);
});

// @desc    Get user's recommended plants
// @route   GET /api/swaps/recommended
// @access  Private
const getRecommendedPlants = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    // Only return recommended plants that have an active swap request
    // Filter out plants without a valid swap reference or with deleted swaps
    const validPlants = [];
    const invalidPlantIds = [];
    
    for (const plant of user.recommendedPlants || []) {
      if (plant.fromSwap) {
        // Check if the swap still exists and is open
        const swap = await Swap.findOne({
          _id: plant.fromSwap,
          user: req.user._id,
          status: 'open',
        });
        
        if (swap) {
          validPlants.push(plant);
        } else {
          // Mark as invalid to remove later
          invalidPlantIds.push(plant._id);
        }
      } else {
        // Plants without a swap reference are invalid
        invalidPlantIds.push(plant._id);
      }
    }
    
    // Clean up invalid plants from database
    if (invalidPlantIds.length > 0 && user.recommendedPlants) {
      user.recommendedPlants = user.recommendedPlants.filter(
        plant => !invalidPlantIds.some(id => plant._id.toString() === id.toString())
      );
      await user.save();
    }
    
    // Sort by most recent first
    const sortedPlants = validPlants.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json(sortedPlants);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all open swap requests
// @route   GET /api/swaps
// @access  Public
const getAllSwaps = asyncHandler(async (req, res) => {
  const swaps = await Swap.find({ status: 'open' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(swaps);
});

// @desc    Update swap status
// @route   PUT /api/swaps/:id
// @access  Private
const updateSwapStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const swap = await Swap.findById(req.params.id);

  if (!swap) {
    res.status(404);
    throw new Error('Swap not found');
  }

  // Check if user owns this swap
  if (swap.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  swap.status = status;
  const updatedSwap = await swap.save();

  res.json(updatedSwap);
});

// @desc    Delete swap
// @route   DELETE /api/swaps/:id
// @access  Private
const deleteSwap = asyncHandler(async (req, res) => {
  const swap = await Swap.findById(req.params.id);

  if (!swap) {
    res.status(404);
    throw new Error('Swap not found');
  }

  // Check if user owns this swap
  if (swap.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this swap');
  }

  // Get user to remove activity and recommended plant
  const user = await User.findById(req.user._id);
  
  if (user) {
    // Remove swap-related activities
    if (user.activities) {
      user.activities = user.activities.filter(
        activity => !(
          activity.type === 'swap' &&
          activity.message &&
          (activity.message.includes(swap.havePlantName) || activity.message.includes(swap.needPlantName))
        )
      );
    }

    // Remove the requested plant from recommendedPlants if it was from this swap
    if (user.recommendedPlants) {
      user.recommendedPlants = user.recommendedPlants.filter(
        plant => !(
          plant.plantName.toLowerCase() === swap.needPlantName.toLowerCase() &&
          plant.fromSwap &&
          plant.fromSwap.toString() === swap._id.toString()
        )
      );
    }

    await user.save();
  }

  await swap.deleteOne();
  res.json({ message: 'Swap removed' });
});

export { createSwap, getMySwaps, getRecommendedPlants, getAllSwaps, updateSwapStatus, deleteSwap };

