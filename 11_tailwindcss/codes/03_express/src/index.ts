import express from 'express';

const app = express();
const PORT: number = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');


app.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Home Page' });
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});