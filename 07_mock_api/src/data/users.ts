import { User } from "../types/user.ts";

export let users: User[] = [
    { id: 1, name: "Tom", email: "tom@abc.com", image: "/images/tom.png" },
    { id: 2, name: "Jerry", email: "jerry@abc.com", image: "/images/jerry.png" },
    { id: 3, name: "Spike", email: "spike@abc.com", image: "/images/spike.png" },
];

export const resetUsers = () => {
    users.length = 0; // 清空数组
    users.push(
        { id: 1, name: "Tom", email: "tom@abc.com", image: "/images/tom.png" },
        { id: 2, name: "Jerry", email: "jerry@abc.com", image: "/images/jerry.png" },
        { id: 3, name: "Spike", email: "spike@abc.com", image: "/images/spike.png" }
    );
};