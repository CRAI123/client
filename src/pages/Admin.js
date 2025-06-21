import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Chip, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Lock as LockIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { LanguageContext } from '../App';

// 生成VIP密钥的函数
const generateVipKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) result += '-';
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 生成10个VIP密钥
const generateVipKeys = () => {
  const keys = [];
  for (let i = 0; i < 10; i++) {
    keys.push({
      id: i + 1,
      key: generateVipKey(),
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      usedBy: null,
      usedDate: null
    });
  }
  return keys;
};

// 初始数据 - 实际应用中应从后端API获取
const initialData = {
  articles: [
    { id: 1, title: '文章1', category: 'tech', content: '这是技术文章内容', date: '2023-01-01' },
    { id: 2, title: '文章2', category: 'life', content: '这是生活文章内容', date: '2023-01-02' },
  ],
  projects: [
    { id: 1, name: '项目1', description: '这是项目1的描述', technologies: 'React, Node.js', github: 'https://github.com/example/project1' },
    { id: 2, name: '项目2', description: '这是项目2的描述', technologies: 'Vue, Express', github: 'https://github.com/example/project2' },
  ],
  resources: [
    { id: 1, title: '资源1', category: 'article', description: '这是一篇技术文章', link: 'https://example.com/article1' },
    { id: 2, title: '资源2', category: 'note', description: '这是一篇学习笔记', link: 'https://example.com/note1' },
  ],
  contacts: [],
  subscriptions: [],
  vipKeys: generateVipKeys()
};

// localStorage存储键
const STORAGE_KEYS = {
  articles: 'articleData',
  projects: 'projectData',
  resources: 'resourceData',
  contacts: 'contactMessages',
  subscriptions: 'subscriptionEmails',
  vipKeys: 'vipKeys'
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
      
      // 确保VIP密钥数据存在
      if (!loadedData.vipKeys || loadedData.vipKeys.length === 0) {
        loadedData.vipKeys = initialData.vipKeys;
        localStorage.setItem(STORAGE_KEYS.vipKeys, JSON.stringify(loadedData.vipKeys));
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
  
  // 处理表单输入变化
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          createdDate: new Date().toISOString().split('T')[0]
        };
      }
      
      newData[dataType] = [...data[dataType], newItem];
      showSnackbar(language === 'zh' ? '添加成功' : 'Added successfully', 'success');
    }
    
    setData(newData);
    handleCloseDialog();
    
    // 更新localStorage
    localStorage.setItem(STORAGE_KEYS[dataType], JSON.stringify(newData[dataType]));
    
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
  
  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // 根据选项卡索引获取数据类型
  const getDataTypeByTabIndex = (index) => {
    switch(index) {
      case 0: return 'articles';
      case 1: return 'projects';
      case 2: return 'resources';
      case 3: return 'contacts';
      case 4: return 'subscriptions';
      case 5: return 'vipKeys';
      default: return 'articles';
    }
  };
  
  // 渲染表单字段
  const renderFormFields = () => {
    switch(currentTab) {
      case 0: // 文章表单
        return (
          <>
            <TextField
              name="title"
              label={language === 'zh' ? '标题' : 'Title'}
              fullWidth
              margin="normal"
              value={formData.title || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{language === 'zh' ? '分类' : 'Category'}</InputLabel>
              <Select
                name="category"
                value={formData.category || ''}
                onChange={handleFormChange}
                label={language === 'zh' ? '分类' : 'Category'}
              >
                <MenuItem value="tech">{language === 'zh' ? '技术' : 'Technology'}</MenuItem>
                <MenuItem value="life">{language === 'zh' ? '生活' : 'Life'}</MenuItem>
                <MenuItem value="other">{language === 'zh' ? '其他' : 'Other'}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="content"
              label={language === 'zh' ? '内容' : 'Content'}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={formData.content || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="date"
              label={language === 'zh' ? '日期' : 'Date'}
              type="date"
              fullWidth
              margin="normal"
              value={formData.date || ''}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
          </>
        );
      case 1: // 项目表单
        return (
          <>
            <TextField
              name="name"
              label={language === 'zh' ? '项目名称' : 'Project Name'}
              fullWidth
              margin="normal"
              value={formData.name || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="description"
              label={language === 'zh' ? '描述' : 'Description'}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={formData.description || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="technologies"
              label={language === 'zh' ? '技术栈' : 'Technologies'}
              fullWidth
              margin="normal"
              value={formData.technologies || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="github"
              label={language === 'zh' ? 'GitHub链接' : 'GitHub Link'}
              fullWidth
              margin="normal"
              value={formData.github || ''}
              onChange={handleFormChange}
            />
          </>
        );
      case 2: // 资源表单
        return (
          <>
            <TextField
              name="title"
              label={language === 'zh' ? '标题' : 'Title'}
              fullWidth
              margin="normal"
              value={formData.title || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{language === 'zh' ? '分类' : 'Category'}</InputLabel>
              <Select
                name="category"
                value={formData.category || ''}
                onChange={handleFormChange}
                label={language === 'zh' ? '分类' : 'Category'}
              >
                <MenuItem value="article">{language === 'zh' ? '技术文章' : 'Technical Articles'}</MenuItem>
                <MenuItem value="note">{language === 'zh' ? '学习笔记' : 'Study Notes'}</MenuItem>
                <MenuItem value="tool">{language === 'zh' ? '工具' : 'Tools'}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="description"
              label={language === 'zh' ? '描述' : 'Description'}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={formData.description || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="link"
              label={language === 'zh' ? '链接' : 'Link'}
              fullWidth
              margin="normal"
              value={formData.link || ''}
              onChange={handleFormChange}
            />
          </>
        );
      case 3: // 联系表单
        return (
          <>
            <TextField
              name="name"
              label={language === 'zh' ? '姓名' : 'Name'}
              fullWidth
              margin="normal"
              value={formData.name || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="email"
              label={language === 'zh' ? '邮箱' : 'Email'}
              fullWidth
              margin="normal"
              value={formData.email || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="message"
              label={language === 'zh' ? '消息' : 'Message'}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={formData.message || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{language === 'zh' ? '状态' : 'Status'}</InputLabel>
              <Select
                name="status"
                value={formData.status || 'unread'}
                onChange={handleFormChange}
                label={language === 'zh' ? '状态' : 'Status'}
              >
                <MenuItem value="unread">{language === 'zh' ? '未读' : 'Unread'}</MenuItem>
                <MenuItem value="read">{language === 'zh' ? '已读' : 'Read'}</MenuItem>
                <MenuItem value="replied">{language === 'zh' ? '已回复' : 'Replied'}</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 4: // 订阅表单
        return (
          <>
            <TextField
              name="email"
              label={language === 'zh' ? '邮箱' : 'Email'}
              fullWidth
              margin="normal"
              value={formData.email || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{language === 'zh' ? '状态' : 'Status'}</InputLabel>
              <Select
                name="status"
                value={formData.status || 'active'}
                onChange={handleFormChange}
                label={language === 'zh' ? '状态' : 'Status'}
              >
                <MenuItem value="active">{language === 'zh' ? '活跃' : 'Active'}</MenuItem>
                <MenuItem value="inactive">{language === 'zh' ? '不活跃' : 'Inactive'}</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 5: // VIP密钥表单
        return (
          <>
            <TextField
              name="key"
              label={language === 'zh' ? '密钥' : 'Key'}
              fullWidth
              margin="normal"
              value={formData.key || ''}
              onChange={handleFormChange}
              disabled={!editItem} // 新增时禁用，编辑时可用
              helperText={!editItem ? (language === 'zh' ? '新密钥将自动生成' : 'New key will be auto-generated') : ''}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{language === 'zh' ? '状态' : 'Status'}</InputLabel>
              <Select
                name="status"
                value={formData.status || 'active'}
                onChange={handleFormChange}
                label={language === 'zh' ? '状态' : 'Status'}
              >
                <MenuItem value="active">{language === 'zh' ? '可用' : 'Active'}</MenuItem>
                <MenuItem value="used">{language === 'zh' ? '已使用' : 'Used'}</MenuItem>
                <MenuItem value="expired">{language === 'zh' ? '已过期' : 'Expired'}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="usedBy"
              label={language === 'zh' ? '使用者' : 'Used By'}
              fullWidth
              margin="normal"
              value={formData.usedBy || ''}
              onChange={handleFormChange}
            />
            <TextField
              name="usedDate"
              label={language === 'zh' ? '使用日期' : 'Used Date'}
              type="date"
              fullWidth
              variant="outlined"
              value={formData.usedDate || ''}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderDataTable = () => {
    const dataType = getDataTypeByTabIndex(currentTab);
    const items = data[dataType] || [];
    
    switch(currentTab) {
      case 0: // 文章表格
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{language === 'zh' ? 'ID' : 'ID'}</TableCell>
                  <TableCell>{language === 'zh' ? '标题' : 'Title'}</TableCell>
                  <TableCell>{language === 'zh' ? '分类' : 'Category'}</TableCell>
                  <TableCell>{language === 'zh' ? '日期' : 'Date'}</TableCell>
                  <TableCell align="right">{language === 'zh' ? '操作' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell align="right">
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
      case 1: // 项目表格
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{language === 'zh' ? 'ID' : 'ID'}</TableCell>
                  <TableCell>{language === 'zh' ? '名称' : 'Name'}</TableCell>
                  <TableCell>{language === 'zh' ? '描述' : 'Description'}</TableCell>
                  <TableCell>{language === 'zh' ? '技术栈' : 'Technologies'}</TableCell>
                  <TableCell align="right">{language === 'zh' ? '操作' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.technologies}</TableCell>
                    <TableCell align="right">
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
      case 2: // 资源表格
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{language === 'zh' ? 'ID' : 'ID'}</TableCell>
                  <TableCell>{language === 'zh' ? '标题' : 'Title'}</TableCell>
                  <TableCell>{language === 'zh' ? '分类' : 'Category'}</TableCell>
                  <TableCell>{language === 'zh' ? '描述' : 'Description'}</TableCell>
                  <TableCell align="right">{language === 'zh' ? '操作' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      {item.category === 'article' ? (language === 'zh' ? '技术文章' : 'Technical Articles') : 
                       item.category === 'note' ? (language === 'zh' ? '学习笔记' : 'Study Notes') : 
                       item.category}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right">
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
      case 3: // 联系信息表格
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{language === 'zh' ? '姓名' : 'Name'}</TableCell>
                  <TableCell>{language === 'zh' ? '邮箱' : 'Email'}</TableCell>
                  <TableCell>{language === 'zh' ? '消息' : 'Message'}</TableCell>
                  <TableCell>{language === 'zh' ? '时间' : 'Time'}</TableCell>
                  <TableCell>{language === 'zh' ? '状态' : 'Status'}</TableCell>
                  <TableCell align="right">{language === 'zh' ? '操作' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.message}
                    </TableCell>
                    <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status === 'unread' ? (language === 'zh' ? '未读' : 'Unread') : 
                               item.status === 'read' ? (language === 'zh' ? '已读' : 'Read') : 
                               (language === 'zh' ? '已回复' : 'Replied')}
                        color={item.status === 'unread' ? 'error' : 
                               item.status === 'read' ? 'primary' : 
                               'success'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
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
      case 4: // 邮箱订阅表格
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{language === 'zh' ? 'ID' : 'ID'}</TableCell>
                  <TableCell>{language === 'zh' ? '邮箱' : 'Email'}</TableCell>
                  <TableCell>{language === 'zh' ? '订阅时间' : 'Subscription Time'}</TableCell>
                  <TableCell>{language === 'zh' ? '状态' : 'Status'}</TableCell>
                  <TableCell align="right">{language === 'zh' ? '操作' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status === 'active' ? (language === 'zh' ? '活跃' : 'Active') : 
                               (language === 'zh' ? '不活跃' : 'Inactive')}
                        color={item.status === 'active' ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
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
      case 5: // VIP密钥表格
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{language === 'zh' ? 'ID' : 'ID'}</TableCell>
                  <TableCell>{language === 'zh' ? '密钥' : 'Key'}</TableCell>
                  <TableCell>{language === 'zh' ? '状态' : 'Status'}</TableCell>
                  <TableCell>{language === 'zh' ? '使用者' : 'Used By'}</TableCell>
                  <TableCell>{language === 'zh' ? '使用日期' : 'Used Date'}</TableCell>
                  <TableCell>{language === 'zh' ? '创建日期' : 'Created Date'}</TableCell>
                  <TableCell align="right">{language === 'zh' ? '操作' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{item.key}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status === 'active' ? (language === 'zh' ? '可用' : 'Active') : 
                               item.status === 'used' ? (language === 'zh' ? '已使用' : 'Used') : 
                               (language === 'zh' ? '已过期' : 'Expired')}
                        color={item.status === 'active' ? 'success' : 
                               item.status === 'used' ? 'primary' : 
                               'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{item.usedBy || '-'}</TableCell>
                    <TableCell>{item.usedDate ? new Date(item.usedDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{item.createdDate ? new Date(item.createdDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell align="right">
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
      default:
        return null;
    }
  };

  // 批量生成VIP密钥
  const handleBatchGenerateKeys = () => {
    const newKeys = [];
    const currentMaxId = Math.max(...data.vipKeys.map(key => key.id), 0);
    
    for (let i = 0; i < 10; i++) {
      newKeys.push({
        id: currentMaxId + i + 1,
        key: generateVipKey(),
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        usedBy: null,
        usedDate: null
      });
    }
    
    const newData = {
      ...data,
      vipKeys: [...data.vipKeys, ...newKeys]
    };
    
    setData(newData);
    localStorage.setItem(STORAGE_KEYS.vipKeys, JSON.stringify(newData.vipKeys));
    showSnackbar(language === 'zh' ? '成功生成10个VIP密钥' : 'Successfully generated 10 VIP keys', 'success');
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
          <Tab label={language === 'zh' ? '文章' : 'Articles'} />
          <Tab label={language === 'zh' ? '项目' : 'Projects'} />
          <Tab label={language === 'zh' ? '资源' : 'Resources'} />
          <Tab label={language === 'zh' ? '联系' : 'Contacts'} />
          <Tab label={language === 'zh' ? '订阅' : 'Subscriptions'} />
          <Tab label={language === 'zh' ? 'VIP密钥管理' : 'VIP Keys'} />
        </Tabs>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            {language === 'zh' ? '添加' : 'Add'}
          </Button>
          
          {currentTab === 5 && (
            <Button
              variant="outlined"
              onClick={handleBatchGenerateKeys}
              sx={{ ml: 2 }}
            >
              {language === 'zh' ? '批量生成10个密钥' : 'Generate 10 Keys'}
            </Button>
          )}
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