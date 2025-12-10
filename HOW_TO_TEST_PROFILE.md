# 🧪 How to Test Your Profile Feature - Step by Step

## ✅ Current Status

```
✅ Backend Running: http://localhost:5000
✅ MongoDB Connected: localhost
✅ Frontend Available: http://localhost:3000
✅ Profile API: Working
```

---

## 📱 Quick Test Guide (5 Minutes)

### Step 1: Open the Application
```
1. Open Chrome/Firefox/Edge
2. Go to: http://localhost:3000
3. You should see the Green Planet login page
```

### Step 2: Login or Register
```
Option A - If you have an account:
   - Enter your email and password
   - Click "Login"
   
Option B - If you're new:
   - Click "Sign Up"
   - Enter: Name, Email, Password
   - Click "Register"
   - You'll be automatically logged in
```

### Step 3: Access Profile
```
1. After login, you'll see the Dashboard
2. Look at the left sidebar
3. Find "Profile" option (with 👤 user icon)
4. Click on "Profile"
```

### Step 4: View Your Current Profile
```
You'll see a page showing:
┌─────────────────────────────────────┐
│ My Profile      [Edit Profile] btn  │
├─────────────────────────────────────┤
│        [Your Profile Picture]        │
│                                      │
│ Full Name: [Your Name]               │
│ Username: [Not set or your username] │
│ Email: [your@email.com]              │
│ Phone: [Not provided or your phone]  │
│ Address: [Not provided or address]   │
│ Total Orders: 0                      │
└─────────────────────────────────────┘
```

### Step 5: Click "Edit Profile"
```
1. Click the green "Edit Profile" button at top right
2. You'll see the Edit Profile form
3. All your current data is pre-filled
```

### Step 6: Update Your Information
```
Try updating these fields:

✏️ Full Name:
   - Change to something like "John Doe Updated"
   
✏️ Username:
   - Add a username like "johndoe123"
   - Must be at least 3 characters
   - Must be unique
   
✏️ Phone Number:
   - Add something like "+1234567890"
   
✏️ Address:
   - Add something like "123 Main Street, New York"
   
🖼️ Profile Picture:
   - Click "Choose Photo"
   - Select an image from your computer
   - Must be under 5MB
   - JPG, PNG, GIF, or WEBP
   - Preview will show immediately
   
❌ Email:
   - Notice this field is GRAYED OUT
   - You CANNOT change it (as required)
```

### Step 7: Save Changes
```
1. Click the green "Save Changes" button
2. Wait a moment (button shows "Saving...")
3. You'll see a success message:
   ✅ "Profile updated successfully!"
4. After 2 seconds, you'll automatically go back to Profile View
```

### Step 8: Verify Changes
```
On the Profile View page, you should now see:
✅ Your updated name
✅ Your new username
✅ Your phone number
✅ Your address
✅ Your profile picture (if you uploaded one)
✅ Email unchanged (as it should be)
```

### Step 9: Refresh to Confirm Database Save
```
1. Press F5 or click refresh in your browser
2. All your changes are still there!
3. This proves they're saved in the database ✅
```

### Step 10: Verify in Database (Optional)
```
Open a terminal and run:

> mongosh
> use green_planet
> db.users.findOne({ email: "your@email.com" })

You'll see all your updated data in MongoDB!
```

---

## 🎯 What to Test

### ✅ Test 1: Update Name
- Change name → Save → See new name ✅

### ✅ Test 2: Add Username
- Enter "testuser" → Save → See username ✅

### ✅ Test 3: Username Too Short
- Enter "ab" (2 chars) → Save
- Should show error: "Username must be at least 3 characters" ✅

### ✅ Test 4: Upload Picture
- Choose photo → See preview → Save
- Picture appears in profile ✅

### ✅ Test 5: Update Phone & Address
- Add phone and address → Save
- Both appear in profile ✅

### ✅ Test 6: Email Protected
- Try to click email field
- It's disabled (can't edit) ✅

### ✅ Test 7: Leave Optional Fields Empty
- Don't fill username, phone, address → Save
- Should work fine (they're optional) ✅

### ✅ Test 8: Cancel Button
- Make changes → Click "Cancel"
- Returns to profile without saving ✅

---

## 🖼️ Visual Flow

```
Login Page
   ↓
Dashboard (with sidebar)
   ↓
Click "Profile" in sidebar
   ↓
Profile View Page
   ↓
Click "Edit Profile" button
   ↓
Edit Profile Form
   ↓
Make changes
   ↓
Click "Save Changes"
   ↓
✅ Success message
   ↓
Auto-redirect (2 sec)
   ↓
Profile View (with updates)
```

---

## 📸 Expected Screenshots

### Profile View:
- Clean white card
- Green header with "My Profile"
- Profile picture in center (circle)
- Information in grid layout
- Green "Edit Profile" button

### Edit Profile:
- Green header with "Edit Profile"
- Back button (← Back to Profile)
- Profile picture preview with "Choose Photo" button
- Form with all fields
- Email field grayed out
- Green "Save Changes" button
- Gray "Cancel" button

---

## ✅ Success Indicators

**You'll know it's working when:**

1. ✅ Form loads with your current data
2. ✅ You can type in all fields (except email)
3. ✅ Picture preview works
4. ✅ Success message appears after save
5. ✅ Changes appear in Profile View
6. ✅ Changes persist after page refresh
7. ✅ No errors in browser console (F12)

---

## 🐛 If Something Doesn't Work

### "Cannot read profile"
→ Make sure you're logged in
→ Check token in localStorage (F12 → Application → Local Storage)

### "Failed to update profile"
→ Check backend is running (should be on port 5000)
→ Check MongoDB is running

### "Username already taken"
→ Someone else is using that username
→ Try a different one

### Picture not uploading
→ Check file size (must be < 5MB)
→ Check file type (must be image)

### Changes don't save
→ Check browser console (F12) for errors
→ Make sure backend is connected to MongoDB
→ Check backend terminal for error messages

---

## 🎬 Quick Video-Style Steps

```
1. 🌐 Open http://localhost:3000
2. 🔐 Login with your account
3. 👤 Click "Profile" in sidebar
4. ✏️ Click "Edit Profile"
5. 📝 Update name to "Test User"
6. 👔 Add username "testuser123"
7. 📞 Add phone "+1234567890"
8. 🏠 Add address "123 Test St"
9. 🖼️ Upload a profile picture
10. 💾 Click "Save Changes"
11. ✅ See success message
12. 👁️ View updated profile
13. 🔄 Refresh page - changes still there!
```

---

## 📊 Database Verification

**Check in MongoDB:**

```bash
# Open MongoDB shell
mongosh

# Switch to database
use green_planet

# View all users
db.users.find()

# Find your user
db.users.findOne({ email: "your@email.com" })

# You should see:
{
  _id: ObjectId("..."),
  name: "Test User",              // ← Your updated name
  username: "testuser123",        // ← Your new username
  email: "your@email.com",        // ← Unchanged
  phone: "+1234567890",           // ← Your new phone
  address: "123 Test St",         // ← Your new address
  profilePicture: "/uploads/...", // ← Your picture path
  updatedAt: "2024-12-02T..."     // ← Recent timestamp
}
```

---

## 🎉 Expected Result

After completing all tests, you should have:

✅ A fully updated profile
✅ All changes visible in the UI
✅ All changes saved in MongoDB
✅ Profile picture uploaded and displaying
✅ Username set and unique
✅ Email protected (unchanged)
✅ Phone and address updated
✅ No errors or crashes

---

## 🚀 READY TO TEST!

**Your Edit Profile feature is 100% functional and ready!**

Just follow the steps above and you'll see:
- ✅ Form works smoothly
- ✅ Data saves to database
- ✅ Changes appear immediately
- ✅ Everything persists

**Start testing now at http://localhost:3000!** 🌱

---

*If you encounter any issues, check `PROFILE_FUNCTIONALITY_STATUS.md` for detailed troubleshooting.*

