// Type definitions related to Blog

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

export interface BlogWithTags extends Blog {
    tags: number[];
}

export interface BlogsResponse {
    total: number;
    data: Blog[];
}

