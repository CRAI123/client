import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Divider, Chip, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';

export default function ArticleDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // 模拟文章数据 - 实际项目中应该从API获取
  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      const articles = {
        technical: [
          { id: 1, title: "GPT + Tripo =王炸", content: "目录 一、ChatGPT 镜像网站 二、ChatGPT生成人偶图片 三、tripo生成3D模型 注：可以找作者打印模型哦！", 
            csdnLink: "https://blog.csdn.net/lcr557hcck/article/details/147165941?fromshare=blogdetail&sharetype=blogdetail&sharerId=147165941&sharerefer=PC&sharesource=lcr557hcck&sharefrom=from_link",
            tags: ["React", "Hooks", "前端", "JavaScript"] },
          { id: 2, title: "Node.js 性能优化指南", content: "Node.js作为一个高性能的JavaScript运行时环境，有很多优化技巧可以提升应用性能。本文将分享一些实用的Node.js性能优化方法。\n\n## 内存管理\n\n- 避免内存泄漏\n- 使用流处理大文件\n- 适当使用Buffer\n\n## 异步编程模型\n\n- 使用Promise和async/await\n- 避免回调地狱\n- 合理使用事件循环\n\n## 数据库优化\n\n- 使用连接池\n- 优化查询语句\n- 使用适当的索引\n\n## 缓存策略\n\n- 使用Redis缓存热点数据\n- 实现合理的缓存失效策略\n- 使用内存缓存减少计算\n\n## 集群和负载均衡\n\n- 使用PM2进行进程管理\n- 利用Node.js的cluster模块\n- 水平扩展应用实例", 
            csdnLink: "https://blog.csdn.net/example/article/789012",
            tags: ["Node.js", "性能优化", "后端", "JavaScript"] }
        ],
        notes: [
          { id: 3, title: "JavaScript 高级程序设计笔记", content: "《JavaScript高级程序设计》是前端开发者必读的经典书籍，本文整理了学习笔记和重点内容。\n\n## 第1章：JavaScript简介\n\n- JavaScript历史\n- JavaScript实现\n- JavaScript版本\n\n## 第2章：在HTML中使用JavaScript\n\n- <script>元素\n- 引入JavaScript文件的方式\n- 异步加载脚本\n\n## 第3章：语言基础\n\n- 语法\n- 变量\n- 数据类型\n- 操作符\n\n## 第4章：变量、作用域与内存\n\n- 原始值与引用值\n- 执行上下文与作用域\n- 垃圾回收\n\n## 第5章：基本引用类型\n\n- Date\n- RegExp\n- 原始值包装类型\n\n## 第6章：集合引用类型\n\n- Object\n- Array\n- Map与Set\n- WeakMap与WeakSet\n\n## 第7章：迭代器与生成器\n\n- 迭代器模式\n- 生成器\n- 可迭代协议\n\n## 第8章：对象、类与面向对象编程\n\n- 理解对象\n- 创建对象\n- 继承\n- 类\n\n## 第9章：代理与反射\n\n- 代理基础\n- 代理捕获器\n- 代理模式\n\n## 第10章：函数\n\n- 函数表达式\n- 递归\n- 闭包\n- this\n- 箭头函数", 
            csdnLink: "https://blog.csdn.net/example/article/345678",
            tags: ["JavaScript", "前端", "学习笔记"] },
          { id: 4, title: "数据结构与算法总结", content: "数据结构与算法是计算机科学的基础，掌握它们对提升编程能力至关重要。本文总结了常见的数据结构与算法知识。\n\n## 基础数据结构\n\n### 数组\n\n- 特点：连续内存空间，随机访问\n- 时间复杂度：查找O(1)，插入删除O(n)\n- JavaScript中的数组实际上是对象\n\n### 链表\n\n- 特点：非连续内存，通过指针连接\n- 时间复杂度：查找O(n)，插入删除O(1)\n- 单链表、双链表、循环链表\n\n### 栈\n\n- 特点：后进先出(LIFO)\n- 应用：函数调用栈、表达式求值、括号匹配\n\n### 队列\n\n- 特点：先进先出(FIFO)\n- 应用：消息队列、广度优先搜索\n\n### 哈希表\n\n- 特点：键值对存储，O(1)查找\n- 哈希冲突解决：链地址法、开放寻址法\n- JavaScript中的Map和Object\n\n### 树\n\n- 二叉树、二叉搜索树、平衡树\n- 遍历：前序、中序、后序、层序\n- 应用：表达式树、决策树\n\n### 堆\n\n- 特点：完全二叉树，父节点大于等于（小于等于）子节点\n- 应用：优先队列、堆排序\n\n### 图\n\n- 表示：邻接矩阵、邻接表\n- 遍历：深度优先搜索、广度优先搜索\n- 最短路径：Dijkstra、Floyd\n\n## 常见算法\n\n### 排序算法\n\n- 冒泡排序：O(n²)\n- 选择排序：O(n²)\n- 插入排序：O(n²)\n- 快速排序：O(nlogn)\n- 归并排序：O(nlogn)\n- 堆排序：O(nlogn)\n\n### 搜索算法\n\n- 线性搜索：O(n)\n- 二分搜索：O(logn)\n\n### 动态规划\n\n- 特点：将问题分解为子问题，存储子问题解\n- 应用：背包问题、最长公共子序列\n\n### 贪心算法\n\n- 特点：每步选择当前最优解\n- 应用：最小生成树、哈夫曼编码\n\n### 分治算法\n\n- 特点：将问题分解为子问题，独立解决后合并\n- 应用：快速排序、归并排序", 
            csdnLink: "https://blog.csdn.net/example/article/901234",
            tags: ["数据结构", "算法", "计算机科学"] }
        ]
      };

      // 查找文章
      const foundArticle = articles[category]?.find(item => item.id === parseInt(id));
      setArticle(foundArticle || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [category, id]);

  // 返回资料列表
  const handleBack = () => {
    navigate('/resources');
  };

  // 打开CSDN链接
  const openCsdnLink = () => {
    if (article?.csdnLink) {
      window.open(article.csdnLink, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return (
      <Box sx={{ mt: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          返回资料列表
        </Button>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            文章未找到
          </Typography>
          <Typography variant="body1">
            抱歉，您请求的文章不存在或已被移除。
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        返回资料列表
      </Button>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {article.title}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {article.tags?.map((tag, index) => (
            <Chip key={index} label={tag} size="small" color="primary" variant="outlined" />
          ))}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 4 }}>
          {article.content}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<LinkIcon />} 
          onClick={openCsdnLink}
          sx={{ mt: 2 }}
        >
          在CSDN中查看详细内容
        </Button>
      </Paper>
    </Box>
  );
}