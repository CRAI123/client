import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Lock as LockIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { LanguageContext } from '../App';



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
  vipKeys: generateFixedVipKeys() // 使用固定密钥
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
  
  // 数据状态
  const [data, setData] = useState(initialData);
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // 表单状态 - 根据当前选项卡动态设置
  const [formData, setFormData] = useState({});
  
  // 处理登录
  const handleLogin = () => {
    // 验证管理员账号和密码
    if (username === '123456789' && password === '123456789') {
      setIsLoggedIn(true);
      setLoginError(false);
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
      
        // 强制重新初始化固定VIP密钥数据
        loadedData.vipKeys = generateFixedVipKeys();
        localStorage.setItem(STORAGE_KEYS.vipKeys, JSON.stringify(loadedData.vipKeys));
        
        setData(loadedData);
        console.log('VIP密钥已初始化:', loadedData.vipKeys);
      
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
  const handleSave = () => {
    const dataType = getDataTypeByTabIndex(currentTab);
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
    
    // 在实际应用中，这里应该调用API将数据同步到后端
    console.log('保存后的数据:', newData);
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

  // 批量生成VIP密钥
  const handleBatchGenerateKeys = () => {
    // 重置为固定的10个密钥
    const fixedKeys = generateFixedVipKeys();
    const newData = { ...data };
    
    newData.vipKeys = fixedKeys;
    setData(newData);
    
    // 更新localStorage
    localStorage.setItem(STORAGE_KEYS.vipKeys, JSON.stringify(newData.vipKeys));
    
    // 手动触发storage事件，确保同一标签页内的组件能够同步
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'vipKeyData',
      newValue: localStorage.getItem('vipKeyData'),
      storageArea: localStorage
    }));
    
    showSnackbar(language === 'zh' ? '已重置为10个固定密钥（可重复使用）' : 'Reset to 10 fixed keys (reusable)', 'success');
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

  const renderDataTable = () => {
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
            onClick={handleBatchGenerateKeys}
            sx={{ ml: 2 }}
          >
            {language === 'zh' ? '重置固定密钥' : 'Reset Fixed Keys'}
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