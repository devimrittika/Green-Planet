import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const cleanupEmptyUsernames = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update all users with empty string username to undefined
    const result = await User.updateMany(
      { username: '' },
      { $unset: { username: '' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with empty usernames`);

    // Also update users with empty string in phone/address
    const phoneResult = await User.updateMany(
      { phone: '' },
      { $unset: { phone: '' } }
    );
    
    const addressResult = await User.updateMany(
      { address: '' },
      { $unset: { address: '' } }
    );

    console.log(`✅ Updated ${phoneResult.modifiedCount} users with empty phone`);
    console.log(`✅ Updated ${addressResult.modifiedCount} users with empty address`);

    console.log('✅ Cleanup completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
};

cleanupEmptyUsernames();

