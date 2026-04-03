import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.static('public'));  // Set static files directory
app.set('view engine', 'ejs');      // Set view engine
app.set('views', 'views');          // Set views directory - where EJS templates are stored

app.get('/', (req, res) => {
  res.render('home.ejs', { title: 'Home Page' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});