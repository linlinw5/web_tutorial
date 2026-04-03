import express from "express";

const app = express();
const PORT: number = 3000;

// Complete the following setup here:
//
// 1. Use express.static() to serve the public directory
//
// 2. Set EJS as the view engine
//
// 3. Set the views directory to 'views'
//
// 4. Create GET / route, render index.ejs, pass { title: 'Home Page' }

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
