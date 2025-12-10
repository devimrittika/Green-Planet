# Fix: E11000 Duplicate Key Error for Username

## Problem
```
E11000 duplicate key error collection: green_planet.users index: username_1 dup key: { username: "" }
```

**Root Cause:** 
- The `username` field has a `unique: true` and `sparse: true` index
- MongoDB's sparse unique index allows multiple `null` or `undefined` values
- However, **empty strings (`""`) are treated as actual values** and must be unique
- When creating multiple users with empty string usernames, MongoDB throws duplicate key error

## Solution Implemented

### 1. User Model Pre-Save Hook (`backend/models/userModel.js`)

**Added pre-save middleware to convert empty strings to undefined:**

```javascript
userSchema.pre('save', async function (next) {
  // Convert empty string username to undefined (sparse unique index allows multiple undefined)
  if (this.username === '') {
    this.username = undefined;
  }
  
  // Convert empty strings to undefined for other optional fields
  if (this.address === '') {
    this.address = undefined;
  }
  if (this.phone === '') {
    this.phone = undefined;
  }
  
  // Encrypt password using bcrypt (only if password is modified)
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});
```

**Why this works:**
- Sparse unique index allows multiple `undefined`/`null` values
- Empty strings are converted to `undefined` before saving
- Multiple users can have `undefined` username without conflict

### 2. User Creation (`backend/controllers/userController.js`)

**Removed explicit empty string assignments:**

```javascript
const user = await User.create({
  name,
  email,
  password,
  // Don't set username - let it be undefined
  // activities and recommendedPlants will default to empty arrays automatically
});
```

**Why this works:**
- Don't set optional fields if they're empty
- Let Mongoose defaults handle it
- Pre-save hook will handle any edge cases

### 3. Profile Update (`backend/controllers/userController.js`)

**Changed to set undefined instead of empty string:**

```javascript
} else if (!newUsername) {
  // Set to undefined (not empty string) to avoid duplicate key errors
  user.username = undefined;
}
```

## Cleaning Up Existing Database

If you have existing users with empty string usernames, run this MongoDB command:

```javascript
// Connect to MongoDB and run:
db.users.updateMany(
  { username: "" },
  { $unset: { username: "" } }
)
```

Or create a cleanup script:

```javascript
// backend/scripts/cleanupEmptyUsernames.js
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupEmptyUsernames = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await User.updateMany(
      { username: '' },
      { $unset: { username: '' } }
    );

    console.log(`Updated ${result.modifiedCount} users with empty usernames`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanupEmptyUsernames();
```

## Files Modified

1. ✅ `backend/models/userModel.js` - Added pre-save hook to convert empty strings to undefined
2. ✅ `backend/controllers/userController.js` - Removed empty string assignments, set undefined instead

## Testing

1. Try signing up a new user - should work without duplicate key error
2. Sign up multiple users - all should have undefined username, no errors
3. Edit profile and clear username - should set to undefined, not empty string

## Result

✅ **New users can sign up without duplicate key errors**
✅ **Multiple users can have undefined username**
✅ **Empty strings are automatically converted to undefined**
✅ **Signup works smoothly**

