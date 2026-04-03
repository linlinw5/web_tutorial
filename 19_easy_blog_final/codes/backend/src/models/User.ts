export interface User {
    id: number;
    username: string;
    password?: string;    // Google 用户可能没有密码
    email: string;
    group_id: number;     // 分组 ID（1=admin, 2=editor, 3=guest）
    groupname?: string;   // 分组名称，由 JOIN groups 得到
    google_id?: string;   // Google 用户 ID（对应数据库列名 google_id）
    avatar?: string;      // 头像 URL
    provider: 'local' | 'google'; // 登录方式
    created_at?: string;
}

// 创建统一的响应格式 - 用于 API 响应，本案例暂未使用
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}