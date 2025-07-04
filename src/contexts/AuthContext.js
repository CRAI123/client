import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUsersTable, checkUsernameExists, checkEmailExists, insertUser, validateUserLogin } from '../api/database';
import MemberService from '../db/services/MemberService';

// 密码哈希现在在数据库层处理，这里不再需要客户端哈希

// 创建认证上下文
export const AuthContext = createContext();

// 认证上下文提供者组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberService] = useState(() => new MemberService());

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

  // 同步用户数据到数据库
  const syncUserDataToDatabase = async (userInfo) => {
    try {
      // 检查数据库中是否已存在该用户
      const existingUser = await memberService.memberModel.getMemberByUsername(userInfo.username);
      
      if (!existingUser.success || !existingUser.data) {
        // 用户不存在，创建新用户记录
        const memberData = {
          username: userInfo.username,
          email: userInfo.email || `${userInfo.username}@local.com`,
          passwordHash: 'local_auth', // 标记为本地认证
          vipStatus: userInfo.vipStatus || false,
          vipLevel: userInfo.vipLevel || 'basic',
          vipExpiresAt: userInfo.vipExpiresAt || null,
          lastLogin: new Date().toISOString(),
          metadata: {
            source: 'localStorage',
            syncedAt: new Date().toISOString(),
            originalData: userInfo
          }
        };
        
        const createResult = await memberService.memberModel.createMember(memberData);
        if (createResult.success) {
          console.log('用户数据已同步到数据库:', createResult.data);
        } else {
          console.warn('用户数据同步失败:', createResult.error);
        }
      } else {
        // 用户已存在，更新最后登录时间和相关信息
        const updateResult = await memberService.memberModel.updateLastLogin(existingUser.data.id);
        if (updateResult.success) {
          console.log('用户登录时间已更新');
        }
        
        // 同步VIP状态变化
        if (userInfo.vipStatus !== existingUser.data.vip_status) {
          await memberService.memberModel.updateMemberVipStatus(
            existingUser.data.id,
            userInfo.vipStatus,
            userInfo.vipLevel,
            userInfo.vipExpiresAt
          );
        }
      }
      
      // 同步localStorage中的其他数据（如收藏、设置等）
      await syncAdditionalUserData(userInfo);
      
    } catch (error) {
      console.error('数据库同步过程中出错:', error);
      throw error;
    }
  };

  // 同步其他用户数据（收藏、设置等）
  const syncAdditionalUserData = async (userInfo) => {
    try {
      // 同步用户收藏数据
      if (userInfo.favorites && userInfo.favorites.length > 0) {
        // 这里可以添加收藏数据的同步逻辑
        console.log('同步用户收藏数据:', userInfo.favorites);
      }
      
      // 同步用户设置
      if (userInfo.settings) {
        // 这里可以添加用户设置的同步逻辑
        console.log('同步用户设置:', userInfo.settings);
      }
      
      // 同步VIP密钥使用记录
      if (userInfo.usedVipKeys && userInfo.usedVipKeys.length > 0) {
        console.log('同步VIP密钥使用记录:', userInfo.usedVipKeys);
      }
      
    } catch (error) {
      console.error('同步附加用户数据失败:', error);
    }
  };

  // 登录函数
  const login = async (userData) => {
    try {
      // 存储用户信息到localStorage（不包含密码）
      const { password, ...userInfo } = userData;
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      
      // 同步用户数据到数据库
      await syncUserDataToDatabase(userInfo);
      
      return true;
    } catch (error) {
      console.error('登录数据同步失败:', error);
      // 即使数据库同步失败，登录仍然成功
      return true;
    }
  };

  // 注册函数
  const register = async (userData) => {
    try {
      // 首先尝试数据库注册（主要方式）
      try {
        // 确保用户表存在
        await createUsersTable();
        
        // 检查用户名是否已存在
        const usernameCheck = await checkUsernameExists(userData.username);
        if (usernameCheck.success && usernameCheck.exists) {
          return { success: false, message: '用户名已存在' };
        }
        
        // 检查邮箱是否已存在
        const emailCheck = await checkEmailExists(userData.email);
        if (emailCheck.success && emailCheck.exists) {
          return { success: false, message: '邮箱已被注册' };
        }
        
        // 密码哈希现在在数据库层处理
        const passwordHash = userData.password;
        
        // 插入新用户到数据库
        const insertResult = await insertUser(userData.username, userData.email, passwordHash);
        if (insertResult.success) {
          // 数据库注册成功，同步到localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const newUser = {
            id: insertResult.data.id,
            username: userData.username,
            email: userData.email,
            password: userData.password, // 保存原始密码用于localStorage验证
            joinDate: new Date().toISOString().split('T')[0],
            vipStatus: false,
            vipLevel: 0,
            vipExpiresAt: null,
            avatar: null,
            signature: '',
            createdAt: insertResult.data.created_at
          };
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          return { success: true, data: insertResult.data };
        }
      } catch (dbError) {
        console.warn('数据库注册失败，回退到localStorage注册:', dbError);
      }
      
      // 回退到localStorage注册
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
      
      // 保存到localStorage
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

  // 验证用户登录凭据
  const validateCredentials = async (username, password) => {
    try {
      // 首先尝试数据库验证（主要方式）
      try {
        // 密码哈希在数据库层处理
        const result = await validateUserLogin(username, password);
        
        if (result.success) {
          // 数据库验证成功，同步到localStorage
          const userData = {
            id: result.data.id,
            username: result.data.username,
            email: result.data.email,
            password: password, // 保存原始密码用于localStorage备份
            joinDate: result.data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            vipStatus: result.data.vip_status || false,
            vipLevel: result.data.vip_level || 0,
            vipExpiresAt: result.data.vip_expires_at || null,
            avatar: result.data.avatar || null,
            signature: result.data.signature || '',
            createdAt: result.data.created_at
          };
          
          // 更新localStorage中的用户数据
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const existingIndex = users.findIndex(u => u.username === username);
          if (existingIndex >= 0) {
            users[existingIndex] = userData;
          } else {
            users.push(userData);
          }
          localStorage.setItem('users', JSON.stringify(users));
          
          return {
            success: true,
            user: {
              username: result.data.username,
              email: result.data.email,
              joinDate: result.data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
              vipStatus: result.data.vip_status || false,
              vipLevel: result.data.vip_level || 0,
              vipExpiresAt: result.data.vip_expires_at || null,
              avatar: result.data.avatar || null,
              signature: result.data.signature || ''
            }
          };
        }
      } catch (dbError) {
        console.warn('数据库验证失败，回退到localStorage验证:', dbError);
      }
      
      // 回退到localStorage验证
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        // 尝试将localStorage用户迁移到数据库
        try {
          await createUsersTable();
          const usernameCheck = await checkUsernameExists(username);
          if (!usernameCheck.exists) {
            await insertUser(username, user.email, password);
            console.log('用户数据已从localStorage迁移到数据库');
          }
        } catch (migrationError) {
          console.warn('用户数据迁移失败:', migrationError);
        }
        
        return {
          success: true,
          user: {
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
      
      // 异步同步到数据库
      syncUserDataToDatabase(updatedUser).catch(error => {
        console.warn('用户数据同步到数据库失败:', error);
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