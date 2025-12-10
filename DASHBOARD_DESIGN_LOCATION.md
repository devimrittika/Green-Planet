# 📂 Dashboard Design - File Locations

## 🎨 All Dashboard Design Files

Your dashboard design is split across multiple files in the `frontend/src/components/` directory.

---

## 📁 Main Dashboard Structure

### Location: `frontend/src/components/`

```
frontend/src/components/
│
├── Dashboard.js           ← Main dashboard wrapper/router
├── Auth.css              ← Login/Signup styling
├── Login.js              ← Login page component
├── Signup.js             ← Signup page component
│
└── dashboard/            ← Dashboard sub-components folder
    ├── Sidebar.js        ← Left sidebar menu
    ├── Sidebar.css       ← Sidebar styling
    ├── TopNavbar.js      ← Top navigation bar
    ├── TopNavbar.css     ← Top navbar styling
    ├── DashboardHome.js  ← Dashboard home content
    ├── DashboardHome.css ← Home page styling
    ├── ProfileView.js    ← Profile display page
    ├── ProfileView.css   ← Profile view styling
    ├── ProfileEdit.js    ← Profile edit form
    ├── ProfileEdit.css   ← Profile edit styling
    ├── Dashboard.css     ← Overall dashboard layout styling
    └── Profile.css       ← Additional profile styling
```

---

## 🎯 Key Dashboard Design Files

### 1. **Main Dashboard Component**
**File:** `frontend/src/components/Dashboard.js`
```javascript
// This is the main dashboard wrapper
// Handles routing between different pages
// Contains: Sidebar + TopNavbar + Content Area
```

**What it does:**
- Wraps the entire dashboard
- Routes between Home, Profile, Profile Edit
- Manages active page state

---

### 2. **Sidebar (Left Menu)**
**Files:**
- `frontend/src/components/dashboard/Sidebar.js` (Component)
- `frontend/src/components/dashboard/Sidebar.css` (Styling)

**Contains:**
- Green Planet logo
- Menu items (Home, Profile, Orders, etc.)
- Icons for each menu item
- Active state highlighting

**Design Features:**
```css
- Fixed left sidebar
- Green theme (#4caf50)
- Icon + text layout
- Hover effects
- Active item highlighting
```

---

### 3. **Top Navigation Bar**
**Files:**
- `frontend/src/components/dashboard/TopNavbar.js` (Component)
- `frontend/src/components/dashboard/TopNavbar.css` (Styling)

**Contains:**
- Welcome message
- User name display
- Profile icon
- Logout button

**Design Features:**
```css
- Fixed top bar
- White background
- Shadow effect
- User profile section
```

---

### 4. **Dashboard Home Page**
**Files:**
- `frontend/src/components/dashboard/DashboardHome.js` (Component)
- `frontend/src/components/dashboard/DashboardHome.css` (Styling)

**Contains:**
- Welcome message
- Quick stats cards
- Dashboard overview
- User information display

**Design Features:**
```css
- Card-based layout
- Statistics display
- Green accent colors
- Responsive grid
```

---

### 5. **Profile View Page**
**Files:**
- `frontend/src/components/dashboard/ProfileView.js` (Component)
- `frontend/src/components/dashboard/ProfileView.css` (Styling)

**Contains:**
- Profile picture (circular)
- User information display
- Edit Profile button
- Information grid layout

**Design Features:**
```css
- Card design
- Green header gradient
- Circular profile picture
- 2-column grid layout
- Green accent borders
```

---

### 6. **Profile Edit Page**
**Files:**
- `frontend/src/components/dashboard/ProfileEdit.js` (Component)
- `frontend/src/components/dashboard/ProfileEdit.css` (Styling)

**Contains:**
- Edit form with all fields
- Profile picture upload
- Save/Cancel buttons
- Form validation

**Design Features:**
```css
- Form layout
- Input field styling
- Green buttons
- Disabled field styling
- Upload button design
```

---

### 7. **Overall Dashboard Layout**
**File:** `frontend/src/components/dashboard/Dashboard.css`

**Contains:**
- Dashboard grid layout (sidebar + main content)
- Container sizing
- Responsive breakpoints
- Color variables

**Design:**
```css
.dashboard-root {
  display: flex;
  min-height: 100vh;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
```

---

## 🎨 Design System Used

### Color Scheme:
```css
Primary Green:   #4caf50
Dark Green:      #388e3c
White:           #ffffff
Light Gray:      #f5f5f5
Text Dark:       #333333
Border Gray:     #e0e0e0
```

### Typography:
```css
Font Family:     System fonts (sans-serif)
Header Sizes:    1.8rem - 2rem
Body Text:       1rem
Small Text:      0.85rem - 0.95rem
```

### Spacing:
```css
Padding:         1rem, 1.5rem, 2rem
Margin:          1rem, 1.5rem, 2rem
Border Radius:   8px, 12px
```

### Layout:
```css
Sidebar Width:   250px (fixed)
Card Shadow:     0 2px 8px rgba(0, 0, 0, 0.1)
Grid Gap:        1.5rem, 2rem
```

---

## 📊 Component Hierarchy

```
App.js
  └── Dashboard.js (Main wrapper)
      ├── Sidebar.js (Left menu)
      │   └── Sidebar.css
      │
      ├── TopNavbar.js (Top bar)
      │   └── TopNavbar.css
      │
      └── Content Area (Dynamic)
          ├── DashboardHome.js
          │   └── DashboardHome.css
          │
          ├── ProfileView.js
          │   └── ProfileView.css
          │
          └── ProfileEdit.js
              └── ProfileEdit.css
```

---

## 🔍 Where to Find Each Design Element

### Want to change the Sidebar design?
```
📁 frontend/src/components/dashboard/
   ├── Sidebar.js      ← Component logic & content
   └── Sidebar.css     ← All sidebar styling
```

### Want to change the Top navbar?
```
📁 frontend/src/components/dashboard/
   ├── TopNavbar.js    ← Component logic
   └── TopNavbar.css   ← Top bar styling
```

### Want to change the Profile pages?
```
📁 frontend/src/components/dashboard/
   ├── ProfileView.js   ← Profile display
   ├── ProfileView.css  ← View page styling
   ├── ProfileEdit.js   ← Profile editing
   └── ProfileEdit.css  ← Edit form styling
```

### Want to change the Dashboard home?
```
📁 frontend/src/components/dashboard/
   ├── DashboardHome.js   ← Home page content
   └── DashboardHome.css  ← Home page styling
```

### Want to change overall layout?
```
📁 frontend/src/components/dashboard/
   └── Dashboard.css      ← Grid layout, containers
```

---

## 📝 Quick Reference

| Element | Component File | Style File |
|---------|---------------|------------|
| **Main Dashboard** | `Dashboard.js` | `dashboard/Dashboard.css` |
| **Sidebar Menu** | `dashboard/Sidebar.js` | `dashboard/Sidebar.css` |
| **Top Navbar** | `dashboard/TopNavbar.js` | `dashboard/TopNavbar.css` |
| **Home Page** | `dashboard/DashboardHome.js` | `dashboard/DashboardHome.css` |
| **Profile View** | `dashboard/ProfileView.js` | `dashboard/ProfileView.css` |
| **Profile Edit** | `dashboard/ProfileEdit.js` | `dashboard/ProfileEdit.css` |

---

## 🎨 Design Examples From Your Files

### Sidebar Design (Sidebar.css):
```css
- Green logo section
- Menu items with icons
- Hover effects (background changes)
- Active state (darker green)
- Smooth transitions
```

### Profile View (ProfileView.css):
```css
- White card with shadow
- Green gradient header
- Circular profile picture (200px)
- 2-column information grid
- Green accent borders on values
```

### Profile Edit (ProfileEdit.css):
```css
- Form with grid layout
- Styled input fields
- Green buttons
- Disabled email field (gray)
- File upload styling
```

---

## 💡 How to Modify Dashboard Design

### To Change Colors:
1. Open the `.css` file you want to modify
2. Find color codes (e.g., `#4caf50`)
3. Replace with your preferred color

### To Change Layout:
1. Open `dashboard/Dashboard.css`
2. Modify flexbox/grid properties
3. Adjust sidebar width, spacing, etc.

### To Change Components:
1. Open the `.js` file (e.g., `Sidebar.js`)
2. Modify JSX structure
3. Update corresponding `.css` file

### To Add New Pages:
1. Create new `.js` and `.css` files in `dashboard/` folder
2. Import in `Dashboard.js`
3. Add routing logic

---

## 📂 Complete File Path Summary

### All Dashboard Design Files:

```
C:\Users\ASUS\Desktop\CSE470_Green_Planet\frontend\src\components\

Main Dashboard:
├── Dashboard.js                      ← Main wrapper

Dashboard Components (in dashboard/ folder):
├── dashboard\Dashboard.css           ← Overall layout
├── dashboard\Sidebar.js              ← Left menu component
├── dashboard\Sidebar.css             ← Sidebar styling
├── dashboard\TopNavbar.js            ← Top bar component
├── dashboard\TopNavbar.css           ← Navbar styling
├── dashboard\DashboardHome.js        ← Home page component
├── dashboard\DashboardHome.css       ← Home styling
├── dashboard\ProfileView.js          ← Profile display
├── dashboard\ProfileView.css         ← Profile view styling
├── dashboard\ProfileEdit.js          ← Profile edit form
├── dashboard\ProfileEdit.css         ← Edit form styling
└── dashboard\Profile.css             ← Additional profile styles
```

---

## 🚀 Summary

**Dashboard design is in:**
```
frontend/src/components/Dashboard.js
frontend/src/components/dashboard/
```

**Each component has:**
- `.js` file (logic & structure)
- `.css` file (styling)

**Main design files:**
1. `Sidebar.js` + `Sidebar.css` = Left menu
2. `TopNavbar.js` + `TopNavbar.css` = Top bar
3. `DashboardHome.js` + `DashboardHome.css` = Home page
4. `ProfileView.js` + `ProfileView.css` = Profile display
5. `ProfileEdit.js` + `ProfileEdit.css` = Profile editing
6. `Dashboard.css` = Overall layout

---

**All files are in:**
```
📁 C:\Users\ASUS\Desktop\CSE470_Green_Planet\frontend\src\components\
```

**🎨 Your dashboard uses a beautiful green theme with modern card-based design!**

