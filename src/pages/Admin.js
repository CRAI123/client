import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, MenuItem, Select, FormControl, InputLabel, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Lock as LockIcon, Logout as LogoutIcon, Storage as StorageIcon } from '@mui/icons-material';
import { LanguageContext } from '../App';
import MemberService from '../db/services/MemberService';



// 固定的10个VIP密钥（可重复使用）
const FIXED_VIP_KEYS = [
  'ABCD-1234-EFGH-5678',
  'IJKL-9012-MNOP-3456',
  'QRST-7890-UVWX-1234',
  'YZAB-5678-CDEF-9012',
  'GHIJ-3456-KLMN-7890',
  'OPQR-1234-STUV-5678',
  'WXYZ-9012-ABCD-3456',
  'EFGH-7890-IJKL-1234',
  'MNOP-5678-QRST-9012',
  'UVWX-3456-YZAB-7890'
];

// 生成VIP密钥的函数（用于动态生成）
const generateVipKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) result += '-';
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 生成固定的10个VIP密钥
const generateFixedVipKeys = () => {
  const keys = [];
  for (let i = 0; i < FIXED_VIP_KEYS.length; i++) {
    keys.push({
      id: i + 1,
      key: FIXED_VIP_KEYS[i],
      status: 'permanent', // 永久有效状态
      createdDate: new Date().toISOString().split('T')[0],
      usedBy: null,
      usedDate: null,
      usageCount: 0 // 使用次数统计
    });
  }
  return keys;
};

// 生成10个随机VIP密钥（原有功能保留）
const generateVipKeys = () => {
  const keys = [];
  for (let i = 0; i < 10; i++) {
    keys.push({
      id: Date.now() + i, // 使用时间戳避免ID冲突
      key: generateVipKey(),
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      usedBy: null,
      usedDate: null,
      usageCount: 0
    });
  }
  return keys;
};

// 初始数据 - 实际应用中应从后端API获取
const initialData = {
  vipKeys: [] // 空数组，完全依赖localStorage或数据库中的数据
};

// localStorage存储键
const STORAGE_KEYS = {
  vipKeys: 'vipKeyData'
};

function Admin() {
  const theme = useTheme();
  const { language } = useContext(LanguageContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // 数据库服务
  const [memberService] = useState(() => new MemberService());
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  
  // 数据状态
  const [data, setData] = useState(initialData);
  const [dbData, setDbData] = useState({ members: [], vipKeys: [], stats: null });
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // 表单状态 - 根据当前选项卡动态设置
  const [formData, setFormData] = useState({});
  
  // 初始化数据库
  const initializeDatabase = async () => {
    setDbLoading(true);
    try {
      const result = await memberService.initializeTables();
      if (result.success) {
        setDbInitialized(true);
        showSnackbar('数据库初始化成功', 'success');
        await loadDatabaseData();
      } else {
        showSnackbar(`数据库初始化失败: ${result.error}`, 'error');
      }
    } catch (error) {
      showSnackbar(`数据库初始化失败: ${error.message}`, 'error');
    } finally {
      setDbLoading(false);
    }
  };

  // 加载数据库数据
  const loadDatabaseData = async () => {
    try {
      // 如果数据库未初始化，先尝试初始化
      if (!dbInitialized) {
        const initResult = await memberService.initializeTables();
        if (initResult.success) {
          setDbInitialized(true);
          showSnackbar('数据库初始化成功', 'success');
        } else if (!initResult.fallbackToLocalStorage) {
          showSnackbar(`数据库初始化失败: ${initResult.error}`, 'error');
          return;
        }
      }

      const [membersResult, vipKeysResult, statsResult] = await Promise.all([
        memberService.getMemberList(1, 50),
        memberService.getVipKeyList({}, 1, 50),
        memberService.getDashboardStats()
      ]);

      setDbData({
        members: (membersResult.success && Array.isArray(membersResult.data)) ? membersResult.data : [],
        vipKeys: (vipKeysResult.success && Array.isArray(vipKeysResult.data)) ? vipKeysResult.data : [],
        stats: statsResult.success ? statsResult.data : null
      });
    } catch (error) {
      showSnackbar(`加载数据失败: ${error.message}`, 'error');
      // 确保在出错时也设置默认值
      setDbData({
        members: [],
        vipKeys: [],
        stats: null
      });
    }
  };

  // 创建VIP密钥到数据库
  const createVipKeyInDb = async (keyData) => {
    try {
      const result = await memberService.createVipKeys(keyData);
      if (result.success) {
        showSnackbar('VIP密钥创建成功', 'success');
        await loadDatabaseData();
        return result.data;
      } else {
        showSnackbar(`创建失败: ${result.error}`, 'error');
        return null;
      }
    } catch (error) {
      showSnackbar(`创建失败: ${error.message}`, 'error');
      return null;
    }
  };

  // 批量创建VIP密钥
  const createBatchVipKeys = async (count, keyType = 'temporary') => {
    try {
      const keyData = {
        keyType,
        vipLevel: 'premium',
        maxUsageCount: keyType === 'permanent' ? -1 : 1,
        createdBy: 'admin',
        description: `管理员批量创建的${keyType === 'permanent' ? '永久' : '临时'}密钥`
      };
      
      const result = await memberService.createVipKeys(keyData, count);
      if (result.success) {
        showSnackbar(`成功创建 ${result.data.length} 个VIP密钥`, 'success');
        await loadDatabaseData();
      } else {
        showSnackbar(`批量创建失败: ${result.error}`, 'error');
      }
    } catch (error) {
      showSnackbar(`批量创建失败: ${error.message}`, 'error');
    }
  };

  // 创建指定有效期的VIP密钥
  const createVipKeysWithValidity = async (count, validityPeriod) => {
    setDbLoading(true);
    try {
      const validityNames = {
        '1month': language === 'zh' ? '1个月' : '1 Month',
        '6months': language === 'zh' ? '6个月' : '6 Months',
        '1year': language === 'zh' ? '1年' : '1 Year',
        'permanent': language === 'zh' ? '永久' : 'Permanent'
      };

      const options = {
        vipLevel: 'premium',
        createdBy: 'admin',
        description: `${validityNames[validityPeriod]}有效期密钥`
      };
      
      const result = await memberService.createBatchVipKeysWithValidity(count, validityPeriod, options);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: language === 'zh' 
            ? `成功创建${count}个${validityNames[validityPeriod]}有效期密钥`
            : `Successfully created ${count} ${validityNames[validityPeriod]} validity keys`,
          severity: 'success'
        });
        // 刷新数据
        await loadDatabaseData();
      } else {
        setSnackbar({
          open: true,
          message: language === 'zh' 
            ? `创建密钥失败: ${result.error}`
            : `Failed to create keys: ${result.error}`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('创建指定有效期VIP密钥失败:', error);
      setSnackbar({
        open: true,
        message: language === 'zh' 
          ? `创建密钥失败: ${error.message}`
          : `Failed to create keys: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDbLoading(false);
    }
  };

  // 处理登录
  const handleLogin = () => {
    // 验证管理员账号和密码
    if (username === '123456789' && password === '123456789') {
      setIsLoggedIn(true);
      setLoginError(false);
      // 登录成功后加载数据库数据
      // 移除强制初始化，让数据库服务自己判断是否需要初始化
      loadDatabaseData();
    } else {
      setLoginError(true);
    }
  };
  
  // 处理登出
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError(false);
  };
  
  // 初始化数据加载和实时监听
  useEffect(() => {
    try {
      // 从localStorage加载所有数据
      const loadedData = { ...initialData };
      
      Object.keys(STORAGE_KEYS).forEach(dataType => {
        const stored = localStorage.getItem(STORAGE_KEYS[dataType]);
        if (stored) {
          loadedData[dataType] = JSON.parse(stored);
        }
      });
      
        // 只在没有VIP密钥数据时才初始化固定密钥
        if (!loadedData.vipKeys || loadedData.vipKeys.length === 0) {
          loadedData.vipKeys = generateFixedVipKeys();
          localStorage.setItem(STORAGE_KEYS.vipKeys, JSON.stringify(loadedData.vipKeys));
          console.log('VIP密钥已初始化:', loadedData.vipKeys);
        } else {
          console.log('从localStorage加载现有VIP密钥:', loadedData.vipKeys);
        }
        
        setData(loadedData);
      
      // 设置实时监听localStorage变化
      const handleStorageChange = (e) => {
        if (Object.values(STORAGE_KEYS).includes(e.key)) {
          const dataType = Object.keys(STORAGE_KEYS).find(key => STORAGE_KEYS[key] === e.key);
          if (dataType && e.newValue) {
            setData(prevData => ({
              ...prevData,
              [dataType]: JSON.parse(e.newValue)
            }));
          }
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } catch (error) {
      console.error('数据加载失败:', error);
      showSnackbar(language === 'zh' ? '数据加载失败' : 'Failed to load data', 'error');
    }
  }, [language]);
  
  // 切换选项卡时重置表单
  useEffect(() => {
    setFormData({});
    setEditItem(null);
    setOpenDialog(false);
  }, [currentTab]);
  
  // 处理选项卡切换
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  

  
  // 打开添加对话框
  const handleOpenAddDialog = () => {
    setEditItem(null);
    setFormData({});
    setOpenDialog(true);
  };
  
  // 打开编辑对话框
  const handleOpenEditDialog = (item) => {
    setEditItem(item);
    setFormData(item);
    setOpenDialog(true);
  };
  
  // 关闭对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
    setFormData({});
  };
  
  // 保存数据
  const handleSave = async () => {
    const dataType = getDataTypeByTabIndex(currentTab);
    
    // 检查是否在数据库管理选项卡
    if (currentTab === 1) {
      // 数据库管理模式
      if (editItem) {
        // 编辑现有项 - 暂时不支持数据库编辑
        showSnackbar(language === 'zh' ? '数据库编辑功能暂未实现' : 'Database editing not implemented yet', 'warning');
        return;
      } else {
        // 添加新项到数据库
        if (dataType === 'vipKeys') {
          const keyData = {
            keyType: formData.status === 'permanent' ? 'permanent' : 'temporary',
            vipLevel: formData.vipLevel || 'premium',
            maxUsageCount: formData.status === 'permanent' ? -1 : 1,
            createdBy: 'admin',
            description: formData.description || '管理员手动创建的VIP密钥'
          };
          
          const result = await createVipKeyInDb(keyData);
          if (result) {
            handleCloseDialog();
            return;
          }
        }
      }
    } else {
      // localStorage模式
      let newData = { ...data };
      
      if (editItem) {
        // 编辑现有项
        newData[dataType] = data[dataType].map(item => 
          item.id === editItem.id ? { ...item, ...formData } : item
        );
        showSnackbar(language === 'zh' ? '更新成功' : 'Updated successfully', 'success');
      } else {
        // 添加新项
        const newId = Math.max(...data[dataType].map(item => item.id), 0) + 1;
        let newItem = { id: newId, ...formData };
        
        // 如果是VIP密钥，自动生成密钥
        if (dataType === 'vipKeys') {
          newItem = {
            ...newItem,
            key: generateVipKey(),
            status: 'active',
            createdDate: new Date().toISOString().split('T')[0],
            usageCount: 0
          };
        }
        
        newData[dataType] = [...data[dataType], newItem];
        showSnackbar(language === 'zh' ? '添加成功' : 'Added successfully', 'success');
      }
      
      setData(newData);
      handleCloseDialog();
      
      // 更新localStorage
      localStorage.setItem(STORAGE_KEYS[dataType], JSON.stringify(newData[dataType]));
      
      // 手动触发storage事件，确保同一标签页内的组件能够同步
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEYS[dataType],
        newValue: localStorage.getItem(STORAGE_KEYS[dataType]),
        storageArea: localStorage
      }));
    }
  };
  
  // 删除数据
  const handleDelete = (id) => {
    const dataType = getDataTypeByTabIndex(currentTab);
    const newData = { ...data };
    newData[dataType] = data[dataType].filter(item => item.id !== id);
    setData(newData);
    showSnackbar(language === 'zh' ? '删除成功' : 'Deleted successfully', 'success');
    
    // 更新localStorage
    localStorage.setItem(STORAGE_KEYS[dataType], JSON.stringify(newData[dataType]));
    
    // 在实际应用中，这里应该调用API将删除操作同步到后端
    console.log('删除后的数据:', newData);
  };
  
  // 显示提示消息
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };


  
  // 添加生成随机密钥的函数（可选功能）
  const handleGenerateRandomKeys = () => {
    const newKeys = generateVipKeys();
    const newData = { ...data };
    const existingKeys = newData.vipKeys || [];
    const maxId = existingKeys.length > 0 ? Math.max(...existingKeys.map(k => k.id)) : 0;
    
    const keysWithNewIds = newKeys.map((key, index) => ({
      ...key,
      id: maxId + index + 1
    }));
    
    newData.vipKeys = [...existingKeys, ...keysWithNewIds];
    setData(newData);
    
    // 更新localStorage
    localStorage.setItem(STORAGE_KEYS.vipKeys, JSON.stringify(newData.vipKeys));
    
    // 手动触发storage事件，确保同一标签页内的组件能够同步
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'vipKeyData',
      newValue: localStorage.getItem('vipKeyData'),
      storageArea: localStorage
    }));
    
    showSnackbar(language === 'zh' ? '成功生成10个随机密钥' : 'Successfully generated 10 random keys', 'success');
  };
  
  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // 根据选项卡索引获取数据类型
  const getDataTypeByTabIndex = (tabIndex) => {
    return 'vipKeys';
  };
  
  // 渲染表单字段
  const renderFormFields = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TextField
          label={language === 'zh' ? '密钥' : 'Key'}
          value={formData.key || ''}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          fullWidth
          required
          disabled={!editItem} // 新增时自动生成，编辑时可修改
        />
        <FormControl fullWidth required>
          <InputLabel>{language === 'zh' ? '状态' : 'Status'}</InputLabel>
          <Select
            value={formData.status || 'active'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            label={language === 'zh' ? '状态' : 'Status'}
          >
            <MenuItem value="permanent">{language === 'zh' ? '永久' : 'Permanent'}</MenuItem>
            <MenuItem value="active">{language === 'zh' ? '激活' : 'Active'}</MenuItem>
            <MenuItem value="used">{language === 'zh' ? '已使用' : 'Used'}</MenuItem>
            <MenuItem value="expired">{language === 'zh' ? '已过期' : 'Expired'}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>{language === 'zh' ? 'VIP等级' : 'VIP Level'}</InputLabel>
          <Select
            value={formData.vipLevel || 'premium'}
            onChange={(e) => setFormData({ ...formData, vipLevel: e.target.value })}
            label={language === 'zh' ? 'VIP等级' : 'VIP Level'}
          >
            <MenuItem value="basic">{language === 'zh' ? '基础' : 'Basic'}</MenuItem>
            <MenuItem value="premium">{language === 'zh' ? '高级' : 'Premium'}</MenuItem>
            <MenuItem value="ultimate">{language === 'zh' ? '至尊' : 'Ultimate'}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={language === 'zh' ? '描述' : 'Description'}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label={language === 'zh' ? '使用者' : 'Used By'}
          value={formData.usedBy || ''}
          onChange={(e) => setFormData({ ...formData, usedBy: e.target.value })}
          fullWidth
        />
        <TextField
          label={language === 'zh' ? '使用日期' : 'Used Date'}
          type="date"
          value={formData.usedDate || ''}
          onChange={(e) => setFormData({ ...formData, usedDate: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={language === 'zh' ? '使用次数' : 'Usage Count'}
          type="number"
          value={formData.usageCount || 0}
          onChange={(e) => setFormData({ ...formData, usageCount: parseInt(e.target.value) || 0 })}
          fullWidth
          inputProps={{ min: 0 }}
        />
      </Box>
    );
  };

  // 渲染数据库管理界面
  const renderDatabaseManagement = () => {
    return (
      <Box sx={{ mt: 2 }}>
        {/* 数据库状态和操作 */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'zh' ? '数据库状态' : 'Database Status'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip 
              icon={<StorageIcon />}
              label={dbInitialized ? 
                (language === 'zh' ? '已初始化' : 'Initialized') : 
                (language === 'zh' ? '未初始化' : 'Not Initialized')
              }
              color={dbInitialized ? 'success' : 'warning'}
            />
            {dbData.stats && (
              <>
                <Chip label={`${language === 'zh' ? '会员数' : 'Members'}: ${dbData.stats.totalMembers || 0}`} />
                <Chip label={`${language === 'zh' ? 'VIP密钥数' : 'VIP Keys'}: ${dbData.stats.totalVipKeys || 0}`} />
                <Chip label={`${language === 'zh' ? '活跃密钥' : 'Active Keys'}: ${dbData.stats.activeVipKeys || 0}`} />
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={initializeDatabase}
              disabled={dbLoading || dbInitialized}
              startIcon={<StorageIcon />}
            >
              {language === 'zh' ? '初始化数据库' : 'Initialize Database'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={loadDatabaseData}
              disabled={dbLoading || !dbInitialized}
            >
              {language === 'zh' ? '刷新数据' : 'Refresh Data'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => createVipKeysWithValidity(5, '1month')}
              disabled={dbLoading || !dbInitialized}
            >
              {language === 'zh' ? '创建5个1月期密钥' : 'Create 5 1-Month Keys'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => createVipKeysWithValidity(3, '6months')}
              disabled={dbLoading || !dbInitialized}
            >
              {language === 'zh' ? '创建3个半年期密钥' : 'Create 3 6-Month Keys'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => createVipKeysWithValidity(2, '1year')}
              disabled={dbLoading || !dbInitialized}
            >
              {language === 'zh' ? '创建2个1年期密钥' : 'Create 2 1-Year Keys'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => createVipKeysWithValidity(1, 'permanent')}
              disabled={dbLoading || !dbInitialized}
            >
              {language === 'zh' ? '创建1个永久密钥' : 'Create 1 Permanent Key'}
            </Button>
          </Box>
        </Paper>

        {/* 会员列表 */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'zh' ? '会员列表' : 'Members List'}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{language === 'zh' ? '用户名' : 'Username'}</TableCell>
                  <TableCell>{language === 'zh' ? '邮箱' : 'Email'}</TableCell>
                  <TableCell>{language === 'zh' ? 'VIP状态' : 'VIP Status'}</TableCell>
                  <TableCell>{language === 'zh' ? '注册时间' : 'Created At'}</TableCell>
                  <TableCell>{language === 'zh' ? '最后登录' : 'Last Login'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(dbData.members || []).map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.username}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={member.vip_status ? 'VIP' : 'Normal'}
                        color={member.vip_status ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{member.last_login ? new Date(member.last_login).toLocaleDateString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* VIP密钥列表 */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'zh' ? 'VIP密钥列表' : 'VIP Keys List'}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{language === 'zh' ? '密钥' : 'Key Code'}</TableCell>
                  <TableCell>{language === 'zh' ? '类型' : 'Type'}</TableCell>
                  <TableCell>{language === 'zh' ? 'VIP等级' : 'VIP Level'}</TableCell>
                  <TableCell>{language === 'zh' ? '状态' : 'Status'}</TableCell>
                  <TableCell>{language === 'zh' ? '使用次数' : 'Usage'}</TableCell>
                  <TableCell>{language === 'zh' ? '过期时间' : 'Expires At'}</TableCell>
                  <TableCell>{language === 'zh' ? '创建时间' : 'Created At'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(dbData.vipKeys || []).map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.id}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {key.key_code}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={key.key_type}
                        color={key.key_type === 'permanent' ? 'success' : 'info'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{key.vip_level}</TableCell>
                    <TableCell>
                      <Chip 
                        label={key.status}
                        color={key.status === 'active' ? 'success' : key.status === 'used' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {key.current_usage_count || 0}/{key.max_usage_count === -1 ? '∞' : key.max_usage_count}
                    </TableCell>
                    <TableCell>
                      {key.expires_at ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {new Date(key.expires_at).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: new Date(key.expires_at) < new Date() ? 'error.main' : 'text.secondary',
                            fontSize: '0.7rem'
                          }}>
                            {new Date(key.expires_at) < new Date() ? 
                              (language === 'zh' ? '已过期' : 'Expired') : 
                              (language === 'zh' ? '有效' : 'Valid')
                            }
                          </Typography>
                        </Box>
                      ) : (
                        <Chip 
                          label={language === 'zh' ? '永久' : 'Permanent'} 
                          color="success" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  };

  const renderDataTable = () => {
    // 如果是数据库管理选项卡
    if (currentTab === 1) {
      return renderDatabaseManagement();
    }
    
    const dataType = getDataTypeByTabIndex(currentTab);
    const currentData = data[dataType] || [];
    
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{language === 'zh' ? 'ID' : 'ID'}</TableCell>
              <TableCell>{language === 'zh' ? '密钥' : 'Key'}</TableCell>
              <TableCell>{language === 'zh' ? '状态' : 'Status'}</TableCell>
              <TableCell>{language === 'zh' ? '使用者' : 'Used By'}</TableCell>
              <TableCell>{language === 'zh' ? '使用日期' : 'Used Date'}</TableCell>
              <TableCell>{language === 'zh' ? '使用次数' : 'Usage Count'}</TableCell>
              <TableCell>{language === 'zh' ? '创建日期' : 'Created Date'}</TableCell>
              <TableCell>{language === 'zh' ? '操作' : 'Actions'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>{item.key}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: 'white',
                      backgroundColor: 
                        item.status === 'permanent' ? '#9c27b0' :
                        item.status === 'active' ? '#4caf50' :
                        item.status === 'used' ? '#ff9800' : '#f44336'
                    }}
                  >
                    {item.status === 'permanent' ? (language === 'zh' ? '永久' : 'Permanent') :
                     item.status === 'active' ? (language === 'zh' ? '激活' : 'Active') :
                     item.status === 'used' ? (language === 'zh' ? '已使用' : 'Used') :
                     (language === 'zh' ? '已过期' : 'Expired')}
                  </Box>
                </TableCell>
                <TableCell>{item.usedBy || '-'}</TableCell>
                <TableCell>{item.usedDate || '-'}</TableCell>
                <TableCell>{item.usageCount || 0}</TableCell>
                <TableCell>{item.createdDate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };




  // 主渲染函数
  if (!isLoggedIn) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            {language === 'zh' ? '管理员登录' : 'Admin Login'}
          </Typography>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {language === 'zh' ? '用户名或密码错误' : 'Invalid username or password'}
            </Alert>
          )}
          <TextField
            fullWidth
            label={language === 'zh' ? '用户名' : 'Username'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label={language === 'zh' ? '密码' : 'Password'}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            {language === 'zh' ? '登录' : 'Login'}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {language === 'zh' ? '管理控制台' : 'Admin Console'}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          {language === 'zh' ? '退出登录' : 'Logout'}
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label={language === 'zh' ? 'VIP密钥' : 'VIP Keys'} />
          <Tab label={language === 'zh' ? '数据库管理' : 'Database Management'} />
        </Tabs>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            {language === 'zh' ? '添加' : 'Add'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleGenerateRandomKeys}
            sx={{ ml: 2 }}
          >
            {language === 'zh' ? '生成随机密钥' : 'Generate Random Keys'}
          </Button>
        </Box>
        
        {renderDataTable()}
      </Paper>

      {/* 添加/编辑对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editItem ? 
            (language === 'zh' ? '编辑' : 'Edit') : 
            (language === 'zh' ? '添加' : 'Add')
          }
        </DialogTitle>
        <DialogContent>
          {renderFormFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {language === 'zh' ? '取消' : 'Cancel'}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {language === 'zh' ? '保存' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Admin;