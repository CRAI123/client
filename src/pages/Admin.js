import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, 
  Dialog, DialogActions, DialogContent, DialogTitle, 
  FormControl, InputLabel, Select, MenuItem, Alert, Snackbar,
  Tabs, Tab, useTheme, Chip, CircularProgress
} from '@mui/material';
import { LanguageContext } from '../App';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import { articlesAPI, projectsAPI, resourcesAPI, contactsAPI, subscriptionsAPI } from '../db/models';
import supabase from '../config/supabase';

// 初始数据结构
const initialData = {
  articles: [],
  projects: [],
  resources: [],
  contacts: [],
  subscriptions: []
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
  const [loading, setLoading] = useState(false);
  
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
  };
  
  // 处理选项卡变更
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    resetFormData(newValue);
  };
  
  // 根据当前选项卡重置表单数据
  const resetFormData = (tabIndex) => {
    switch(tabIndex) {
      case 0: // 文章
        setFormData({ title: '', category: 'tech', content: '', date: new Date().toISOString().split('T')[0] });
        break;
      case 1: // 项目
        setFormData({ name: '', description: '', technologies: '', imageUrl: '' });
        break;
      case 2: // 资源
        setFormData({ title: '', category: 'article', description: '', link: '' });
        break;
      case 3: // 联系信息
        setFormData({ name: '', email: '', message: '', status: 'unread' });
        break;
      case 4: // 邮箱订阅
        setFormData({ email: '', status: 'active' });
        break;
      default:
        setFormData({});
    }
  };
  
  // 初始化表单数据
  useEffect(() => {
    resetFormData(currentTab);
  }, [currentTab]);
  
  // 处理表单输入变更
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 打开添加对话框
  const handleOpenAddDialog = () => {
    setEditItem(null);
    resetFormData(currentTab);
    setOpenDialog(true);
  };
  
  // 打开编辑对话框
  const handleOpenEditDialog = (item) => {
    setEditItem(item);
    
    // 根据当前选项卡设置表单数据
    switch(currentTab) {
      case 0: // 文章
        setFormData({ 
          title: item.title, 
          category: item.category, 
          content: item.content, 
          date: item.date 
        });
        break;
      case 1: // 项目
        setFormData({ 
          name: item.name, 
          description: item.description, 
          technologies: item.technologies, 
          imageUrl: item.imageUrl 
        });
        break;
      case 2: // 资源
        setFormData({ 
          title: item.title, 
          category: item.category, 
          description: item.description, 
          link: item.link 
        });
        break;
      default:
        break;
    }
    
    setOpenDialog(true);
  };
  
  // 关闭对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // 保存数据
  const handleSave = async () => {
    try {
      setLoading(true);
      const dataType = getDataTypeByTabIndex(currentTab);
      const api = getAPIByDataType(dataType);
      
      let savedItem;
      if (editItem) {
        // 编辑现有项
        savedItem = await api.update(editItem.id, formData);
        setData(prev => ({
          ...prev,
          [dataType]: prev[dataType].map(item =>
            item.id === editItem.id ? savedItem : item
          )
        }));
        showSnackbar(language === 'zh' ? '更新成功' : 'Updated successfully', 'success');
      } else {
        // 添加新项
        savedItem = await api.create(formData);
        setData(prev => ({
          ...prev,
          [dataType]: [...prev[dataType], savedItem]
        }));
        showSnackbar(language === 'zh' ? '添加成功' : 'Added successfully', 'success');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('保存数据失败:', error);
      showSnackbar(language === 'zh' ? '操作失败' : 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 删除数据
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const dataType = getDataTypeByTabIndex(currentTab);
      const api = getAPIByDataType(dataType);
      
      await api.delete(id);
      setData(prev => ({
        ...prev,
        [dataType]: prev[dataType].filter(item => item.id !== id)
      }));
      showSnackbar(language === 'zh' ? '删除成功' : 'Deleted successfully', 'success');
    } catch (error) {
      console.error('删除数据失败:', error);
      showSnackbar(language === 'zh' ? '删除失败' : 'Delete failed', 'error');
    } finally {
      setLoading(false);
    }
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
      default: return 'articles';
    }
  };
  
  // 获取对应的API
  const getAPIByDataType = (dataType) => {
    switch(dataType) {
      case 'articles': return articlesAPI;
      case 'projects': return projectsAPI;
      case 'resources': return resourcesAPI;
      case 'contacts': return contactsAPI;
      case 'subscriptions': return subscriptionsAPI;
      default: return articlesAPI;
    }
  };

  // 初始化数据加载和实时监听
  useEffect(() => {
    let subscriptions = [];

    const loadAllData = async () => {
      try {
        setLoading(true);
        // 从Supabase加载所有数据
        const [articles, projects, resources, contacts, subs] = await Promise.all([
          articlesAPI.getAll(),
          projectsAPI.getAll(),
          resourcesAPI.getAll(),
          contactsAPI.getAll(),
          subscriptionsAPI.getAll()
        ]);

        setData({
          articles,
          projects,
          resources,
          contacts,
          subscriptions: subs
        });
      } catch (error) {
        console.error('加载数据失败:', error);
        showSnackbar(language === 'zh' ? '加载数据失败' : 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    // 设置实时订阅
    const setupSubscriptions = () => {
      const tables = ['articles', 'projects', 'resources', 'contacts', 'subscriptions'];
      
      tables.forEach(table => {
        const subscription = supabase
          .channel(`public:${table}`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
            const { eventType, new: newRecord, old: oldRecord } = payload;
            
            setData(prev => {
              switch (eventType) {
                case 'INSERT':
                  return {
                    ...prev,
                    [table]: [...prev[table], newRecord]
                  };
                case 'UPDATE':
                  return {
                    ...prev,
                    [table]: prev[table].map(item =>
                      item.id === newRecord.id ? newRecord : item
                    )
                  };
                case 'DELETE':
                  return {
                    ...prev,
                    [table]: prev[table].filter(item => item.id !== oldRecord.id)
                  };
                default:
                  return prev;
              }
            });
          })
          .subscribe();
        
        subscriptions.push(subscription);
      });
    };

    // 加载初始数据并设置实时订阅
    loadAllData();
    setupSubscriptions();

    // 清理订阅
    return () => {
      subscriptions.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
    };
  }, [currentTab, language]);
  
  // 初始化时将数据保存到localStorage
  useEffect(() => {
    // 如果localStorage中没有数据，则初始化
    if (!localStorage.getItem(STORAGE_KEYS.articles)) {
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(initialData.articles));
    }
    if (!localStorage.getItem(STORAGE_KEYS.projects)) {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(initialData.projects));
    }
    if (!localStorage.getItem(STORAGE_KEYS.resources)) {
      localStorage.setItem(STORAGE_KEYS.resources, JSON.stringify(initialData.resources));
    }
    if (!localStorage.getItem(STORAGE_KEYS.subscriptions)) {
      localStorage.setItem(STORAGE_KEYS.subscriptions, JSON.stringify([]));
    }
  }, []);

  // 渲染表单字段
  const renderFormFields = () => {
    switch(currentTab) {
      case 0: // 文章表单
        return (
          <>
            <TextField
              margin="dense"
              name="title"
              label={language === 'zh' ? '标题' : 'Title'}
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>{language === 'zh' ? '分类' : 'Category'}</InputLabel>
              <Select
                name="category"
                value={formData.category || 'tech'}
                label={language === 'zh' ? '分类' : 'Category'}
                onChange={handleFormChange}
              >
                <MenuItem value="tech">{language === 'zh' ? '技术' : 'Technology'}</MenuItem>
                <MenuItem value="life">{language === 'zh' ? '生活' : 'Life'}</MenuItem>
                <MenuItem value="other">{language === 'zh' ? '其他' : 'Other'}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="content"
              label={language === 'zh' ? '内容' : 'Content'}
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.content || ''}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="date"
              label={language === 'zh' ? '日期' : 'Date'}
              type="date"
              fullWidth
              variant="outlined"
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
              margin="dense"
              name="name"
              label={language === 'zh' ? '名称' : 'Name'}
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name || ''}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="description"
              label={language === 'zh' ? '描述' : 'Description'}
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description || ''}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="technologies"
              label={language === 'zh' ? '技术栈' : 'Technologies'}
              type="text"
              fullWidth
              variant="outlined"
              value={formData.technologies || ''}
              onChange={handleFormChange}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="project-image-upload"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setFormData(prev => ({ ...prev, imageUrl: event.target.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label htmlFor="project-image-upload">
              <Button variant="contained" component="span" fullWidth sx={{ mt: 1 }}>
                {language === 'zh' ? '上传图片' : 'Upload Image'}
              </Button>
            </label>
            {formData.imageUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </Box>
            )}
          </>
        );
      case 2: // 资源表单
        return (
          <>
            <TextField
              margin="dense"
              name="title"
              label={language === 'zh' ? '标题' : 'Title'}
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>{language === 'zh' ? '分类' : 'Category'}</InputLabel>
              <Select
                name="category"
                value={formData.category || 'article'}
                label={language === 'zh' ? '分类' : 'Category'}
                onChange={handleFormChange}
              >
                <MenuItem value="article">{language === 'zh' ? '技术文章' : 'Technical Articles'}</MenuItem>
                <MenuItem value="note">{language === 'zh' ? '学习笔记' : 'Study Notes'}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="description"
              label={language === 'zh' ? '描述' : 'Description'}
              type="text"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={formData.description || ''}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="link"
              label={language === 'zh' ? '链接' : 'Link'}
              type="text"
              fullWidth
              variant="outlined"
              value={formData.link || ''}
              onChange={handleFormChange}
            />
          </>
        );
      case 3: // 联系信息表单
        return (
          <>
            <TextField
              margin="dense"
              name="name"
              label={language === 'zh' ? '姓名' : 'Name'}
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name || ''}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="email"
              label={language === 'zh' ? '邮箱' : 'Email'}
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email || ''}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="message"
              label={language === 'zh' ? '消息' : 'Message'}
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.message || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>{language === 'zh' ? '状态' : 'Status'}</InputLabel>
              <Select
                name="status"
                value={formData.status || 'unread'}
                label={language === 'zh' ? '状态' : 'Status'}
                onChange={handleFormChange}
              >
                <MenuItem value="unread">{language === 'zh' ? '未读' : 'Unread'}</MenuItem>
                <MenuItem value="read">{language === 'zh' ? '已读' : 'Read'}</MenuItem>
                <MenuItem value="replied">{language === 'zh' ? '已回复' : 'Replied'}</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 4: // 邮箱订阅表单
        return (
          <>
            <TextField
              margin="dense"
              name="email"
              label={language === 'zh' ? '邮箱' : 'Email'}
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email || ''}
              onChange={handleFormChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>{language === 'zh' ? '状态' : 'Status'}</InputLabel>
              <Select
                name="status"
                value={formData.status || 'active'}
                label={language === 'zh' ? '状态' : 'Status'}
                onChange={handleFormChange}
              >
                <MenuItem value="active">{language === 'zh' ? '活跃' : 'Active'}</MenuItem>
                <MenuItem value="inactive">{language === 'zh' ? '不活跃' : 'Inactive'}</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      default:
        return null;
    }
  };
  
  // 渲染数据表格
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
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ mt: 4 }}>
      {!isLoggedIn ? (
        // 登录界面
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            maxWidth: 400, 
            mx: 'auto',
            background: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '8px'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LockIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                fontFamily: '"Orbitron", sans-serif',
                background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {language === 'zh' ? '管理员登录' : 'Admin Login'}
            </Typography>
          </Box>
          
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {language === 'zh' ? '用户名或密码错误' : 'Invalid username or password'}
            </Alert>
          )}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label={language === 'zh' ? '用户名' : 'Username'}
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={language === 'zh' ? '密码' : 'Password'}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{ 
              py: 1.2,
              borderRadius: '4px',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)'
            }}
          >
            {language === 'zh' ? '登录' : 'Login'}
          </Button>
        </Paper>
      ) : (
        // 管理界面
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontFamily: '"Orbitron", sans-serif',
                background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {language === 'zh' ? '管理控制台' : 'Admin Console'}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleLogout}
              sx={{ 
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)'
                }
              }}
            >
              {language === 'zh' ? '退出登录' : 'Logout'}
            </Button>
          </Box>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4,
              background: 'rgba(18, 18, 18, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label={language === 'zh' ? '文章管理' : 'Articles'} />
                <Tab label={language === 'zh' ? '项目管理' : 'Projects'} />
                <Tab label={language === 'zh' ? '资源管理' : 'Resources'} />
                <Tab label={language === 'zh' ? '联系信息' : 'Contacts'} />
                <Tab label={language === 'zh' ? '邮箱订阅' : 'Subscriptions'} />
              </Tabs>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleOpenAddDialog}
                sx={{ 
                  borderRadius: '4px',
                  boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)'
                }}
              >
                {language === 'zh' ? '添加' : 'Add'}
              </Button>
            </Box>
            
            {renderDataTable()}
          </Paper>
          
          {/* 添加/编辑对话框 */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editItem 
                ? (language === 'zh' ? '编辑' : 'Edit') 
                : (language === 'zh' ? '添加' : 'Add')}
            </DialogTitle>
            <DialogContent>
              {renderFormFields()}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>
                {language === 'zh' ? '取消' : 'Cancel'}
              </Button>
              <Button onClick={handleSave} variant="contained" color="primary">
                {language === 'zh' ? '保存' : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* 提示消息 */}
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={3000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </Box>
  );
}

export default Admin;