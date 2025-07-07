import React, { createContext, useContext, useState, useEffect } from 'react';
// 移除数据库相关导入，只使用localStorage
// import MemberService from '../services/MemberService';

// 使用localStorage进行用户数据管理

// 创建认证上下文
export const AuthContext = createContext();

// 认证上下文提供者组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // 移除MemberService，使用localStorage作为主要存储
  // const [memberService] = useState(() => new MemberService());

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

  // 简化的用户数据同步（仅使用localStorage）
  const syncUserDataToLocalStorage = async (userInfo) => {
    try {
      // 更新localStorage中的用户列表
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingIndex = users.findIndex(u => u.username === userInfo.username);
      
      const userData = {
        ...userInfo,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        users[existingIndex] = userData;
      } else {
        users.push(userData);
      }
      
      localStorage.setItem('users', JSON.stringify(users));
      console.log('用户数据已同步到localStorage');
      
    } catch (error) {
      console.error('localStorage同步过程中出错:', error);
      throw error;
    }
  };

  // 简化的用户附加数据处理（仅记录日志）
  const logUserData = (userInfo) => {
    try {
      // 记录用户数据日志
      if (userInfo.favorites && userInfo.favorites.length > 0) {
        console.log('用户收藏数据:', userInfo.favorites);
      }
      
      if (userInfo.settings) {
        console.log('用户设置:', userInfo.settings);
      }
      
      if (userInfo.usedVipKeys && userInfo.usedVipKeys.length > 0) {
        console.log('VIP密钥使用记录:', userInfo.usedVipKeys);
      }
      
    } catch (error) {
      console.error('记录用户数据失败:', error);
    }
  };

  // 登录函数
  const login = async (userData) => {
    try {
      // 存储用户信息到localStorage（不包含密码）
      const { password, ...userInfo } = userData;
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      
      // 同步用户数据到localStorage
      await syncUserDataToLocalStorage(userInfo);
      
      // 记录用户数据
      logUserData(userInfo);
      
      return true;
    } catch (error) {
      console.error('登录数据同步失败:', error);
      // 即使同步失败，登录仍然成功
      return true;
    }
  };

  // 注册函数（使用localStorage）
  const register = async (userData) => {
    try {
      // 检查localStorage中的用户数据
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.username === userData.username || u.email === userData.email);
      
      if (existingUser) {
        if (existingUser.username === userData.username) {
          return { success: false, message: '用户名已存在' };
        }
        if (existingUser.email === userData.email) {
          return { success: false, message: '邮箱已被注册' };
        }
      }
      
      // 创建新用户
      const newUser = {
        id: Date.now(), // 使用时间戳作为ID
        username: userData.username,
        email: userData.email,
        password: userData.password, // 保存原始密码用于localStorage验证
        joinDate: new Date().toISOString().split('T')[0],
        vipStatus: false,
        vipLevel: 0,
        vipExpiresAt: null,
        avatar: null,
        signature: '',
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      console.log('用户注册成功，已保存到localStorage');
      return { success: true, data: newUser };
    } catch (error) {
      console.error('注册过程中出错:', error);
      return { success: false, message: '注册失败，请稍后重试' };
    }
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // 验证用户登录凭据（使用localStorage）
  const validateCredentials = async (username, password) => {
    try {
      // 从localStorage验证用户
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (user) {
        console.log('用户验证成功');
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            joinDate: user.joinDate,
            vipStatus: user.vipStatus || false,
            vipLevel: user.vipLevel || 0,
            vipExpiresAt: user.vipExpiresAt || null,
            avatar: user.avatar || null,
            signature: user.signature || ''
          }
        };
      }
      
      return {
        success: false,
        message: '用户名或密码错误'
      };
    } catch (error) {
      console.error('验证凭据时出错:', error);
      return {
        success: false,
        message: '登录验证失败，请稍后重试'
      };
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

  // 更新用户信息
  const updateUser = (updatedUserData) => {
    if (!currentUser) return false;
    
    try {
      // 合并更新的用户数据
      const updatedUser = {
        ...currentUser,
        ...updatedUserData,
        updatedAt: new Date().toISOString()
      };
      
      // 更新localStorage和状态
      updateUserStorage(updatedUser);
      
      // 异步同步到localStorage
      syncUserDataToLocalStorage(updatedUser).catch(error => {
        console.warn('用户数据同步到localStorage失败:', error);
      });
      
      return true;
    } catch (error) {
      console.error('更新用户信息时出错:', error);
      return false;
    }
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
    updateUser,
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