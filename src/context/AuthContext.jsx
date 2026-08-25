import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Load initial user from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('careerforge_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('careerforge_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('careerforge_auth_user');
    }
  }, [user]);

  // Login Handler (backend only)
  const login = async (email, password, expectedRole = null) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await response.json();
      if (response.ok && data.user) {
        const fullUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          rollNo: data.user.rollNo,
          branch: data.user.branch,
          companyName: data.user.companyName,
          title: data.user.title,
          cgpa: data.user.cgpa || 8.5,
          atsScore: data.user.atsScore || 85,
          token: data.token,
          initials: data.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US',
          avatarBg: data.user.role === 'student' ? 'bg-indigo-600' : data.user.role === 'company' ? 'bg-emerald-600' : 'bg-rose-600'
        };
        if (expectedRole && fullUser.role !== expectedRole) {
          return { success: false, message: `This account is registered as a ${fullUser.role.toUpperCase()}, not a ${expectedRole.toUpperCase()}.` };
        }
        setUser(fullUser);
        return { success: true, user: fullUser };
      }
      return { success: false, message: data.message || 'Invalid email or password.' };
    } catch (error) {
      return { success: false, message: 'Unable to connect to the server. Please try again.' };
    }
  };

  // Register Handler (backend only)
  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name.trim(),
          email: userData.email.trim(),
          password: userData.password,
          role: userData.role,
          rollNo: userData.rollNo,
          branch: userData.branch,
          companyName: userData.companyName,
          accessCode: userData.accessCode
        })
      });
      const data = await response.json();
      if (response.ok && data.user) {
        const newUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          rollNo: data.user.rollNo,
          branch: data.user.branch,
          companyName: data.user.companyName,
          title: data.user.title,
          cgpa: data.user.cgpa || 8.5,
          atsScore: data.user.atsScore || 85,
          token: data.token,
          initials: data.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US',
          avatarBg: data.user.role === 'student' ? 'bg-indigo-600' : data.user.role === 'company' ? 'bg-emerald-600' : 'bg-rose-600'
        };
        setUser(newUser);
        return { success: true, user: newUser };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch (error) {
      return { success: false, message: 'Unable to connect to the server. Please try again.' };
    }
  };

  // Logout Handler
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
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
