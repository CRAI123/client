import supabase from '../../config/supabase';

// 文章相关操作
export const articlesAPI = {
  // 获取所有文章
  getAll: async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 创建文章
  create: async (article) => {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 更新文章
  update: async (id, article) => {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 删除文章
  delete: async (id) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// 项目相关操作
export const projectsAPI = {
  // 获取所有项目
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 创建项目
  create: async (project) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 更新项目
  update: async (id, project) => {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 删除项目
  delete: async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// 资源相关操作
export const resourcesAPI = {
  // 获取所有资源
  getAll: async () => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 创建资源
  create: async (resource) => {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 更新资源
  update: async (id, resource) => {
    const { data, error } = await supabase
      .from('resources')
      .update(resource)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 删除资源
  delete: async (id) => {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// 联系信息相关操作
export const contactsAPI = {
  // 获取所有联系信息
  getAll: async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 创建联系信息
  create: async (contact) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 更新联系信息状态
  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 删除联系信息
  delete: async (id) => {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// 订阅相关操作
export const subscriptionsAPI = {
  // 获取所有订阅
  getAll: async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 创建订阅
  create: async (subscription) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscription])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 更新订阅状态
  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 删除订阅
  delete: async (id) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};