export interface Blog {
    id: number;
    user_id: number;
    title: string;
    content: string;
    img: string;
    published: boolean;
    created_at: string;
}

export interface BlogByTag {
    id: number;
    title: string;
    user_id: number;
    img: string;
    published: boolean;
    created_at : string;
    username: string;
}