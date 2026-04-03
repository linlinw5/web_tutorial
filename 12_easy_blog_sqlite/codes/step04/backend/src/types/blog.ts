// Blog entity
export interface Blog {
    id: number;
    title: string;
    content: string;
    img: string;
    user_id: number;
    published: number;
    created_at: string;
    username: string;
}

// Blog with associated tag IDs
export interface BlogWithTags extends Blog {
    tags: number[];
}

// Response structure for multiple blogs
export interface BlogsResponse {
    total: number;
    data: Blog[];
}

// Response structure for create, update, delete operations
export interface CUDResponse {
    success: boolean;
    message?: string;
    error?: string;
}

