export const container = document.querySelector(".container") as HTMLElement;
export const rightContent = document.querySelector(".right-content") as HTMLElement;
export interface Blog {
    id: number;
    user_id: number;
    title: string;
    content: string;
    img: string;
    published: boolean;
    created_at: string;
    username: string;
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

export interface User {
    id: number;
    username: string;
    group_id: number;
    email: string;
    password: string;
    groupname: string;
    google_id?: string;
    avatar?: string;
    provider?: string;
    created_at: string;
}