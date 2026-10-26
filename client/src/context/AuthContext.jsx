import React, { createContext, useContext, useState, useEffect } from 'react';

const DEMO_USERS = {
  seeker: {
    id: '44444444-4444-4444-a444-444444444444',
    name: 'Alex Chen',
    email: 'alex.chen@gmail.com',
    role: 'seeker',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    badge: 'Verified Renter'
  },
  landlord: {
    id: '11111111-1111-4111-a111-111111111111',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@baypropertymgmt.com',
    role: 'landlord',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    badge: 'Verified Property Manager'
  },
  moderator: {
    id: '33333333-3333-4333-a333-333333333333',
    name: 'Elena Rostova',
    email: 'elena.rostova@rentcheck.org',
    role: 'moderator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    badge: 'Compliance Lead'
  }
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('rentcheck_role') || 'seeker';
  });

  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.seeker;

  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      setCurrentRole(newRole);
      localStorage.setItem('rentcheck_role', newRole);
    }
  };

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      role: currentUser.role,
      switchRole,
      allRoles: Object.keys(DEMO_USERS),
      demoUsers: DEMO_USERS
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
