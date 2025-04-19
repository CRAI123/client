import { createClient } from '@supabase/supabase-js'

// 从环境变量获取数据库连接信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 创建Supabase客户端实例
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase