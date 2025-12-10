import asyncHandler from 'express-async-handler';
import SellPlant from '../models/sellPlantModel.js';
import User from '../models/userModel.js';

// @desc    Create a new plant listing for sale
// @route   POST /api/sellplants
// @access  Private
const createSalePlant = asyncHandler(async (req, res) => {
  const { plantName, plantType, price, amount } = req.body;

  // Validate required fields
  if (!plantName || !plantType || !price || !amount) {
    res.status(400);
    throw new Error('Please provide all required fields: plant name, type, price, and amount');
  }

  // Create the plant listing
  const sellPlant = await SellPlant.create({
    user: req.user._id,
    plantName,
    plantType,
    price: Number(price),
    amount: Number(amount),
    image: req.file ? `/uploads/${req.file.filename}` : '',
  });

  if (sellPlant) {
    // Get user and update their activities
    const user = await User.findById(req.user._id);
    
    // Create activity message
    const activityMessage = `${user.name} listed ${amount} pcs of ${plantName} for sale at ${price} Tk`;

    // Add to user's activities
    user.activities.unshift({
      type: 'sale',
      message: activityMessage,
      createdAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      _id: sellPlant._id,
      plantName: sellPlant.plantName,
      plantType: sellPlant.plantType,
      price: sellPlant.price,
      amount: sellPlant.amount,
      image: sellPlant.image,
      status: sellPlant.status,
      createdAt: sellPlant.createdAt,
      activity: {
        type: 'sale',
        message: activityMessage,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid plant data');
  }
});

// @desc    Get user's plants for sale
// @route   GET /api/sellplants/my
// @access  Private
const getMySalePlants = asyncHandler(async (req, res) => {
  const plants = await SellPlant.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(plants);
});

// @desc    Get all available plants for sale
// @route   GET /api/sellplants
// @access  Public
const getAllSalePlants = asyncHandler(async (req, res) => {
  const plants = await SellPlant.find({ status: 'available' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(plants);
});

// @desc    Get single plant by ID
// @route   GET /api/sellplants/:id
// @access  Public
const getSalePlantById = asyncHandler(async (req, res) => {
  const plant = await SellPlant.findById(req.params.id).populate('user', 'name email');

  if (plant) {
    res.json(plant);
  } else {
    res.status(404);
    throw new Error('Plant not found');
  }
});

// @desc    Update plant listing
// @route   PUT /api/sellplants/:id
// @access  Private
const updateSalePlant = asyncHandler(async (req, res) => {
  const { plantName, plantType, price, amount, status } = req.body;
  const plant = await SellPlant.findById(req.params.id);

  if (!plant) {
    res.status(404);
    throw new Error('Plant not found');
  }

  // Check if user owns this plant listing
  if (plant.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this listing');
  }

  plant.plantName = plantName || plant.plantName;
  plant.plantType = plantType || plant.plantType;
  plant.price = price || plant.price;
  plant.amount = amount || plant.amount;
  plant.status = status || plant.status;

  if (req.file) {
    plant.image = `/uploads/${req.file.filename}`;
  }

  const updatedPlant = await plant.save();
  res.json(updatedPlant);
});

// @desc    Delete plant listing
// @route   DELETE /api/sellplants/:id
// @access  Private
const deleteSalePlant = asyncHandler(async (req, res) => {
  const plant = await SellPlant.findById(req.params.id);

  if (!plant) {
    res.status(404);
    throw new Error('Plant not found');
  }

  // Check if user owns this plant listing
  if (plant.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this listing');
  }

  // Get user to remove activity
  const user = await User.findById(req.user._id);
  
  // Remove sale-related activities from user
  if (user && user.activities) {
    user.activities = user.activities.filter(
      activity => !(
        activity.type === 'sale' &&
        activity.message &&
        activity.message.includes(plant.plantName)
      )
    );
    await user.save();
  }

  await plant.deleteOne();
  res.json({ message: 'Plant listing removed' });
});

export {
  createSalePlant,
  getMySalePlants,
  getAllSalePlants,
  getSalePlantById,
  updateSalePlant,
  deleteSalePlant,
};

