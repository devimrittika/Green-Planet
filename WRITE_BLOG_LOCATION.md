# Write Blog Feature - Complete File Locations

## 📍 Where "Write Blog" is Handled

### **FRONTEND - User Interface**

#### 1. **Blog Form Component** (Main UI)
📄 **File:** `frontend/src/components/dashboard/BlogForm.js`
- **Purpose:** The actual form where users write blogs
- **Fields:** 
  - Title (text input)
  - Type (dropdown: Plant Care, Gardening Tips, etc.)
  - Writing/Blog (textarea)
- **Action:** Submits to `POST /api/blogs`
- **Route:** `/dashboard/write-blog`

#### 2. **Blog Form Styling**
📄 **File:** `frontend/src/components/dashboard/BlogForm.css`
- **Purpose:** Styling for the blog form
- **Theme:** Green Planet theme, simple and clean

#### 3. **Navigation to Write Blog**
📄 **File:** `frontend/src/App.js`
- **Route:** `<Route path="write-blog" element={<BlogFormRoute />} />`
- **Access:** Navigate to `/dashboard/write-blog`

#### 4. **Dashboard Home - Quick Action Button**
📄 **File:** `frontend/src/components/dashboard/DashboardHome.js`
- **Location:** Line ~95-98
- **Button:** "Write Blog" quick action
- **Action:** Navigates to `/dashboard/write-blog`

---

### **BACKEND - Server & Database**

#### 1. **Blog Model** (Database Schema)
📄 **File:** `backend/models/blogModel.js`
- **Purpose:** Defines the blog document structure in MongoDB
- **Fields:**
  - `user`: ObjectId (ref to User)
  - `title`: String
  - `topic`: Enum (Plant Care, Gardening Tips, etc.)
  - `content`: String
  - `image`: String (optional)
  - `visibility`: Enum (Public, Community Only)
  - `likes`: Number
  - `views`: Number

#### 2. **Blog Controller** (Business Logic)
📄 **File:** `backend/controllers/blogController.js`
- **Function:** `createBlog()` - Line 8-76
- **Purpose:** 
  - Validates blog data
  - Creates blog in database
  - Updates user's activities array
  - Returns blog data with activity/highlight info
- **Route Handler:** Handles `POST /api/blogs`

#### 3. **Blog Routes** (API Endpoints)
📄 **File:** `backend/routes/blogRoutes.js`
- **Route:** `POST /` → `createBlog` controller (Line 17)
- **Middleware:** 
  - `protect` - JWT authentication
  - `upload.single('image')` - Optional image upload

#### 4. **Backend Main Index**
📄 **File:** `backend/index.js`
- **Line:** `app.use('/api/blogs', blogRoutes);`
- **Purpose:** Registers blog routes

---

## 🔄 Complete Flow

### User Journey:
1. **User clicks "Write Blog"** 
   - Location: Dashboard Home quick actions
   - File: `DashboardHome.js`

2. **Navigates to Write Blog page**
   - Route: `/dashboard/write-blog`
   - File: `App.js` → `BlogFormRoute` → `BlogForm.js`

3. **User fills form**
   - Title, Type, Writing/Blog
   - File: `BlogForm.js`

4. **Submits form**
   - File: `BlogForm.js` → `handleSubmit()`
   - API Call: `POST /api/blogs`
   - Payload: FormData with title, topic, content

5. **Backend processes**
   - Route: `backend/routes/blogRoutes.js`
   - Controller: `backend/controllers/blogController.js` → `createBlog()`
   - Model: `backend/models/blogModel.js`

6. **Blog saved to MongoDB**
   - Collection: `blogs`
   - User's activities updated
   - Response returned

7. **Frontend receives success**
   - Shows success message
   - Updates dashboard (Community Highlights)
   - Redirects to dashboard

---

## 📋 File Summary

### Frontend Files:
1. ✅ `frontend/src/components/dashboard/BlogForm.js` - Main form component
2. ✅ `frontend/src/components/dashboard/BlogForm.css` - Styling
3. ✅ `frontend/src/App.js` - Route definition (Line 118, 185-188)
4. ✅ `frontend/src/components/dashboard/DashboardHome.js` - Navigation button

### Backend Files:
1. ✅ `backend/models/blogModel.js` - Database schema
2. ✅ `backend/controllers/blogController.js` - Business logic
3. ✅ `backend/routes/blogRoutes.js` - API routes
4. ✅ `backend/index.js` - Route registration

---

## 🎯 Key Functions

### Frontend:
- **BlogForm.js** → `handleSubmit()` - Submits blog data

### Backend:
- **blogController.js** → `createBlog()` - Creates blog, updates user activities
- **blogController.js** → `getCommunityHighlights()` - Gets blogs for dashboard
- **blogController.js** → `getMyBlogs()` - Gets user's blogs

---

## 🔗 API Endpoints

1. **POST** `/api/blogs` - Create blog (Protected)
2. **GET** `/api/blogs` - Get all public blogs
3. **GET** `/api/blogs/my` - Get user's blogs (Protected)
4. **GET** `/api/blogs/highlights` - Get community highlights
5. **GET** `/api/blogs/:id` - Get single blog
6. **PUT** `/api/blogs/:id` - Update blog (Protected)
7. **DELETE** `/api/blogs/:id` - Delete blog (Protected)

---

**That's where the "Write Blog" feature is fully implemented!** ✅


