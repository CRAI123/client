import React, { createContext, useState, useEffect, useContext } from 'react';

// 创建认证上下文
export const AuthContext = createContext();

// 认证上下文提供者组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化时从localStorage加载用户信息
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('加载用户信息时出错:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);
  
  // 更新用户信息到localStorage
  const updateUserStorage = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  // 登录函数
  const login = (userData) => {
    // 存储用户信息到localStorage（不包含密码）
    const { password, ...userInfo } = userData;
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    setCurrentUser(userInfo);
    return true;
  };

  // 注册函数
  const register = (userData) => {
    // 从localStorage获取现有用户数据
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === userData.username)) {
      return { success: false, message: '用户名已存在' };
    }
    
    // 检查邮箱是否已存在
    if (users.some(user => user.email === userData.email)) {
      return { success: false, message: '邮箱已被注册' };
    }
    
    // 创建新用户
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    
    // 添加到用户列表并保存
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true };
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // 验证用户登录凭据
  const validateCredentials = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: '用户名或密码错误' };
    }
  };

  // 添加收藏功能
  const addFavorite = (resourceId) => {
    if (!currentUser) return false;
    
    // 创建新的用户对象，添加收藏
    const updatedUser = { ...currentUser };
    
    // 如果没有favorites数组，创建一个
    if (!updatedUser.favorites) {
      updatedUser.favorites = [];
    }
    
    // 检查是否已经收藏
    if (!updatedUser.favorites.includes(resourceId)) {
      updatedUser.favorites.push(resourceId);
      updateUserStorage(updatedUser);
      return true;
    }
    
    return false;
  };
  
  // 移除收藏功能
  const removeFavorite = (resourceId) => {
    if (!currentUser || !currentUser.favorites) return false;
    
    // 创建新的用户对象，移除收藏
    const updatedUser = { ...currentUser };
    const index = updatedUser.favorites.indexOf(resourceId);
    
    if (index !== -1) {
      updatedUser.favorites.splice(index, 1);
      updateUserStorage(updatedUser);
      return true;
    }
    
    return false;
  };
  
  // 检查资源是否已收藏
  const isFavorite = (resourceId) => {
    return currentUser && 
           currentUser.favorites && 
           currentUser.favorites.includes(resourceId);
  };
  
  // 提供的上下文值
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    validateCredentials,
    addFavorite,
    removeFavorite,
    isFavorite,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，方便在组件中使用认证上下文
export const useAuth = () => {
  return useContext(AuthContext);
};