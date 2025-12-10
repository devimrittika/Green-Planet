# 🏗️ MVC Architecture in Green Planet Project

## 📚 MVC Pattern Explained

Your Green Planet application follows the **MVC (Model-View-Controller)** architecture pattern:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  MODEL ← → CONTROLLER ← → VIEW                  │
│  (Data)    (Logic)        (UI)                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 MVC Components in Your Project

### Your Project Structure:
```
CSE470_Green_Planet/
├── backend/           ← MODEL + CONTROLLER
│   ├── models/        ← MODEL (Data Structure)
│   ├── controllers/   ← CONTROLLER (Business Logic)
│   └── routes/        ← Routes (Connects Controller to API)
│
└── frontend/          ← VIEW (User Interface)
    └── src/
        └── components/ ← VIEW Components
```

---

## 1️⃣ MODEL (Data Layer)

### 📁 Location: `backend/models/`

**What is Model?**
- Defines data structure (schema)
- Represents database tables/collections
- Handles data validation
- Manages database operations

### Your Models:

#### **User Model**
```
📁 Path: backend/models/userModel.js
```

**Full Path:**
```
C:\Users\ASUS\Desktop\CSE470_Green_Planet\backend\models\userModel.js
```

**What it contains:**
```javascript
// User Schema Definition
const userSchema = mongoose.Schema({
  name: String,           // User's full name
  username: String,       // Unique username
  email: String,          // User's email (unique)
  password: String,       // Hashed password
  phone: String,          // Phone number
  address: String,        // User address
  profilePicture: String, // Profile image path
  isAdmin: Boolean        // Admin flag
});

// Methods for password matching, encryption
userSchema.methods.matchPassword = ...
userSchema.pre('save', async function() {...});

// Export Model
const User = mongoose.model('User', userSchema);
```

**Purpose:**
- Defines how user data is structured
- Validates data before saving to MongoDB
- Provides methods for data operations

---

## 2️⃣ CONTROLLER (Business Logic Layer)

### 📁 Location: `backend/controllers/`

**What is Controller?**
- Contains business logic
- Processes user requests
- Interacts with Models (database)
- Sends responses back to Views
- Handles CRUD operations (Create, Read, Update, Delete)

### Your Controllers:

#### **User Controller**
```
📁 Path: backend/controllers/userController.js
```

**Full Path:**
```
C:\Users\ASUS\Desktop\CSE470_Green_Planet\backend\controllers\userController.js
```

**What it contains:**
```javascript
// Login Controller
const authUser = async (req, res) => {
  // 1. Get email & password from request
  // 2. Find user in database (MODEL)
  // 3. Verify password
  // 4. Generate JWT token
  // 5. Send response to VIEW
};

// Signup Controller
const registerUser = async (req, res) => {
  // 1. Get user data from request
  // 2. Check if user exists (MODEL)
  // 3. Create new user (MODEL)
  // 4. Hash password
  // 5. Save to database (MODEL)
  // 6. Send response to VIEW
};

// Get Profile Controller
const getUserProfile = async (req, res) => {
  // 1. Get user ID from JWT token
  // 2. Find user in database (MODEL)
  // 3. Send user data to VIEW
};

// Update Profile Controller
const updateUserProfile = async (req, res) => {
  // 1. Get user ID from token
  // 2. Get updated data from request
  // 3. Validate data (username unique, etc.)
  // 4. Update user in database (MODEL)
  // 5. Save changes (MODEL)
  // 6. Send updated data to VIEW
};
```

**Purpose:**
- Handles all profile-related logic
- Validates input data
- Manages authentication
- Updates database through Models
- Returns formatted responses

---

## 3️⃣ VIEW (Presentation Layer)

### 📁 Location: `frontend/src/components/`

**What is View?**
- User Interface (what users see)
- Displays data from Controllers
- Captures user input
- Sends user actions to Controllers
- React components in your case

### Your Views:

#### **Login/Signup Views**
```
📁 Path: frontend/src/components/
   ├── Login.js      ← Login VIEW
   ├── Signup.js     ← Signup VIEW
   └── Auth.css      ← Styling
```

**Full Paths:**
```
C:\Users\ASUS\Desktop\CSE470_Green_Planet\frontend\src\components\Login.js
C:\Users\ASUS\Desktop\CSE470_Green_Planet\frontend\src\components\Signup.js
```

**What they do:**
```javascript
// Login View
- Shows login form (email, password fields)
- Captures user input
- Sends credentials to CONTROLLER (/api/users/login)
- Receives response (success/error)
- Displays result to user
```

---

#### **Dashboard View**
```
📁 Path: frontend/src/components/Dashboard.js
```

**Full Path:**
```
C:\Users\ASUS\Desktop\CSE470_Green_Planet\frontend\src\components\Dashboard.js
```

**What it does:**
```javascript
// Dashboard View
- Shows sidebar menu
- Shows top navbar
- Displays user information
- Routes to different pages
```

---

#### **Profile Views**
```
📁 Path: frontend/src/components/dashboard/
   ├── ProfileView.js    ← Profile Display VIEW
   ├── ProfileEdit.js    ← Profile Edit VIEW
   ├── ProfileView.css   ← View styling
   └── ProfileEdit.css   ← Edit styling
```

**Full Paths:**
```
C:\Users\ASUS\Desktop\CSE470_Green_Planet\frontend\src\components\dashboard\ProfileView.js
C:\Users\ASUS\Desktop\CSE470_Green_Planet\frontend\src\components\dashboard\ProfileEdit.js
```

**What they do:**
```javascript
// ProfileView (Read)
- Requests user data from CONTROLLER (GET /api/users/profile)
- Displays user information
- Shows profile picture, name, email, etc.

// ProfileEdit (Update)
- Shows editable form
- Captures user changes
- Sends updates to CONTROLLER (PUT /api/users/profile)
- Receives confirmation
- Shows success/error messages
```

---

## 🔄 MVC Flow in Your Application

### Example: User Updates Profile

```
┌─────────────────────────────────────────────────────────┐
│                    MVC FLOW                             │
└─────────────────────────────────────────────────────────┘

1. VIEW (ProfileEdit.js)
   ↓
   User types new name: "John Doe Updated"
   User clicks "Save Changes"
   ↓
   
2. VIEW sends data to CONTROLLER
   ↓
   axios.put('/api/users/profile', {
     name: "John Doe Updated",
     username: "johndoe",
     phone: "+1234567890"
   })
   ↓
   
3. ROUTE (userRoutes.js) receives request
   ↓
   PUT /api/users/profile → updateUserProfile
   ↓
   
4. CONTROLLER (userController.js)
   ↓
   updateUserProfile function executes:
   - Gets user from database (uses MODEL)
   - Validates new data
   - Checks username uniqueness (uses MODEL)
   ↓
   
5. MODEL (userModel.js)
   ↓
   - user.name = "John Doe Updated"
   - await user.save()  ← Saves to MongoDB
   ↓
   
6. CONTROLLER sends response back
   ↓
   res.json({
     name: "John Doe Updated",
     username: "johndoe",
     ...
   })
   ↓
   
7. VIEW (ProfileEdit.js) receives response
   ↓
   - Shows success message
   - Redirects to ProfileView
   - ProfileView displays updated data
   ↓
   
✅ USER SEES UPDATED PROFILE!
```

---

## 📊 MVC Components Summary

### MODEL (Data)
```
📁 Location: backend/models/

Files:
└── userModel.js

Purpose:
- Define data structure (schema)
- Validate data
- Save to database
- Query database
- Data relationships

Technology:
- Mongoose (MongoDB ODM)
- MongoDB (Database)
```

---

### CONTROLLER (Logic)
```
📁 Location: backend/controllers/

Files:
└── userController.js

Functions:
├── authUser           (Login logic)
├── registerUser       (Signup logic)
├── getUserProfile     (Get profile data)
├── updateUserProfile  (Update profile logic)
└── other functions...

Purpose:
- Process requests from VIEW
- Validate input
- Call MODEL methods
- Apply business logic
- Format responses
- Handle errors

Technology:
- Express.js
- Node.js
```

---

### VIEW (User Interface)
```
📁 Location: frontend/src/components/

Files:
├── Login.js           (Login form)
├── Signup.js          (Signup form)
├── Dashboard.js       (Main dashboard)
└── dashboard/
    ├── ProfileView.js (Profile display)
    └── ProfileEdit.js (Profile edit form)

Purpose:
- Display data to user
- Capture user input
- Send requests to CONTROLLER
- Show success/error messages
- Navigate between pages

Technology:
- React.js
- JSX
- CSS
- Axios (HTTP requests)
```

---

## 🔗 How They Connect

### Routes Layer (Connector)
```
📁 Location: backend/routes/userRoutes.js
```

**Full Path:**
```
C:\Users\ASUS\Desktop\CSE470_Green_Planet\backend\routes\userRoutes.js
```

**Purpose:**
- Connects VIEW requests to CONTROLLER functions
- Defines API endpoints
- Applies middleware (authentication, file upload)

**Example:**
```javascript
// Routes connect VIEW to CONTROLLER

router.post('/login', authUser);
//    ↑ API endpoint    ↑ CONTROLLER function

router.get('/profile', protect, getUserProfile);
//    ↑ endpoint  ↑ middleware  ↑ CONTROLLER

router.put('/profile', protect, upload, updateUserProfile);
//    ↑ endpoint  ↑ auth  ↑ file  ↑ CONTROLLER
```

---

## 🎯 Complete MVC Mapping

| MVC Layer | Files in Your Project | What They Do |
|-----------|----------------------|--------------|
| **MODEL** | `backend/models/userModel.js` | Define user data structure, validate, save to MongoDB |
| **CONTROLLER** | `backend/controllers/userController.js` | Handle login, signup, get profile, update profile logic |
| **VIEW** | `frontend/src/components/Login.js`<br>`frontend/src/components/Signup.js`<br>`frontend/src/components/dashboard/ProfileView.js`<br>`frontend/src/components/dashboard/ProfileEdit.js` | Display forms, show data, capture input, send to controller |
| **ROUTES** | `backend/routes/userRoutes.js` | Connect VIEW requests to CONTROLLER functions |

---

## 📋 MVC in Action: Profile Feature

### **1. MODEL** (What data looks like)
```
File: backend/models/userModel.js

Defines:
- name: String
- username: String
- email: String
- phone: String
- address: String
- profilePicture: String
```

### **2. CONTROLLER** (What happens with data)
```
File: backend/controllers/userController.js

Functions:
- getUserProfile()     → Fetches user from database
- updateUserProfile()  → Updates user in database
```

### **3. VIEW** (What user sees)
```
Files: 
- frontend/src/components/dashboard/ProfileView.js
- frontend/src/components/dashboard/ProfileEdit.js

Shows:
- Profile information (read-only)
- Edit form (editable)
- Save button
- Success messages
```

---

## 🎨 Visual MVC Structure

```
┌───────────────────────────────────────────────┐
│            Your Application                   │
├───────────────────────────────────────────────┤
│                                               │
│  FRONTEND (VIEW)                              │
│  ├── Login.js                                 │
│  ├── Signup.js                                │
│  ├── Dashboard.js                             │
│  ├── ProfileView.js                           │
│  └── ProfileEdit.js                           │
│         ↓ (sends HTTP requests)               │
│         ↓                                     │
│  API Routes (/api/users/...)                  │
│         ↓                                     │
│  BACKEND                                      │
│  ├── ROUTES (userRoutes.js)                  │
│  │    ↓                                       │
│  ├── CONTROLLER (userController.js)          │
│  │    ↓                                       │
│  └── MODEL (userModel.js)                    │
│       ↓                                       │
│  DATABASE (MongoDB)                           │
│                                               │
└───────────────────────────────────────────────┘
```

---

## ✅ Summary

### Your MVC Architecture:

**MODEL (M):**
```
📁 backend/models/userModel.js
Purpose: Data structure, database operations
```

**VIEW (V):**
```
📁 frontend/src/components/
   ├── Login.js
   ├── Signup.js
   ├── Dashboard.js
   └── dashboard/
       ├── ProfileView.js
       └── ProfileEdit.js
Purpose: User interface, what user sees
```

**CONTROLLER (C):**
```
📁 backend/controllers/userController.js
Purpose: Business logic, data processing
```

**CONNECTOR:**
```
📁 backend/routes/userRoutes.js
Purpose: Connect VIEW to CONTROLLER
```

---

**This is a clean MVC architecture with clear separation of concerns!** 🏗️✨

Each layer has a specific responsibility:
- **MODEL** = Data
- **VIEW** = Display
- **CONTROLLER** = Logic

This makes your code organized, maintainable, and scalable! 🎯

