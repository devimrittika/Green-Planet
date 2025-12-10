# Profile Management System - Setup Guide

## Overview
This project now includes a complete user profile management system with read and edit capabilities, including profile picture upload functionality.

## Features Implemented

### Backend Features
1. **Enhanced User Model** (`backend/models/userModel.js`)
   - Added fields: `username`, `phone`, `address`, `profilePicture`
   - Username is unique and optional
   - Email cannot be changed (read-only)
   - Profile picture stored as file path

2. **File Upload Support**
   - Multer middleware for handling file uploads
   - Images only (JPG, JPEG, PNG, GIF, WEBP)
   - 5MB file size limit
   - Uploads stored in `backend/uploads/` directory
   - Static file serving enabled for uploaded images

3. **API Endpoints**
   - `GET /api/users/profile` - Fetch user profile data
   - `PUT /api/users/profile` - Update profile with file upload support

4. **Validation**
   - Username uniqueness check
   - Email is not editable
   - Phone and address are optional fields
   - Image file type and size validation

### Frontend Features
1. **Profile View Page** (`ProfileView.js`)
   - Display full name
   - Display username
   - Display email (read-only)
   - Display phone number
   - Display address
   - Display profile picture
   - Display total orders count
   - "Edit Profile" button to navigate to edit page

2. **Profile Edit Page** (`ProfileEdit.js`)
   - Editable form for name, username, phone, address
   - Email field is disabled (non-editable)
   - Profile picture upload with preview
   - File validation (type and size)
   - Real-time error messages
   - Success confirmation
   - Cancel and Save buttons
   - Auto-redirect to profile view after successful save

3. **Navigation**
   - Integrated with Dashboard sidebar
   - Click "Profile" to view profile
   - Click "Edit Profile" to edit
   - Active state highlighting in sidebar

## Installation & Setup

### Backend Setup
```bash
cd backend
npm install
```

Make sure your `.env` file contains:
```
MONGODB_URI=mongodb://localhost:27017/green_planet
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Database
The MongoDB database will automatically create the new fields when you first update a profile. No migration needed.

### Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## Usage

1. **Login to your account**
   - Navigate to http://localhost:3000
   - Login with your credentials

2. **View Your Profile**
   - Click on "Profile" in the dashboard sidebar
   - See all your profile information
   - View total orders count

3. **Edit Your Profile**
   - Click "Edit Profile" button
   - Update your information:
     - Full Name (required)
     - Username (optional, must be unique)
     - Phone Number (optional)
     - Address (optional)
     - Profile Picture (optional, max 5MB)
   - Click "Save Changes"
   - Redirected back to profile view with success message

## API Documentation

### Get User Profile
```
GET /api/users/profile
Headers: Authorization: Bearer <token>

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "profilePicture": "/uploads/profilePicture-1234567890.jpg",
  "totalOrders": 5,
  "isAdmin": false
}
```

### Update User Profile
```
PUT /api/users/profile
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body (FormData):
  - name: string (required)
  - username: string (optional)
  - phone: string (optional)
  - address: string (optional)
  - profilePicture: file (optional)

Response:
{
  "_id": "user_id",
  "name": "John Doe Updated",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "456 New St, City, Country",
  "profilePicture": "/uploads/profilePicture-1234567890.jpg",
  "isAdmin": false,
  "token": "new_jwt_token"
}
```

## File Structure

```
backend/
├── controllers/
│   └── userController.js (updated with profile logic)
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js (NEW - multer config)
├── models/
│   └── userModel.js (updated with new fields)
├── routes/
│   └── userRoutes.js (updated with upload middleware)
├── uploads/ (NEW - stores uploaded images)
└── index.js (updated to serve static files)

frontend/
└── src/
    └── components/
        ├── Dashboard.js (updated with routing)
        └── dashboard/
            ├── ProfileView.js (NEW - read-only view)
            ├── ProfileView.css (NEW)
            ├── ProfileEdit.js (NEW - edit form)
            ├── ProfileEdit.css (NEW)
            ├── Sidebar.js (updated with navigation)
            └── Sidebar.css (updated with active state)
```

## Notes

- Email cannot be changed for security reasons
- Username must be unique across all users
- Profile pictures are stored in the `backend/uploads/` folder
- Maximum file size for profile pictures is 5MB
- Supported image formats: JPG, JPEG, PNG, GIF, WEBP
- The `totalOrders` field is currently set to 0 (placeholder for future order integration)

## Future Enhancements

1. Connect `totalOrders` to actual Order model when implemented
2. Add ability to crop/resize images before upload
3. Add password change functionality in profile
4. Add email verification process for email changes
5. Add profile picture removal option
6. Add loading states for image uploads
7. Implement image optimization on backend

## Troubleshooting

**Issue: Images not displaying**
- Check if backend is serving static files correctly
- Verify the `uploads/` folder exists
- Check file permissions on the uploads folder

**Issue: "Username already taken" error**
- Try a different username
- Usernames must be unique across the platform

**Issue: File upload fails**
- Check file size (must be under 5MB)
- Verify file type (only images allowed)
- Check backend console for detailed error messages

**Issue: Profile not loading**
- Verify JWT token is valid and stored in localStorage
- Check if user is authenticated
- Verify backend is running on port 5000

