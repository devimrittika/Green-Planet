# Login & Signup Backend Implementation

## 📍 Complete Backend Files for Authentication

---

## 1. **USER MODEL** (Database Schema)
📄 **File:** `backend/models/userModel.js`

### Key Features:
- User schema with name, email, password, username (optional), address, profilePicture
- Password hashing using bcrypt (automatic on save)
- Pre-save middleware that:
  - Converts empty strings to `undefined` for optional fields (prevents duplicate key errors)
  - Hashes password before saving
- `matchPassword()` method to verify password during login
- Activities array for tracking user actions
- Recommended plants array for swap feature

### Key Code:
```javascript
// Password matching method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware (hashing + cleanup)
userSchema.pre('save', async function (next) {
  if (this.username === '') this.username = undefined;
  if (this.address === '') this.address = undefined;
  if (this.phone === '') this.phone = undefined;
  
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
```

---

## 2. **USER CONTROLLER** (Business Logic)
📄 **File:** `backend/controllers/userController.js`

### A. **LOGIN FUNCTION**
📍 **Function:** `authUser()` (Lines 8-25)
📍 **Route:** `POST /api/users/login`
📍 **Access:** Public

**What it does:**
1. Receives `email` and `password` from request body
2. Finds user by email in database
3. Compares entered password with hashed password using `matchPassword()`
4. If valid, returns user data + JWT token
5. If invalid, throws 401 error

**Response on Success:**
```json
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "isAdmin": false,
  "token": "jwt_token_string"
}
```

**Code:**
```javascript
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
```

---

### B. **SIGNUP/REGISTER FUNCTION**
📍 **Function:** `registerUser()` (Lines 30-61)
📍 **Route:** `POST /api/users`
📍 **Access:** Public

**What it does:**
1. Receives `name`, `email`, `password` from request body
2. Checks if user with same email already exists
3. If exists, throws 400 error
4. Creates new user (password auto-hashed by pre-save hook)
5. Returns user data + JWT token

**Important Notes:**
- Username is optional (not set during signup)
- Empty strings for optional fields are converted to `undefined` (prevents duplicate key errors)
- Activities and recommendedPlants default to empty arrays
- Password is automatically hashed via pre-save middleware

**Response on Success:**
```json
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "isAdmin": false,
  "token": "jwt_token_string"
}
```

**Code:**
```javascript
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
    // Username omitted - let it be undefined
    // Activities and recommendedPlants default to empty arrays
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
```

---

## 3. **USER ROUTES** (API Endpoints)
📄 **File:** `backend/routes/userRoutes.js`

### Routes Defined:

| Method | Route | Controller | Access | Purpose |
|--------|-------|------------|--------|---------|
| `POST` | `/api/users` | `registerUser` | Public | **SIGNUP** - Register new user |
| `POST` | `/api/users/login` | `authUser` | Public | **LOGIN** - Authenticate user |
| `GET` | `/api/users/profile` | `getUserProfile` | Private | Get user profile |
| `PUT` | `/api/users/profile` | `updateUserProfile` | Private | Update user profile |
| `GET` | `/api/users/my-profile` | `getUserMyProfile` | Private | Get user + all posts |

**Code:**
```javascript
// SIGNUP Route
router.route('/').post(registerUser);

// LOGIN Route
router.post('/login', authUser);

// Profile Routes (Protected)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profilePicture'), updateUserProfile);
```

---

## 4. **AUTHENTICATION MIDDLEWARE**
📄 **File:** `backend/middleware/authMiddleware.js`

### Purpose:
- Protects routes that require authentication
- Verifies JWT token from request header
- Extracts user info from token and attaches to `req.user`

### `protect` Middleware:
```javascript
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token and decode user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continue to next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
```

**Usage:** Add `protect` middleware to any route that requires login:
```javascript
router.get('/profile', protect, getUserProfile);
```

---

## 5. **JWT TOKEN GENERATION**
📄 **File:** `backend/utils/generateToken.js`

### Purpose:
- Creates JWT token for authenticated users
- Token expires in 30 days
- Token payload contains user ID

### Code:
```javascript
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;
```

**Environment Variable Required:**
- `JWT_SECRET` - Secret key for signing tokens (in `.env` file)

---

## 6. **ROUTE REGISTRATION**
📄 **File:** `backend/index.js`

### User Routes Registered:
```javascript
app.use('/api/users', userRoutes);
```

**Full API Base URLs:**
- Signup: `POST http://localhost:5000/api/users`
- Login: `POST http://localhost:5000/api/users/login`
- Profile: `GET http://localhost:5000/api/users/profile` (Protected)

---

## 🔄 Complete Authentication Flow

### **SIGNUP Flow:**
```
1. Frontend sends POST /api/users
   Body: { name, email, password }

2. Backend: registerUser() controller
   - Checks if email exists
   - Creates new user (password auto-hashed)
   - Returns user + JWT token

3. Frontend stores token in localStorage
   - Sets userInfo: { ...user, token }
```

### **LOGIN Flow:**
```
1. Frontend sends POST /api/users/login
   Body: { email, password }

2. Backend: authUser() controller
   - Finds user by email
   - Compares password (bcrypt)
   - Returns user + JWT token

3. Frontend stores token in localStorage
   - Sets userInfo: { ...user, token }
```

### **PROTECTED ROUTE Flow:**
```
1. Frontend sends request with header:
   Authorization: Bearer <token>

2. Backend: protect middleware
   - Extracts token from header
   - Verifies token with JWT_SECRET
   - Loads user from database
   - Attaches user to req.user

3. Controller receives req.user
   - Can access logged-in user's data
```

---

## 📋 File Summary

| File | Purpose | Key Functions |
|------|---------|---------------|
| `backend/models/userModel.js` | Database schema | Password hashing, validation |
| `backend/controllers/userController.js` | Business logic | `authUser()`, `registerUser()` |
| `backend/routes/userRoutes.js` | API endpoints | Route definitions |
| `backend/middleware/authMiddleware.js` | Route protection | `protect`, `admin` |
| `backend/utils/generateToken.js` | JWT generation | `generateToken()` |
| `backend/index.js` | Server setup | Route registration |

---

## 🔗 API Endpoints Summary

### Public Routes (No Login Required):
- ✅ `POST /api/users` - Signup
- ✅ `POST /api/users/login` - Login

### Protected Routes (Login Required):
- 🔒 `GET /api/users/profile` - Get profile
- 🔒 `PUT /api/users/profile` - Update profile
- 🔒 `GET /api/users/my-profile` - Get profile + posts

---

## 🔐 Security Features

1. **Password Hashing:**
   - Uses bcrypt with salt rounds = 10
   - Automatic hashing before saving to database

2. **JWT Tokens:**
   - Tokens expire in 30 days
   - Signed with secret key (JWT_SECRET)

3. **Route Protection:**
   - `protect` middleware verifies token
   - Returns 401 if token is missing/invalid

4. **Input Validation:**
   - Email uniqueness check
   - Password comparison with hashed version

---

## 🎯 Key Functions Reference

### Login:
- **File:** `backend/controllers/userController.js`
- **Function:** `authUser()` (Line 8-25)
- **Route:** `POST /api/users/login`

### Signup:
- **File:** `backend/controllers/userController.js`
- **Function:** `registerUser()` (Line 30-61)
- **Route:** `POST /api/users`

### Token Generation:
- **File:** `backend/utils/generateToken.js`
- **Function:** `generateToken(id)`

### Route Protection:
- **File:** `backend/middleware/authMiddleware.js`
- **Function:** `protect` middleware

---

**That's the complete backend login/signup implementation!** ✅


