import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProfileView from './components/dashboard/ProfileView';
import ProfileEdit from './components/dashboard/ProfileEdit';
import MyProfile from './components/dashboard/MyProfile';
import MyBlogs from './components/dashboard/MyBlogs';
import MyDonations from './components/dashboard/MyDonations';
import MySwaps from './components/dashboard/MySwaps';
import MyListings from './components/dashboard/MyListings';
import ReadBlog from './components/dashboard/ReadBlog';
import DonatePlant from './components/dashboard/DonatePlant';
import SwapPlant from './components/dashboard/SwapPlant';
import AddPlantForSale from './components/dashboard/AddPlantForSale';
import BlogForm from './components/dashboard/BlogForm';
import TrackOrder from './components/dashboard/TrackOrder';
import Marketplace from './components/dashboard/Marketplace';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

function AppRoutes() {
  const { user, updateUser } = useUser();

  function LoginWrapper() {
    const navigate = useNavigate();
    const { updateUser } = useUser();
    
    return (
      <Login
        onLogin={(data) => {
          // Login component already clears localStorage
          updateUser(data);
          navigate('/dashboard');
        }}
      />
    );
  }

  function SignupWrapper() {
    const navigate = useNavigate();
    const { updateUser } = useUser();
    
    return (
      <Signup
        onSignup={(data) => {
          // Data is already cleared in Signup component
          // Just update and navigate
          updateUser(data);
          navigate('/dashboard');
        }}
      />
    );
  }

  function DashboardWrapper() {
    const { user, loading } = useUser();
    const currentUser = user || (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null);

    if (loading) {
      return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    return <DashboardLayout user={currentUser} />;
  }

  return (
    <>
      {!window.location.pathname.startsWith('/dashboard') && (
        <nav className="main-nav">
          <div className="nav-logo">Green Planet</div>
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomeRoute />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="profile" element={<ProfileViewRoute />} />
          <Route path="edit-profile" element={<ProfileEditRoute />} />
          <Route path="my-blogs" element={<MyBlogs />} />
          <Route path="my-donations" element={<MyDonations />} />
          <Route path="my-swaps" element={<MySwaps />} />
          <Route path="my-listings" element={<MyListings />} />
          <Route path="read-blog" element={<ReadBlog />} />
          <Route path="donate" element={<DonatePlantRoute />} />
          <Route path="swap" element={<SwapPlantRoute />} />
          <Route path="sell" element={<AddPlantForSaleRoute />} />
          <Route path="write-blog" element={<BlogFormRoute />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="wishlist" element={<WishlistRoute />} />
          <Route path="my-orders" element={<MyOrdersRoute />} />
          <Route path="settings" element={<SettingsRoute />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

// Route wrapper components
function DashboardHomeRoute() {
  const context = useOutletContext();
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <DashboardHome
      user={user}
      onNavigate={(page) => {
        const routes = {
          'AddPlantForSale': '/dashboard/sell',
          'DonatePlant': '/dashboard/donate',
          'SwapPlant': '/dashboard/swap',
          'WriteBlog': '/dashboard/write-blog',
        };
        if (routes[page]) navigate(routes[page]);
      }}
      activities={context?.activities || []}
      recommendedPlants={context?.recommendedPlants || []}
      communityHighlights={context?.communityHighlights || []}
      onRefresh={context?.fetchDashboardData}
    />
  );
}

function ProfileViewRoute() {
  const navigate = useNavigate();
  return <ProfileView onEditClick={() => navigate('/dashboard/edit-profile')} />;
}

function ProfileEditRoute() {
  const navigate = useNavigate();
  return <ProfileEdit onBackClick={() => navigate('/dashboard/profile')} />;
}

function DonatePlantRoute() {
  const navigate = useNavigate();
  const context = useOutletContext();
  return <DonatePlant onBack={() => navigate('/dashboard')} onDonationSuccess={context?.onDonationSuccess} />;
}

function SwapPlantRoute() {
  const navigate = useNavigate();
  const context = useOutletContext();
  return <SwapPlant onBack={() => navigate('/dashboard')} onSwapSuccess={context?.onSwapSuccess} />;
}

function AddPlantForSaleRoute() {
  const navigate = useNavigate();
  const context = useOutletContext();
  return <AddPlantForSale onBack={() => navigate('/dashboard')} onSaleSuccess={context?.onSaleSuccess} />;
}

function BlogFormRoute() {
  const navigate = useNavigate();
  const context = useOutletContext();
  return <BlogForm onBack={() => navigate('/dashboard')} onBlogSuccess={context?.onBlogSuccess} />;
}

function WishlistRoute() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Wishlist</h1>
      <p>Your wishlist feature coming soon!</p>
    </div>
  );
}

function MyOrdersRoute() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Orders</h1>
      <p>Your orders feature coming soon!</p>
    </div>
  );
}

function SettingsRoute() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Settings</h1>
      <p>Settings feature coming soon!</p>
    </div>
  );
}

export default App;
