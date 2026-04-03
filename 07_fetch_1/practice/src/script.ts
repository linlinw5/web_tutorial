// Mock API base URL
const baseUrl = "http://localhost:3000";

// Get elements to operate on from HTML
const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;
const userList = document.getElementById("userList") as HTMLUListElement;
const message = document.getElementById("message") as HTMLDivElement;

// Define user data structure
interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}

// Implement the following features here:
// 1. getUserList()   - GET request to fetch and render the user list
// 2. renderUserList() - Render function including delete buttons
// 3. deleteUser()    - DELETE request to remove a user
// 4. addUserJSON()   - POST request to add user in JSON format
// 5. addUserWWW()    - POST request to add user in www-form format
