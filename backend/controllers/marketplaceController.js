import asyncHandler from 'express-async-handler';
import SellPlant from '../models/sellPlantModel.js';

// @desc    Search marketplace products
// @route   GET /api/marketplace?search=query
// @access  Public
const searchMarketplace = asyncHandler(async (req, res) => {
  const { search } = req.query;

  // If no search query, return empty array (user needs to search)
  if (!search || !search.trim()) {
    return res.json([]);
  }

  const searchQuery = search.trim();

  // Search in plant name, plant type (case-insensitive)
  const products = await SellPlant.find({
    status: 'available', // Only show available products
    $or: [
      { plantName: { $regex: searchQuery, $options: 'i' } },
      { plantType: { $regex: searchQuery, $options: 'i' } },
    ],
  })
    .populate('user', 'name email') // Include seller info
    .sort({ createdAt: -1 }) // Most recent first
    .limit(50); // Limit results

  res.json(products);
});

export { searchMarketplace };

