import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Listen for user update events and logout events
  useEffect(() => {
    const handleUserUpdate = () => {
      // Reload user from localStorage when profile is updated
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const updatedUser = JSON.parse(userInfo);
          setUser(updatedUser);
        } catch (error) {
          console.error('Error parsing user info on update:', error);
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    const handleUserLogout = () => {
      // Clear user state on logout
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('userLoggedOut', handleUserLogout);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('userLoggedOut', handleUserLogout);
    };
  }, []);

  const loadUser = async () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        // Fetch fresh user data
        if (parsedUser.token) {
          try {
            const response = await fetch('/api/users/profile', {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
              },
            });
            if (response.ok) {
              const freshUser = await response.json();
              const updatedUser = {
                ...parsedUser,
                ...freshUser,
                token: parsedUser.token,
              };
              setUser(updatedUser);
              localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('userInfo');
              setUser(null);
            }
          } catch (error) {
            console.error('Error loading user:', error);
            // On error, still use parsed user but don't merge with old data
            setUser(parsedUser);
          }
        } else {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      localStorage.removeItem('userInfo');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    // Clear any old data first, then set only the new user data
    const newUser = {
      _id: updatedUserData._id,
      name: updatedUserData.name || '',
      email: updatedUserData.email || '',
      username: updatedUserData.username || '',
      phone: updatedUserData.phone || '',
      address: updatedUserData.address || '',
      profilePicture: updatedUserData.profilePicture || '',
      isAdmin: updatedUserData.isAdmin || false,
      token: updatedUserData.token,
    };
    
    setUser(newUser);
    localStorage.setItem('userInfo', JSON.stringify(newUser));
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: newUser }));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, loadUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
