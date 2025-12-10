import React, { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import TopNavbar from './dashboard/TopNavbar';
import DashboardHome from './dashboard/DashboardHome';
import ProfileView from './dashboard/ProfileView';
import ProfileEdit from './dashboard/ProfileEdit';
import DonatePlant from './dashboard/DonatePlant';
import SwapPlant from './dashboard/SwapPlant';
import AddPlantForSale from './dashboard/AddPlantForSale';
import BlogForm from './dashboard/BlogForm';
import './dashboard/Dashboard.css';

const Dashboard = ({ user }) => {
  const [activePage, setActivePage] = useState('Home');
  const [activities, setActivities] = useState([]);
  const [recommendedPlants, setRecommendedPlants] = useState([]);
  const [communityHighlights, setCommunityHighlights] = useState([]);

  // Fetch activities, recommended plants, and community highlights on mount
  useEffect(() => {
    fetchActivities();
    fetchRecommendedPlants();
    fetchCommunityHighlights();
  }, []);

  const fetchActivities = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) return;

      const response = await fetch('/api/donations/activities', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchRecommendedPlants = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) return;

      const response = await fetch('/api/swaps/recommended', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendedPlants(data);
      }
    } catch (error) {
      console.error('Error fetching recommended plants:', error);
    }
  };

  const fetchCommunityHighlights = async () => {
    try {
      const response = await fetch('/api/blogs/highlights');

      if (response.ok) {
        const data = await response.json();
        setCommunityHighlights(data);
      }
    } catch (error) {
      console.error('Error fetching community highlights:', error);
    }
  };

  const handleDonationSuccess = (newActivity) => {
    // Add new activity to the top of the list
    setActivities(prev => [{
      ...newActivity,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }, ...prev]);
  };

  const handleSwapSuccess = ({ activity, recommendedPlant }) => {
    // Add new activity to the top of the list
    setActivities(prev => [{
      ...activity,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }, ...prev]);

    // Add new recommended plant to the top of the list (avoid duplicates)
    if (recommendedPlant) {
      setRecommendedPlants(prev => {
        const exists = prev.some(
          p => p.plantName.toLowerCase() === recommendedPlant.plantName.toLowerCase()
        );
        if (exists) return prev;
        return [{
          ...recommendedPlant,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }, ...prev];
      });
    }
  };

  const handleSaleSuccess = ({ activity }) => {
    // Add new activity to the top of the list
    setActivities(prev => [{
      ...activity,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }, ...prev]);
  };

  const handleBlogSuccess = ({ activity, communityHighlight }) => {
    // Add new activity to the top of the list
    if (activity) {
      setActivities(prev => [{
        ...activity,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }, ...prev]);
    }

    // Add new community highlight to the top of the list
    if (communityHighlight) {
      setCommunityHighlights(prev => [{
        ...communityHighlight,
        _id: Date.now().toString(),
        type: 'blog',
        createdAt: new Date().toISOString(),
      }, ...prev]);
    }
  };

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Home':
        return (
          <DashboardHome 
            user={user} 
            onNavigate={handleNavigate}
            activities={activities}
            recommendedPlants={recommendedPlants}
            communityHighlights={communityHighlights}
          />
        );
      case 'Profile':
        return <ProfileView onEditClick={() => setActivePage('ProfileEdit')} />;
      case 'ProfileEdit':
        return <ProfileEdit onBackClick={() => setActivePage('Profile')} />;
      case 'DonatePlant':
        return (
          <DonatePlant 
            onBack={() => setActivePage('Home')}
            onDonationSuccess={handleDonationSuccess}
          />
        );
      case 'SwapPlant':
        return (
          <SwapPlant 
            onBack={() => setActivePage('Home')}
            onSwapSuccess={handleSwapSuccess}
          />
        );
      case 'AddPlantForSale':
        return (
          <AddPlantForSale 
            onBack={() => setActivePage('Home')}
            onSaleSuccess={handleSaleSuccess}
          />
        );
      case 'WriteBlog':
        return (
          <BlogForm 
            onBack={() => setActivePage('Home')}
            onBlogSuccess={handleBlogSuccess}
          />
        );
      default:
        return (
          <DashboardHome 
            user={user} 
            onNavigate={handleNavigate}
            activities={activities}
            recommendedPlants={recommendedPlants}
            communityHighlights={communityHighlights}
          />
        );
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="dashboard-main">
        <TopNavbar user={user} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
